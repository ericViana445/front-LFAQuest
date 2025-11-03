"use client"

import React, { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { useLocation } from "react-router-dom"
import autoimag from "../../components/lession/LessonDataImages/automatonlixo.jpeg"
import Sidebar from "../../components/sidebar/Sidebar.tsx"
import Task from "../../components/Task/Taks.tsx"
import Lesson from "../../components/lession/LessonTemplate.tsx"
import {
  lessonsFase1,
  lessonsFase2,
  lessonsFase3,
  lessonsFase4,
  lessonsFase5,
} from "../../components/lession/LessonData.ts"

const lessons = [lessonsFase1, lessonsFase2, lessonsFase3, lessonsFase4, lessonsFase5]

import "./path_player.css"

interface DecodedToken {
  id: number
  email: string
  exp: number
}

const Path_player: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("journey")
  const [isTaskOpen, setIsTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isLessonActive, setIsLessonActive] = useState(false)
  const [currentLessonType, setCurrentLessonType] = useState<"normal" | "automaton">("normal")
  const [newAchievements, setNewAchievements] = useState<any[]>([])
  const [showAchievementsPopup, setShowAchievementsPopup] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(1) // 1 ou 2
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0) // 0-4 para as 5 questões
  const [showPhaseSummary, setShowPhaseSummary] = useState(false) // Nova state para controlar o resumo da fase
  const [phaseAnswers, setPhaseAnswers] = useState<boolean[]>([]) // Armazenar respostas da fase

  const location = useLocation()
  const [reviewMode, setReviewMode] = useState(false)
  const [reviewQuestions, setReviewQuestions] = useState<any[]>([])
  const [reviewTags, setReviewTags] = useState<string[]>([])

  const [userData, setUserData] = useState<any>(null)

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [showLogin, setShowLogin] = useState(false)

  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    if (location.state?.reviewMode) {
      console.log("[v0] Review mode activated with", location.state.reviewQuestions.length, "questions")
      setReviewMode(true)
      setReviewQuestions(location.state.reviewQuestions)
      setReviewTags(location.state.reviewTags || [])
      setCurrentQuestionIndex(0)
      setPhaseAnswers([])
      setIsLessonActive(true)
    }
  }, [location.state])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const decoded: DecodedToken = jwtDecode(token)
      const userId = decoded.id

      fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar usuário")
          return res.json()
        })
        .then((data) => {
          setUserData(data)
          console.log("✅ Dados do usuário carregados:", data)
        })
        .catch((err) => console.error("Erro ao carregar usuário:", err))
    } catch (error) {
      console.error("Token inválido:", error)
    }
  }, [])

  const handleLogin = async () => {
    setLoginError("")
    try {
      const res = await fetch("https://backend-lfaquest.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Erro no login")
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      alert("✅ Login realizado com sucesso!")
      setShowLogin(false)
      window.location.reload()
    } catch (err: any) {
      setLoginError(err.message)
    }
  }

  const handleRegister = async () => {
    setRegisterError("")
    try {
      const res = await fetch("https://backend-lfaquest.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Erro no cadastro")
      alert("✅ Cadastro realizado com sucesso!")
      setShowRegister(false)
      setShowLogin(true)
    } catch (err: any) {
      setRegisterError(err.message)
    }
  }

  const navigator = (item: string) => {
    setActiveNavItem(item)
    console.log(`[v0] Navigating to: ${item}`)
  }

  const phaseData = [
    {
      phase: 1,
      title: "Fundamentos dos Autômatos",
      description: "Aprenda os conceitos básicos de autômatos finitos e gramáticas regulares.",
      icon: "🧠",
      xp: 75,
      progress: 60,
      questionsCount: 5,
      learningPoints: [
        "Autômatos Finitos Não Determinísticos (AFND)",
        "Gramáticas Regulares e Derivações",
        "Conversão de AFN para AFD",
        "Propriedades dos Autômatos",
        "Expressões Aritméticas e Gramáticas",
      ],
    },
    {
      phase: 2,
      title: "Aplicações Avançadas",
      description: "Aprofunde seus conhecimentos com questões mais complexas sobre autômatos.",
      icon: "⚡",
      xp: 75,
      progress: 30,
      questionsCount: 5,
      learningPoints: [
        "Análise de Autômatos e Cadeias",
        "Autômatos JFLAP e Transições",
        "Autômatos Determinísticos vs Não Determinísticos",
        "Linguagens Aceitas por AFD",
        "Tipos de Gramática e Hierarquia de Chomsky",
      ],
    },
    {
      phase: 3,
      title: "Expressões Regulares",
      description: "Estude expressões regulares e sua relação com autômatos.",
      icon: "🔍",
      xp: 100,
      progress: 0,
      questionsCount: 5,
      learningPoints: [
        "Expressões Regulares básicas",
        "Fecho de Kleene",
        "União e Interseção de Linguagens",
        "Conversão para Autômatos",
        "Exercícios práticos",
      ],
    },
    {
      phase: 4,
      title: "Avançado em Automatos",
      description: "Consolide seu conhecimento em autômatos e expressões regulares.",
      icon: "🚀",
      xp: 100,
      progress: 0,
      questionsCount: 5,
      learningPoints: [
        "Propriedades avançadas de autômatos",
        "Expressões regulares complexas",
        "Validação de autômatos",
        "Simulações de autômatos",
        "Desafios de integração",
      ],
    },
    {
      phase: 5,
      title: "Lema do Bombeamento e Linguagens Não Regulares",
      description: "Domine o uso do Lema do Bombeamento para provar que certas linguagens não são regulares, explorando diferentes estratégias e exemplos clássicos.",
      icon: "🧩",
      xp: 100,
      progress: 0,
      questionsCount: 5,
      learningPoints: [
        "Entendimento formal do Lema do Bombeamento",
        "Provas de não regularidade de linguagens como {0ⁿ1ⁿ} e {ww}",
        "Bombeamento para cima e para baixo",
        "Relação entre autômatos e o comprimento de bombeamento",
        "Estratégias eficazes para aplicar o lema em provas formais"
      ],
    }
  ]

  const handleNodeClick = (phase: number) => {
    const phaseInfo = phaseData.find((p) => p.phase === phase)
    setSelectedTask(phaseInfo)
    setCurrentPhase(phase)
    setCurrentQuestionIndex(0) // Começar na primeira questão
    setPhaseAnswers([]) // Resetar respostas
    setShowPhaseSummary(false) // Resetar resumo
    setIsTaskOpen(true)
  }

  const handleCloseTask = () => {
    setIsTaskOpen(false)
    setSelectedTask(null)
  }

  const handleStartLesson = () => {
    console.log(`[v0] Starting lesson - Phase ${currentPhase}, Question ${currentQuestionIndex}`)
    setIsLessonActive(true)
    handleCloseTask()
  }

  const handleStartAutomatonLesson = () => {
    console.log("[v0] Starting automaton lesson...")
    setCurrentLessonType("automaton")
    setIsLessonActive(true)
    handleCloseTask()
  }

  const handleExitLesson = () => {
    setIsLessonActive(false)
    setCurrentLessonType("normal")
    if (reviewMode) {
      setReviewMode(false)
      setReviewQuestions([])
      setReviewTags([])
    }
  }


  const handleLessonComplete = async (isCorrect: boolean) => {
    const updatedAnswers = [...phaseAnswers, isCorrect];
    setPhaseAnswers(updatedAnswers);
  
    // Detecta se estamos em uma lição de autômato
    const isAutomatonLesson = currentLessonType === "automaton";
  
    // Se for automato, sempre tratamos como última questão
    if (isAutomatonLesson) {
      console.log("⚙️ Finalizando lição de autômato (sem próxima questão).");
      setIsLessonActive(false);
    
      if (!userData) return;
    
      try {
        console.log("📡 Enviando dados para verificar conquistas (automaton lesson).");
        const res = await fetch(`https://backend-lfaquest.onrender.com/api/users/${userData.id}/checkAchievements`);
        const data = await res.json();
      
        if (data.newAchievements && data.newAchievements.length > 0) {
          setNewAchievements(data.newAchievements);
          setShowAchievementsPopup(true);
          console.log("🏅 Novas conquistas desbloqueadas:", data.newAchievements);
        } else {
          console.log("Nenhuma nova conquista encontrada.");
        }
      } catch (err) {
        console.error("Erro ao verificar conquistas:", err);
      }
    
      // Resetar o tipo de lição para evitar softlocks
      setCurrentLessonType("normal");
      return;
    }
  
    // 🔸 Caso contrário, segue o fluxo normal das lições de fase
    const currentPhaseLessons = lessons[currentPhase - 1];
    const isLastQuestion = currentQuestionIndex >= currentPhaseLessons.length - 1;
  
    if (isLastQuestion) {
      console.log("🏁 Última questão da fase alcançada!");
      setIsLessonActive(false);
    
      if (!userData) return;
    
      try {
        console.log("📡 Enviando dados para verificar conquistas (fase normal).");
        const res = await fetch(`https://backend-lfaquest.onrender.com/api/users/${userData.id}/checkAchievements`);
        const data = await res.json();
      
        if (data.newAchievements && data.newAchievements.length > 0) {
          setNewAchievements(data.newAchievements);
          setShowAchievementsPopup(true);
          console.log("🏅 Novas conquistas desbloqueadas:", data.newAchievements);
        } else {
          console.log("Nenhuma nova conquista encontrada.");
        }
      } catch (err) {
        console.error("Erro ao verificar conquistas:", err);
      }
    } else {
      console.log("➡️ Indo para a próxima questão.");
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };


  const handlePhaseSummaryContinue = () => {
    setShowPhaseSummary(false)
    setCurrentQuestionIndex(0)
    setPhaseAnswers([])
    if (reviewMode) {
      setReviewMode(false)
      setReviewQuestions([])
      setReviewTags([])
    }
  }

  const getCurrentLesson = () => {
    if (currentLessonType === "automaton") {
      return {
        isAutomaton: true,
        title: "Construção de Autômato Finito Determinístico",
        explanation: "Marque o estado inicial com → e estados finais com ⦻.",
        alternatives: [],
        image: autoimag,
        correctAnswer: 0,
        correctAutomaton: {
          conexoes: [
            { de: 2, para: 3, caractere: "b" },
            { de: 2, para: 6, caractere: "a" },
            { de: 3, para: 5, caractere: "a" },
            { de: 5, para: 2, caractere: "b" },
            { de: 5, para: 5, caractere: "a" },
            { de: 6, para: 7, caractere: "a" },
            { de: 7, para: 6, caractere: "b" },
            { de: 7, para: 7, caractere: "a" },
          ],
        },
      }
    }

    if (reviewMode && reviewQuestions.length > 0) {
      const currentLesson = reviewQuestions[currentQuestionIndex]
      if (currentLesson) {
        return {
          ...currentLesson,
          title: `${currentLesson.title} (Questão ${currentQuestionIndex + 1} de ${reviewQuestions.length}) - Modo Revisão`,
        }
      }
    }

    const currentPhaseLessons = lessons[currentPhase - 1]
    const currentLesson = currentPhaseLessons[currentQuestionIndex]

    if (currentLesson) {
      return {
        ...currentLesson,
        title: `${currentLesson.title} (Questão ${currentQuestionIndex + 1} de ${currentPhaseLessons.length})`,
      }
    }

    return currentPhaseLessons[0]
  }

  if (showPhaseSummary) {
    const totalQuestions = reviewMode
      ? reviewQuestions.length
      : currentPhase === 1
        ? lessonsFase1.length
        : lessonsFase2.length
    const correctAnswers = phaseAnswers.filter((answer) => answer).length
    const phaseTitle = reviewMode
      ? `Revisão: ${reviewTags.join(", ")}`
      : currentPhase === 1
        ? "Fundamentos dos Autômatos"
        : "Aplicações Avançadas"

    return (
      <div className="summary-container">
        <div className="summary-card">
          <h1>🎉 {reviewMode ? "Revisão Concluída!" : "Fase Concluída!"}</h1>
          <h2>
            {reviewMode ? "Modo Revisão" : `Fase ${currentPhase}`}: {phaseTitle}
          </h2>

          <p>
            Você respondeu <b>{totalQuestions}</b> pergunta{totalQuestions > 1 ? "s" : ""}{" "}
            {reviewMode ? "nesta revisão" : "nesta fase"}.
          </p>
          <p>
            ✅ Acertos: <b>{correctAnswers}</b> &nbsp;&nbsp; ❌ Erros: <b>{totalQuestions - correctAnswers}</b>
          </p>

          <p className="performance-text">
            {correctAnswers === totalQuestions
              ? "🎯 Performance Perfeita!"
              : correctAnswers >= totalQuestions * 0.7
                ? "🌟 Excelente desempenho!"
                : correctAnswers >= totalQuestions * 0.5
                  ? "👍 Bom trabalho!"
                  : "💪 Continue praticando!"}
          </p>

          <button className="continue-button" onClick={handlePhaseSummaryContinue}>
            {reviewMode ? "Voltar à Jornada →" : "Continuar Jornada →"}
          </button>
        </div>
      </div>
    )
  }

  if (isLessonActive) {

    return (
      <Lesson
        lessonData={getCurrentLesson()}
        onComplete={() => handleLessonComplete(true)}
        onExit={handleExitLesson}
        isAutomaton={currentLessonType === "automaton"}
        questionIndex={currentQuestionIndex}
        totalQuestions={lessons[currentPhase - 1].length}
      />
    )
  }

  return (
    <div className="app-container">
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />
      <div className="main-content">
        <div className="learning-path">
          <div className="path-title">Jornada de Autômatos Finitos</div>

          <div className="path-nodes">
            {phaseData.map((phase, index) => (
              <React.Fragment key={phase.phase}>
                <div
                  className={`path-node ${currentPhase === phase.phase ? "active" : index < currentPhase - 1 ? "completed" : "upcoming"}`}
                  onClick={() => handleNodeClick(phase.phase)}
                >
                  <div className="node-circle">
                    <span className="node-icon">{phase.icon}</span>
                  </div>
                  <div className="node-label">{phase.title}</div>
                </div>

                {index < phaseData.length - 1 && <div className="path-connector"></div>}
              </React.Fragment>
            ))}

            <div
              className="path-node upcoming"
              onClick={() => {
                setSelectedTask({
                  title: "Prática: Construção de Autômato",
                  description:
                    "Construa seu próprio autômato finito determinístico arrastando estados e criando transições.",
                  icon: "🎮",
                  xp: 25,
                  progress: 0,
                  learningPoints: [
                    "Construção de autômatos do zero",
                    "Definição de estados iniciais e finais",
                    "Criação de transições com caracteres",
                    "Validação de autômatos construídos",
                  ],
                })
                setIsTaskOpen(true)
              }}
            >
              <div className="node-circle">
                <span className="node-icon">🎮</span>
              </div>
              <div className="node-label">Prática Interativa</div>
              <div className="node-subtitle">Autômatos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-sidebar">
        <div className="stats">
          <div className="stat-item green">
            <span className="stat-icon">🔥</span>
            <span className="stat-number">{userData ? (userData.streak_count ?? 0) : 0}</span>
          </div>
          <div className="stat-item orange">
            <span className="stat-icon">💎</span>
            <span className="stat-number">{userData ? (userData.diamonds ?? 0) : 0}</span>
          </div>
          <div className="stat-item purple">
            <span className="stat-icon">⚡</span>
            <span className="stat-number">{userData ? (userData.xp ?? 0) : 0}</span>
          </div>
        </div>

        <div className="widget">
          <div className="widget-header">
            <h3>Ações Rápidas</h3>
          </div>
          <div className="widget-content">
            <button className="action-btn" onClick={handleStartAutomatonLesson}>
              Praticar Construção de Autômatos
            </button>
            <button className="action-btn" onClick={() => handleNodeClick(1)}>
              Continuar Fase 1
            </button>
            <button className="action-btn" onClick={() => handleNodeClick(2)}>
              Iniciar Fase 2
            </button>
          </div>
        </div>

        {!userData && (
          <div className="widget login-widget">
            <div className="widget-header">
              <h3>Crie seu perfil e salve seu progresso!</h3>
            </div>
            <div className="widget-content">
              <button className="login-btn create-btn" onClick={() => setShowRegister(true)}>
                Criar Conta
              </button>
              <button className="login-btn login-btn-alt" onClick={() => setShowLogin(true)}>
                Entrar
              </button>
            </div>
          </div>
        )}
      </div>

      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              ✕
            </button>
            <h2>Entrar</h2>
            <input
              type="email"
              placeholder="E-mail"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            {loginError && <p style={{ color: "red" }}>{loginError}</p>}
            <button className="confirm-btn-jorney" onClick={handleLogin}>
              Entrar
            </button>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowRegister(false)}>
              ✕
            </button>
            <h2>Criar Conta</h2>
            <input
              type="text"
              placeholder="Nome"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
            <input
              type="email"
              placeholder="E-mail"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            {registerError && <p style={{ color: "red" }}>{registerError}</p>}
            <button className="confirm-btn-jorney" onClick={handleRegister}>
              Cadastrar
            </button>
          </div>
        </div>
      )}

      {selectedTask && (
        <Task
          isOpen={isTaskOpen}
          onClose={handleCloseTask}
          taskData={selectedTask}
          onStartLesson={selectedTask.title.includes("Prática") ? handleStartAutomatonLesson : handleStartLesson}
        />
      )}
      {showAchievementsPopup && (
        <div className="modal-overlay">
          <div className="modal achievements-modal">
            <h2>🏆 Novas Conquistas!</h2>
            <div className="achievement-list">
              {newAchievements.map((ach) => (
                <div key={ach.id} className="achievement-item">
                  <span className="achievement-icon">{ach.icon || "✨"}</span>
                  <div className="achievement-info">
                    <strong>{ach.name}</strong>
                    <p>{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="confirm-btn-jorney" onClick={() => setShowAchievementsPopup(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Path_player
