import { useState } from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import { KITCHEN_CRAFT_IMAGE } from '../data/menuData';
import { SectionHeaderReveal } from './SectionHeaderReveal';

const DISH_HIGHLIGHTS = [
  {
    index: '01',
    title: 'Smoked Brisket Burgers',
    description: 'Juicy, smoky, stacked high, and built for serious two-handed bites.',
  },
  {
    index: '02',
    title: 'Brisket Rice Bowls',
    description:
      'Warm, fragrant rice loaded with tender, charred-edge brisket that soaks up every drop of savory richness.',
  },
  {
    index: '03',
    title: 'Brisket Aglio Olio',
    description:
      'Garlic, olive oil, a gentle kick of heat, and melt-in-your-mouth smoked brisket tossed together for a smoky-meets-savory pasta upgrade.',
  },
  {
    index: '04',
    title: 'And Plenty More',
    description:
      'Fresh drops, secret specials, and creative menu experiments that keep things exciting every time you pull up.',
  },
];

export function StoryAndReviewsSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="dapur-kami"
      className="relative scroll-mt-20 overflow-hidden border-b border-white/20 bg-[#d9291a] text-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[380px_1fr] xl:grid-cols-[440px_1fr]">
        {/* Left: Full-Bleed Compact Brisket Photo Integrated With Signature Red */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:min-h-[340px] lg:min-h-0 overflow-hidden border-b border-white/20 bg-[#b81f12] md:border-b-0 md:border-r md:border-white/20"
        >
          {!imgError ? (
            <img
              src={KITCHEN_CRAFT_IMAGE}
              alt="Proses pemotongan smoked brisket BAKR. di atas talenan kayu setelah diasap perlahan"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="absolute inset-0 h-full w-full object-cover object-[50%_50%]"
            />
          ) : (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 p-8 text-white/85">
              <Flame className="h-10 w-10 text-white" aria-hidden="true" />
              <span className="font-display text-lg font-bold uppercase text-white">
                Inside BAKR.
              </span>
            </div>
          )}
        </motion.div>

        {/* Right: Compact Editorial Story on Clean Solid BAKR Signature Red */}
        <div className="relative flex items-center overflow-hidden bg-[#d9291a] px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-3xl"
          >
            <SectionHeaderReveal delay={0}>
              <p className="font-mono-ui text-[11px] font-bold uppercase tracking-[0.16em] text-white/85">
                Inside BAKR
              </p>
            </SectionHeaderReveal>

            <SectionHeaderReveal delay={0.05}>
              <h2 className="mt-1.5 font-display italic text-balance text-2xl sm:text-3xl lg:text-[2.25rem] lg:leading-[1.06] font-extrabold uppercase tracking-[-0.02em] text-white">
                Where Smoke Meets Soul.
              </h2>
            </SectionHeaderReveal>

            <div className="mt-3.5 space-y-2.5 text-sm sm:text-[14.5px] leading-relaxed text-white/90">
              <p>
                Forget fast food. Real flavor takes time—and a whole lot of patience. At BAKR,
                every cut of brisket is crafted slow and low, kissed by hours of gentle smoke until
                the bark turns rich, the fat melts into pure velvet, and every bite pulls apart
                effortlessly.
              </p>
              <p>
                Once the smoke does its magic, the real playground begins. We take that deeply
                smoky, tender brisket and reimagine it across a lineup of dishes that hit every
                craving—from late-night comfort to bold, unexpected twists:
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-x-7 gap-y-3.5 border-t border-white/25 pt-5 sm:grid-cols-2">
              {DISH_HIGHLIGHTS.map((item) => (
                <div key={item.index}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono-ui text-[10px] font-bold text-white/75">
                      {item.index}.
                    </span>
                    <h3 className="font-display italic text-[13px] sm:text-sm font-extrabold uppercase tracking-tight text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/85">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
