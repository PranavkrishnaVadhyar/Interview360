// Animation timing and easing presets
export const animationConfig = {
  durations: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.35,
    slower: 0.5,
  },
  easing: {
    ease: [0.25, 0.1, 0.25, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    easeCirc: [0.1, 0.1, 0.9, 0.9],
  },
};

// Entrance animations
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: animationConfig.durations.normal, ease: animationConfig.easing.easeOut },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: animationConfig.durations.normal, ease: animationConfig.easing.easeOut },
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: animationConfig.durations.normal, ease: animationConfig.easing.easeOut },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: animationConfig.durations.normal, ease: animationConfig.easing.easeOut },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: animationConfig.durations.fast, ease: animationConfig.easing.easeOut },
};

// Continuous animations
export const float = {
  animate: { y: [-10, 10, -10] },
  transition: { duration: 3, repeat: Infinity, ease: animationConfig.easing.easeInOut },
};

export const pulse = {
  animate: { opacity: [1, 0.7, 1] },
  transition: { duration: 2, repeat: Infinity, ease: animationConfig.easing.easeInOut },
};

export const shimmer = {
  animate: { backgroundPosition: ['0% 0%', '100% 0%'] },
  transition: { duration: 3, repeat: Infinity, ease: 'linear' },
};

// Stagger container
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: animationConfig.durations.fast },
};

export const hoverGlow = {
  whileHover: { boxShadow: '0 0 20px rgba(79, 124, 255, 0.4)' },
  transition: { duration: animationConfig.durations.fast },
};

// Page transition animation
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: animationConfig.durations.normal },
};

// Count-up animation for numbers
export const countUpVariants = (finalValue: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: animationConfig.durations.slow },
});
