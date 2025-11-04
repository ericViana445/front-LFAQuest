"use client";

import React, { useState, useEffect, useRef } from "react";
import "./LessonTemplate.css";
import AutomatonLesson, { extractAutomatonDetails } from "./AutomatonLession";
import type { Estado, Conexao } from "./AutomatonLession";
import axios from "axios";

// Importando as funções de validação de autômato
import { 
  getNodesWithStates, 
  getNosEspeciais, 
  validarEstruturaAutomato,
  getNosPorTipo,
} from "./AutomatonLession";

interface LessonData {
  title: string;
  question?: string;
  alternatives: string[];
  correctAnswer: number;
  explanation?: string;
  image?: string;
  isAutomaton?: boolean;
  correctAutomaton?: {
    conexoes: Array<{
      de: number;
      para: number;
      caractere: string;
    }>;
    inicial?: number | string; // Agora aceita número ou string
    finais?: (number | string)[]; // Agora aceita números ou strings
  };
  tags?: string[];
}

interface LessonTemplateProps {
  lessonData: LessonData;
  onComplete: () => void;
  onExit: () => void;
  isAutomaton?: boolean;
  questionIndex: number;
  totalQuestions: number;
}

interface ValidationDetails {
  estadosIniciais: Estado[];
  estadosFinais: Estado[];
  conexoesValidas: Array<{
    de: number;
    para: number;
    caractere: string;
  }>;
  conexoesInvalidas: Array<{
    de: number;
    para: number;
    caractere: string;
  }>;
  mensagens: string[];
}

interface AnsweredQuestion {
  questionId: string;
  isCorrect: boolean;
  selectedAnswer?: number | null;
  correctAnswer?: number;
  tags?: string[];
  timeTaken: number;
}



const LessonTemplate: React.FC<LessonTemplateProps> = ({
  lessonData,
  onComplete,
  onExit,
  isAutomaton = false,
  questionIndex,
  totalQuestions,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showSummary, setShowSummary] = useState(false);
  const [lessonResult, setLessonResult] = useState<{
    diamonds: number;
    xp: number;
    streak: number;
  } | null>(null);
  const [userAutomaton, setUserAutomaton] = useState<{ estados: Estado[]; conexoes: Conexao[] } | null>(null);
  const automatonLessonRef = useRef<{ handleValidar: () => any }>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [isContinueClicked, setIsContinueClicked] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
    setShowSummary(false);
    setLessonResult(null);
    setUserAutomaton(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setIsContinueClicked(false);

  }, [lessonData]);

  console.debug(extractAutomatonDetails)

// ===============================
// 🧠 FUNÇÃO MELHORADA DE VALIDAÇÃO DO AUTÔMATO
// ===============================
const validateAutomatonEnhanced = (
  userEstados: Estado[],
  userConexoes: Conexao[]
) => {
  console.group("🔍 Validação Avançada do Autômato");
  
  if (!lessonData.correctAutomaton) {
    console.warn("⚠️ Nenhum autômato correto definido em lessonData.correctAutomaton!");
    console.groupEnd();
    return false;
  }

  const correct = lessonData.correctAutomaton;
  const correctConexoes = correct.conexoes || [];
  const correctInicial = correct.inicial;
  const correctFinais = correct.finais || [];

  console.log("📘 Autômato correto esperado:", {
    inicial: correctInicial,
    finais: correctFinais,
    conexoes: correctConexoes
  });

  // 🎯 ANÁLISE COMPLETA DO AUTÔMATO DO USUÁRIO
  const analiseUsuario = getNodesWithStates(userEstados, userConexoes);
  const nosEspeciaisUsuario = getNosEspeciais(userEstados);
  const validacaoEstrutura = validarEstruturaAutomato(userEstados, userConexoes);
  const nosPorTipoUsuario = getNosPorTipo(userEstados);

  console.log("📊 Análise completa do autômato do usuário:", analiseUsuario.estatisticas);
  console.log("⭐ Nós especiais do usuário:", nosEspeciaisUsuario);
  console.log("✅ Validação de estrutura:", validacaoEstrutura);

  // 🔍 VALIDAÇÃO DE ESTADOS ESPECIAIS - CORREÇÃO AQUI
  // Estados iniciais do usuário (inclui os que são inicial E final)
  const estadosIniciaisUsuario = [
    ...nosPorTipoUsuario.iniciais, 
    ...nosPorTipoUsuario.inicialEFinal
  ].map(e => e.nome);

  // Estados finais do usuário (inclui os que são final E inicial)
  const estadosFinaisUsuario = [
    ...nosPorTipoUsuario.finais, 
    ...nosPorTipoUsuario.inicialEFinal
  ].map(e => e.nome);

  console.log("🚀 Estados iniciais do usuário (incluindo inicial+final):", estadosIniciaisUsuario);
  console.log("🏁 Estados finais do usuário (incluindo inicial+final):", estadosFinaisUsuario);

  // Normalizar para comparação (aceita número ou string)
  const normalizarEstado = (estado: number | string | undefined): string => {
    return estado?.toString() || "";
  };

  const correctInicialStr = normalizarEstado(correctInicial);
  const correctFinaisStr = correctFinais.map(normalizarEstado);

  // Verificar estado inicial (deve estar presente nos iniciais do usuário)
  const estadoInicialCorreto = correctInicialStr === "" || 
    estadosIniciaisUsuario.includes(correctInicialStr);

  // Verificar estados finais (todos os finais corretos devem estar nos finais do usuário)
  const estadosFinaisCorretos = correctFinaisStr.length === 0 || 
    correctFinaisStr.every(fim => estadosFinaisUsuario.includes(fim));

  console.log("🎯 Verificação de estados especiais:", {
    estadoInicialCorreto,
    estadosFinaisCorretos,
    esperadoInicial: correctInicialStr,
    esperadoFinais: correctFinaisStr,
    encontradoIniciais: estadosIniciaisUsuario,
    encontradoFinais: estadosFinaisUsuario
  });

  // 🔗 VALIDAÇÃO DE CONEXÕES (mantém igual)
  const normalizarConexao = (conexao: any) => ({
    de: conexao.de.toString(),
    para: conexao.para.toString(),
    caractere: (conexao.caractere || "").toLowerCase().trim(),
  });

  const conexoesUsuarioNormalizadas = userConexoes
    .map(normalizarConexao)
    .sort((a, b) => {
      if (a.de !== b.de) return a.de.localeCompare(b.de);
      if (a.para !== b.para) return a.para.localeCompare(b.para);
      return a.caractere.localeCompare(b.caractere);
    });

  const conexoesCorretasNormalizadas = correctConexoes
    .map(normalizarConexao)
    .sort((a, b) => {
      if (a.de !== b.de) return a.de.localeCompare(b.de);
      if (a.para !== b.para) return a.para.localeCompare(b.para);
      return a.caractere.localeCompare(b.caractere);
    });

  const conexoesIguais = JSON.stringify(conexoesUsuarioNormalizadas) === 
                        JSON.stringify(conexoesCorretasNormalizadas);

  console.log("🔗 Comparação de conexões:", {
    usuario: conexoesUsuarioNormalizadas,
    correto: conexoesCorretasNormalizadas,
    iguais: conexoesIguais
  });

  // 🎯 RESULTADO FINAL
  const resultadoFinal = estadoInicialCorreto && estadosFinaisCorretos && conexoesIguais;

  console.log("🎊 Resultado da validação:", {
    estadoInicialCorreto,
    estadosFinaisCorretos,
    conexoesIguais,
    resultadoFinal
  });

  if (!resultadoFinal) {
    console.group("📋 Detalhes dos erros:");
    
    if (!estadoInicialCorreto) {
      console.error("❌ Estado inicial incorreto");
      console.log("Esperado:", correctInicialStr);
      console.log("Encontrado:", estadosIniciaisUsuario);
      console.log("Dica: Lembre-se que um estado pode ser inicial E final ao mesmo tempo");
    }

    if (!estadosFinaisCorretos) {
      console.error("❌ Estados finais incorretos");
      console.log("Esperado:", correctFinaisStr);
      console.log("Encontrado:", estadosFinaisUsuario);
      console.log("Dica: Verifique se todos os estados finais estão marcados, incluindo os que também são iniciais");
    }

    if (!conexoesIguais) {
      console.error("❌ Conexões incorretas");
      
      const conexoesFaltando = conexoesCorretasNormalizadas.filter(
        correct => !conexoesUsuarioNormalizadas.some(
          user => user.de === correct.de && user.para === correct.para && user.caractere === correct.caractere
        )
      );

      const conexoesExtras = conexoesUsuarioNormalizadas.filter(
        user => !conexoesCorretasNormalizadas.some(
          correct => correct.de === user.de && correct.para === user.para && correct.caractere === user.caractere
        )
      );

      console.table({ "Conexões Faltando": conexoesFaltando, "Conexões Extras": conexoesExtras });
    }
    
    console.groupEnd();
  }

  console.groupEnd();
  return resultadoFinal;
};

  // ===============================
  // 🔄 Atualização de estados do autômato
  // ===============================
  const handleAutomatonStateChange = (estados: Estado[], conexoes: Conexao[]) => {
    setUserAutomaton({ estados, conexoes });
    
    // Análise em tempo real para debugging
    const analise = getNodesWithStates(estados, conexoes);
    console.log("🔄 Atualização de estado - Estatísticas:", analise.estatisticas);
  };

  // ===============================
  // ✅ Validação completa ao enviar do AutomatonLesson
  // ===============================
  const handleAutomatonValidation = (
    isValid: boolean,
    message: string,
    details: ValidationDetails
  ) => {
    console.group("🧠 handleAutomatonValidation()");
    console.log("📋 Detalhes recebidos:", details);
    console.debug(isValid, message)
    // Reconstruir o autômato completo do usuário
    const userConnections: Conexao[] = details.conexoesValidas.map((conn) => ({
      id: `conexao-${conn.de}-${conn.para}`,
      de: conn.de,
      para: conn.para,
      ativa: true,
      direcao: `${conn.de}→${conn.para}`,
      tipo: "normal",
      caractere: conn.caractere,
    }));

    // Combinar todos os estados (iniciais, finais e normais)
    const todosEstados = [...details.estadosIniciais, ...details.estadosFinais];
    const estadosUnicos = todosEstados.filter((estado, index, self) => 
      index === self.findIndex(e => e.id === estado.id)
    );

    setUserAutomaton({
      estados: estadosUnicos,
      conexoes: userConnections,
    });

    // Usar a validação aprimorada
    const correct = validateAutomatonEnhanced(estadosUnicos, userConnections);
    setIsCorrect(correct);
    setIsSubmitted(true);

    console.log("🎯 Resultado da validação:", correct ? "CORRETO" : "INCORRETO");
    console.groupEnd();
  };

  // ===============================
  // 🚀 Submissão manual de autômato
  // ===============================
  const handleAutomatonSubmit = () => {
    if (!userAutomaton) {
      console.warn("⚠️ Nenhum autômato para validar");
      return;
    }

    console.group("🧩 handleAutomatonSubmit()");
    
    // Análise detalhada antes da validação
    const analise = getNodesWithStates(userAutomaton.estados, userAutomaton.conexoes);
    console.log("📊 Análise antes da validação:", analise.estatisticas);

    const correct = validateAutomatonEnhanced(userAutomaton.estados, userAutomaton.conexoes);
    setIsCorrect(correct);
    setIsSubmitted(true);

    console.log("🎯 Resultado:", correct ? "CORRETO" : "INCORRETO");
    console.groupEnd();
  };

  // ===============================
  // 🏁 Registro da lição concluída
    // ===============================
  const handleLessonComplete = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("handelando fim de lição");


      try {
        console.group("📤 handleLessonComplete()");
        console.log("🚀 Enviando dados de finalização da lição...");

        const payload = {
          user_id: user.id,
          correct_answers: answeredQuestions.filter((q) => q.isCorrect).length,
          total_questions: answeredQuestions.length,
          questions: answeredQuestions.map((q) => ({
            questionId: q.questionId,
            isCorrect: q.isCorrect,
            tags: q.tags || [],
            timeTaken: q.timeTaken,
          })),
        };

        // ✅ 1. Registrar conclusão da lição
        const response = await axios.post(
          "https://backend-lfaquest.onrender.com/api/lesson/complete",
          payload
        );

        const { diamonds_earned, xp_earned, new_xp, new_diamonds, new_streak } =
          response.data;

        const updatedUser = {
          ...user,
          xp: new_xp,
          diamonds: new_diamonds,
          streak: new_streak,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setLessonResult({
          diamonds: diamonds_earned,
          xp: xp_earned,
          streak: new_streak,
        });

        console.log("✅ Lição registrada com sucesso:", response.data);

        // 🔔 Notificar Path_player que a fase terminou
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("faseConcluida"));
          console.log("📢 Evento 'faseConcluida' disparado!");
          
        }


          // 🔓 NOVO: desbloquear próxima fase
          // 🔓 Desbloquear próxima fase diretamente (sem depender do Path_player)
          try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user?.id) {
              const resUser = await fetch(`https://backend-lfaquest.onrender.com/api/users/${user.id}`);
              const freshUserData = await resUser.json();
              const currentPhases = freshUserData.unlocked_phases
                ? JSON.parse(freshUserData.unlocked_phases)
                : ["1"];
              const nextPhase = currentPhases.length + 1;
            
              if (!currentPhases.includes(String(nextPhase)) && nextPhase <= 5) {
                const updatedPhases = [...currentPhases, String(nextPhase)];
                console.log(`🔓 Liberando nova fase diretamente no LessonTemplate: ${nextPhase}`, updatedPhases);
              
                const res = await fetch(
                  `https://backend-lfaquest.onrender.com/api/users/${user.id}/unlockedPhases`,
                  {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      unlocked_phases: updatedPhases, // ✅ envia array puro
                    }),
                  }
                );
                
              
                const data = await res.json();
                if (res.ok) {
                  console.log(`✅ Fase ${nextPhase} liberada com sucesso via LessonTemplate.`, data);
                
                  // Atualiza localStorage
                  const updatedUser = { ...user, unlocked_phases: updatedPhases };
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                } else {
                  console.error("❌ Erro ao atualizar progresso via LessonTemplate:", data);
                }
              } else {
                console.log("ℹ️ Nenhuma nova fase a liberar (já desbloqueada).");
              }
            }
          } catch (err) {
            console.error("❌ Falha ao liberar fase no LessonTemplate:", err);
          }
          

          // exibir sumário normalmente
          setShowSummary(true);

      } catch (err) {
        console.error("❌ Erro ao registrar lição:", err);
      } finally {
        console.groupEnd();
      }
    
  };

  const handleAnswerSelect = (index: number) => {
    if (!isSubmitted) setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
    const correct = selectedAnswer === lessonData.correctAnswer;
    setIsCorrect(correct);
  };

  const handleContinue = async () => {
    if (isContinueClicked) return;

    setIsContinueClicked(true);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    const currentQuestion: AnsweredQuestion = {
      questionId: lessonData.title.replace(/\s+/g, "_").toLowerCase(),
      isCorrect: !!isCorrect,
      selectedAnswer,
      correctAnswer: lessonData.correctAnswer,
      tags: lessonData.tags || [],
      timeTaken,
    };

    const updatedAnswers = [...answeredQuestions, currentQuestion];
    setAnsweredQuestions(updatedAnswers);

    if (questionIndex + 1 === totalQuestions) {
      console.log("🔥 Última questão detectada — chamando handleLessonComplete()");
      await handleLessonComplete();
    } else {
      console.log("➡️ Indo para a próxima questão (Path_player controlará o fluxo)");
      onComplete();
    }
  };


  if (showSummary) {
    const total = answeredQuestions.length || 1;
    const correct = answeredQuestions.filter(q => q.isCorrect).length;
    const wrong = total - correct;
    const totalTime = answeredQuestions.reduce((acc, q) => acc + q.timeTaken, 0);

    return (
      <div className="summary-container">
        <div className="summary-card">
          <h1>🎉 Lição Concluída!</h1>
          <h2>{lessonData.title}</h2>

          <p>
            Você respondeu <b>{total}</b> pergunta{total > 1 ? "s" : ""} em <b>{totalTime}</b> segundos.
          </p>
          <p>
            ✅ Acertos: <b>{correct}</b> &nbsp;&nbsp; ❌ Erros: <b>{wrong}</b>
          </p>

          {lessonResult && (
            <div className="reward-section">
              <p className="reward-text">💎 +{lessonResult.diamonds} diamantes</p>
              <p className="reward-text">⚡ +{lessonResult.xp} XP</p>
              <p className="reward-text fire-text">
                🔥 Ofensiva atual: <b>{lessonResult.streak}</b> dia{lessonResult.streak > 1 ? "s" : ""} seguidos!
              </p>
            </div>
          )}

          <button
            className="continue-button"
            onClick={() => {
              setShowSummary(false);
              onComplete();
            }}
          >
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      <div className="lesson-left">
        <div className="lesson-header">
          <button className="lesson-exit" onClick={onExit}>
            ✕
          </button>
          <h1 className="lesson-title">{lessonData.title}</h1>
        </div>

        <div className="lesson-content">
          <h2 className="content-heading">📘 Explicação / Teoria</h2>
          {lessonData.explanation ? (
            <div>
              <p>{lessonData.explanation}</p>
              {lessonData.image && (
                <div className="lesson-image-container">
                  <img src={lessonData.image} alt="Ilustração da questão" className="lesson-image" />
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>Nenhuma explicação disponível para esta pergunta.</p>
          )}
        </div>
      </div>

      <div className="lesson-right">
        {isAutomaton ? (
          <div className="automaton-container">
            <AutomatonLesson
              ref={automatonLessonRef}
              onStateChange={handleAutomatonStateChange}
              onValidation={handleAutomatonValidation}
            />

            {isSubmitted && (
              <div className={`feedback ${isCorrect ? "correct-feedback" : "incorrect-feedback"}`}>
                {isCorrect ? "🎉 Parabéns! Autômato correto!" : "💭 Autômato incorreto! Tente novamente."}
                
                {/* Feedback detalhado para ajudar o usuário */}
                {!isCorrect && userAutomaton && (
                  <div className="detailed-feedback">
                  </div>
                )}
              </div>
            )}

            <div className="action-buttons">
              {!isSubmitted ? (
                <button className="submit-button" onClick={handleAutomatonSubmit} disabled={selectedAnswer === null}>
                  Confirmar Resposta
                </button>
              ) : (
                <button 
                  className="continue-button" 
                  onClick={handleContinue}
                  disabled={isContinueClicked} // 🔒 NOVA PROP
                >
                  {isContinueClicked ? "Processando..." : "Continuar →"} {/* 🔄 TEXTO DINÂMICO */}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="question-container">
            <h2 className="question-title">{lessonData.question}</h2>

            <div className="alternatives-list">
              {lessonData.alternatives.map((alt, i) => (
                <button
                  key={i}
                  className={`alternative-button ${selectedAnswer === i ? "selected" : ""} ${
                    isSubmitted
                      ? i === lessonData.correctAnswer
                        ? "correct"
                        : selectedAnswer === i
                        ? "incorrect"
                        : ""
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(i)}
                  disabled={isSubmitted}
                >
                  <span className="alternative-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="alternative-text">{alt}</span>
                </button>
              ))}
            </div>

            {isSubmitted && (
              <div className={`feedback ${isCorrect ? "correct-feedback" : "incorrect-feedback"}`}>
                {isCorrect ? "🎉 Parabéns! Resposta correta!" : "💭 Resposta incorreta!"}
              </div>
            )}

            <div className="action-buttons">
              {!isSubmitted ? (
                <button className="submit-button" onClick={handleSubmit} disabled={selectedAnswer === null}>
                  Confirmar Resposta
                </button>
              ) : (
                <button 
                  className="continue-button" 
                  onClick={handleContinue}
                  disabled={isContinueClicked} // 🔒 NOVA PROP
                >
                  {isContinueClicked ? "Processando..." : "Continuar →"} {/* 🔄 TEXTO DINÂMICO */}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTemplate;