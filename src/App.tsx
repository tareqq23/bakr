import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { CartDrawer } from './components/CartDrawer';
import { FaqSection } from './components/FaqSection';
import { FooterSection } from './components/FooterSection';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { Navbar } from './components/Navbar';
import { SectionTransition } from './components/SectionTransition';
import { StoryAndReviewsSection } from './components/StoryAndReviewsSection';
import { MENU_ITEMS } from './data/menuData';
import { BurgerMenuItem, CartItem } from './types/burger';
import { getOperatingHoursStatus, useOperatingHours } from './utils/operatingHours';

const CART_STORAGE_KEY = 'bakr_cart_items_v1';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved) as CartItem[];
      const validKeys = new Set(MENU_ITEMS.map((item) => `menu:${item.id}`));
      return parsed.filter((item) => validKeys.has(item.cartKey));
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);
  const operatingHours = useOperatingHours();

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleAddMenuItem = (item: BurgerMenuItem) => {
    const liveStatus = getOperatingHoursStatus();
    if (!liveStatus.isOpen) {
      showToast('Dapur BAKR. tutup — pemesanan dibuka pukul 09.00 – 17.00 WIB');
      return;
    }

    const cartKey = `menu:${item.id}`;
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.cartKey === cartKey);
      if (existing) {
        return prev.map((ci) =>
          ci.cartKey === cartKey ? { ...ci, quantity: ci.quantity + 1 } : ci,
        );
      }
      return [
        ...prev,
        {
          cartKey,
          title: item.name,
          unitPrice: item.price,
          quantity: 1,
          image: item.image,
        },
      ];
    });
    showToast(`${item.name} ditambahkan ke keranjang`);
  };

  const handleUpdateQuantity = (cartKey: string, delta: number) => {
    if (delta > 0 && !getOperatingHoursStatus().isOpen) {
      showToast('Jam operasional selesai — pemesanan dibuka pukul 09.00 – 17.00 WIB');
      return;
    }

    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen bg-white text-[#161211]"
      >
        {gmpQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <div className="mx-auto min-h-screen max-w-[1600px] overflow-x-clip border-x border-[#e8e1df] bg-white">
          <Navbar totalItems={totalItems} onOpenCart={() => setIsCartOpen(true)} />

          <main>
            <SectionTransition immediate sectionIds={['hero']}>
              <HeroSection />
            </SectionTransition>

            <SectionTransition sectionIds={['menu']}>
              <MenuSection
                cartItems={cartItems}
                operatingHours={operatingHours}
                onAddMenuItem={handleAddMenuItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </SectionTransition>

            <SectionTransition sectionIds={['dapur-kami']}>
              <StoryAndReviewsSection />
            </SectionTransition>

            <SectionTransition preserveSticky sectionIds={['faq']}>
              <FaqSection />
            </SectionTransition>
          </main>

          <SectionTransition sectionIds={['lokasi']}>
            <FooterSection onOpenCart={() => setIsCartOpen(true)} />
          </SectionTransition>
        </div>

        <CartDrawer
          isOpen={isCartOpen}
          items={cartItems}
          operatingHours={operatingHours}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

        {/* Non-intrusive Add-to-Cart Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-5 sm:right-5 z-40 flex items-center justify-between sm:justify-start gap-3 rounded-[4px] border border-[#d9291a]/30 bg-white px-4 py-3 text-xs sm:text-sm font-medium text-[#161211] shadow-lg"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d9291a]" aria-hidden="true" />
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={() => {
                  setToastMessage(null);
                  setIsCartOpen(true);
                }}
                className="ml-2 font-mono-ui text-[11px] font-bold uppercase text-[#d9291a] hover:text-[#b81f12] cursor-pointer whitespace-nowrap"
              >
                Lihat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}
