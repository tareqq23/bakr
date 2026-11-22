import { type ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';

interface SectionTransitionProps {
  children: ReactNode;
  sectionIds?: string[];
  className?: string;
  immediate?: boolean;
  preserveSticky?: boolean;
}

const FLUID_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Provides fluid section-to-section motion when scrolling into a section
 * or navigating directly between sections via links and CTAs.
 */
export function SectionTransition({
  children,
  sectionIds = [],
  className = '',
  immediate = false,
  preserveSticky = false,
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.08 });
  const prefersReducedMotion = useReducedMotion();
  const [navPhase, setNavPhase] = useState<'idle' | 'entering' | 'arrived'>('idle');
  const [sweepKey, setSweepKey] = useState(0);

  const isVisible = immediate || isInView;

  useEffect(() => {
    if (prefersReducedMotion || sectionIds.length === 0) return;

    let arrivalTimer = 0;
    let settleTimer = 0;

    const handleSectionNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ sectionId?: string }>;
      const targetId = customEvent.detail?.sectionId;
      if (!targetId || !sectionIds.includes(targetId)) return;

      window.clearTimeout(arrivalTimer);
      window.clearTimeout(settleTimer);

      setNavPhase('entering');

      // Fallback arrival in case scroll completes quickly or is interrupted
      arrivalTimer = window.setTimeout(() => {
        setNavPhase('arrived');
        setSweepKey((prev) => prev + 1);
        settleTimer = window.setTimeout(() => setNavPhase('idle'), 520);
      }, 460);
    };

    const handleSectionArrived = (event: Event) => {
      const customEvent = event as CustomEvent<{ sectionId?: string }>;
      const targetId = customEvent.detail?.sectionId;
      if (!targetId || !sectionIds.includes(targetId)) return;

      window.clearTimeout(arrivalTimer);
      window.clearTimeout(settleTimer);

      setNavPhase('arrived');
      setSweepKey((prev) => prev + 1);
      settleTimer = window.setTimeout(() => setNavPhase('idle'), 520);
    };

    const handleNavigateCancel = () => {
      window.clearTimeout(arrivalTimer);
      window.clearTimeout(settleTimer);
      setNavPhase('idle');
    };

    window.addEventListener('bakr:section-navigate', handleSectionNavigate);
    window.addEventListener('bakr:section-arrived', handleSectionArrived);
    window.addEventListener('bakr:section-navigate-cancel', handleNavigateCancel);

    return () => {
      window.removeEventListener('bakr:section-navigate', handleSectionNavigate);
      window.removeEventListener('bakr:section-arrived', handleSectionArrived);
      window.removeEventListener('bakr:section-navigate-cancel', handleNavigateCancel);
      window.clearTimeout(arrivalTimer);
      window.clearTimeout(settleTimer);
    };
  }, [prefersReducedMotion, sectionIds]);

  const initialState = prefersReducedMotion
    ? { opacity: 1 }
    : preserveSticky
      ? { opacity: 0 }
      : { opacity: 0, y: 26, scale: 0.988 };

  const targetState = !isVisible
    ? initialState
    : navPhase === 'entering'
      ? preserveSticky
        ? { opacity: 0.3 }
        : { opacity: 0.28, y: 22, scale: 0.99 }
      : preserveSticky
        ? { opacity: 1 }
        : { opacity: 1, y: 0, scale: 1 };

  const transition =
    navPhase === 'entering'
      ? { duration: 0.18, ease: FLUID_EASE }
      : navPhase === 'arrived'
        ? { duration: 0.5, ease: FLUID_EASE }
        : { duration: 0.68, ease: FLUID_EASE };

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={targetState}
      transition={transition}
      className={`relative ${className}`}
    >
      {/* Top-edge sweep highlight when landing on a section */}
      <AnimatePresence>
        {!prefersReducedMotion && sweepKey > 0 && navPhase === 'arrived' && (
          <motion.div
            key={sweepKey}
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 0.95 }}
            animate={{ scaleX: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              scaleX: { duration: 0.45, ease: FLUID_EASE },
              opacity: { duration: 0.55, delay: 0.18, ease: 'easeOut' },
            }}
            className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[3px] origin-left bg-[#d9291a]"
          />
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  );
}
