"use client";
import { FaCoins, FaStar } from "react-icons/fa6";
import { WiDaySunny } from "react-icons/wi";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Store.css";

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

const Store: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("store");
  const [userData, setUserData] = useState<any>(null);
  const [purchasedItems, setPurchasedItems] = useState<Purchase[]>([]);
  const [diamonds, setDiamonds] = useState(0);

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
        <h1 className="store-title">Game Store</h1>

        {userData ? (
          <p className="store-balance">💎 Seus diamantes: {diamonds}</p>
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
                  <div className="store-icon">{item.emoji}</div>
                  <p>{item.name}</p>
                  <span>
                    {item.unlocked ? "✅ Desbloqueado" : `💎 ${item.cost}`}
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
                    {item.unlocked ? "✅ Desbloqueado" : `💎 ${item.cost}`}
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
                    {item.unlocked ? "✅ Desbloqueado" : `💎 ${item.cost}`}
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

        {/* Leaderboard */}
        <div className="widget">
          <div className="widget-header">
            <h3>Leaderboard</h3>
            <button className="view-button">Ver</button>
          </div>
          <div className="widget-content">
            <div className="leaderboard-message">
              <span className="lock-icon">🔒</span>
              <p>
                Continue aprendendo e ganhe XP para conquistar novos itens na
                loja!
              </p>
            </div>
          </div>
        </div>

        {/* Missões Diárias */}
        <div className="widget">
          <div className="widget-header">
            <h3>Missões Diárias</h3>
            <button className="view-button">Revisão</button>
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
