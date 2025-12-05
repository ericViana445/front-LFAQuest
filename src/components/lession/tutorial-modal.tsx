"use client"
import { FaXmark } from "react-icons/fa6"
import "./tutorial-modal.css"

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  steps: string[]
  actionButton?: string
  onAction?: () => void
}

export default function TutorialModal({
  isOpen,
  onClose,
  title = "Tutorial",
  steps,
  actionButton = "Avançar",
  onAction,
}: TutorialModalProps) {
  if (!isOpen) return null

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-header">
          <h2>{title}</h2>
          <button className="tutorial-close" onClick={onClose}>
            <FaXmark size={20} />
          </button>
        </div>

        <div className="tutorial-content">
          <ol className="tutorial-steps">
            {steps.map((step, index) => (
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
          <button className="tutorial-button" onClick={onAction || onClose}>
            {actionButton}
          </button>
        </div>
      </div>
    </div>
  )
}
