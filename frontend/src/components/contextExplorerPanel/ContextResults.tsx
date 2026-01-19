import { AnimatePresence, motion } from "framer-motion";

import type { ResultCard } from "./types";

type ContextResultsProps = {
  pinnedCards: ResultCard[];
  currentCard: ResultCard | null;
  keepCurrent: boolean;
  onToggleKeep: () => void;
  onUnpin: (id: string) => void;
};

export function ContextResults({
  pinnedCards,
  currentCard,
  keepCurrent,
  onToggleKeep,
  onUnpin,
}: ContextResultsProps) {
  return (
    <>
      <AnimatePresence initial={false}>
        {pinnedCards.map((card) => (
          <motion.div
            key={card.id}
            className="card card--result integration-result-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="integration-result-card__top">
              <p className="integration-panel__pill">
                {card.tool} • {card.label}
              </p>
              <button
                type="button"
                className="integration-unpin"
                onClick={() => onUnpin(card.id)}
              >
                Remove
              </button>
            </div>
            <p className="integration-panel__text">{card.content}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {currentCard && (
          <motion.div
            key={currentCard.id}
            className="card card--result integration-result-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="integration-result-card__top">
              <p className="integration-panel__pill">
                {currentCard.tool} • {currentCard.label}
              </p>
              <button
                type="button"
                className={`integration-keep-btn ${keepCurrent ? "integration-keep-btn--active" : ""}`}
                onClick={onToggleKeep}
              >
                {keepCurrent ? "Remove" : "Keep"}
              </button>
            </div>
            <p className="integration-panel__text">{currentCard.content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
