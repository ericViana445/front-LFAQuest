"use client";
import { SuggestionWidget } from "../Statistics/Statistics"
import { FaUserSecret, FaRobot} from "react-icons/fa6";
import { FaUserGraduate, FaLaptopCode } from "react-icons/fa6";
import { FaShieldHalved } from "react-icons/fa6";
import { FaCoins, FaStar } from "react-icons/fa6";
import { WiDaySunny } from "react-icons/wi";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Store.css";
import {
  lessonsFase1,
  lessonsFase2,
  lessonsFase3,
  lessonsFase4,
  lessonsFase5,
} from "../../components/lession/LessonData";

import { useNavigate } from "react-router-dom";


interface StoreItem {
  id: number;
  name: string;
  type: "avatar" | "background" | "item";
  cost: number;
  unlocked: boolean;
  emoji?: string;
  gradient?: string;
}

interface Purchase {
  item_name: string;
  type: string;
}

interface DecodedToken {
  id: number;
  email: string;
  exp: number;
}


const iconMap: Record<string, React.ReactNode> = {
  "👨‍💻": <FaLaptopCode color="#3b82f6" size={32} />, // Coder
  "🎓": <FaUserGraduate color="#22c55e" size={32} />, // Student
  "🥷": <FaUserSecret color="#8b5cf6" size={32} />,   // Ninja
  "🤖": <FaRobot color="#06b6d4" size={32} />,        // Robot
  "💎": <FaCoins color="#facc15" size={32} />,        // Moeda
  "🛡️": <FaShieldHalved color="#ef4444" size={32} /> // Escudo
};

const Store: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("store");
  const [userData, setUserData] = useState<any>(null);
  const [purchasedItems, setPurchasedItems] = useState<Purchase[]>([]);
  const [diamonds, setDiamonds] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);
  const navigate = useNavigate();

const handleReviewTopic = () => {
  if (!analytics || !analytics.tags || analytics.tags.length === 0) {
    alert("Nenhum dado disponível para revisão");
    return;
  }

  // 1️⃣ Filtra as tags com acerto menor ou igual a 35%
  const lowAccuracyTags = analytics.tags.filter((t: any) => t.accuracy <= 0.35);

  if (lowAccuracyTags.length === 0) {
    alert("Parabéns! Nenhum tópico com taxa de acerto menor ou igual a 35%. 🎉");
    return;
  }

  // 2️⃣ Extrai o nome das tags com baixo desempenho
  const tagNames = lowAccuracyTags.map((t: any) => t.tag);

  // 3️⃣ Importa todas as lições (igual ao arquivo de Estatísticas)
  const allLessons = [
    ...lessonsFase1,
    ...lessonsFase2,
    ...lessonsFase3,
    ...lessonsFase4,
    ...lessonsFase5,
  ];

  // 4️⃣ Filtra as questões que correspondem a essas tags
  const reviewQuestions = allLessons.filter(
    (lesson) => lesson.tags && lesson.tags.some((tag) => tagNames.includes(tag))
  );

  if (reviewQuestions.length === 0) {
    alert("Nenhuma questão encontrada para os tópicos com mais dificuldade");
    return;
  }

  // 5️⃣ Limita a 5 questões
  const limitedQuestions = reviewQuestions.slice(0, 5);

  // 6️⃣ Redireciona para a página de lições com modo revisão
  navigate("/path", {
    state: {
      reviewMode: true,
      reviewQuestions: limitedQuestions,
      reviewTags: tagNames,
    },
  });
};


  // ================================
  // 🧠 Buscar dados do backend (usuário + compras)
  // ================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.id;

      // Busca informações do usuário
      fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar usuário");
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          setDiamonds(data.diamonds ?? 0);
          console.log("✅ Usuário carregado:", data);
        })
        .catch((err) => console.error("Erro ao carregar usuário:", err));

      // Busca compras do usuário
      fetch(`https://backend-lfaquest.onrender.com/api/store/purchases/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setPurchasedItems(data);
        })
        .catch((err) => console.error("Erro ao buscar compras:", err));
      
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

  // ================================
  // 🛒 Itens disponíveis na loja
  // ================================
  const storeItems: StoreItem[] = [
    { id: 1, name: "Coder", type: "avatar", cost: 5, unlocked: false, emoji: "👨‍💻" },
    { id: 2, name: "Student", type: "avatar", cost: 10, unlocked: false, emoji: "🎓" },
    { id: 3, name: "Ninja", type: "avatar", cost: 12, unlocked: false, emoji: "🥷" },
    { id: 4, name: "Robot", type: "avatar", cost: 15, unlocked: false, emoji: "🤖" },
    {
      id: 5,
      name: "Forest",
      type: "background",
      cost: 8,
      unlocked: false,
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 6,
      name: "Sunset",
      type: "background",
      cost: 12,
      unlocked: false,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      id: 7,
      name: "Purple",
      type: "background",
      cost: 15,
      unlocked: false,
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    { id: 8, name: "Shield", type: "item", cost: 20, unlocked: false, emoji: "🛡️" },
  ];

  // ================================
  // 🟢 Atualiza os itens desbloqueados
  // ================================
  const updatedStoreItems = storeItems.map((item) => {
    const bought = purchasedItems.some(
      (p) => p.item_name === item.name && p.type === item.type
    );
    return { ...item, unlocked: bought };
  });

  // ================================
  // 💎 Função de compra
  // ================================
  const handlePurchase = async (item: StoreItem) => {
    if (item.unlocked) return alert("🟢 Você já possui este item!");
    if (!userData) return alert("❌ Usuário não autenticado!");

    if (diamonds >= item.cost) {
      try {
        const res = await fetch("https://backend-lfaquest.onrender.com/api/store/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userData.id,
            item_name: item.name,
            type: item.type,
            cost: item.cost,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro na compra");

        // Atualiza saldo e backend
        const newBalance = data.new_balance;
        setDiamonds(newBalance);
        setUserData({ ...userData, diamonds: newBalance });
        setPurchasedItems([...purchasedItems, { item_name: item.name, type: item.type }]);
        alert(`✅ Você comprou ${item.name}!`);
      } catch (err: any) {
        alert(`❌ ${err.message}`);
      }
    } else {
      alert("❌ Diamantes insuficientes!");
    }
  };

  return (
    <div className="store-layout">
      {/* Sidebar esquerda */}
      <Sidebar activeItem={activeNavItem} onNavigate={setActiveNavItem} />

      {/* Conteúdo principal */}
      <div className="store-main">
        <h1 className="store-title">Loja</h1>

        {userData ? (
          <p className="store-balance"><FaCoins className="text-yellow-400 text-xl" />  Seus diamantes: {diamonds}</p>
        ) : (
          <p className="store-balance">
            ⚠️ Faça login para comprar e desbloquear novos itens!
          </p>
        )}

        {/* Avatares */}
        <div className="store-section">
          <h2>Avatares</h2>
          <div className="store-grid">
            {updatedStoreItems
              .filter((i) => i.type === "avatar")
              .map((item) => (
                <div
                  key={item.id}
                  className={`store-item ${item.unlocked ? "unlocked" : "locked"}`}
                  onClick={() => handlePurchase(item)}
                >
                  <div className="store-icon">{iconMap[item.emoji || ""] || item.emoji}</div>
                  <p>{item.name}</p>
                  <span>
                    {item.unlocked ? (
                      " Desbloqueado"
                    ) : (
                      <>
                        <FaCoins className="text-yellow-400 text-xl inline-block mr-1" />
                        {item.cost}
                      </>
                    )}
                  </span>
                  
                </div>
              ))}
          </div>
        </div>

        {/* Backgrounds */}
        <div className="store-section">
          <h2>Backgrounds</h2>
          <div className="store-grid">
            {updatedStoreItems
              .filter((i) => i.type === "background")
              .map((item) => (
                <div
                  key={item.id}
                  className={`store-item ${item.unlocked ? "unlocked" : "locked"}`}
                  style={{ background: item.gradient }}
                  onClick={() => handlePurchase(item)}
                >
                  <p>{item.name}</p>
                  <span>
                    {item.unlocked ? (
                      "✅ Desbloqueado"
                    ) : (
                      <>
                        <FaCoins style={{ color: "#ffffffff" }}className="text-yellow-400 text-xl inline-block mr-1" />
                        {item.cost}
                      </>
                    )}
                  </span>
                  
                </div>
              ))}
          </div>
        </div>

        {/* Itens */}
        <div className="store-section">
          <h2>Itens</h2>
          <div className="store-grid">
            {updatedStoreItems
              .filter((i) => i.type === "item")
              .map((item) => (
                <div
                  key={item.id}
                  className={`store-item ${item.unlocked ? "unlocked" : "locked"}`}
                  onClick={() => handlePurchase(item)}
                >
                  <div className="store-icon">{item.emoji}</div>
                  <p>{item.name}</p>
                  <span>
                    {item.unlocked ? (
                      "✅ Desbloqueado"
                    ) : (
                      <>
                        <FaCoins style={{ color: "#bcb4b4df" }} className="text-yellow-800 text-xl inline-block mr-1" />
                        {item.cost}
                      </>
                    )}
                  </span>
                  
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Sidebar direita */}
      <div className="right-sidebar">
        {/* Estatísticas */}
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

        
        {/* Caso o usuário não esteja logado */}
        {!userData && (
          <div className="widget login-widget">
            <div className="widget-header">
              <h3>Entre para acessar a loja!</h3>
            </div>
            <div className="widget-content">
              <p style={{ textAlign: "center" }}>
                Faça login para comprar e desbloquear itens exclusivos.
              </p>
              <button
                className="login-btn login-btn-alt"
                onClick={() => (window.location.href = "/path")}
              >
                Fazer Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
