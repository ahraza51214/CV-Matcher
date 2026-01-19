// Encapsulates context explorer selections, pinned cards, and reset logic.
import { useEffect, useState } from "react";

import type { ResultCard, ToolId, ToolOption } from "./types";
import { fetchContent, fetchOptions } from "../../api/context";

type UseContextExplorerStateProps = {
  resetSignal?: number;
  canUseContext: boolean;
  onPinnedChange?: (cards: ResultCard[]) => void;
};

const createCard = (toolId: ToolId, opt: { value: string; label: string; content: string }): ResultCard => ({
  id: `${toolId}-${opt.value}-${Date.now()}`,
  tool: toolId,
  label: opt.label,
  content: opt.content,
});

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [optionsForTool, setOptionsForTool] = useState<ToolOption[]>([]);

  const hasContent = !!currentCard || pinnedCards.length > 0;

  useEffect(() => {
    let cancelled = false;
    const loadOptions = async () => {
      if (!tool) {
        setOptionsForTool([]);
        return;
      }
      const opts = await fetchOptions(tool);
      if (!cancelled) setOptionsForTool(opts.map((o) => ({ value: o.id, label: o.label, content: o.description || "" })));
    };
    loadOptions();
    return () => { cancelled = true; };
  }, [tool]);

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
    const target = optionsForTool.find((opt) => opt.value === value);
    const label = target?.label ?? value;

    // Fetch live content and display it (no local dummy fallback).
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchContent(currentTool, value);
        if (res?.aiRendered) {
          setCurrentCard(createCard(currentTool, { value, label: res.label, content: res.aiRendered }));
        } else if (res) {
          setCurrentCard(createCard(currentTool, { value, label: res.label, content: "Ingen data tilgængelig." }));
        } else {
          setError("Ingen data fundet.");
          setCurrentCard(null);
        }
      } catch (e) {
        setError("Kunne ikke hente data fra værktøjet.");
        setCurrentCard(null);
      } finally {
        setLoading(false);
      }
    })();
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
    loading,
    error,
    handleToolChange,
    handleOptionChange,
    toggleKeepCurrent,
    handleUnpin,
  };
}
