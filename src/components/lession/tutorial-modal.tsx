"use client"
import { FaXmark } from "react-icons/fa6"
import "./tutorial-modal.css"
import { useState } from "react"

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  steps?: string[]
  actionButton?: string
  onAction?: () => void
  multiStep?: boolean
}

const tutorialSteps = [
  {
    title: "Modo de Conexão",
    steps: [
      "Clique no botão 'Criar Conexão' para ativar o modo de conexão",
      "Este modo permite que você crie conexões entre os nós do seu autômato",
    ],
  },
  {
    title: "Criando uma Conexão",
    steps: [
      "Clique no primeiro nó (estado) que você deseja conectar",
      "Clique no segundo nó (estado) para completar a conexão",
      "Uma conexão será criada entre os dois nós selecionados",
    ],
  },
  {
    title: "Auto-reflexão",
    steps: [
      "Você pode criar uma auto-reflexão (loop) em um nó",
      "Simplesmente selecione o MESMO nó duas vezes ao criar uma conexão",
      "Isso criará uma conexão que volta para o mesmo estado",
    ],
  },
  {
    title: "Movendo Nós",
    steps: [
      "A qualquer momento você pode arrastar os nós para qualquer lugar",
      "Mantenha o clique pressionado e arraste o nó para reposicioná-lo",
      "Os nós podem ser movidos livremente dentro do espaço reservado",
    ],
  },
  {
    title: "Selecionando Conexões",
    steps: [
      "Clique em uma conexão já criada para selecioná-la",
      "A conexão será destacada quando estiver selecionada",
      "Você pode então editar ou deletar a conexão",
    ],
  },
  {
    title: "Deletando Conexões",
    steps: [
      "Com uma conexão selecionada, pressione a tecla 'Delete' do teclado",
      "A conexão será removida do seu autômato",
      "Você pode criar outras conexões normalmente após deletar",
    ],
  },
  {
    title: "Editando Caracteres da Conexão",
    steps: [
      "Clique DUAS VEZES em uma conexão já criada",
      "Uma janela de edição aparecerá permitindo mudar o caractere",
      "Confirme as alterações para atualizar a conexão",
    ],
  },
  {
    title: "Pronto para Começar!",
    steps: [
      "Agora você sabe como criar e editar conexões",
      "Siga estes passos para construir seu autômato corretamente",
      "Clique em 'Começar' para iniciar a lição",
    ],
  },
]

export default function TutorialModal({
  isOpen,
  onClose,
  title,
  steps,
  actionButton = "Avançar",
  onAction,
  multiStep = true,
}: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const isMultiStepMode = multiStep && !steps
  const currentData = isMultiStepMode ? tutorialSteps[currentStep] : null

  if (!isOpen) return null

  const handleNext = () => {
    if (isMultiStepMode) {
      if (currentStep < tutorialSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onClose()
      }
    } else {
      onAction?.() || onClose()
    }
  }

  const handlePrevious = () => {
    if (isMultiStepMode && currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const displayTitle = isMultiStepMode ? currentData?.title : title
const displaySteps: string[] = isMultiStepMode 
  ? currentData?.steps ?? [] 
  : steps ?? []
    const isLastStep = isMultiStepMode && currentStep === tutorialSteps.length - 1
  const buttonText = isLastStep ? "Começar" : actionButton

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-header">
          <h2>{displayTitle}</h2>
          <button className="tutorial-close" onClick={onClose}>
            <FaXmark size={20} />
          </button>
        </div>

        <div className="tutorial-content">
          <ol className="tutorial-steps">
            {displaySteps.map((step, index) => (
              <li key={index} className="tutorial-step">
                <div className="step-icon">
                  <span>{index + 1}</span>
                </div>
                <p className="step-text">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="tutorial-footer">
          {isMultiStepMode && (
            <div className="tutorial-progress">
              <span className="progress-text">
                {currentStep + 1} de {tutorialSteps.length}
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
          <div className="tutorial-actions">
            {isMultiStepMode && currentStep > 0 && (
              <button className="tutorial-button tutorial-button-secondary" onClick={handlePrevious}>
                Voltar
              </button>
            )}
            <button className="tutorial-button" onClick={handleNext}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
