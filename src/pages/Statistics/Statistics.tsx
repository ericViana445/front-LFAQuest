"use client"
import { FaCoins, FaStar } from "react-icons/fa6";
import { FaCheck, FaXmark, FaClipboardList, FaClock,  FaTriangleExclamation } from "react-icons/fa6";
import { WiDaySunny } from "react-icons/wi";
import type React from "react"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/sidebar/Sidebar"
import {
  lessonsFase1,
  lessonsFase2,
  lessonsFase3,
  lessonsFase4,
  lessonsFase5,
} from "../../components/lession/LessonData"
import "./statistics.css"

interface DecodedToken {
  id: number
  email: string
  exp: number
}

interface TagAnalytics {
  tag: string
  total_questions: number
  correct: number
  incorrect: number
  accuracy: number
  avg_time: number
}

interface AnalyticsData {
  total_questions: number
  total_correct: number
  total_incorrect: number
  tag_most_errors: string | null
  tags: TagAnalytics[]
}

const Statistics: React.FC = () => {
  const [activeNavItem, setActiveNavItem] = useState("more")
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const navigate = useNavigate()

  const cardIconMap: Record<string, React.ReactNode> = {
  totalQuestions: <FaClipboardList color="#3b82f6" size={24} />,  // antes 📝
  accuracy: <FaCheck color="#10b981" size={24} />,                 // antes ✓
  avgTime: <FaClock color="#3b82f6" size={24} />,                  // antes ⏱️
  needsAttention: < FaTriangleExclamation color="#ef4444" size={24} />, // antes ⚠️
  correct: <FaCheck color="#10b981" size={24} />,                  // antes ✓
  incorrect: <FaXmark color="#ef4444" size={24} />,                // antes ✗
  default: <FaClipboardList color="#9ca3af" size={24} />,          // fallback
}

  const navigator = (item: string) => setActiveNavItem(item)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const decoded: DecodedToken = jwtDecode(token)
      const userId = decoded.id

      Promise.all([
        fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}`).then((r) => r.json()),
        fetch(`https://backend-lfaquest.onrender.com/api/users/${userId}/analytics`).then((r) => r.json()),
      ])
        .then(([user, analytics]) => {
          setUserData(user)
          setAnalytics(analytics)
          setLoading(false)
        })
        .catch((err) => console.error("Erro ao carregar dados:", err))
    } catch (error) {
      console.error("Token inválido:", error)
      setLoading(false)
    }
  }, [])

  const getPerformanceLevel = (accuracy: number): { level: string; color: string; label: string } => {
    if (accuracy >= 0.8) return { level: "excellent", color: "#10b981", label: "Excelente" }
    if (accuracy >= 0.6) return { level: "good", color: "#f59e0b", label: "Bom" }
    return { level: "needs-improvement", color: "#ef4444", label: "Precisa Melhorar" }
  }



const handleReviewTopic = () => {
  if (!analytics || !analytics.tags || analytics.tags.length === 0) {
    alert("Nenhum dado disponível para revisão")
    return
  }

  // 1️⃣ Filtra todas as tags com taxa de acerto menor ou igual a 35%
  const lowAccuracyTags = analytics.tags.filter((t) => t.accuracy <= 0.35)

  if (lowAccuracyTags.length === 0) {
    alert("Parabéns! Nenhum tópico com taxa de acerto menor ou igual a 35%. 🎉")
    return
  }

  // 2️⃣ Extrai o nome das tags que precisam de revisão
  const tagNames = lowAccuracyTags.map((t) => t.tag)

  // 3️⃣ Junta todas as lições de todas as fases
  const allLessons = [
    ...lessonsFase1,
    ...lessonsFase2,
    ...lessonsFase3,
    ...lessonsFase4,
    ...lessonsFase5,
  ]

  // 4️⃣ Filtra todas as questões que possuem essas tags
  const reviewQuestions = allLessons.filter(
    (lesson) => lesson.tags && lesson.tags.some((tag) => tagNames.includes(tag))
  )

  if (reviewQuestions.length === 0) {
    alert("Nenhuma questão encontrada para os tópicos com mais dificuldade")
    return
  }

  // 5️⃣ Limita o número de questões a 5
  const limitedQuestions = reviewQuestions.slice(0, 5)

  // 6️⃣ Inicia a lição em modo de revisão
  navigate("/path", {
    state: {
      reviewMode: true,
      reviewQuestions: limitedQuestions,
      reviewTags: tagNames,
    },
  })
}




  if (loading)
    return (
      <div className="statistics-container">
        <Sidebar activeItem={activeNavItem} onNavigate={navigator} />
        <div className="statistics-main">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando estatísticas...</p>
          </div>
        </div>
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
        </div>
      </div>
    )

  if (!analytics)
    return (
      <div className="statistics-container">
        <Sidebar activeItem={activeNavItem} onNavigate={navigator} />
        <div className="statistics-main">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2>Nenhum dado disponível</h2>
            <p>Resolva algumas questões para começar a gerar estatísticas!</p>
          </div>
        </div>
        <div className="right-sidebar">
          
        </div>
      </div>
    )

  const accuracy = (analytics.total_correct / analytics.total_questions) * 100 || 0
  const avgTime = analytics.tags.reduce((acc, t) => acc + t.avg_time, 0) / (analytics.tags.length || 1)
  const overallPerformance = getPerformanceLevel(accuracy / 100)

  return (
    <div className="statistics-container">
      <Sidebar activeItem={activeNavItem} onNavigate={navigator} />

      <div className="statistics-main">
        <div className="statistics-header">
          <div className="header-content">
            <h1>Estatísticas de Aprendizagem</h1>
            <p>Acompanhe seu progresso e identifique áreas de melhoria</p>
          </div>
          <div
            className="performance-badge"
            style={{ backgroundColor: `${overallPerformance.color}20`, color: overallPerformance.color }}
          >
            <span className="badge-label">Desempenho Geral</span>
            <span className="badge-value">{overallPerformance.label}</span>
          </div>
        </div>

        <div className="overview-grid">
          <div className="overview-card primary">
            <div className="card-icon">{cardIconMap.totalQuestions}</div>
            <div className="card-content">
              <h3>Total de Questões</h3>
              <p className="card-value">{analytics.total_questions}</p>
              <span className="card-label">questões respondidas</span>
            </div>
          </div>
          <div className="overview-card success">
            <div className="card-icon">{cardIconMap.accuracy}</div>
            <div className="card-content">
              <h3>Taxa de Acerto</h3>
              <p className="card-value">{accuracy.toFixed(1)}%</p>
              <div className="mini-progress">
                <div
                  className="mini-progress-bar"
                  style={{ width: `${accuracy}%`, backgroundColor: overallPerformance.color }}
                ></div>
              </div>
            </div>
          </div>
          <div className="overview-card info">
            <div className="card-icon">{cardIconMap.avgTime}</div>
            <div className="card-content">
              <h3>Tempo Médio</h3>
              <p className="card-value">{avgTime.toFixed(1)}s</p>
              <span className="card-label">por questão</span>
            </div>
          </div>
          <div className="overview-card warning">
            <div className="card-icon">{cardIconMap.needsAttention}</div>
            <div className="card-content">
              <h3>Precisa Atenção</h3>
              <p className="card-value-text">{analytics.tag_most_errors || "Nenhuma 🎉"}</p>
              <span className="card-label">tag com mais erros</span>
            </div>
          </div>
        </div>

        <div className="tags-section">
          <div className="section-header">
            <div>
              <h2>Desempenho por Tópico</h2>
              <p className="section-description">Selecione um tópico para ver análise detalhada</p>
            </div>
          </div>
          <div className="tags-grid">
            {analytics.tags.map((tag, i) => {
              const performance = getPerformanceLevel(tag.accuracy)
              return (
                <button
                  key={i}
                  className={`tag-card ${selectedTag === tag.tag ? "active" : ""}`}
                  onClick={() => setSelectedTag(tag.tag)}
                  style={{
                    borderColor: selectedTag === tag.tag ? performance.color : "transparent",
                  }}
                >
                  <div className="tag-card-header">
                    <span className="tag-name">{tag.tag}</span>
                    <span
                      className="tag-badge"
                      style={{ backgroundColor: `${performance.color}20`, color: performance.color }}
                    >
                      {(tag.accuracy * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="tag-card-stats">
                    <span className="tag-stat">{tag.total_questions} questões</span>
                    <span className="tag-stat-dot">•</span>
                    <span className="tag-stat">{tag.avg_time.toFixed(1)}s médio</span>
                  </div>
                  <div className="tag-progress-bar">
                    <div
                      className="tag-progress-fill"
                      style={{
                        width: `${tag.accuracy * 100}%`,
                        backgroundColor: performance.color,
                      }}
                    ></div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {selectedTag ? (
          <div className="tag-details-section">
            {analytics.tags
              .filter((tag) => tag.tag === selectedTag)
              .map((tag, i) => {
                const performance = getPerformanceLevel(tag.accuracy)
                return (
                  <div key={i} className="tag-detail-container">
                    <div className="detail-header">
                      <h2>Análise Detalhada: {selectedTag}</h2>
                      <span
                        className="performance-label"
                        style={{ backgroundColor: `${performance.color}20`, color: performance.color }}
                      >
                        {performance.label}
                      </span>
                    </div>
                    <div className="detail-stats-grid">
                      <div className="detail-stat-card">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: "#10b98120" }}>
                          {cardIconMap.correct}
                        </div>

                        <div className="stat-info">
                          <h3>Taxa de Acerto</h3>
                          <p className="stat-value-large" style={{ color: performance.color }}>
                            {(tag.accuracy * 100).toFixed(1)}%
                          </p>
                          <div className="stat-progress">
                            <div
                              className="stat-progress-bar"
                              style={{
                                width: `${tag.accuracy * 100}%`,
                                backgroundColor: performance.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="detail-stat-card">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: "#445eef20" }}>
                          {cardIconMap.avgTime}
                        </div>
                        <div className="stat-info">
                          <h3>Tempo Médio</h3>
                          <p className="stat-value-large">{tag.avg_time.toFixed(1)}s</p>
                          <span className="stat-sublabel">por questão</span>
                        </div>
                      </div>
                      <div className="detail-stat-card">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: "#8b5cf620" }}>
                          {cardIconMap.totalQuestions}
                        </div>
                        <div className="stat-info">
                          <h3>Total de Questões</h3>
                          <p className="stat-value-large">{tag.total_questions}</p>
                          <span className="stat-sublabel">respondidas</span>
                        </div>
                      </div>
                      <div className="detail-stat-card">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: "#8b5cf620" }}>
                          {cardIconMap.correct}
                        </div>
                        <div className="stat-info">
                          <h3>Acertos</h3>
                          <p className="stat-value-large correct">{tag.correct}</p>
                          <span className="stat-sublabel">questões corretas</span>
                        </div>
                      </div>
                      <div className="detail-stat-card">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: "#8b5cf620" }}>
                          {cardIconMap.incorrect}
                        </div>
                        <div className="stat-info">
                          <h3>Erros</h3>
                          <p className="stat-value-large incorrect">{tag.incorrect}</p>
                          <span className="stat-sublabel">questões incorretas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="no-selection-state">
            <div className="selection-icon">👆</div>
            <h3>Selecione um tópico</h3>
            <p>Escolha um tópico acima para ver análise detalhada do seu desempenho</p>
          </div>
        )}

      </div>

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
          {analytics.tag_most_errors && (
          <div className="suggestion-section">
            <div className="suggestion-content">
              <div className="suggestion-text">
                <h3>Recomendação Personalizada</h3>
                <p>
                  Identificamos que você tem mais dificuldade em <strong>{analytics.tag_most_errors}</strong>.
                  Preparamos questões específicas para você praticar e melhorar neste tópico.
                </p>
              </div>
            </div>
            <button className="review-btn" onClick={handleReviewTopic}>
              <span>Revisar Tópicos com Dificuldade</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Statistics

import type { FC } from "react"

export const SuggestionWidget: FC<{
  analytics: AnalyticsData
  handleReviewTopic: () => void
}> = ({ analytics, handleReviewTopic }) => {
  if (!analytics?.tag_most_errors) return null

  return (
    <div className="suggestion-section">
      <div className="suggestion-content">
        <div className="suggestion-text">
          <h3>Recomendação Personalizada</h3>
          <p>
            Identificamos que você tem mais dificuldade em{" "}
            <strong>{analytics.tag_most_errors}</strong>.
            Preparamos questões específicas para você praticar e melhorar neste tópico.
          </p>
        </div>
      </div>
      <button className="review-btn" onClick={handleReviewTopic}>
        <span>Revisar Tópicos com Dificuldade</span>
        <span className="btn-arrow">→</span>
      </button>
    </div>
  )
}
