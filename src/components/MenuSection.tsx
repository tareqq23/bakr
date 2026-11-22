import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Minus,
  Plus,
  Search,
  Share2,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { BAKR_CONTACT, formatRupiah, MENU_ITEMS } from '../data/menuData';
import { BurgerMenuItem, CartItem, MenuCategory } from '../types/burger';
import { OperatingHoursStatus } from '../utils/operatingHours';
import { SectionHeaderReveal } from './SectionHeaderReveal';
import { WhatsAppIcon } from './WhatsAppIcon';

interface MenuSectionProps {
  cartItems: CartItem[];
  operatingHours: OperatingHoursStatus;
  onAddMenuItem: (item: BurgerMenuItem) => void;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
}

const FILTER_TABS: { id: MenuCategory; label: string }[] = [
  { id: 'semua', label: 'Semua Menu' },
  { id: 'burger', label: 'Burgers' },
  { id: 'rice-pasta', label: 'Rice & Pasta' },
];

interface MenuItemCardProps {
  item: BurgerMenuItem;
  idx: number;
  qty: number;
  isKitchenOpen: boolean;
  isWideFeatured: boolean;
  hasFailedImage: boolean;
  onImageError: (id: string) => void;
  onAddMenuItem: (item: BurgerMenuItem) => void;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
}

const cardSurfaceVariants = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const cardGlowVariants = {
  rest: { opacity: 0.2, scale: 0.985 },
  hover: {
    opacity: 1,
    scale: 1.008,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function MenuItemCard({
  item,
  idx,
  qty,
  isKitchenOpen,
  isWideFeatured,
  hasFailedImage,
  onImageError,
  onAddMenuItem,
  onUpdateQuantity,
}: MenuItemCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const imageParallaxY = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const imageScrollScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1.08, 1.04]);

  const itemCode = String(idx + 1).padStart(2, '0');

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.35,
        delay: idx * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative ${isWideFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
    >
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="group relative h-full"
      >
        {/* Subtle Glowing Crimson Shadow Layer (compositor opacity & scale on hover) */}
        <motion.div
          aria-hidden="true"
          variants={cardGlowVariants}
          className="pointer-events-none absolute inset-0 rounded-[4px] will-change-transform"
          style={{
            boxShadow:
              '0 20px 44px -10px rgba(217, 41, 26, 0.32), 0 8px 20px -6px rgba(22, 18, 17, 0.08)',
          }}
        />

        <motion.article
          variants={cardSurfaceVariants}
          className={`relative z-10 flex h-full flex-col overflow-hidden rounded-[4px] border border-[#e8e1df] bg-[#faf7f6] transition-colors duration-200 group-hover:border-[#d9291a]/45 will-change-transform ${
            isWideFeatured ? 'md:flex-row' : ''
          }`}
        >
          {/* Image Container (4:3 uniform aspect ratio) */}
          <div
            className={`relative overflow-hidden border-b border-[#e8e1df] ${
              item.id === 'mighty-double' || item.id === 'mighty-classic'
                ? 'bg-white'
                : 'bg-[#f4f4f6]'
            } ${
              isWideFeatured
                ? 'aspect-[4/3] md:w-1/2 md:aspect-auto md:border-b-0 md:border-r'
                : 'aspect-[4/3]'
            }`}
          >
            {item.isLimitedTime && (
              <div className="pointer-events-none absolute top-3.5 left-3.5 z-20">
                <motion.div
                  aria-hidden="true"
                  animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0, 0.45] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-[2px] bg-[#d9291a] will-change-transform"
                />
                <motion.span
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative inline-flex items-center gap-1.5 rounded-[2px] bg-[#d9291a] px-2.5 py-1 font-mono-ui text-[10px] font-bold uppercase tracking-[0.08em] text-white shadow-md whitespace-nowrap will-change-transform"
                >
                  <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>Limited Time</span>
                </motion.span>
              </div>
            )}

            {!hasFailedImage ? (
              <motion.div
                style={{ y: imageParallaxY, scale: imageScrollScale }}
                className="h-full w-full will-change-transform"
              >
                <div
                  className={`h-full w-full ${
                    item.id === 'smokey-brisk'
                      ? 'scale-[1.12]'
                      : item.id === 'mighty-double' || item.id === 'mighty-classic'
                        ? 'scale-[1.16]'
                        : 'scale-100'
                  }`}
                >
                  <motion.img
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 4.2 + (idx % 3) * 0.55,
                      delay: (idx % 3) * 0.35,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={() => onImageError(item.id)}
                    className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] will-change-transform ${
                      item.id === 'smokey-brisk'
                        ? 'object-[50%_58%] brightness-[1.04] contrast-[1.05]'
                        : item.id === 'mighty-double'
                          ? 'object-[50%_45%]'
                          : item.id === 'mighty-classic'
                            ? 'object-[50%_46%]'
                            : item.id === 'the-punchy-rice'
                              ? 'object-[50%_58%]'
                              : item.id === 'the-smoked-aglio'
                                ? 'object-[50%_54%]'
                                : 'object-center'
                    }`}
                  />
                </div>
              </motion.div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-[#5a5250]">
                <UtensilsCrossed className="h-8 w-8 text-[#d9291a]" aria-hidden="true" />
                <span className="font-display text-sm font-bold uppercase">{item.name}</span>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div
            className={`flex flex-1 flex-col justify-between p-5 sm:p-6 ${
              isWideFeatured ? 'md:w-1/2 md:p-6 lg:p-8' : ''
            }`}
          >
            <div>
              {/* Zero-Pill Metadata Line */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono-ui text-[10px] uppercase tracking-[0.08em] leading-snug text-[#5a5250]">
                <span className="text-[#d9291a] font-bold">[ {itemCode} ]</span>
                <span>{item.weightInfo}</span>
                <span aria-hidden="true">·</span>
                <span>{item.spiceInfo}</span>
                <span aria-hidden="true">·</span>
                <span>{item.bunInfo}</span>
              </div>

              <div className="mt-2.5 flex items-baseline justify-between gap-3">
                <h3 className="font-display italic text-xl font-extrabold uppercase tracking-[-0.01em] text-[#d9291a]">
                  {item.name}
                </h3>
                {item.highlightNote && (
                  <span className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.08em] text-[#5a5250] whitespace-nowrap shrink-0">
                    {item.highlightNote}
                  </span>
                )}
              </div>

              <p className="mt-2 font-menu-serif italic text-[14px] leading-relaxed text-[#5a5250]">
                {item.description}
              </p>
            </div>

            {/* Price & Action Row */}
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#e8e1df] pt-4">
              <span className="font-display italic text-lg font-extrabold text-[#161211] tabular-nums">
                {formatRupiah(item.price)}
              </span>

              {!isKitchenOpen ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#e8e1df] px-4 py-2.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-[#5a5250] whitespace-nowrap shrink-0 cursor-not-allowed"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Tutup</span>
                </button>
              ) : qty === 0 ? (
                <button
                  type="button"
                  onClick={() => onAddMenuItem(item)}
                  className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#d9291a] px-4 py-2.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-white whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 hover:bg-[#b81f12] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9291a]"
                >
                  <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Tambah</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-[2px] border border-[#d9291a]/40 bg-white px-2 py-1">
                  <button
                    type="button"
                    aria-label={`Kurangi jumlah ${item.name}`}
                    onClick={() => onUpdateQuantity(`menu:${item.id}`, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-[2px] text-[#161211] hover:bg-[#faf7f6] cursor-pointer transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <span className="font-mono-ui min-w-[20px] text-center text-xs font-bold text-[#161211]">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label={`Tambah jumlah ${item.name}`}
                    onClick={() => onUpdateQuantity(`menu:${item.id}`, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#d9291a] text-white hover:bg-[#b81f12] cursor-pointer transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.article>
      </motion.div>
    </motion.div>
  );
}

export function MenuSection({
  cartItems,
  operatingHours,
  onAddMenuItem,
  onUpdateQuantity,
}: MenuSectionProps) {
  const [activeFilter, setActiveFilter] = useState<MenuCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleItems = useMemo(
    () =>
      MENU_ITEMS.filter((item) => {
        const matchesCategory = activeFilter === 'semua' || item.category === activeFilter;
        const matchesName =
          normalizedQuery === '' || item.name.toLowerCase().includes(normalizedQuery);
        return matchesCategory && matchesName;
      }),
    [activeFilter, normalizedQuery],
  );

  const getItemQty = (id: string) => {
    const found = cartItems.find((ci) => ci.cartKey === `menu:${id}`);
    return found ? found.quantity : 0;
  };

  const selectedItems = useMemo(
    () => cartItems.filter((ci) => ci.cartKey.startsWith('menu:') && ci.quantity > 0),
    [cartItems],
  );

  const selectedCount = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems],
  );

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [selectedItems],
  );

  const shareMessage = useMemo(() => {
    const pageUrl =
      typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';

    if (selectedItems.length > 0) {
      const itemLines = selectedItems.map(
        (item, index) =>
          `${index + 1}. ${item.title} x${item.quantity} — ${formatRupiah(
            item.unitPrice * item.quantity,
          )}`,
      );

      return [
        `Lagi pengin menu dari BAKR. (${BAKR_CONTACT.instagramHandle})! Ini daftar menu pilihan yang mau dipesan:`,
        '',
        ...itemLines,
        '',
        `Total Estimasi (${selectedCount} porsi): ${formatRupiah(selectedTotal)}`,
        pageUrl ? `Pesan langsung di sini: ${pageUrl}#menu` : '',
      ]
        .filter(Boolean)
        .join('\n');
    }

    const highlightLines = visibleItems
      .slice(0, 5)
      .map((item) => `• ${item.name} (${formatRupiah(item.price)})`);

    return [
      `Cobain smoked meats, burgers, rice bowl & pasta dari BAKR. (${BAKR_CONTACT.instagramHandle})!`,
      '',
      'Menu pilihan:',
      ...highlightLines,
      '',
      pageUrl ? `Lihat katalog lengkapnya di: ${pageUrl}#menu` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }, [selectedItems, selectedCount, selectedTotal, visibleItems]);

  const whatsappShareHref = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  const xShareHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
  const canUseNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleCopyShareMessage = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopiedShare(true);
      window.setTimeout(() => setCopiedShare(false), 2200);
    } catch {
      setCopiedShare(false);
    }
  };

  const handleNativeShare = async () => {
    if (!canUseNativeShare) return;
    try {
      await navigator.share({
        title: 'BAKR. — Pilihan Burger Rumahan Panggang',
        text: shareMessage,
      });
    } catch {
      // Ignore user cancellation gracefully
    }
  };

  return (
    <section
      id="menu"
      className="relative scroll-mt-20 border-b border-[#e8e1df] bg-white py-12 sm:py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Section Header + Interactive Segmented Filter Tabs */}
        <div className="flex flex-col gap-5 border-b border-[#e8e1df] pb-7 sm:gap-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionHeaderReveal delay={0}>
              <p className="font-mono-ui text-[11px] font-bold uppercase tracking-[0.15em] text-[#d9291a]">
                Katalog Panggang Harian
              </p>
            </SectionHeaderReveal>
            <SectionHeaderReveal delay={0.08}>
              <h2 className="mt-2 font-display italic text-balance text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-[-0.02em] text-[#161211]">
                Menu Pilihan Dapur BAKR.
              </h2>
            </SectionHeaderReveal>
          </div>

          <SectionHeaderReveal delay={0.12}>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div
                role="tablist"
                aria-label="Filter kategori menu"
                className="inline-flex flex-wrap items-center gap-1 rounded-[4px] border border-[#e8e1df] bg-[#faf7f6] p-1"
              >
                {FILTER_TABS.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`relative rounded-[2px] px-3 py-2 sm:px-4 font-mono-ui text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.06em] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9291a] ${
                        isActive
                          ? 'bg-[#d9291a] text-white'
                          : 'text-[#5a5250] hover:text-[#161211]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                aria-expanded={isShareOpen}
                aria-controls="bakr-menu-share-panel"
                onClick={() => setIsShareOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-[4px] border px-3.5 py-2 sm:px-4 sm:py-2.5 font-mono-ui text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.06em] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9291a] ${
                  isShareOpen
                    ? 'border-[#161211] bg-[#161211] text-white'
                    : 'border-[#d9291a]/35 bg-white text-[#d9291a] hover:bg-[#d9291a] hover:text-white'
                }`}
              >
                <Share2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {selectedCount > 0 ? `Bagikan (${selectedCount})` : 'Bagikan Menu'}
                </span>
              </button>
            </div>
          </SectionHeaderReveal>
        </div>

        {/* Search Bar Row */}
        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="group relative w-full sm:max-w-md">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#5a5250] transition-colors group-focus-within:text-[#d9291a]"
              aria-hidden="true"
            />
            <input
              type="text"
              role="searchbox"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari burger atau rice bowl (mis. Smokey, Mighty, Rice)..."
              aria-label="Cari menu berdasarkan nama"
              className="w-full rounded-[4px] border border-[#e8e1df] bg-[#faf7f6] py-2.5 pl-10 pr-10 text-sm text-[#161211] placeholder:text-[#5a5250]/75 transition-colors focus:border-[#d9291a] focus:bg-white focus:outline-none"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                aria-label="Hapus pencarian menu"
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[2px] text-[#5a5250] hover:bg-[#e8e1df]/60 hover:text-[#d9291a] cursor-pointer transition-colors"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <p className="font-mono-ui text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#5a5250] whitespace-nowrap">
            {normalizedQuery
              ? `${visibleItems.length} menu ditemukan`
              : `Menampilkan ${visibleItems.length} dari ${MENU_ITEMS.length} menu`}
          </p>
        </div>

        {/* Expandable Share Panel with Pre-formatted Message */}
        <AnimatePresence>
          {isShareOpen && (
            <motion.div
              id="bakr-menu-share-panel"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-[4px] border border-[#d9291a]/30 bg-[#faf7f6] p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4 border-b border-[#e8e1df] pb-4">
                  <div>
                    <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.14em] text-[#d9291a]">
                      [ BAGIKAN PILIHAN ]{' '}
                      {selectedCount > 0
                        ? `${selectedCount} ITEM BURGER DIPILIH`
                        : 'REKOMENDASI MENU BAKR.'}
                    </p>
                    <h3 className="mt-1 font-display text-lg sm:text-xl font-extrabold uppercase tracking-tight text-[#161211]">
                      {selectedCount > 0
                        ? 'Kirim Daftar Pesanan ke Teman atau Grup'
                        : 'Bagikan Katalog Burger ke Teman'}
                    </h3>
                    {selectedCount === 0 && (
                      <p className="mt-1 text-xs text-[#5a5250]">
                        Tekan <span className="font-semibold text-[#161211]">+ Tambah</span> pada
                        kartu burger di bawah bila ingin menyertakan item spesifik ke dalam pesan.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="Tutup panel bagikan"
                    onClick={() => setIsShareOpen(false)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border border-[#e8e1df] bg-white text-[#5a5250] hover:border-[#d9291a] hover:text-[#d9291a] cursor-pointer transition-colors"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
                  <div className="min-w-0">
                    <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[#5a5250]">
                      Pratinjau Pesan Siap Kirim
                    </p>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-[4px] border border-[#e8e1df] bg-white p-3.5 sm:p-4 font-mono-ui text-xs leading-relaxed text-[#161211]">
                      {shareMessage}
                    </pre>
                  </div>

                  <div className="flex flex-col gap-2.5 lg:pt-6">
                    <a
                      href={whatsappShareHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#d9291a] px-5 py-3 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] text-white hover:bg-[#b81f12] transition-colors"
                    >
                      <WhatsAppIcon className="h-4 w-4 shrink-0" />
                      <span>Bagikan ke WhatsApp</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </a>

                    <a
                      href={xShareHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] border border-[#e8e1df] bg-white px-5 py-3 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] text-[#161211] hover:border-[#d9291a] hover:text-[#d9291a] transition-colors"
                    >
                      <span>Bagikan ke X / Media Sosial</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyShareMessage}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] border border-[#e8e1df] bg-white px-5 py-3 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] text-[#161211] hover:border-[#d9291a] hover:text-[#d9291a] cursor-pointer transition-colors"
                    >
                      {copiedShare ? (
                        <>
                          <Check className="h-4 w-4 shrink-0 text-[#d9291a]" aria-hidden="true" />
                          <span className="text-[#d9291a]">Pesan Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>Salin Pesan</span>
                        </>
                      )}
                    </button>

                    {canUseNativeShare && (
                      <button
                        type="button"
                        onClick={handleNativeShare}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#161211] px-5 py-3 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] text-white hover:bg-[#2a2321] cursor-pointer transition-colors"
                      >
                        <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Bagikan Lewat Aplikasi Lain</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Closed Operating Hours Banner */}
        {!operatingHours.isOpen && (
          <div
            role="status"
            className="mt-6 flex items-start gap-3 rounded-[4px] border border-[#d9291a]/30 bg-[#faf7f6] px-4 py-3.5 sm:px-5"
          >
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#d9291a]" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-mono-ui text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-[#d9291a]">
                {operatingHours.headline} · 09.00 – 17.00 WIB
              </p>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#5a5250]">
                {operatingHours.message}
              </p>
            </div>
          </div>
        )}

        {/* Menu Grid or Empty Search State */}
        {visibleItems.length > 0 ? (
          <motion.div
            layout
            className={`mt-8 sm:mt-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:gap-7 ${
              visibleItems.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, idx) => {
                const qty = getItemQty(item.id);
                const hasFailedImage = failedImages[item.id];
                const isWideFeatured =
                  activeFilter === 'semua' &&
                  normalizedQuery === '' &&
                  Boolean(item.featuredSpan);

                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    idx={idx}
                    qty={qty}
                    isKitchenOpen={operatingHours.isOpen}
                    isWideFeatured={isWideFeatured}
                    hasFailedImage={Boolean(hasFailedImage)}
                    onImageError={(id) => setFailedImages((prev) => ({ ...prev, [id]: true }))}
                    onAddMenuItem={onAddMenuItem}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center rounded-[4px] border border-[#e8e1df] bg-[#faf7f6] px-6 py-12 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-[4px] border border-[#e8e1df] bg-white text-[#d9291a]">
              <Search className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display italic text-lg font-extrabold uppercase tracking-tight text-[#161211]">
              Menu Tidak Ditemukan
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-[#5a5250]">
              Tidak ada menu yang cocok dengan pencarian{' '}
              <span className="font-semibold text-[#161211]">&ldquo;{searchQuery.trim()}&rdquo;</span>
              {activeFilter !== 'semua' ? ' pada kategori ini.' : '.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('semua');
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-[2px] bg-[#d9291a] px-4 py-2.5 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-white cursor-pointer transition-colors hover:bg-[#b81f12]"
            >
              <span>Tampilkan Semua Menu</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
