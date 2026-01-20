// Coordinates context explorer controls/results with shared panel animations.
import { AnimatePresence, motion } from "framer-motion";

import { usePanelsChoreography } from "../../hooks/usePanelsChoreography";
import { stageVariants, uploadSolid, resultZoom, timeline } from "../../motion/presets";
import { ContextControls } from "./ContextControls";
import { ContextResults } from "./ContextResults";
import { useContextExplorerState } from "./useContextExplorerState";
import type { ResultCard } from "./types";
import type { MatchResponse } from "../../api/types";

type ContextExplorerPanelProps = {
  resetSignal?: number;
  canUseContext?: boolean;
  onPinnedChange?: (cards: ResultCard[]) => void;
  matchResult?: MatchResponse | null;
};

export function ContextExplorerPanel({
  resetSignal = 0,
  canUseContext = true,
  onPinnedChange,
  matchResult,
}: ContextExplorerPanelProps) {
  // Local state/actions for tool selection and cards.
  const {
    tool,
    option,
    optionsForTool,
    currentCard,
    pinnedCards,
    keepCurrent,
    hasContent,
    handleToolChange,
    handleOptionChange,
    toggleKeepCurrent,
    handleUnpin,
  } = useContextExplorerState({ resetSignal, canUseContext, onPinnedChange, matchResult });

  // Drive staging/animation based on whether we have content to show.
  const { showResults, stageAnimate, uploadAnimate, onExitComplete } = usePanelsChoreography(hasContent, () => {});

  return (
    <div className="integration-section">
      <motion.div
        className={`integration-grid ${showResults ? "integration-grid--split" : "integration-grid--solo"}`}
        variants={stageVariants}
        animate={stageAnimate}
        initial={false}
        transition={timeline}
      >
        <motion.div
          className="integration-panel card"
          variants={uploadSolid}
          animate={uploadAnimate}
          transition={timeline}
          initial={false}
        >
          <ContextControls
            tool={tool}
            option={option}
            optionsForTool={optionsForTool}
            canUseContext={canUseContext}
            onToolChange={handleToolChange}
            onOptionChange={handleOptionChange}
          />
        </motion.div>

        <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
          {showResults && canUseContext && (
            <motion.div
              className="integration-results-column card"
              initial={resultZoom.initial}
              animate={resultZoom.animate}
              exit={resultZoom.exit}
              transition={resultZoom.transition}
            >
              <ContextResults
                pinnedCards={pinnedCards}
                currentCard={currentCard}
                keepCurrent={keepCurrent}
                onToggleKeep={toggleKeepCurrent}
                onUnpin={handleUnpin}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
