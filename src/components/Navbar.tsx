import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '../utils/smoothScroll';
import { BakrLogo } from './BakrLogo';

interface NavbarProps {
  totalItems: number;
  onOpenCart: () => void;
}

const NAV_LINKS = [
  { href: '#menu', label: 'Menu' },
  { href: '#dapur-kami', label: 'Dapur Kami' },
  { href: '#faq', label: 'FAQ' },
  { href: '#lokasi', label: 'Lokasi' },
];

export function Navbar({ totalItems, onOpenCart }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [popSeq, setPopSeq] = useState(0);
  const prevTotalRef = useRef(totalItems);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setPopSeq((prev) => prev + 1);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  const [activeSection, setActiveSection] = useState<string>('hero');
  const programmaticTargetRef = useRef<string | null>(null);
  const programmaticLockTimerRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48);

      if (programmaticTargetRef.current) return;

      const sectionOrder = ['lokasi', 'faq', 'dapur-kami', 'menu', 'hero'];
      const markerY = window.scrollY + 140;
      for (const id of sectionOrder) {
        const el = document.getElementById(id);
        if (el && markerY >= el.getBoundingClientRect().top + window.scrollY) {
          setActiveSection(id);
          break;
        }
      }
    };

    const handleSectionNavigate = (event: Event) => {
      const targetId = (event as CustomEvent<{ sectionId?: string }>).detail?.sectionId;
      if (!targetId) return;
      window.clearTimeout(programmaticLockTimerRef.current);
      programmaticTargetRef.current = targetId;
      setActiveSection(targetId);
      programmaticLockTimerRef.current = window.setTimeout(() => {
        programmaticTargetRef.current = null;
      }, 900);
    };

    const handleSectionArrivedOrCancel = () => {
      window.clearTimeout(programmaticLockTimerRef.current);
      programmaticTargetRef.current = null;
      setScrolled(window.scrollY > 48);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('bakr:section-navigate', handleSectionNavigate);
    window.addEventListener('bakr:section-arrived', handleSectionArrivedOrCancel);
    window.addEventListener('bakr:section-navigate-cancel', handleSectionArrivedOrCancel);

    return () => {
      window.clearTimeout(programmaticLockTimerRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('bakr:section-navigate', handleSectionNavigate);
      window.removeEventListener('bakr:section-arrived', handleSectionArrivedOrCancel);
      window.removeEventListener('bakr:section-navigate-cancel', handleSectionArrivedOrCancel);
    };
  }, []);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setMobileMenuOpen(false);
    window.setTimeout(() => scrollToSection(sectionId), 40);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#e8e1df] text-[#161211]'
          : 'bg-[#d9291a] border-b border-white/20 text-white'
      }`}
    >
      {/* Slim Top-of-Viewport Scroll Progress Indicator */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] overflow-hidden transition-colors duration-200 ${
          scrolled ? 'bg-[#e8e1df]/75' : 'bg-white/20'
        }`}
      >
        <motion.div
          style={{ scaleX }}
          className={`h-full w-full origin-left will-change-transform transition-colors duration-200 ${
            scrolled ? 'bg-[#d9291a]' : 'bg-white'
          }`}
        />
      </div>

      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8 md:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#hero"
          aria-label="Beranda BAKR."
          onClick={(e) => handleNavClick(e, 'hero')}
          className="inline-flex items-center whitespace-nowrap shrink-0 rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          <BakrLogo variant={scrolled ? 'red' : 'white'} className="h-5 sm:h-6 md:h-7 w-auto" />
        </a>

        {/* Zone 2: Desktop & Tablet (md+) Navigation Links */}
        <nav aria-label="Navigasi utama" className="hidden md:flex items-center md:gap-5 lg:gap-7">
          {NAV_LINKS.map((link) => {
            const targetId = link.href.slice(1);
            const isActive = activeSection === targetId;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, targetId)}
                className={`relative font-mono-ui text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap shrink-0 py-1.5 transition-colors duration-150 ${
                  scrolled
                    ? isActive
                      ? 'text-[#d9291a]'
                      : 'text-[#161211]/75 hover:text-[#d9291a]'
                    : isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="bakr-nav-active-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className={`absolute inset-x-0 bottom-0 h-[2px] ${
                      scrolled ? 'bg-[#d9291a]' : 'bg-white'
                    }`}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Bag Action + Mobile Menu Toggle (< md) */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            key={`btn-${popSeq}`}
            type="button"
            onClick={onOpenCart}
            initial={false}
            animate={popSeq > 0 ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center gap-2 rounded-[2px] px-3.5 py-2 sm:px-4 sm:py-2.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.08em] whitespace-nowrap shrink-0 cursor-pointer will-change-transform transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
              scrolled
                ? 'bg-[#d9291a] text-white hover:bg-[#b81f12] focus-visible:outline-[#d9291a]'
                : 'bg-white text-[#d9291a] hover:bg-white/95 focus-visible:outline-white'
            }`}
          >
            <span>Bag</span>
            <motion.span
              key={`badge-${popSeq}`}
              initial={false}
              animate={popSeq > 0 ? { scale: [1, 1.3, 0.95, 1] } : { scale: 1 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="will-change-transform"
            >
              [{totalItems}]
            </motion.span>
          </motion.button>

          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-[2px] border md:hidden cursor-pointer transition-colors ${
              scrolled
                ? 'border-[#e8e1df] text-[#161211] hover:border-[#d9291a] hover:text-[#d9291a]'
                : 'border-white/35 text-white hover:bg-white/15'
            }`}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer (< md) */}
      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.nav
            aria-label="Navigasi seluler"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`overflow-hidden border-t md:hidden ${
              scrolled
                ? 'border-[#e8e1df] bg-white text-[#161211]'
                : 'border-white/20 bg-[#c42214] text-white'
            }`}
          >
            <div className="grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-4 sm:px-6">
              {NAV_LINKS.map((link) => {
                const targetId = link.href.slice(1);
                const isActive = activeSection === targetId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, targetId)}
                    className={`rounded-[2px] border px-3 py-2.5 text-center font-mono-ui text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                      scrolled
                        ? isActive
                          ? 'border-[#d9291a] bg-[#d9291a] text-white'
                          : 'border-[#e8e1df] bg-[#faf7f6] text-[#161211]'
                        : isActive
                          ? 'border-white bg-white text-[#d9291a]'
                          : 'border-white/25 bg-white/10 text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
