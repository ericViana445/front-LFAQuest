"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import automatoFinal from "../../assets/automato_q5.png";
import {
  FaGamepad,
  FaChartBar,
  FaTrophy,
  FaRoute,
} from "react-icons/fa6";
import { IoClose } from "react-icons/io5";  
import { MdCelebration } from "react-icons/md";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

const questions: Question[] = [
  {
    question:
      "No contexto da teoria da computação, qual é a característica fundamental que define uma linguagem regular?",
    options: [
      "A) Pode ser processada por uma máquina de Turing com fita infinita.",
      "B) Requer uma gramática livre de contexto para sua descrição.",
      "C) Pode ser reconhecida por um autômato finito determinístico.",
      "D) Necessita de memória auxiliar para cadeias complexas.",
      "E) É exclusiva para linguagens de programação orientada a objetos.",
    ],
    correct_answer: "C",
  },
  {
    question: `Considere a gramática G:
S → AcB
A → cA | aB
B → cB | aA
A → ε
Assinale a alternativa que NÃO pertence à linguagem gerada pela gramática.`,
    options: ["A) ccca", "B) aaca", "C) aaaca", "D) ccac", "E) aaa"],
    correct_answer: "E",
  },
  
  {
    question:
      "Dado o autômato finito abaixo, assinale a alternativa onde a expressão regular o representa:",
    options: [
      "A) a*b(cb)a*",
      "B) aba(cb)",
      "C) a*b(cb)*a",
      "D) a*b*c*b*a*",
      "E) a*bcb*a*",
    ],
    correct_answer: "C",
  },
  {
    question:
      "Considere a expressão regular (c∗a[abc]∗b[abc]∗) | c∗. Assinale a alternativa correta:",
    options: [
      "A) Cadeias onde o primeiro 'a' precede o primeiro 'b'.",
      "B) Cadeias com número par de 'a's.",
      "C) Cadeias contendo a substring 'baa'.",
      "D) Cadeias com número ímpar de 'c's.",
      "E) Cadeias terminadas por 'c'.",
    ],
    correct_answer: "A",
  },
  {
    question: `Sobre o Teorema do Bombeamento para linguagens regulares, é INCORRETO afirmar que:`,
    options: [
      "A) Se uma linguagem L não é regular, pode-se demonstrar que é regular usando o teorema.",
      "B) Para toda linguagem regular L existe uma parte da palavra que pode ser repetida infinitamente.",
      "C) Pode-se usar o teorema para mostrar que uma linguagem com número primo de símbolos não é regular.",
      "D) O enunciado do teorema usa quantificadores existenciais e universais.",
      "E) Pode ser usado para mostrar que a linguagem {0ⁿ1ⁿ} não é regular.",
    ],
    correct_answer: "A",
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
  const [loadingLogin, setLoadingLogin] = useState(false);


  const handleAnswer = (value: string) => {
    const correct = questions[currentQuestion].correct_answer === value;
    setAnswers({ ...answers, [currentQuestion]: value });

    if (correct) {
      setScore((s) => s + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((q) => q + 1);
      } else {
        handleSubmit();
      }
    }, 1500);
  };

  const handleSubmit = async () => {
    const formatted = questions.map((q, idx) => ({
      question: q.question,
      answer: answers[idx] || "",
      correct_answer: q.correct_answer,
    }));

    const API_BASE_URL = "https://backend-lfaquest.onrender.com/api";

    try {
      console.log("🌐 Enviando para:", `${API_BASE_URL}/users/diagnostic`);

      const response = await fetch(`${API_BASE_URL}/users/diagnostic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: null, answers: formatted }),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

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

  // 🔹 Gerador dinâmico de botões (A–E)
  const renderOptions = () => {
    return questions[currentQuestion].options.map((opt, i) => {
      const letter = opt.trim().charAt(0);
      return (
        <button
          key={i}
          onClick={() => handleAnswer(letter)}
          className="answer-btn"
          disabled={!!feedback}
        >
          {opt}
        </button>
      );
    });
  };

  const topics = [
    {
      name: "Autômatos Finitos",
      description: "Modelos computacionais que reconhecem linguagens regulares.",
      complexity: "Determinísticos e não-determinísticos",
    
    },
    {
      name: "Autômatos Infinitos",
      description: "Autômatos que processam palavras infinitas, como Büchi e Muller.",
      complexity: "Processamento contínuo",
    },
    {
      name: "Lema do Bombeamento",
      description: "Ferramenta usada para provar que uma linguagem não é regular.",
      complexity: "Prova por contradição",
    },  
  ];
  
  const features = [
    {
      title: "Aprendizado Interativo",
      description: "Explore conceitos teóricos com animações e simulações visuais.",
      icon: <FaGamepad size={26} />,
    },
    {
      title: "Acompanhamento de Progresso",
      description: "Monitore seu domínio em tópicos como linguagens formais e autômatos.",
      icon: <FaChartBar size={26} />,
    },
    {
      title: "Experiência Gamificada",
      description: "Ganhe pontos, avance em trilhas e supere desafios teóricos.",
      icon: <FaTrophy size={26} />,
    },
    {
      title: "Trilha Personalizada",
      description: "Conteúdo adaptado ao seu conhecimento em teoria da computação.",
      icon: <FaRoute size={26} />,
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
            <button
              className="cta-primary"
              onClick={() => {
                setShowModal(true);
                setStep("choose");
              }}
            >
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

      {/* CTA FINAL */}
      <section className="final-cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Pronto para começar?</h2>
          <button
            className="cta-primary large"
            onClick={() => {
              setShowModal(true);
              setStep("choose");
            }}
          >
            Comece Gratuitamente
          </button>
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-a">
            {/* Botão de fechar (X) */}
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <IoClose size={24} />
            </button>
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
                </div>
              </>
            )}

            {/* LOGIN */}
            {step === "login" && (
              <div className="login-form">
                <h2>Entrar na Plataforma</h2>
                <input type="email" placeholder="E-mail" />
                <input type="password" placeholder="Senha" />
                <div className="login-actions">
                  <button
                    className="confirm-btn"
                    disabled={loadingLogin}
                    onClick={async () => {
                      const emailInput = document.querySelector<HTMLInputElement>('input[type="email"]');
                      const passwordInput = document.querySelector<HTMLInputElement>('input[type="password"]');
                      const email = emailInput?.value.trim();
                      const password = passwordInput?.value.trim();
                    
                      if (!email || !password) {
                        alert("Por favor, preencha o e-mail e a senha.");
                        return;
                      }
                    
                      const API_BASE_URL =
                        window.location.hostname === "localhost"
                          ? "http://localhost:5000/api"
                          : "https://backend-lfaquest.onrender.com/api";
                    
                      try {
                        setLoadingLogin(true); // 👉 inicia o loading
                      
                        const response = await fetch(`${API_BASE_URL}/auth/login`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email, password }),
                        });
                      
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.message || "Erro no login");
                      
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                      
                        alert("✅ Login realizado com sucesso!");
                        navigate("/path");
                      } catch (error: any) {
                        alert(error.message || "Erro ao fazer login.");
                      } finally {
                        setLoadingLogin(false); // 👉 termina o loading
                      }
                    }}
                  >
                    {loadingLogin ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      "Entrar"
                    )}
                  </button>
                  
                </div>
              </div>
            )}

            {/* DIAGNÓSTICO */}
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
                {currentQuestion ===  2 && (
                  <img
                    src={automatoFinal}
                    alt="Autômato da questão 5"
                    className="question-image"
                  />
                )}

                <div className="answers">{renderOptions()}</div>

                {feedback && (
                  <div
                    className={`feedback-message ${feedback === "correct" ? "correct" : "wrong"}`}
                  >
                    {feedback === "correct" ? "✅ Correto!" : "❌ Resposta incorreta!"}
                  </div>
                )}
              </div>
            )}

            {/* FINAL */}
            {step === "done" && (
              <div className="diagnostic-finish">
                <h2 className="flex items-center justify-center gap-2">
                  <MdCelebration size={26} /> Questionário concluído!
                </h2>

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
