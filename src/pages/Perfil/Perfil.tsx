"use client";
import { useNavigate } from "react-router-dom";
import {
  lessonsFase1,
  lessonsFase2,
  lessonsFase3,
  lessonsFase4,
  lessonsFase5,
} from "../../components/lession/LessonData";
import { SuggestionWidget } from "../Statistics/Statistics";
import { FaUser, FaCoins, FaStar, FaUserSecret, FaRobot, FaUserGraduate, FaLaptopCode} from "react-icons/fa6";
import { WiDaySunny } from "react-icons/wi";
import type React from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Perfil.css";
import { FaPuzzlePiece, FaRocket, FaFire, FaGift } from "react-icons/fa";

interface PerfilProps {
  onNavigate?: (section: string) => void;
}

interface DecodedToken {
  id: number;
  email: string;
  exp: number;
}

interface Purchase {
  item_name: string;
  type: string;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  unlocked: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  "👤": <FaUser color="#9ca3af"  />,        // Padrão
  "👨‍💻": <FaLaptopCode color="#3b82f6" />, // Coder
  "🎓": <FaUserGraduate color="#22c55e"  />, // Student
  "🥷": <FaUserSecret color="#8b5cf6"  />,   // Ninja
  "🤖": <FaRobot color="#06b6d4" />,        // Robot
  "💎": <FaCoins color="#facc15" />,        // Moeda
};

const achievementIconMap: Record<string, JSX.Element> = {
  puzzle: <FaPuzzlePiece color="#fbbf24" />,
  rocket: <FaRocket color="#60a5fa" />,
  fire: <FaFire color="#fb7185" />,
  gift: <FaGift color="#86efac" />,
};

const Perfil: React.FC<PerfilProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("profile");
  const [analytics, setAnalytics] = useState<any>(null);


  // Estes DOIS estados agora guardam **IDs** de preset (não índices)
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const [selectedBackground, setSelectedBackground] = useState<number>(0);

  const [userData, setUserData] = useState<any>(null);
  const [purchasedItems, setPurchasedItems] = useState<Purchase[]>([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [readyToSave, setReadyToSave] = useState(false); // só salva após carregar do backend
  //conquistas
  const [achievements, setAchievements] = useState<Achievement[]>([]);


  // Presets (IDs estáveis)
  const avatarPresets = [
    { id: 0, name: "Padrão", emoji: "👤" },
    { id: 1, name: "Coder", emoji: "👨‍💻" },
    { id: 2, name: "Student", emoji: "🎓" },
    { id: 3, name: "Ninja", emoji: "🥷" },
    { id: 4, name: "Robot", emoji: "🤖" },
  ];

  const backgroundPresets = [
    { id: 0, name: "Padrão", gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)" },
    { id: 1, name: "Forest", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
    { id: 2, name: "Sunset", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
    { id: 3, name: "Purple", gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
  ];

  // Buscar dados do usuário + compras + conquistas
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.id;

      // perfil
      fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          // aplica IDs salvos no banco
          setSelectedAvatar(Number(data.selected_avatar ?? 0));
          setSelectedBackground(Number(data.selected_background ?? 0));
          setReadyToSave(true);
        })
        .catch((err) => console.error("Erro ao carregar usuário:", err));

      // compras
      fetch(`https://backend-lfaquest.onrender.com/api/store/purchases/${userId}`)
        .then((res) => res.json())
        .then((data) => setPurchasedItems(data))
        .catch((err) => console.error("Erro ao carregar compras:", err));

      //conquistas
      fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}/achievements`)
        .then((res) => res.json())
        .then((data) => {
          console.log("🏆 Conquistas carregadas:", data);
          setAchievements(data);
        })
        .catch((err) => console.error("Erro ao carregar conquistas:", err));
      // analytics
      fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}/analytics`)
        .then((res) => res.json())
        .then((data) => {
          setAnalytics(data);
          console.log(" Analytics carregado:", data);
        })
        .catch((err) => console.error("Erro ao buscar analytics:", err));
      

    } catch (error) {
      console.error("Token inválido:", error);
    }
  }, []);

  // Filtra desbloqueados (default id 0 sempre disponível)
  const unlockedAvatars = avatarPresets.filter(
    (a) => a.id === 0 || purchasedItems.some((p) => p.item_name === a.name && p.type === "avatar")
  );
  const unlockedBackgrounds = backgroundPresets.filter(
    (b) => b.id === 0 || purchasedItems.some((p) => p.item_name === b.name && p.type === "background")
  );

  // Objeto do avatar/background atualmente selecionado (por ID)
  const currentAvatar = avatarPresets.find((a) => a.id === selectedAvatar) ?? avatarPresets[0];
  const currentBackground =
    backgroundPresets.find((b) => b.id === selectedBackground) ?? backgroundPresets[0];

  // Salvar preferências no backend quando usuário mudar (após carregar)
  useEffect(() => {
    if (!readyToSave) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.id;

      fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected_avatar: selectedAvatar,         // manda ID
          selected_background: selectedBackground, // manda ID
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("💾 Preferências salvas:", data);
          // opcional: manter userData em sincronia
          setUserData((prev: any) =>
            prev
              ? {
                  ...prev,
                  selected_avatar: selectedAvatar,
                  selected_background: selectedBackground,
                }
              : prev
          );
        })
        .catch((err) => console.error("Erro ao salvar preferências:", err));
    } catch (error) {
      console.error("Token inválido:", error);
    }
  }, [selectedAvatar, selectedBackground, readyToSave]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/path";
  };

  const navigator = (item: string) => {
    setActiveItem(item);
    onNavigate?.(item);
  };

  const handleReviewTopic = () => {
    if (!analytics || !analytics.tags || analytics.tags.length === 0) {
      alert("Nenhum dado disponível para revisão");
      return;
    }

    const lowAccuracyTags = analytics.tags.filter((t: any) => t.accuracy <= 0.35);

    if (lowAccuracyTags.length === 0) {
      alert("Parabéns! Nenhum tópico com taxa de acerto menor ou igual a 35%. 🎉");
      return;
    }

    const tagNames = lowAccuracyTags.map((t: any) => t.tag);

    const allLessons = [
      ...lessonsFase1,
      ...lessonsFase2,
      ...lessonsFase3,
      ...lessonsFase4,
      ...lessonsFase5,
    ];

    const reviewQuestions = allLessons.filter(
      (lesson) => lesson.tags && lesson.tags.some((tag) => tagNames.includes(tag))
    );

    if (reviewQuestions.length === 0) {
      alert("Nenhuma questão encontrada para os tópicos com mais dificuldade");
      return;
    }

    const limitedQuestions = reviewQuestions.slice(0, 5);

    navigate("/path", {
      state: {
        reviewMode: true,
        reviewQuestions: limitedQuestions,
        reviewTags: tagNames,
      },
    });
  };

  // Conquistas (exemplo)
  {/* Conquistas reais */}
 
  
  return (

    
    <div className="perfil-layout">
      <Sidebar activeItem={activeItem} onNavigate={navigator} />

      {/* Conteúdo principal */}
      <div className="perfil-main">
        {/* Cabeçalho e avatar */}
        <div
          className="widget perfil-header"
          style={{ background: currentBackground.gradient }}
        >
          <div className="avatar-silhouette">
            <div className="avatar-display"style={{ fontSize: "4rem" }}>{iconMap[currentAvatar.emoji] || currentAvatar.emoji}</div>
          </div>
        </div>

        {/* Informações do usuário */}
        <div className="widget user-info-section">
          <h1 className="username">{userData ? userData.name : "Carregando..."}</h1>
          <p className="user-subtitle">{userData ? userData.email : ""}</p>
        </div>

        {/* Conquistas reais */}
          <div className="widget badges-section">
            <h2 className="section-title">Conquistas</h2>
            
            {achievements.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center" }}>
                Nenhuma conquista registrada ainda.
              </p>
            ) : (
              <div className="badges-list">
                {achievements.map((ach: Achievement) => (
                  <div
                    key={ach.id}
                    className={`badge-item ${ach.unlocked ? "completed" : "locked"}`}
                    title={ach.unlocked ? "Conquista desbloqueada!" : "Ainda bloqueada"}
                  >
                    <div className="badge-icon">
                      {ach.unlocked ? achievementIconMap[ach.icon] : "🔒"}
                    </div>
                                    
                    <div className="badge-info">
                      <h3 className="badge-name">{ach.name}</h3>
                      <p className="badge-description">{ach.description}</p>
                    </div>
                    <div className="badge-progress">{ach.unlocked ? "✅" : "—"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          

        {/* Personalização */}
        <div className="widget customization-section">
          <div className="customization-group">
            <h3 className="customization-title">Escolher Avatar</h3>
            <div className="avatar-presets">
              {unlockedAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  className={`avatar-preset ${selectedAvatar === avatar.id ? "selected" : ""}`}
                  onClick={() => setSelectedAvatar(avatar.id)} // salva ID
                  title={avatar.name}
                >
                  <span className="preset-emoji">{iconMap[avatar.emoji] || avatar.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="customization-group">
            <h3 className="customization-title">Tema de Fundo</h3>
            <div className="background-presets">
              {unlockedBackgrounds.map((bg) => (
                <button
                  key={bg.id}
                  className={`background-preset ${selectedBackground === bg.id ? "selected" : ""}`}
                  onClick={() => setSelectedBackground(bg.id)} // salva ID
                  style={{ background: bg.gradient }}
                  title={bg.name}
                >
                  <span className="preset-name">{bg.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barra lateral direita */}
      <div className="right-sidebar">
        <div className="stats">
          <div className="stat-item green">
            <WiDaySunny size={28} className="text-yellow-900" />
            <span className="stat-number">{userData ? (userData.streak_count ?? 0) : 0}</span>
          </div>
          <div className="stat-item orange">
            <FaCoins className="text-yellow-400 text-xl" />
            <span className="stat-number">{userData ? (userData.diamonds ?? 0) : 0}</span>
          </div>
          <div className="stat-item purple">
            <FaStar className="text-blue-400 text-xl" />
            <span className="stat-number">{userData ? (userData.xp ?? 0) : 0}</span>
          </div>
        </div>

        {analytics && (
          <SuggestionWidget
            analytics={analytics}
            handleReviewTopic={handleReviewTopic}
          />
        )}

        <div className="widget-logout-widget">
          <div className="widget-header">
            <h3>Encerrar Sessão</h3>
          </div>
          <div className="widget-content">
            <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
              Sair da Conta
            </button>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal logout-modal">
            <h2>Deseja realmente sair?</h2>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleLogout}>
                Sim, sair
              </button>
              <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
