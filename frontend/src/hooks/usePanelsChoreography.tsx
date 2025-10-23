import { useRef, useState } from "react";

/**
 * Orchestrates the two-panel choreography:
 * - Keeps the grid in split mode until the result panel fully exits
 * - Exposes stage/upload animation targets plus close/exit handlers
 */
export function usePanelsChoreography(
  started: boolean,
  dismiss: () => void,
) {
  const [closing, setClosing] = useState(false);

  const uploadRef = useRef<HTMLDivElement | null>(null);

  const showResults = started && !closing;
  const stageClass = started || closing ? "stage--split" : "stage--center";
  const stageAnimate = started || closing ? "split" : "center";
  const uploadAnimate = started || closing ? "left" : "center";

  const requestClose = () => {
    if (!closing) {
      setClosing(true);
    }
  };

  const onExitComplete = () => {
    if (!closing) return;
    dismiss(); // flips started=false in evaluation hook
    window.requestAnimationFrame(() => setClosing(false)); // let stage animate back to center
  };

  return {
    uploadRef,
    showResults,
    stageClass,
    stageAnimate,
    uploadAnimate,
    requestClose,
    onExitComplete,
  };
}
