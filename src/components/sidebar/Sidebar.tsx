"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onNavigate }) => {
  const navigate = useNavigate();

  // 🔹 Verifica se o usuário está logado
  const isLoggedIn = !!localStorage.getItem("token");

  // 🔹 Itens do menu (todos, mas só "journey" fica livre sem login)
  const navItems = [
    { id: "journey", label: "Jornada", icon: "📖", path: "/path", requiresLogin: false },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆", path: "/leaderboard", requiresLogin: true },
    { id: "store", label: "Loja", icon: "🏪", path: "/store", requiresLogin: true },
    { id: "profile", label: "Perfil", icon: "👤", path: "/profile", requiresLogin: true },
    { id: "more", label: "Estatísticas", icon: "⋯", path: "/more", requiresLogin: true },
  ];

  // 🔸 Handler de clique
  const handleClick = (item: any) => {
    if (item.requiresLogin && !isLoggedIn) {
      // 🔒 Bloqueia clique e mostra aviso
      alert("⚠️ Faça login para acessar esta funcionalidade!");
      return;
    }
    onNavigate(item.id);
    navigate(item.path);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-icon">{"</>"}</div>
        <span className="logo-text">LFA Quest</span>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => {
          const locked = item.requiresLogin && !isLoggedIn;

          return (
            <div
              key={item.id}
              className={`nav-item ${activeItem === item.id ? "active" : ""} ${locked ? "locked" : ""}`}
              onClick={() => handleClick(item)}
              title={locked ? "Faça login para acessar" : item.label}
            >
              <span className="nav-icon">
                {locked ? "🔒" : item.icon}
              </span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
