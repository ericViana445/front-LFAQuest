"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Leaderboard.css";

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

const avatarPresets = [
  { id: 0, emoji: "👤" },
  { id: 1, emoji: "👨‍💻" },
  { id: 2, emoji: "🎓" },
  { id: 3, emoji: "🥷" },
  { id: 4, emoji: "🤖" },
];

const Leaderboard: React.FC = () => {
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
    } catch (error) {
      console.error("Token inválido:", error);
    }
  }, []);

  // ============================================
  // 🏅 Ranking ordenado por XP
  // ============================================
  const sortedRanking = [...ranking].sort((a, b) => b.xp - a.xp);

  return (
    <div className="leaderboard-layout">
      {/* Sidebar esquerda */}
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      {/* Conteúdo principal */}
      <div className="leaderboard-main">
        <div className="leaderboard-header">
          <h2>Leaderboard</h2>
          <p>Veja sua posição no ranking!</p>
        </div>

        <div className="leaderboard-list">
          {sortedRanking.length === 0 ? (
            <p className="empty-text">Nenhum jogador ainda!</p>
          ) : (
            sortedRanking.map((userItem, index) => {
              const avatar =
                avatarPresets.find((a) => a.id === userItem.selected_avatar)
                  ?.emoji ?? "👤";
              const isCurrentUser = userData && userItem.id === userData.id;
              return (
                <div
                  key={userItem.id}
                  className={`leaderboard-item ${
                    isCurrentUser ? "me" : ""
                  }`}
                >
                  <span className="position">#{index + 1}</span>
                  <span className="avatar">{avatar}</span>
                  <span className="name">{userItem.name}</span>
                  <span className="xp">{userItem.xp} XP</span>
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
            <span className="stat-icon">🔥</span>
            <span className="stat-number">
              {userData ? userData.streak_count ?? 0 : 0}
            </span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">
              {userData ? userData.diamonds ?? 0 : 0}
            </span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">
              {userData ? userData.xp ?? 0 : 0}
            </span>
          </div>
        </div>

        {/* Widget lateral */}
        <div className="widget">
          <div className="widget-header">
            <h3>Leaderboard</h3>
          </div>
          <div className="widget-content">
            <div className="leaderboard-message">
              <p>
                Continue aprendendo para ganhar XP e subir no ranking
                semanal!
              </p>
            </div>
          </div>
        </div>

        {/* Missões Diárias */}
        <div className="widget">
          <div className="widget-header">
            <h3>Missões Diárias</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="goal-item">
              <div className="goal-text">
                <span>Complete 5 missões</span>
                <span className="goal-progress">0/5</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
            <div className="goal-item">
              <div className="goal-text">
                <span>Resolva 3 questões na primeira tentativa</span>
                <span className="goal-progress">0/3</span>
              </div>
              <span className="trophy-icon">🏆</span>
            </div>
          </div>
        </div>

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
