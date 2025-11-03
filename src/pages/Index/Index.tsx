"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

interface Question {
  question: string;
  correct_answer: string;
}

const questions: Question[] = [
  {
    question:
      "Um autômato finito determinístico possui apenas uma transição possível para cada símbolo de entrada em um estado.",
    correct_answer: "Verdadeiro",
  },
  {
    question: "Um autômato não determinístico pode ser transformado em um determinístico equivalente.",
    correct_answer: "Verdadeiro",
  },
  {
    question: "A linguagem gerada por uma gramática regular é sempre reconhecível por um autômato finito.",
    correct_answer: "Verdadeiro",
  },
  {
    question: "Gramáticas livres de contexto são equivalentes aos autômatos finitos determinísticos.",
    correct_answer: "Falso",
  },
  {
    question: "O lema do bombeamento pode ser usado para provar que uma linguagem é regular.",
    correct_answer: "Falso",
  },
  {
    question: "Todo autômato determinístico é também não determinístico.",
    correct_answer: "Verdadeiro",
  },
];

const Index: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"choose" | "login" | "diagnostic" | "done">("choose");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const handleAnswer = (value: string) => {
    const correct = questions[currentQuestion].correct_answer === value;
    setAnswers({ ...answers, [currentQuestion]: value });

    if (correct) {
      setScore((s) => s + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }

    // aguarda o feedback antes de ir pra próxima
    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((q) => q + 1);
      } else {
        handleSubmit();
      }
    }, 1500);
  };

  // 🔹 AQUI ESTÁ A PARTE AJUSTADA
  const handleSubmit = async () => {
    const formatted = questions.map((q, idx) => ({
      question: q.question,
      answer: answers[idx] || "",
      correct_answer: q.correct_answer,
    }));

    // Detecta ambiente e define o backend automaticamente
    const API_BASE_URL =
      window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "https://backend-lfaquest.onrender.com/api";

    try {
      console.log("🌐 Enviando para:", `${API_BASE_URL}/users/diagnostic`);

      const response = await fetch(`${API_BASE_URL}/users/diagnostic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: null, answers: formatted }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      console.log("✅ Diagnóstico enviado com sucesso!");
      setStep("done");

      setTimeout(() => {
        setShowModal(false);
        navigate("/path");
      }, 2500);
    } catch (error) {
      console.error("❌ Erro ao enviar diagnóstico:", error);
      alert("Erro ao enviar o diagnóstico. Verifique sua conexão ou tente novamente.");
    }
  };
  // 🔹 FIM DO AJUSTE

  const topics = [
    {
      name: "Autômatos Finitos",
      description: "Modelos computacionais que reconhecem linguagens regulares.",
      complexity: "Determinísticos e não-determinísticos",
      icon: "🔁",
    },
    {
      name: "Autômatos Infinitos",
      description: "Autômatos que processam palavras infinitas, como Büchi e Muller.",
      complexity: "Processamento contínuo",
      icon: "♾️",
    },
    {
      name: "Lema do Bombeamento",
      description: "Ferramenta usada para provar que uma linguagem não é regular.",
      complexity: "Prova por contradição",
      icon: "💣",
    },
    {
      name: "Máquinas de Turing",
      description: "Modelo teórico que define a noção de computabilidade.",
      complexity: "Tese de Church-Turing",
      icon: "🖥️",
    },
  ];

  const features = [
    {
      title: "Aprendizado Interativo",
      description: "Explore conceitos teóricos com animações e simulações visuais.",
      icon: "🎮",
    },
    {
      title: "Acompanhamento de Progresso",
      description: "Monitore seu domínio em tópicos como linguagens formais e autômatos.",
      icon: "📊",
    },
    {
      title: "Experiência Gamificada",
      description: "Ganhe pontos, avance em trilhas e supere desafios teóricos.",
      icon: "🏆",
    },
    {
      title: "Trilha Personalizada",
      description: "Conteúdo adaptado ao seu conhecimento em teoria da computação.",
      icon: "🛤️",
    },
  ];

  return (
    <div className="index-container">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Domine os <span className="highlight">Fundamentos da Computação</span>
          </h1>
          <p className="hero-subtitle">
            Aprenda teoria da computação com lições visuais e práticas interativas.
          </p>
          <div className="hero-buttons">
            <button className="cta-primary" onClick={() => { setShowModal(true); setStep("choose"); }}>
              Começar a Aprender
            </button>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="algorithms-section">
        <h2 className="section-title">Explore os Fundamentos</h2>
        <div className="algorithms-grid">
          {topics.map((topic, i) => (
            <div key={i} className="algorithm-card">
              <div className="algorithm-icon">{topic.icon}</div>
              <h3 className="algorithm-name">{topic.name}</h3>
              <p className="algorithm-description">{topic.description}</p>
              <span className="complexity-value">{topic.complexity}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2 className="section-title">Por que escolher nossa plataforma?</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Pronto para começar?</h2>
          <button className="cta-primary large" onClick={() => { setShowModal(true); setStep("choose"); }}>
            Comece Gratuitamente
          </button>
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* Escolha inicial */}
            {step === "choose" && (
              <>
                <h2>Você já utiliza a plataforma?</h2>
                <p>Escolha uma das opções abaixo:</p>
                <div className="modal-actions">
                  <button className="confirm-btn" onClick={() => setStep("login")}>
                    Sim, fazer login
                  </button>
                  <button className="confirm-btn-alt" onClick={() => setStep("diagnostic")}>
                    Não, é minha primeira vez
                  </button>
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                </div>
              </>
            )}

            {/* Login */}
            {step === "login" && (
              <div className="login-form">
                <h2>Entrar na Plataforma</h2>
                <input type="email" placeholder="E-mail" />
                <input type="password" placeholder="Senha" />

                <div className="login-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setStep("choose")}
                  >
                    Cancelar
                  </button>

                  <button
                    className="confirm-btn"
                    onClick={() => {
                      alert("Login simulado! Redirecionando...");
                      navigate("/path");
                    }}
                  >
                    Entrar
                  </button>
                </div>
              </div>
            )}

            {/* Diagnóstico */}
            {step === "diagnostic" && (
              <div className="diagnostic">
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    }}
                  ></div>
                </div>

                <h2>Questionário Diagnóstico</h2>
                <p className="progress-text">
                  Pergunta {currentQuestion + 1} de {questions.length}
                </p>
                <p className="question-text">{questions[currentQuestion].question}</p>

                <div className="answers">
                  <button
                    onClick={() => handleAnswer("Verdadeiro")}
                    className="answer-btn"
                    disabled={!!feedback}
                  >
                    Verdadeiro
                  </button>
                  <button
                    onClick={() => handleAnswer("Falso")}
                    className="answer-btn"
                    disabled={!!feedback}
                  >
                    Falso
                  </button>
                </div>

                {/* Feedback imediato */}
                {feedback && (
                  <div
                    className={`feedback-message ${feedback === "correct" ? "correct" : "wrong"}`}
                  >
                    {feedback === "correct" ? "✅ Correto!" : "❌ Resposta incorreta!"}
                  </div>
                )}
              </div>
            )}

            {/* Final */}
            {step === "done" && (
              <div className="diagnostic-finish">
                <h2>🎉 Questionário concluído!</h2>
                <p>
                  Você acertou <strong>{score}</strong> de{" "}
                  <strong>{questions.length}</strong> perguntas.
                </p>
                <p>Redirecionando para a plataforma...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;