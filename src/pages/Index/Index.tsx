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
    question: `No contexto da teoria da computação, qual é a característica fundamental que define uma linguagem regular?`,
    correct_answer: "C",
  },
  {
    question: `Considere a seguinte gramática G, onde S é o símbolo inicial:
S → AcB
A → cA | aB
B → cB | aA
A → ε
Assinale a alternativa que apresenta a palavra que NÃO pertence à linguagem gerada pela gramática G.
(A) ccca
(B) aaca
(C) aaaca
(D) ccac
(E) aaa`,
    correct_answer: "E",
  },
  {
    question: `Seja o autômato finito mostrado na figura abaixo que opera sobre o alfabeto Σ={a,b} (o círculo em negrito indica um estado terminal).

Analise as seguintes afirmativas:
I. O autômato finito mostrado na figura é determinístico.
II. O autômato finito mostrado na figura é não-determinístico.
III. O autômato finito mostrado na figura reconhece a palavra vazia.

A análise permite concluir que:
(A) todas as afirmativas são falsas.
(B) Somente a afirmativa I é falsa.
(C) Somente a afirmativa II é falsa.
(D) Somente a afirmativa III é falsa.
(E) nenhuma das afirmativas é falsa.`,
    correct_answer: "B",
  },
  {
    question: `Encontre a maior linguagem para o alfabeto {a,b} utilizando apenas uma expressão regular abaixo:
A) ab*
B) a*b*
C) (ab)*
D) (a|b)(a|b)*
E) (a|b)*`,
    correct_answer: "E",
  },
  {
    question: `Dado o autômato Finito abaixo, assinale a alternativa onde a expressão regular (ER) o representa:
a*b(cb)a*.
aba(cb).
a*b(cb)*a.
a*b*c*b*a*.
a*bcb*a*`,
    correct_answer: "C",
  },
  {
    question: `Considere a expressão regular a seguir:
(c∗a[abc]∗b[abc]∗) | c∗
Assinale a alternativa que descreve, corretamente, todas as cadeias geradas por essa expressão regular:
a) Cadeias sobre o alfabeto {a,b,c} onde o primeiro a precede o primeiro b.
b) Cadeias sobre o alfabeto {a,b,c} com um número par de a's.
c) Cadeias sobre o alfabeto {a,b,c} contendo a substring baa.
d) Cadeias sobre o alfabeto {a,b,c} contendo um número ímpar de c's.
e) Cadeias sobre o alfabeto {a,b,c} terminadas por c.`,
    correct_answer: "A",
  },
  {
    question: `Sobre o Teorema do Bombeamento para linguagens regulares, é INCORRETO afirmar que:
(A) Se uma linguagem L não é regular, pode-se demonstrar que de fato L não é regular, utilizando-se o Teorema do Bombeamento.
(B) Para toda linguagem regular L e toda palavra suficientemente grande pertencente a L, é possível afirmar que há um trecho desta palavra que pode ser repetido quantas vezes desejarmos para se obterem outras palavras de L.
(C) O Teorema do Bombeamento pode ser utilizado para mostrar que a linguagem L, composta por palavras cujo comprimento é um número primo, não é regular.
(D) O enunciado do Teorema do Bombeamento possui diversos quantificadores lógicos, sendo eles existenciais e universais.
(E) O Teorema do Bombeamento pode ser utilizado para mostrar que a linguagem composta por palavras formadas por uma quantidade qualquer de 0's, seguida da mesma quantidade de 1's, não é regular.`,
    correct_answer: "A",
  },
  {
    question: `Sobre o lema do bombeamento para as linguagens regulares, analise as assertivas a seguir:
I. Se uma linguagem é Regular, então é aceita por um Autômato Finito Determinístico o qual possui um número finito e predefinido de n estados.
II. Se o autômato reconhece uma entrada w de comprimento maior ou igual a n, obrigatoriamente o autômato assume algum estado q mais de uma vez, então existe um ciclo na função programa que passa por q.
III. A entrada w pode ser dividida em 3 subpalavras w = xyz tal que |xy| <= n, |y| >= 1 e onde y é a parte de w reconhecida pelo ciclo na função programa.
IV. O Lema do bombeamento não pode ser utilizado para provar que uma determinada linguagem é Não Regular.
Quais estão corretas?
(A) Apenas I e II.
(B) Apenas III e IV.
(C) Apenas I, II e III.
(D) Apenas II, III e IV.
(E) I, II, III e IV.`,
    correct_answer: "C",
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
                        console.log("🔐 Enviando login para:", `${API_BASE_URL}/auth/login`);
                      
                        const response = await fetch(`${API_BASE_URL}/auth/login`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email, password }),
                        });
                      
                        const data = await response.json();
                        if (!response.ok) throw new Error(data.message || "Erro no login");
                      
                        // ✅ Salva token e dados do usuário
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                      
                        alert("✅ Login realizado com sucesso!");
                        navigate("/path");
                      } catch (error: any) {
                        console.error("❌ Erro ao fazer login:", error);
                        alert(error.message || "Erro ao fazer login. Tente novamente.");
                      }
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