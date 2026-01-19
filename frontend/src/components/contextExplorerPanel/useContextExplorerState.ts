// Encapsulates context explorer selections, pinned cards, and reset logic.
import { useEffect, useMemo, useState } from "react";

import { createCard, TOOL_DATA } from "./contextData";
import type { ResultCard, ToolId } from "./types";

type UseContextExplorerStateProps = {
  resetSignal?: number;
  canUseContext: boolean;
  onPinnedChange?: (cards: ResultCard[]) => void;
};

export function useContextExplorerState({
  resetSignal = 0,
  canUseContext,
  onPinnedChange,
}: UseContextExplorerStateProps) {
  const [tool, setTool] = useState<ToolId | "">("");
  const [option, setOption] = useState<string>("");
  const [currentCard, setCurrentCard] = useState<ResultCard | null>(null);
  const [pinnedCards, setPinnedCards] = useState<ResultCard[]>([]);
  const [keepCurrent, setKeepCurrent] = useState(false);

  const optionsForTool = useMemo(
    () => (tool ? TOOL_DATA[tool] : []),
    [tool],
  );

  const hasContent = !!currentCard || pinnedCards.length > 0;

  const finalizeCurrentIfKept = () => {
    // When navigating away, just clear the keep toggle; pinning happens immediately on toggle.
    setKeepCurrent(false);
  };

  const handleToolChange = (value: string) => {
    // Reset current view when switching tools.
    finalizeCurrentIfKept();
    if (value === "") {
      setTool("");
      setOption("");
      setCurrentCard(null);
      return;
    }

    setTool(value as ToolId);
    setOption("");
    setCurrentCard(null);
  };

  const handleOptionChange = (value: string) => {
    // Swap cards when picking another data option.
    finalizeCurrentIfKept();
    setOption(value);

    if (!value || !tool) {
      setCurrentCard(null);
      return;
    }

    const currentTool = tool as ToolId;
    const target = TOOL_DATA[currentTool].find((opt) => opt.value === value);
    if (target) {
      setCurrentCard(createCard(currentTool, target));
    }
  };

  const toggleKeepCurrent = () => {
    // Toggle keep state and immediately add/remove the current card in pinned list.
    if (!currentCard) return;
    setKeepCurrent((prev) => {
      const next = !prev;
      setPinnedCards((cards) => {
        // Add when turning on; remove when turning off.
        if (next) {
          const exists = cards.some((c) => c.id === currentCard.id);
          return exists ? cards : [currentCard, ...cards];
        }
        return cards.filter((c) => c.id !== currentCard.id);
      });
      return next;
    });

    // Reset selection so user is prompted to pick a new tool/option after keeping.
    setTool("");
    setOption("");
    setCurrentCard(null);
  };

  const handleUnpin = (id: string) => {
    // Remove a pinned card and clear current if it matches.
    setPinnedCards((prev) => prev.filter((card) => card.id !== id));
    if (currentCard && currentCard.id === id) {
      setCurrentCard(null);
      setKeepCurrent(false);
    }
  };

  useEffect(() => {
    if (onPinnedChange) {
      onPinnedChange(pinnedCards);
    }
  }, [pinnedCards, onPinnedChange]);

  useEffect(() => {
    // External reset: clear all selections when resetSignal changes or context locks.
    setTool("");
    setOption("");
    setCurrentCard(null);
    setPinnedCards([]);
    setKeepCurrent(false);
  }, [resetSignal, canUseContext]);

  return {
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
  };
}
