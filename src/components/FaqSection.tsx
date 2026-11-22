import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { BAKR_CONTACT, FAQ_ITEMS } from '../data/menuData';
import { SectionHeaderReveal } from './SectionHeaderReveal';

const WHOLESALE_WHATSAPP_HREF =
  `${BAKR_CONTACT.whatsappBaseUrl}?text=` +
  encodeURIComponent(
    'Halo Tim Dapur BAKR.! Saya ingin menanyakan informasi mengenai pesanan jumlah besar / grosir / acara.',
  );

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="scroll-mt-20 border-b border-[#e8e1df] bg-[#faf7f6] py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left Column: Sticky Editorial Intro + Wholesale / Bulk Inquiry Link */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.15fr_0.85fr] md:items-start lg:col-span-4 lg:grid-cols-1 lg:gap-7 lg:sticky lg:top-24">
            <div>
              <SectionHeaderReveal delay={0}>
                <p className="font-mono-ui text-[11px] font-bold uppercase tracking-[0.15em] text-[#d9291a]">
                  Tanya Jawab Dapur
                </p>
              </SectionHeaderReveal>
              <SectionHeaderReveal delay={0.07}>
                <h2 className="mt-2 font-display text-balance text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-[-0.02em] text-[#161211]">
                  Informasi Pesanan, Bahan &amp; Grosir.
                </h2>
              </SectionHeaderReveal>
              <SectionHeaderReveal delay={0.14}>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#5a5250]">
                  Ringkasan hal yang paling sering ditanyakan pelanggan seputar jangkauan kurir,
                  kesegaran bahan harian, serta pemesanan untuk acara maupun kerja sama grosir.
                </p>
              </SectionHeaderReveal>
            </div>

            <SectionHeaderReveal delay={0.2}>
              <div className="rounded-[4px] border border-[#e8e1df] bg-white p-5">
                <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[#d9291a]">
                  Acara &amp; Pemesanan Besar
                </p>
                <p className="mt-1.5 font-display text-base font-extrabold uppercase tracking-tight text-[#161211]">
                  Butuh 15+ porsi atau penawaran grosir?
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#5a5250]">
                  Diskusikan jadwal panggang dan harga paket khusus langsung bersama tim dapur kami.
                </p>
                <a
                  href={WHOLESALE_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-[#d9291a] hover:text-[#b81f12] transition-colors"
                >
                  <span>Tanya Penawaran via WhatsApp</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </SectionHeaderReveal>
          </div>

          {/* Right Column: Clean Bordered Accordion */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-[#e8e1df] rounded-[4px] border border-[#e8e1df] bg-white overflow-hidden">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openId === item.id;
                const buttonId = `${item.id}-trigger`;
                const panelId = `${item.id}-panel`;
                const indexNumber = String(idx + 1).padStart(2, '0');

                return (
                  <div key={item.id} className="transition-colors">
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleItem(item.id)}
                        className="flex w-full items-start justify-between gap-3 sm:gap-4 px-4 py-4 sm:px-6 sm:py-5 text-left cursor-pointer hover:bg-[#faf7f6] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#d9291a] transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 font-mono-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[#5a5250]">
                            <span className="text-[#d9291a]">[ {indexNumber} ]</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.topic}</span>
                          </div>
                          <span className="mt-1.5 block font-display text-[15px] sm:text-lg font-extrabold tracking-tight text-[#161211] leading-snug">
                            {item.question}
                          </span>
                        </div>

                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
                          className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border transition-colors will-change-transform ${
                            isOpen
                              ? 'border-[#d9291a] bg-[#d9291a] text-white'
                              : 'border-[#e8e1df] bg-[#faf7f6] text-[#5a5250]'
                          }`}
                          aria-hidden="true"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] as const }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0.5 sm:px-6 sm:pb-5 text-sm sm:text-base leading-relaxed text-[#5a5250]">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
