import { type MouseEvent, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Flame } from 'lucide-react';
import { HERO_BURGER_IMAGE, KITCHEN_PILLARS } from '../data/menuData';
import { scrollToSection } from '../utils/smoothScroll';
import { BakrLogo } from './BakrLogo';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [imgError, setImgError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Subtle compositor-only scroll parallax transforms
  const dotGridY = useTransform(scrollYProgress, [0, 1], [0, 54]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-12, 18]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.26, 1.34]);

  const handleOrderNowClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    scrollToSection('menu');
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative border-b border-[#e8e1df] bg-[#d9291a] text-white"
    >
      {/* Asymmetric Editorial Split Preserving Variation 8 Grid with Official BAKR. Red & White Palette */}
      <div className="grid grid-cols-1 md:grid-cols-[1.08fr_0.92fr] lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_490px]">
        {/* Left Signature Red Pane */}
        <div className="relative overflow-hidden border-b border-white/20 bg-[#d9291a] px-5 py-10 sm:px-8 sm:py-12 md:border-b-0 md:border-r md:border-white/20 md:p-10 lg:p-14 xl:p-20 flex flex-col justify-center">
          <motion.div
            aria-hidden="true"
            style={{ y: dotGridY }}
            className="dot-pattern-white pointer-events-none absolute -inset-y-12 inset-x-0 opacity-75 will-change-transform"
          />

          <motion.div
            style={{ y: contentY }}
            className="relative z-10 max-w-2xl will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 sm:mb-6 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <BakrLogo variant="white" className="h-8 sm:h-9 md:h-10 w-auto" />
              <span className="font-mono-ui text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
                Est. 2020 · Cilegon
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-balance font-extrabold uppercase tracking-[-0.025em] text-white leading-[1.02]"
              style={{ fontSize: 'clamp(2.25rem, 4.9vw, 4.85rem)' }}
            >
              Daging Segar.
              <br />
              Pinggiran
              <br />
              Renyah.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 sm:mt-7 max-w-[500px] text-[15px] sm:text-base lg:text-[17px] leading-[1.6] text-white/90"
            >
              Tanpa daging beku, tanpa pemanis berlebih. Setiap patty sapi ditekan langsung di atas
              besi tuang panas lalu disatukan bersama roti brioche mentega dan saus asap racikan
              dapur kami.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <motion.a
                href="#menu"
                onClick={handleOrderNowClick}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center justify-center gap-2.5 rounded-[2px] bg-white px-6 py-3.5 sm:px-7 sm:py-4 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] text-[#d9291a] whitespace-nowrap shrink-0 transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Pesan Sekarang</span>
                <ArrowDown
                  className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </motion.a>

              <a
                href="#dapur-kami"
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  scrollToSection('dapur-kami');
                }}
                className="inline-flex items-center justify-center rounded-[2px] border border-white/75 bg-transparent px-6 py-3.5 sm:px-7 sm:py-4 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-white hover:text-[#d9291a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Cerita Dapur
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Pane: Studio Signature Burger Floating Parallax + Clean White Specimen Overlay */}
        <div className="relative flex min-h-[430px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[600px] items-center justify-center overflow-hidden bg-gradient-to-b from-[#eff0f3] via-[#f4f5f7] to-[#fafafa]">
          {!imgError ? (
            <>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                className="h-full w-full will-change-transform"
              >
                <motion.img
                  style={{ y: imageY, scale: imageScale, transformOrigin: '50% 82%' }}
                  src={HERO_BURGER_IMAGE}
                  alt="SMOKEY BRISK signature burger BAKR. dengan slice smoke brisket, 80gr beef patty, melt cheese, acar timun, dan roti brioche wijen"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-[50%_78%] brightness-[1.05] contrast-[1.06] saturate-[1.08] will-change-transform"
                />
              </motion.div>

              {/* Soft studio edge-feathering so the photo backdrop blends cleanly into the frame and white specimen card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-28 bg-gradient-to-b from-[#f0f1f4]/80 via-[#f0f1f4]/25 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 sm:h-44 bg-gradient-to-t from-white/95 via-white/50 to-transparent"
              />
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#d9291a] p-8 text-center text-white">
              <Flame className="h-12 w-12" aria-hidden="true" />
              <span className="font-display italic text-xl font-extrabold uppercase">
                SMOKEY BRISK — BAKR.
              </span>
            </div>
          )}

          {/* Clean White Specimen Card Framed in Crimson */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-4 bottom-4 z-10 rounded-[2px] border border-[#d9291a]/35 bg-white p-3.5 text-[#161211] shadow-xl sm:inset-x-6 sm:bottom-6 sm:p-4 lg:inset-x-8 lg:bottom-8 lg:p-5"
          >
            <p className="font-mono-ui text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9291a]">
              [ SIGNATURE MENU ] SMOKE BRISKET + 80G PATTY
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <h2 className="font-display italic text-lg sm:text-xl font-extrabold tracking-tight text-[#d9291a]">
                SMOKEY BRISK
              </h2>
              <p className="font-display italic text-sm sm:text-base font-extrabold text-[#161211] whitespace-nowrap shrink-0">
                Rp 45.000
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-Width 4-Column Craft Pillars Strip on Clean White */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 border-t border-[#e8e1df] bg-white text-[#161211] sm:grid-cols-2 lg:grid-cols-4"
      >
        {KITCHEN_PILLARS.map((pillar, index) => (
          <div
            key={pillar.index}
            className={`px-5 py-5 sm:px-6 sm:py-6 lg:px-8 border-[#e8e1df] ${
              index > 0 ? 'border-t' : ''
            } ${index < 2 ? 'sm:border-t-0' : 'sm:border-t lg:border-t-0'} ${
              index % 2 === 1 ? 'sm:border-l' : ''
            } ${index > 0 ? 'lg:border-l' : ''}`}
          >
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono-ui text-[11px] font-bold text-[#d9291a]">
                {pillar.index}.
              </span>
              <h3 className="font-display text-sm font-extrabold uppercase tracking-tight text-[#161211]">
                {pillar.title}
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#5a5250]">{pillar.detail}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
