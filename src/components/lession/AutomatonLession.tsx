"use client"

import type React from "react"
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import "./AutomatonLesson.css"

// Interfaces para o componente AutomatonLesson
interface Posicao {
  x: number
  y: number
}

interface Offset {
  x: number
  y: number
}

export interface Estado {
  id: number
  posicao: Posicao
  posicaoAlvo: Posicao
  arrastando: boolean
  offset: Offset
  conectada: boolean
  selecionada: boolean
  nome: string
  isInicial: boolean
  isFinal: boolean
}

export interface Conexao {
  id: string
  de: number
  para: number
  ativa: boolean
  direcao: string
  tipo: "normal" | "autorreflexao"
  caractere: string
}

interface AutomatonLessonProps {
  onStateChange?: (estados: Estado[], conexoes: Conexao[]) => void
  onValidation?: (isValid: boolean, message: string, details: ValidationDetails) => void
}

interface ValidationDetails {
  estadosIniciais: Estado[]
  estadosFinais: Estado[]
  conexoesValidas: Conexao[]
  conexoesInvalidas: Conexao[]
  mensagens: string[]
}

const AutomatonLesson = forwardRef<{ handleValidar: () => any }, AutomatonLessonProps>(
  ({ onStateChange, onValidation }, ref) => {
    const VELOCIDADE_SUAVIZACAO = 0.3

    // Definindo os 8 estados possíveis
    const [estados, setEstados] = useState<Estado[]>([
      {
        id: 1,
        posicao: { x: 0, y: 0 },
        posicaoAlvo: { x: 0, y: 0 },
        arrastando: false,
        offset: { x: 0, y: 0 },
        conectada: false,
        selecionada: false,
        nome: "1",
        isInicial: false,
        isFinal: false,
      },
      {
        id: 2,
        posicao: { x: 0, y: 0 },
        posicaoAlvo: { x: 0, y: 0 },
        arrastando: false,
        offset: { x: 0, y: 0 },
        conectada: false,
        selecionada: false,
        nome: "2",
        isInicial: false,
        isFinal: false,
      },
      {
        id: 3,
        posicao: { x: 0, y: 0 },
        posicaoAlvo: { x: 0, y: 0 },
        arrastando: false,
        offset: { x: 0, y: 0 },
        conectada: false,
        selecionada: false,
        nome: "3",
        isInicial: false,
        isFinal: false,
      },
      {
        id: 4,
        posicao: { x: 0, y: 0 },
        posicaoAlvo: { x: 0, y: 0 },
        arrastando: false,
        offset: { x: 0, y: 0 },
        conectada: false,
        selecionada: false,
        nome: "1,2",
        isInicial: false,
        isFinal: false,
      },
      {
        id: 5,
        posicao: { x: 0, y: 0 },
        posicaoAlvo: { x: 0, y: 0 },
        arrastando: false,
        offset: { x: 0, y: 0 },
        conectada: false,
        selecionada: false,
        nome: "1,3",
        isInicial: false,
        isFinal: false,
      },
      {
        id: 6,
        posicao: { x: 0, y: 0 },
        posicaoAlvo: { x: 0, y: 0 },
        arrastando: false,
        offset: { x: 0, y: 0 },
        conectada: false,
        selecionada: false,
        nome: "2,3",
        isInicial: false,
        isFinal: false,
      },
      {
        id: 7,
        posicao: { x: 0, y: 0 },
        posicaoAlvo: { x: 0, y: 0 },
        arrastando: false,
        offset: { x: 0, y: 0 },
        conectada: false,
        selecionada: false,
        nome: "1,2,3",
        isInicial: false,
        isFinal: false,
      },
    ])

    const [conexoes, setConexoes] = useState<Conexao[]>([])
    const [modoConectar, setModoConectar] = useState<boolean>(false)
    const [estadoSelecionado, setEstadoSelecionado] = useState<number | null>(null)
    const [editandoConexao, setEditandoConexao] = useState<string | null>(null)
    const [novoCaractere, setNovoCaractere] = useState<string>("")
    const [conexaoSelecionada, setConexaoSelecionada] = useState<string | null>(null)
    const [resultadoValidacao, setResultadoValidacao] = useState<{
      isValid: boolean
      message: string
      details: ValidationDetails
    } | null>(null)

    const estadoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const animationFrameRef = useRef<number>(0)

    // Notificar mudanças de estado
    const prevRef = useRef<{ estados: Estado[]; conexoes: Conexao[] }>({
      estados: [],
      conexoes: [],
    })

    useEffect(() => {
      const mudou =
        JSON.stringify(prevRef.current.estados) !== JSON.stringify(estados) ||
        JSON.stringify(prevRef.current.conexoes) !== JSON.stringify(conexoes)

      if (mudou && onStateChange) {
        onStateChange(estados, conexoes)
        prevRef.current = { estados, conexoes }
      }
    }, [estados, conexoes, onStateChange])

    const atribuirRef = (id: number) => (el: HTMLDivElement | null) => {
      estadoRefs.current[id] = el
    }

    useEffect(() => {
      posicionarEstados()

      const animar = () => {
        atualizarSuavizacao()
        animationFrameRef.current = requestAnimationFrame(animar)
      }

      animationFrameRef.current = requestAnimationFrame(animar)

      return () => {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }, [])

    // Adicionar listener para tecla Delete
    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Delete") {
          if (conexaoSelecionada) {
            removerConexao(conexaoSelecionada)
            setConexaoSelecionada(null)
          }
        }
      }

      document.addEventListener("keydown", handleKeyPress)
      return () => {
        document.removeEventListener("keydown", handleKeyPress)
      }
    }, [conexaoSelecionada])

    const atualizarSuavizacao = () => {
      setEstados((prev) =>
        prev.map((estado) => {
          if (!estado.arrastando) {
            const dx = estado.posicaoAlvo.x - estado.posicao.x
            const dy = estado.posicaoAlvo.y - estado.posicao.y

            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
              return { ...estado, posicao: { ...estado.posicaoAlvo } }
            }

            const novaX = estado.posicao.x + dx * VELOCIDADE_SUAVIZACAO
            const novaY = estado.posicao.y + dy * VELOCIDADE_SUAVIZACAO

            return { ...estado, posicao: { x: novaX, y: novaY } }
          }
          return estado
        }),
      )
      console.debug(resultadoValidacao)
    }

    const posicionarEstados = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const estadoWidth = 85
        const estadoHeight = 85

        const colunas = 3
        const linhas = Math.ceil(estados.length / colunas)
        const espacamentoX = containerRect.width / (colunas + 1)
        const espacamentoY = containerRect.height / (linhas + 1)

        setEstados((prev) =>
          prev.map((estado, index) => {
            const coluna = index % colunas
            const linha = Math.floor(index / colunas)

            const x = espacamentoX * (coluna + 1) - estadoWidth / 2
            const y = espacamentoY * (linha + 1) - estadoHeight / 2

            return {
              ...estado,
              posicao: { x, y },
              posicaoAlvo: { x, y },
            }
          }),
        )
      }
    }

    const iniciarArraste = (e: React.MouseEvent | React.TouchEvent, id: number) => {
      if (modoConectar) {
        e.preventDefault()
        return
      }

      setEstados((prev) => prev.map((estado) => (estado.id === id ? { ...estado, arrastando: true } : estado)))

      const tipoEvento = e.type.includes("touch") ? "touch" : "mouse"
      const clientX =
        tipoEvento === "touch" ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX

      const clientY =
        tipoEvento === "touch" ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY

      const estadoRef = estadoRefs.current[id]
      if (estadoRef) {
        const estadoRect = estadoRef.getBoundingClientRect()
        const offsetX = clientX - estadoRect.left
        const offsetY = clientY - estadoRect.top

        setEstados((prev) =>
          prev.map((estado) => (estado.id === id ? { ...estado, offset: { x: offsetX, y: offsetY } } : estado)),
        )
      }

      e.preventDefault()
    }

    const arrastar = (e: MouseEvent | TouchEvent) => {
      const estadoArrastando = estados.find((estado) => estado.arrastando)
      if (!estadoArrastando) return

      const tipoEvento = e.type.includes("touch") ? "touch" : "mouse"
      const clientX = tipoEvento === "touch" ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX

      const clientY = tipoEvento === "touch" ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY

      if (containerRef.current && estadoRefs.current[estadoArrastando.id]) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const estadoRect = estadoRefs.current[estadoArrastando.id]!.getBoundingClientRect()

        let novaX = clientX - estadoArrastando.offset.x - containerRect.left
        let novaY = clientY - estadoArrastando.offset.y - containerRect.top

        const maxX = containerRect.width - estadoRect.width
        const maxY = containerRect.height - estadoRect.height

        novaX = Math.max(0, Math.min(novaX, maxX))
        novaY = Math.max(0, Math.min(novaY, maxY))

        setEstados((prev) =>
          prev.map((estado) =>
            estado.id === estadoArrastando.id
              ? {
                  ...estado,
                  posicao: { x: novaX, y: novaY },
                  posicaoAlvo: { x: novaX, y: novaY },
                }
              : estado,
          ),
        )
      }
    }

    const pararArraste = () => {
      setEstados((prev) => prev.map((estado) => ({ ...estado, arrastando: false })))
    }

    useEffect(() => {
      const algumEstadoArrastando = estados.some((estado) => estado.arrastando)

      if (algumEstadoArrastando) {
        document.addEventListener("mousemove", arrastar)
        document.addEventListener("mouseup", pararArraste)
        document.addEventListener("touchmove", arrastar)
        document.addEventListener("touchend", pararArraste)
      } else {
        document.removeEventListener("mousemove", arrastar)
        document.removeEventListener("mouseup", pararArraste)
        document.removeEventListener("touchmove", arrastar)
        document.removeEventListener("touchend", pararArraste)
      }

      return () => {
        document.removeEventListener("mousemove", arrastar)
        document.removeEventListener("mouseup", pararArraste)
        document.removeEventListener("touchmove", arrastar)
        document.removeEventListener("touchend", pararArraste)
      }
    }, [estados])


    // Mecânica de Conexões
    const ativarModoConectar = () => {
      setModoConectar(true)
      setEstadoSelecionado(null)
      setEstados((prev) => prev.map((estado) => ({ ...estado, selecionada: false })))
    }

    const desativarModoConectar = () => {
      setModoConectar(false)
      setEstadoSelecionado(null)
      setEstados((prev) => prev.map((estado) => ({ ...estado, selecionada: false })))
    }

    const clicarEstado = (id: number) => {
      // Duplo clique para definir estado inicial/final
      const handleDuploClique = () => {
        setEstados((prev) => {
          const clicado = prev.find((e) => e.id === id)
          if (!clicado) return prev

          // 🔁 Alternância entre estados: normal → inicial → final → inicial+fim → normal
          if (clicado.isInicial && !clicado.isFinal) {
            // Se já é inicial, torna inicial+fim
            return prev.map((e) => (e.id === id ? { ...e, isFinal: true } : e))
          } else if (clicado.isInicial && clicado.isFinal) {
            // Se já é inicial+fim, remove ambos
            return prev.map((e) => (e.id === id ? { ...e, isInicial: false, isFinal: false } : e))
          } else if (!clicado.isInicial && clicado.isFinal) {
            // Se já é final, torna inicial+fim
            return prev.map(
              (e) => (e.id === id ? { ...e, isInicial: true } : { ...e, isInicial: false }), // Remove inicial de outros estados
            )
          } else {
            // Se é normal, torna inicial e remove inicial de todos os outros
            return prev.map((e) =>
              e.id === id ? { ...e, isInicial: true, isFinal: false } : { ...e, isInicial: false },
            )
          }
        })
      }

      // Clique simples para modo conectar
      if (modoConectar) {
        if (estadoSelecionado === null) {
          setEstadoSelecionado(id)
          setEstados((prev) =>
            prev.map((estado) =>
              estado.id === id ? { ...estado, selecionada: true } : { ...estado, selecionada: false },
            ),
          )
        } else if (estadoSelecionado === id) {
          // Autorreflexão
          const conexaoId = `autorreflexao-${id}`

          const conexaoExistente = conexoes.find((conexao) => conexao.id === conexaoId)

          if (!conexaoExistente) {
            const novaConexao: Conexao = {
              id: conexaoId,
              de: id,
              para: id,
              ativa: true,
              direcao: `${id}→${id}`,
              tipo: "autorreflexao",
              caractere: "A",
            }

            setConexoes((prev) => [...prev, novaConexao])
            desativarModoConectar()
          }

          setEstadoSelecionado(null)
          setModoConectar(false)
        } else {
          // Conexão normal
          const conexaoId = `conexao-${estadoSelecionado}-${id}`

          const conexaoExistente = conexoes.find((conexao) => conexao.id === conexaoId)

          if (!conexaoExistente) {
            const novaConexao: Conexao = {
              id: conexaoId,
              de: estadoSelecionado,
              para: id,
              ativa: true,
              direcao: `${estadoSelecionado}→${id}`,
              tipo: "normal",
              caractere: "a",
            }

            setConexoes((prev) => [...prev, novaConexao])
          }

          setEstadoSelecionado(null)
          setModoConectar(false)
          desativarModoConectar()
        }
      } else {
        // Clique simples normal - não faz nada especial
        handleDuploClique()
      }
    }

    // Funções auxiliares para cálculos de conexões
    const calcularPontosSetaNormal = (deId: number, paraId: number, offset = 0) => {
      const estadoDe = estados.find((estado) => estado.id === deId)
      const estadoPara = estados.find((estado) => estado.id === paraId)

      if (!estadoDe || !estadoPara || !estadoRefs.current[deId] || !estadoRefs.current[paraId]) {
        return null
      }

      const estadoDeRect = estadoRefs.current[deId].getBoundingClientRect()
      const estadoParaRect = estadoRefs.current[paraId].getBoundingClientRect()

      const centroEstadoDe = {
        x: estadoDe.posicao.x + estadoDeRect.width / 2,
        y: estadoDe.posicao.y + estadoDeRect.height / 2,
      }

      const centroEstadoPara = {
        x: estadoPara.posicao.x + estadoParaRect.width / 2,
        y: estadoPara.posicao.y + estadoParaRect.height / 2,
      }

      const dx = centroEstadoPara.x - centroEstadoDe.x
      const dy = centroEstadoPara.y - centroEstadoDe.y
      const distancia = Math.sqrt(dx * dx + dy * dy)

      if (distancia === 0) return null

      const direcaoX = dx / distancia
      const direcaoY = dy / distancia

      const perpendicularX = -direcaoY
      const perpendicularY = direcaoX

      const raioEstado = estadoDeRect.width / 2

      // Aumentar o espaçamento para conexões bidirecionais
      const espacamento = Math.abs(offset) > 0 ? 25 : 0

      const inicio = {
        x: centroEstadoDe.x + direcaoX * raioEstado + perpendicularX * espacamento * Math.sign(offset),
        y: centroEstadoDe.y + direcaoY * raioEstado + perpendicularY * espacamento * Math.sign(offset),
      }

      const fim = {
        x: centroEstadoPara.x - direcaoX * raioEstado + perpendicularX * espacamento * Math.sign(offset),
        y: centroEstadoPara.y - direcaoY * raioEstado + perpendicularY * espacamento * Math.sign(offset),
      }

      const meio = {
        x: (inicio.x + fim.x) / 2,
        y: (inicio.y + fim.y) / 2,
      }

      const tamanhoSeta = 12
      const anguloSeta = Math.PI / 6

      const ponta1 = {
        x: fim.x - direcaoX * tamanhoSeta + direcaoY * tamanhoSeta * Math.tan(anguloSeta),
        y: fim.y - direcaoY * tamanhoSeta - direcaoX * tamanhoSeta * Math.tan(anguloSeta),
      }

      const ponta2 = {
        x: fim.x - direcaoX * tamanhoSeta - direcaoY * tamanhoSeta * Math.tan(anguloSeta),
        y: fim.y - direcaoY * tamanhoSeta + direcaoX * tamanhoSeta * Math.tan(anguloSeta),
      }

      return { inicio, fim, ponta1, ponta2, direcaoX, direcaoY, meio }
    }

    // Nova função para detectar conexões bidirecionais e calcular offsets
    const getOffsetForConnection = (conexao: any, index: number) => {
      const conexoesEntre = conexoes.filter(
        (c) => (c.de === conexao.de && c.para === conexao.para) || (c.de === conexao.para && c.para === conexao.de),
      )

      console.debug(index)

      const count = conexoesEntre.length
      const i = conexoesEntre.findIndex((c) => c.id === conexao.id)

      // offset simétrico (distribui uniformemente)
      const baseOffset = i * 2 - count + 1

      // 🔁 Se for conexão reversa (ex: A→B vs B→A), inverte o sinal
      const isReverse = conexao.de > conexao.para // pode ajustar conforme seu id cresce
      const offset = isReverse ? -baseOffset : baseOffset

      return offset
    }

    const calcularPontosAutorreflexao = (estadoId: number) => {
      const estado = estados.find((e) => e.id === estadoId)
      if (!estado || !estadoRefs.current[estadoId]) return null

      const estadoRect = estadoRefs.current[estadoId].getBoundingClientRect()
      const centro = {
        x: estado.posicao.x + estadoRect.width / 2,
        y: estado.posicao.y + estadoRect.height / 2,
      }

      const raio = estadoRect.width / 2
      const raioLoop = raio * 2.2

      const anguloInicio = Math.PI / 4
      const anguloFim = 2 * Math.PI - Math.PI / 4

      const pontoControle1 = {
        x: centro.x + raioLoop * Math.cos(anguloInicio) + 20,
        y: centro.y - raioLoop * Math.sin(anguloInicio) + 25,
      }

      const pontoControle2 = {
        x: centro.x + raioLoop * Math.cos(anguloFim) + 15,
        y: centro.y - raioLoop * Math.sin(anguloFim) + 10,
      }

      const pontoFim = {
        x: centro.x + raio * Math.cos(anguloFim),
        y: centro.y - raio * Math.sin(anguloFim),
      }

      const pontoCaractere = {
        x: centro.x + raioLoop * 0.7,
        y: centro.y - raioLoop * 0.7,
      }

      const tamanhoSeta = 10
      const ponta1 = {
        x: pontoFim.x - Math.cos(anguloFim) * tamanhoSeta + Math.sin(anguloFim) * tamanhoSeta,
        y: pontoFim.y - Math.sin(anguloFim) * tamanhoSeta - Math.cos(anguloFim) * tamanhoSeta,
      }

      const ponta2 = {
        x: pontoFim.x - Math.cos(anguloFim) * tamanhoSeta - Math.sin(anguloFim) * tamanhoSeta,
        y: pontoFim.y - Math.sin(anguloFim) * tamanhoSeta + Math.cos(anguloFim) * tamanhoSeta,
      }

      return {
        centro,
        pontoControle1,
        pontoControle2,
        pontoFim,
        ponta1,
        ponta2,
        pontoCaractere,
        raioLoop,
      }
    }

    const handleDuploCliqueConexao = (conexaoId: string, caractereAtual: string) => {
      setEditandoConexao(conexaoId)
      setNovoCaractere(caractereAtual)
    }

    const handleCliqueConexao = (conexaoId: string) => {
      setConexaoSelecionada(conexaoId)
    }

    const confirmarEdicaoConexao = () => {
      if (editandoConexao && novoCaractere.trim() !== "") {
        setConexoes((prev) =>
          prev.map((conexao) =>
            conexao.id === editandoConexao ? { ...conexao, caractere: novoCaractere.trim() } : conexao,
          ),
        )
        setEditandoConexao(null)
        setNovoCaractere("")
      }
    }

    const cancelarEdicaoConexao = () => {
    setEditandoConexao(null)
    setNovoCaractere("")
    }
    
    const removerConexao = (conexaoId: string) => {
      const conexao = conexoes.find((c) => c.id === conexaoId)
      if (conexao) {
        setConexoes((prev) => prev.filter((c) => c.id !== conexaoId))
      }
    }

  const handleValidar = () => {
    const estadosIniciais = estados.filter((e) => e.isInicial)
    const estadosFinais = estados.filter((e) => e.isFinal)
    const conexoesValidas = conexoes.filter((c) => c.caractere.trim() !== "")
    const conexoesInvalidas = conexoes.filter((c) => c.caractere.trim() === "")

    const mensagens: string[] = []
    let isValid = true

    // --- Gabarito de exemplo ---
    const gabaritoInicial = ["1"]
    const gabaritoFinais = ["2", "3"]

    // --- Verificações básicas ---
    if (estadosIniciais.length === 0) {
      mensagens.push("Nenhum estado inicial definido")
      isValid = false
    }

    if (estadosFinais.length === 0) {
      mensagens.push("Nenhum estado final definido")
      isValid = false
    }

    if (conexoes.length === 0) {
      mensagens.push("Nenhuma transição criada")
      isValid = false
    }

    if (conexoesInvalidas.length > 0) {
      mensagens.push(`${conexoesInvalidas.length} transição(ões) sem caractere definido`)
      isValid = false
    }

    // --- 🔎 Validação específica contra o gabarito ---
    const nomesIniciais = estadosIniciais.map((e) => e.nome)
    const nomesFinais = estadosFinais.map((e) => e.nome)

    const iniciaisCorretos = 
      gabaritoInicial.length === nomesIniciais.length &&
      gabaritoInicial.every((g) => nomesIniciais.includes(g))

    const finaisCorretos = 
      gabaritoFinais.length === nomesFinais.length &&
      gabaritoFinais.every((g) => nomesFinais.includes(g))

    if (!iniciaisCorretos) {
      mensagens.push(`Estado(s) inicial(is) incorreto(s). Esperado: ${gabaritoInicial.join(", ")}`)
      isValid = false
    }

    if (!finaisCorretos) {
      mensagens.push(`Estado(s) final(is) incorreto(s). Esperado: ${gabaritoFinais.join(", ")}`)
      isValid = false
    }

    // --- Resultado final ---
    const details: ValidationDetails = {
      estadosIniciais,
      estadosFinais,
      conexoesValidas,
      conexoesInvalidas,
      mensagens,
    }

    const message = isValid ? "✅ Autômato válido!" : mensagens.join(", ")

    const resultado = { isValid, message, details }
    setResultadoValidacao(resultado)

    if (onValidation) {
      onValidation(isValid, message, details)
    }

    return resultado
  }



  



    useImperativeHandle(ref, () => ({
      handleValidar,
    }))

    return (
      <div className="automaton-container" ref={containerRef}>
        {/* Botões de controle */}
        <div className="automaton-simple-controls">
          {!modoConectar ? (
            <>
              <button className="btn-conectar" onClick={ativarModoConectar}>
                🔗 Criar Conexões
              </button>
              <button className="btn-validar" onClick={handleValidar}>
                ✓ Validar Autômato
              </button>
            </>
          ) : (
            <button className="btn-cancelar" onClick={desativarModoConectar}>
              ❌ Cancelar
            </button>
          )}
        </div>

        <svg
          ref={svgRef}
          className="seta-conexao"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <marker id="arrowhead-autorreflexao" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#9C27B0" />
            </marker>
          </defs>

          {conexoes.map((conexao) => {
            if (conexao.tipo === "autorreflexao") {
              const pontos = calcularPontosAutorreflexao(conexao.de)
              if (!pontos) return null

              return (
                <g
                  key={conexao.id}
                  className={`seta-autorreflexao ${conexaoSelecionada === conexao.id ? "selecionada" : ""}`}
                  onClick={() => handleCliqueConexao(conexao.id)}
                  onDoubleClick={() => handleDuploCliqueConexao(conexao.id, conexao.caractere)}
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d={`M ${pontos.centro.x + pontos.raioLoop * 0.3}, ${pontos.centro.y} C ${pontos.pontoControle1.x}, ${pontos.pontoControle1.y} ${pontos.pontoControle2.x}, ${pontos.pontoControle2.y} ${pontos.pontoFim.x}, ${pontos.pontoFim.y}`}
                    stroke="#9C27B0"
                    strokeWidth={conexaoSelecionada === conexao.id ? "4" : "3"}
                    fill="none"
                    markerEnd="url(#arrowhead-autorreflexao)"
                  />
                  <text
                    x={pontos.pontoCaractere.x + 4}
                    y={pontos.pontoCaractere.y + 85}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="caractere-conexao"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#9C27B0"
                    style={{ cursor: "pointer" }}
                  >
                    {conexao.caractere}
                  </text>
                </g>
              )
            } else {
              const offset = getOffsetForConnection(conexao, conexao.de) // 🟩 AQUI pegamos o offset calculado
              const pontos = calcularPontosSetaNormal(conexao.de, conexao.para, offset) // 🟩 e aplicamos aqui
              if (!pontos) return null

              return (
                <g
                  key={conexao.id}
                  className={`seta-conectavel ${conexaoSelecionada === conexao.id ? "selecionada" : ""}`}
                  onClick={() => handleCliqueConexao(conexao.id)}
                  onDoubleClick={() => handleDuploCliqueConexao(conexao.id, conexao.caractere)}
                  style={{ cursor: "pointer" }}
                >
                  <line
                    x1={pontos.inicio.x}
                    y1={pontos.inicio.y}
                    x2={pontos.fim.x}
                    y2={pontos.fim.y}
                    stroke="#4CAF50"
                    strokeWidth={conexaoSelecionada === conexao.id ? "4" : "3"}
                    markerEnd="url(#arrowhead)"
                  />
                  <polygon
                    points={`${pontos.fim.x},${pontos.fim.y} ${pontos.ponta1.x},${pontos.ponta1.y} ${pontos.ponta2.x},${pontos.ponta2.y}`}
                    fill="#4CAF50"
                  />
                  <text
                    x={pontos.meio.x}
                    y={pontos.meio.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="caractere-conexao"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#4CAF50"
                    style={{ cursor: "pointer" }}
                  >
                    {conexao.caractere}
                  </text>
                </g>
              )
            }
          })}
        </svg>

        {estados.map((estado) => (
          <div
            key={estado.id}
            ref={atribuirRef(estado.id)}
            className={`estado ${estado.arrastando ? "arrastando" : ""} ${estado.conectada ? "conectada" : ""} ${estado.selecionada ? "selecionada" : ""} ${estado.isInicial ? "inicial" : ""} ${estado.isFinal ? "final" : ""}`}
            style={{
              transform: `translate(${estado.posicao.x}px, ${estado.posicao.y}px)`,
            }}
            onMouseDown={(e) => iniciarArraste(e, estado.id)}
            onTouchStart={(e) => iniciarArraste(e, estado.id)}
            onClick={() => clicarEstado(estado.id)}
          >
            <span className="estado-nome">{estado.nome}</span>
            {estado.isInicial && <div className="marcador-inicial">→</div>}
            {estado.isFinal && <div className="marcador-final">⦻</div>}
          </div>
        ))}

        {/* Modal de edição de caractere */}
        {editandoConexao && (
          <>
            <div className="edicao-caractere-modal">
              <h4>Editar Caractere da Transição</h4>
              <div className="edicao-caractere">
                <input
                  type="text"
                  value={novoCaractere}
                  onChange={(e) => setNovoCaractere(e.target.value)}
                  className="input-caractere"
                  autoFocus
                  placeholder="a"
                />
                <div className="botoes-edicao">
                  <button onClick={confirmarEdicaoConexao} className="btn-confirmar">
                    Confirmar
                  </button>
                  <button onClick={cancelarEdicaoConexao} className="btn-cancelar-edicao">
                    Cancelar
                  </button>
                </div>
              </div>
              <p className="dica-modal">Pressione Delete para remover a conexão selecionada</p>
            </div>
          </>
        )}
      </div>
    )
  },
)
export default AutomatonLesson

// Função auxiliar reutilizável fora do componente
export function extractAutomatonDetails(estados: Estado[], conexoes: Conexao[]) {
  const estadosIniciais = estados.filter((e) => e.isInicial);
  const estadosFinais = estados.filter((e) => e.isFinal);

  console.group("🔎 Análise de estrutura do autômato");
  console.log("🚀 Estados iniciais:", estadosIniciais.map((e) => e.nome || e.id));
  console.log("🏁 Estados finais:", estadosFinais.map((e) => e.nome || e.id));
  console.log("🔗 Total de conexões:", conexoes.length);
  console.groupEnd();

  return {
    estadosIniciais,
    estadosFinais,
    conexoes,
  };
}

// Função para obter todos os nós com seus estados e nós com estados especiais
export function getNodesWithStates(estados: Estado[], conexoes: Conexao[]) {
  // Todos os nós com seus estados completos
  const todosOsNos = estados.map(estado => ({
    id: estado.id,
    nome: estado.nome,
    posicao: estado.posicao,
    isInicial: estado.isInicial,
    isFinal: estado.isFinal,
    selecionada: estado.selecionada,
    arrastando: estado.arrastando,
    conectada: estado.conectada,
    // Conexões que partem deste nó
    conexoesSaida: conexoes.filter(conexao => conexao.de === estado.id),
    // Conexões que chegam a este nó
    conexoesEntrada: conexoes.filter(conexao => conexao.para === estado.id)
  }));

  // Nós com estados especiais (inicial ou final)
  const nosComEstadosEspeciais = todosOsNos.filter(no => 
    no.isInicial || no.isFinal
  );

  // Nós iniciais
  const nosIniciais = todosOsNos.filter(no => no.isInicial);

  // Nós finais
  const nosFinais = todosOsNos.filter(no => no.isFinal);

  // Nós que são tanto inicial quanto final
  const nosInicialEFinal = todosOsNos.filter(no => no.isInicial && no.isFinal);

  // Nós com múltiplas conexões (mais de 2 conexões de saída)
  const nosComMultiplasConexoes = todosOsNos.filter(no => 
    no.conexoesSaida.length > 2
  );

  // Nós isolados (sem conexões)
  const nosIsolados = todosOsNos.filter(no => 
    no.conexoesSaida.length === 0 && no.conexoesEntrada.length === 0
  );

  return {
    // Retorna todos os nós
    todosOsNos,
    
    // Retorna apenas nós com estados especiais
    nosComEstadosEspeciais,
    
    // Retorna categorias específicas
    nosIniciais,
    nosFinais,
    nosInicialEFinal,
    nosComMultiplasConexoes,
    nosIsolados,
    
    // Estatísticas
    estatisticas: {
      totalNos: todosOsNos.length,
      totalIniciais: nosIniciais.length,
      totalFinais: nosFinais.length,
      totalInicialEFinal: nosInicialEFinal.length,
      totalMultiplasConexoes: nosComMultiplasConexoes.length,
      totalIsolados: nosIsolados.length,
      totalConexoes: conexoes.length
    }
  };
}

// Função específica para obter apenas nós com estados especiais
export function getNosEspeciais(estados: Estado[]) {
  return estados.filter(estado => estado.isInicial || estado.isFinal)
    .map(estado => ({
      id: estado.id,
      nome: estado.nome,
      tipo: estado.isInicial && estado.isFinal ? 'inicial-final' : 
            estado.isInicial ? 'inicial' : 'final',
      posicao: estado.posicao
    }));
}

// Função para validar estrutura do autômato
export function validarEstruturaAutomato(estados: Estado[], conexoes: Conexao[]) {
  const nos = getNodesWithStates(estados, conexoes);
  
  const problemas = [];
  
  // Verificar se há exatamente um estado inicial
  if (nos.nosIniciais.length === 0) {
    problemas.push("❌ Nenhum estado inicial definido");
  } else if (nos.nosIniciais.length > 1) {
    problemas.push(`⚠️ Múltiplos estados iniciais: ${nos.nosIniciais.map(n => n.nome).join(', ')}`);
  }
  
  // Verificar se há pelo menos um estado final
  if (nos.nosFinais.length === 0) {
    problemas.push("❌ Nenhum estado final definido");
  }
  
  // Verificar nós isolados
  if (nos.nosIsolados.length > 0) {
    problemas.push(`⚠️ Nós isolados: ${nos.nosIsolados.map(n => n.nome).join(', ')}`);
  }
  
  // Verificar conexões sem caractere
  const conexoesSemCaractere = conexoes.filter(c => !c.caractere || c.caractere.trim() === '');
  if (conexoesSemCaractere.length > 0) {
    problemas.push(`⚠️ ${conexoesSemCaractere.length} conexão(ões) sem caractere definido`);
  }
  
  return {
    valido: problemas.length === 0,
    problemas,
    estatisticas: nos.estatisticas,
    nosEspeciais: nos.nosComEstadosEspeciais
  };
}

// Funções auxiliares para análise específica
export function getNosPorTipo(estados: Estado[]) {
  return {
    iniciais: estados.filter(e => e.isInicial && !e.isFinal),
    finais: estados.filter(e => e.isFinal && !e.isInicial),
    inicialEFinal: estados.filter(e => e.isInicial && e.isFinal),
    normais: estados.filter(e => !e.isInicial && !e.isFinal)
  };
}

// Função para encontrar nós críticos (com muitas conexões)
export function getNosCriticos(estados: Estado[], conexoes: Conexao[]) {
  return estados.map(estado => {
    const conexoesSaida = conexoes.filter(c => c.de === estado.id);
    const conexoesEntrada = conexoes.filter(c => c.para === estado.id);
    
    return {
      ...estado,
      totalConexoes: conexoesSaida.length + conexoesEntrada.length,
      conexoesSaida: conexoesSaida.length,
      conexoesEntrada: conexoesEntrada.length,
      // Consideramos "crítico" se tiver mais de 3 conexões totais
      isCritico: (conexoesSaida.length + conexoesEntrada.length) > 3
    };
  }).filter(no => no.isCritico);
}

// Função para exportar dados do autômato
export function exportarAutomatonData(estados: Estado[], conexoes: Conexao[]) {
  const nosEspeciais = getNosEspeciais(estados);
  const nosCriticos = getNosCriticos(estados, conexoes);
  const validacao = validarEstruturaAutomato(estados, conexoes);
  
  return {
    timestamp: new Date().toISOString(),
    estados: {
      total: estados.length,
      especiais: nosEspeciais,
      criticos: nosCriticos
    },
    conexoes: {
      total: conexoes.length,
      normais: conexoes.filter(c => c.tipo === 'normal'),
      autorreflexoes: conexoes.filter(c => c.tipo === 'autorreflexao')
    },
    validacao: {
      valido: validacao.valido,
      problemas: validacao.problemas,
      estatisticas: validacao.estatisticas
    }
  };
}