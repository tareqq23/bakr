import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';

interface SectionHeaderRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Intersection-observer backed reveal wrapper for section headers.
 * Uses Framer Motion's `useInView` with compositor-only transform + opacity transitions.
 */
export function SectionHeaderReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: SectionHeaderRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  const initialOffset =
    direction === 'left'
      ? { opacity: 0, x: -16, y: 0 }
      : direction === 'right'
        ? { opacity: 0, x: 16, y: 0 }
        : { opacity: 0, x: 0, y: 22 };

  return (
    <motion.div
      ref={ref}
      initial={initialOffset}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initialOffset}
      transition={{ duration: 0.55, delay, ease: EASE_OUT_EXPO }}
      className={`will-change-transform ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
}
