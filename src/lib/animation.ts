// Shared luxury animation curves and transition presets
export const APPLE_EASE = [0.16, 1, 0.3, 1] as const;

export const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: APPLE_EASE,
    },
  },
};
