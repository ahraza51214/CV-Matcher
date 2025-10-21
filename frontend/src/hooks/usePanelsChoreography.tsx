import { useEffect, useRef, useState } from "react";

/**
 * Orchestrates the two-panel choreography:
 * - Keeps grid in "split" while the result panel exits
 * - Locks upload card width during close to avoid morphing
 * - Exposes stage/upload targets and handlers for close/exit-complete
 */
export function usePanelsChoreography(
  started: boolean,
  dismiss: () => void,
  gridMs = 950 // must match presets timeline (0.95s)
) {
  const [closing, setClosing] = useState(false);

  // Width lock to avoid morphing when grid collapses
  const uploadRef = useRef<HTMLDivElement | null>(null);
  const [lockWidthPx, setLockWidthPx] = useState<number | null>(null);

  // Derived UI flags/targets
  const showResults = started && !closing;
  const stageClass = started || closing ? "stage--split" : "stage--center";
  const stageAnimate = started || closing ? "split" : "center";
  const uploadAnimate = started || closing ? "left" : "center";

  // When starting close, lock the upload card's current pixel width
  useEffect(() => {
    if (closing && uploadRef.current) {
      const w = uploadRef.current.getBoundingClientRect().width;
      setLockWidthPx(Math.round(w));
    }
  }, [closing]);

  // After the result panel finishes its exit, collapse grid and release width
  const onExitComplete = () => {
    if (!closing) return;
    dismiss(); // flips started=false in your evaluation hook
    window.setTimeout(() => setLockWidthPx(null), gridMs); // release lock after grid anim
    setClosing(false);
  };

  const requestClose = () => setClosing(true);

  return {
    // state/refs for the upload card
    uploadRef,
    lockWidthPx,

    // stage/panel animation targets
    showResults,
    stageClass,
    stageAnimate,
    uploadAnimate,

    // flows
    requestClose,
    onExitComplete,
  };
}
