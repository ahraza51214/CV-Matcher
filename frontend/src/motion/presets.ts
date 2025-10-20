import type { Variants, Transition } from "framer-motion";

export const spring: Transition = { type: "spring", stiffness: 240, damping: 24 };

export const stageVariants: Variants = {
  center: { transition: { when: "beforeChildren" as const } },
  split:  { transition: { when: "beforeChildren" as const } },
};

export const panelVariants: Variants = {
  center: { x: 0, scale: 1, transition: spring },
  left:   { x: 0, scale: 1, transition: spring },
};
