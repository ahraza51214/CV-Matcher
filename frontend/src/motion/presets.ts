// Shared motion presets controlling stage and panel animations across the app.
import type { Variants, Transition } from "framer-motion";

/** Cinematic timing shared by both panels */
export const timeline: Transition = {
  type: "tween",
  duration: 0.95,
  ease: [0.22, 1, 0.36, 1], // smooth, premium “glide”
};

/** Stage just orchestrates; no visual props here */
export const stageVariants: Variants = {
  center: { transition: { when: "beforeChildren" as const } },
  split:  { transition: { when: "beforeChildren" as const } },
};

const uploadTransition: Transition = { ...timeline, duration: 0.75 };

/** Upload panel: translate as one solid block (no stretchy layout morphing) */
export const uploadSolid: Variants = {
  center: { x: 0,   opacity: 1, filter: "blur(0px)", transition: uploadTransition },
  left:   { x: -36, opacity: 1, filter: "blur(0px)", transition: uploadTransition },
};

/** Result panel: zoom from its final center (no lateral slide) */
export const resultZoom = {
  initial:   { opacity: 0, x: 0, scale: 0.86, filter: "blur(12px)" },
  animate:   { opacity: 1, x: 0, scale: 1.0,  filter: "blur(0px)"  },
  exit:      { opacity: 0, x: 0, scale: 0.86, filter: "blur(12px)" },
  transition: {
    ...timeline,
    opacity: { duration: 1.05 },
    filter:  { duration: 0.9, delay: 0.02 },
  } as Transition & { opacity?: Transition; filter?: Transition },
};
