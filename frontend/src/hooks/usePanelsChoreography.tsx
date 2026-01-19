// Exposes panel animation targets plus close/exit helpers for upload/result layout.
import { useRef } from "react";

/**
 * Orchestrates the two-panel choreography:
 * - Keeps the grid in split mode until the result panel fully exits
 * - Exposes stage/upload animation targets plus close/exit handlers
 */
export function usePanelsChoreography(
  started: boolean,
  dismiss: () => void,
) {
  const uploadRef = useRef<HTMLDivElement | null>(null);

  const showResults = started;
  const stageClass = started ? "stage--split" : "stage--center";
  const stageAnimate = started ? "split" : "center";
  const uploadAnimate = started ? "left" : "center";

  const requestClose = () => {
    // Defer closing logic to caller to control state resets.
    dismiss();
  };

  const onExitComplete = () => {
    // no-op; closing handled by dismiss
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
