import { useCallback, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Instagram,
  MapPin,
  Share2,
  ShoppingBag,
} from 'lucide-react';
import { BAKR_CONTACT } from '../data/menuData';
import { scrollToSection } from '../utils/smoothScroll';
import { BakrLogo } from './BakrLogo';
import { BakrLocationMap, DEFAULT_BAKR_ADDRESS, ResolvedPlace } from './LocationSection';
import { SectionHeaderReveal } from './SectionHeaderReveal';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterSectionProps {
  onOpenCart: () => void;
}

export function FooterSection({ onOpenCart }: FooterSectionProps) {
  const [displayAddress, setDisplayAddress] = useState(DEFAULT_BAKR_ADDRESS);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);
  const [showShareFallback, setShowShareFallback] = useState(false);

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  const shareText = `Cobain smoked brisket burgers, rice bowls & pasta dari BAKR. (${BAKR_CONTACT.instagramHandle})!`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;

  const handlePlaceResolved = useCallback((place: ResolvedPlace) => {
    if (place.formattedAddress) {
      setDisplayAddress(place.formattedAddress);
    }
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(displayAddress);
      setCopiedAddress(true);
      window.setTimeout(() => setCopiedAddress(false), 2200);
    } catch {
      setCopiedAddress(false);
    }
  };

  const handleCopyShareUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShareUrl(true);
      window.setTimeout(() => setCopiedShareUrl(false), 2200);
    } catch {
      setCopiedShareUrl(false);
    }
  };

  const handleShareSite = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'BAKR. — The Smokehouse',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    setShowShareFallback((prev) => !prev);
    void handleCopyShareUrl();
  };

  return (
    <footer id="lokasi" className="scroll-mt-20 bg-white text-[#161211]">
      {/* Combined Location & Closing Conversion Band in Signature BAKR. Red (#d9291a) */}
      <div className="relative overflow-hidden border-b border-[#e8e1df] bg-[#d9291a] text-white">
        <div
          className="dot-pattern-white pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-[1320px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Brand Closing CTA + Verified Cilegon Location Info */}
            <div className="lg:col-span-6">
              <SectionHeaderReveal delay={0}>
                <BakrLogo variant="white" className="h-8 sm:h-10 w-auto" />
              </SectionHeaderReveal>

              <SectionHeaderReveal delay={0.06}>
                <h2 className="mt-5 font-display italic text-balance text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-[-0.02em] text-white leading-[1.08]">
                  Siap Dipanggang Panas. Kunjungi atau Pesan Langsung.
                </h2>
              </SectionHeaderReveal>

              <SectionHeaderReveal delay={0.12}>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/90">
                  Buka Senin – Minggu pukul 09.00 – 17.00 WIB. Ambil langsung di dapur kami atau
                  kirim pesanan via WhatsApp tanpa biaya aplikasi tambahan.
                </p>
              </SectionHeaderReveal>

              {/* Integrated Location Details */}
              <div className="mt-6 border-t border-white/25 pt-5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">
                      Titik Dapur · Cilegon
                    </p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-white">
                      {displayAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Unified Action Row */}
              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[2px] bg-white px-5 py-3.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-[#d9291a] whitespace-nowrap shrink-0 cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Buka Keranjang</span>
                </button>

                <a
                  href={BAKR_CONTACT.mapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-[2px] border border-white/70 px-4 py-3.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-white whitespace-nowrap shrink-0 hover:bg-white hover:text-[#d9291a] transition-colors"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-[2px] border border-white/35 px-4 py-3.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-white/95 whitespace-nowrap shrink-0 cursor-pointer hover:border-white hover:bg-white/10 transition-colors"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareSite}
                  aria-label="Bagikan tautan BAKR. ke teman"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-[2px] border border-white/35 px-4 py-3.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-white/95 whitespace-nowrap shrink-0 cursor-pointer hover:border-white hover:bg-white/10 transition-colors"
                >
                  {copiedShareUrl ? (
                    <>
                      <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Link Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Bagikan</span>
                    </>
                  )}
                </button>
              </div>

              {showShareFallback && (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-[2px] border border-white/25 bg-[#b81f12]/60 px-3.5 py-2.5 text-xs text-white">
                  <span className="text-white/90">
                    Bagikan langsung lewat WhatsApp atau salin tautan:
                  </span>
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-white underline underline-offset-4 hover:text-white/85"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>Kirim via WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Right Column: Embedded Interactive Google Map Pin */}
            <div className="lg:col-span-6">
              <BakrLocationMap onPlaceResolved={handlePlaceResolved} />
            </div>
          </div>
        </div>
      </div>

      {/* Crisp White Bottom Footer Bar */}
      <div className="mx-auto max-w-[1320px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 font-mono-ui text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#161211]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          {/* Brand & Operating Hours */}
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
            <span className="font-bold text-[#d9291a] whitespace-nowrap">
              © 2026 BAKR. THE SMOKEHOUSE
            </span>
            <span aria-hidden="true" className="hidden sm:inline text-[#e8e1df]">
              /
            </span>
            <span className="text-[#5a5250] whitespace-nowrap">
              Senin – Minggu, 09.00 – 17.00 WIB
            </span>
          </div>

          {/* Grouped Navigation & Contact Links */}
          <div className="flex flex-col gap-3 border-t border-[#e8e1df] pt-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 lg:border-t-0 lg:pt-0 lg:justify-end lg:gap-5">
            <nav
              aria-label="Navigasi footer"
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              <a
                href="#menu"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  scrollToSection('menu');
                }}
                className="whitespace-nowrap text-[#5a5250] hover:text-[#d9291a] transition-colors"
              >
                Menu
              </a>
              <a
                href="#dapur-kami"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  scrollToSection('dapur-kami');
                }}
                className="whitespace-nowrap text-[#5a5250] hover:text-[#d9291a] transition-colors"
              >
                Dapur Kami
              </a>
              <a
                href="#faq"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  scrollToSection('faq');
                }}
                className="whitespace-nowrap text-[#5a5250] hover:text-[#d9291a] transition-colors"
              >
                FAQ
              </a>
            </nav>

            <span
              aria-hidden="true"
              className="hidden sm:block h-3.5 w-px shrink-0 bg-[#e8e1df]"
            />

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href={BAKR_CONTACT.mapsShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 whitespace-nowrap font-bold text-[#161211] hover:text-[#d9291a] transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#d9291a]" aria-hidden="true" />
                <span>Google Maps</span>
              </a>
              <a
                href={BAKR_CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 whitespace-nowrap font-bold text-[#161211] hover:text-[#d9291a] transition-colors"
              >
                <Instagram className="h-3.5 w-3.5 shrink-0 text-[#d9291a]" aria-hidden="true" />
                <span>{BAKR_CONTACT.instagramHandle}</span>
              </a>
              <a
                href={BAKR_CONTACT.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi dapur BAKR. via WhatsApp"
                className="inline-flex items-center gap-1.5 whitespace-nowrap font-bold text-[#161211] hover:text-[#d9291a] transition-colors"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 shrink-0 text-[#d9291a]" />
                <span>Hubungi Kami</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
