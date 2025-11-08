"use client";
import { FaUser, FaCoins, FaStar, FaUserSecret, FaRobot, FaUserGraduate, FaLaptopCode } from "react-icons/fa6";
import { WiDaySunny } from "react-icons/wi";
import type React from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Leaderboard.css";
import { SuggestionWidget } from "../Statistics/Statistics";
import { useNavigate } from "react-router-dom";
import {
  lessonsFase1,
  lessonsFase2,
  lessonsFase3,
  lessonsFase4,
  lessonsFase5,
} from "../../components/lession/LessonData";


interface DecodedToken {
  id: number;
  email: string;
  exp: number;
}

interface User {
  id: number;
  name: string;
  xp: number;
  diamonds: number;
  streak_count: number;
  selected_avatar?: number;
}
const iconMap: Record<string, React.ReactNode> = {
  "👤": <FaUser color="#9ca3af" size={24} />,        // Padrão
  "👨‍💻": <FaLaptopCode color="#3b82f6" size={24} />, // Coder
  "🎓": <FaUserGraduate color="#22c55e" size={24} />, // Student
  "🥷": <FaUserSecret color="#8b5cf6" size={24} />,   // Ninja
  "🤖": <FaRobot color="#06b6d4" size={24} />,        // Robot
};


const avatarPresets = [
  { id: 0, emoji: "👤" },
  { id: 1, emoji: "👨‍💻" },
  { id: 2, emoji: "🎓" },
  { id: 3, emoji: "🥷" },
  { id: 4, emoji: "🤖" },
];

const Leaderboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
    const navigate = useNavigate();


  const [activeNavItem, setActiveNavItem] = useState("leaderboard");
  const [userData, setUserData] = useState<User | null>(null);
  const [ranking, setRanking] = useState<User[]>([]);

  const navigator = (item: string) => setActiveNavItem(item);

  // ============================================
  // 🧠 Buscar usuário logado + leaderboard real
  // ============================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.id;

      // 🔹 Busca o usuário logado
      fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar usuário");
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          console.log("✅ Usuário carregado:", data);
        })
        .catch((err) => console.error("Erro ao carregar usuário:", err));

      // 🔹 Busca o ranking real do banco
      fetch("https://backend-lfaquest.onrender.com/api/users/leaderboard/all")
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar ranking");
          return res.json();
        })
        .then((data) => {
          setRanking(data);
          console.log("🏆 Leaderboard carregado:", data);
        })
        .catch((err) => console.error("Erro ao carregar leaderboard:", err));

        // analytics
        fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}/analytics`)
          .then((res) => res.json())
          .then((data) => {
            setAnalytics(data);
            console.log("📊 Analytics carregado:", data);
          })
          .catch((err) => console.error("Erro ao buscar analytics:", err));
        
    } catch (error) {
      console.error("Token inválido:", error);
    }
  }, []);

  // ============================================
  // 🏅 Ranking ordenado por XP
  // ============================================
  const sortedRanking = [...ranking].sort((a, b) => b.xp - a.xp);

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

  return (
    <div className="leaderboard-layout">
      {/* Sidebar esquerda */}
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      {/* Conteúdo principal */}
      <div className="leaderboard-main">
        <div className="leaderboard-title">
          <h1>Ranking</h1>
        </div>

        <div className="leaderboard-list">
          {sortedRanking.length === 0 ? (
            <p className="empty-text">Nenhum jogador ainda!</p>
          ) : (
            sortedRanking.map((userItem, index) => {
              const avatar = avatarPresets.find((a) => a.id === userItem.selected_avatar)?.emoji ?? "👤";
              const isCurrentUser = userData && userItem.id === userData.id;
              return (
                <div
                  key={userItem.id}
                  className={`leaderboard-item ${isCurrentUser ? "me" : ""}`}
                >
                  <span className="position">#{index + 1}</span>
                  <span className="avatar">
                    {iconMap[avatar] || avatar}
                  </span>
                                  
                  <span className="name">{userItem.name}</span>
                  <span className="xp">{userItem.xp} <FaStar className="text-blue-400 text-xl" /></span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Barra lateral direita */}
      <div className="right-sidebar">
        {/* Estatísticas do usuário */}
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
              <h3>Entre para aparecer no ranking!</h3>
            </div>
            <div className="widget-content">
              <p style={{ textAlign: "center" }}>
                Faça login para ver seu progresso e competir!
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

export default Leaderboard;
