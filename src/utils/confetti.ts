import confetti from 'canvas-confetti';

const BAKR_CONFETTI_COLORS = ['#d9291a', '#ff7c70', '#FBBF24', '#ffffff', '#161211'];

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Fires a celebratory dual-cannon confetti explosion upon completing checkout.
 */
export function fireCheckoutConfetti(): void {
  if (prefersReducedMotion()) return;

  const defaults = {
    spread: 74,
    startVelocity: 42,
    ticks: 210,
    colors: BAKR_CONFETTI_COLORS,
    disableForReducedMotion: true,
    zIndex: 60,
  };

  confetti({
    ...defaults,
    particleCount: 50,
    angle: 62,
    origin: { x: 0.2, y: 0.68 },
  });

  confetti({
    ...defaults,
    particleCount: 50,
    angle: 118,
    origin: { x: 0.8, y: 0.68 },
  });

  window.setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 45,
      spread: 90,
      startVelocity: 34,
      origin: { x: 0.68, y: 0.52 },
    });
  }, 180);
}
