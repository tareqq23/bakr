import { animate } from 'motion/react';

/**
 * Smoothly scrolls the viewport to a section element using a custom eased curve,
 * accounting for the sticky header height and respecting reduced-motion settings.
 */
export function scrollToSection(sectionId: string): void {
  if (typeof window === 'undefined') return;

  const target = document.getElementById(sectionId);
  if (!target) return;

  window.dispatchEvent(
    new CustomEvent('bakr:section-navigate', { detail: { sectionId } }),
  );

  const header = document.querySelector('header');
  const headerOffset = header ? header.getBoundingClientRect().height : 72;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const rawTargetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  const targetY = Math.min(Math.max(0, rawTargetY), maxScroll);

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dispatchArrived = () => {
    window.dispatchEvent(
      new CustomEvent('bakr:section-arrived', { detail: { sectionId } }),
    );
  };

  if (prefersReducedMotion) {
    window.scrollTo(0, targetY);
    dispatchArrived();
    return;
  }

  const startY = window.scrollY;
  if (Math.abs(targetY - startY) < 2) {
    dispatchArrived();
    return;
  }

  // Temporarily bypass CSS `scroll-behavior: smooth` so frame-by-frame updates stay crisp
  const htmlEl = document.documentElement;
  const prevInlineScrollBehavior = htmlEl.style.scrollBehavior;
  htmlEl.style.scrollBehavior = 'auto';

  let controls: ReturnType<typeof animate> | null = null;

  const cleanup = () => {
    htmlEl.style.scrollBehavior = prevInlineScrollBehavior;
    window.removeEventListener('wheel', handleUserInterrupt);
    window.removeEventListener('touchstart', handleUserInterrupt);
    window.removeEventListener('keydown', handleKeyInterrupt);
  };

  const handleUserInterrupt = () => {
    controls?.stop();
    cleanup();
    window.dispatchEvent(new CustomEvent('bakr:section-navigate-cancel'));
  };

  const handleKeyInterrupt = (event: KeyboardEvent) => {
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'PageUp' ||
      event.key === 'PageDown' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === ' '
    ) {
      handleUserInterrupt();
    }
  };

  window.addEventListener('wheel', handleUserInterrupt, { passive: true });
  window.addEventListener('touchstart', handleUserInterrupt, { passive: true });
  window.addEventListener('keydown', handleKeyInterrupt);

  controls = animate(startY, targetY, {
    duration: 0.72,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (latest) => {
      window.scrollTo(0, latest);
    },
    onComplete: () => {
      cleanup();
      dispatchArrived();
    },
  });
}
