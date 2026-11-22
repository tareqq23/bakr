import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Clock, Copy, ExternalLink, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { BAKR_CONTACT, formatRupiah } from '../data/menuData';
import { CartItem } from '../types/burger';
import { getOperatingHoursStatus, OperatingHoursStatus } from '../utils/operatingHours';
import { BakrLogo } from './BakrLogo';
import { fireCheckoutConfetti } from '../utils/confetti';
import { scrollToSection } from '../utils/smoothScroll';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  operatingHours: OperatingHoursStatus;
  onClose: () => void;
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

const KITCHEN_WHATSAPP_NUMBER = BAKR_CONTACT.whatsappNumber;

export function CartDrawer({
  isOpen,
  items,
  operatingHours,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderMethod, setOrderMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const buildOrderMessage = (orderId: string) => {
    const lines = items.map(
      (item, idx) =>
        `${idx + 1}. ${item.title} x${item.quantity} (${formatRupiah(item.unitPrice * item.quantity)})`,
    );

    return [
      `Halo Dapur BAKR.! Saya ingin pesan burger (${orderId}):`,
      '',
      ...lines,
      '',
      `Total Pesanan: ${formatRupiah(subtotal)}`,
      `Nama: ${customerName.trim()}`,
      `No. HP: ${phone.trim()}`,
      `Metode: ${orderMethod === 'delivery' ? 'Antar Kurir' : 'Ambil di Dapur BAKR.'}`,
      orderMethod === 'delivery' ? `Alamat: ${address.trim()}` : '',
      notes.trim() ? `Catatan: ${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleConfirmOrder = (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const liveStatus = getOperatingHoursStatus();
    if (!liveStatus.isOpen) {
      setFormError(liveStatus.message);
      return;
    }

    if (customerName.trim().length < 2) {
      setFormError('Mohon isi nama lengkap Anda.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      setFormError('Mohon masukkan nomor WhatsApp yang valid (minimal 9 digit).');
      return;
    }
    if (orderMethod === 'delivery' && address.trim().length < 8) {
      setFormError('Mohon lengkapi alamat pengantaran agar kurir mudah menemukan lokasi.');
      return;
    }

    setFormError(null);
    const code = `BAKR-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedCode(code);
    fireCheckoutConfetti();
  };

  const orderSummaryText = submittedCode ? buildOrderMessage(submittedCode) : '';
  const whatsappHref = submittedCode
    ? `https://wa.me/${KITCHEN_WHATSAPP_NUMBER}?text=${encodeURIComponent(orderSummaryText)}`
    : '#';

  const handleCopySummary = async () => {
    if (!orderSummaryText) return;
    try {
      await navigator.clipboard.writeText(orderSummaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleStartNewOrder = () => {
    setSubmittedCode(null);
    onClearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Keranjang Pesanan BAKR."
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-dvh w-full max-w-md flex-col border-l border-[#e8e1df] bg-white shadow-2xl"
          >
            {/* Header in BAKR. Signature Red */}
            <div className="flex items-center justify-between bg-[#d9291a] px-4 py-3.5 sm:px-6 sm:py-4 text-white">
              <div className="flex items-center gap-3">
                <BakrLogo variant="white" className="h-5 w-auto" />
                <span className="font-mono-ui text-[11px] font-bold uppercase tracking-[0.08em] text-white/90">
                  Bag [{totalCount}]
                </span>
              </div>
              <button
                type="button"
                aria-label="Tutup keranjang"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-[2px] text-white hover:bg-white/15 cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 bg-[#faf7f6]">
              {!operatingHours.isOpen && !submittedCode && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-[4px] border border-[#d9291a]/35 bg-white p-3.5 text-[#161211]"
                >
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#d9291a]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[#d9291a]">
                      {operatingHours.headline}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#5a5250]">
                      {operatingHours.message}
                    </p>
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[4px] border border-[#e8e1df] bg-white text-[#d9291a]">
                    <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-extrabold uppercase text-[#161211]">
                    Keranjang Anda Masih Kosong
                  </h3>
                  <p className="mt-1.5 max-w-xs text-sm text-[#5a5250]">
                    Pilih menu burger panggang, rice bowl, atau pasta brisket favorit langsung dari
                    dapur BAKR.
                  </p>
                  <a
                    href="#menu"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      onClose();
                      window.setTimeout(() => scrollToSection('menu'), 120);
                    }}
                    className="mt-6 inline-flex items-center rounded-[2px] bg-[#d9291a] px-5 py-3 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] text-white hover:bg-[#b81f12] transition-colors"
                  >
                    Lihat Daftar Menu
                  </a>
                </div>
              ) : submittedCode ? (
                <div className="space-y-6">
                  <div className="rounded-[4px] border border-[#e8e1df] bg-white p-5">
                    <p className="font-mono-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[#d9291a]">
                      Ringkasan Siap Dikirim
                    </p>
                    <h3 className="mt-1 font-display text-xl font-extrabold uppercase text-[#161211]">
                      Pesanan {submittedCode}
                    </h3>
                    <p className="mt-2 text-sm text-[#5a5250]">
                      Klik tombol WhatsApp di bawah untuk langsung mengirim detail pesanan Anda ke
                      dapur BAKR., atau salin teks pesanannya.
                    </p>
                  </div>

                  <pre className="whitespace-pre-wrap rounded-[4px] border border-[#e8e1df] bg-white p-4 font-mono-ui text-xs leading-relaxed text-[#161211]">
                    {orderSummaryText}
                  </pre>

                  <div className="space-y-3">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#d9291a] px-5 py-3.5 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] text-white hover:bg-[#b81f12] transition-colors"
                    >
                      <WhatsAppIcon className="h-4 w-4 shrink-0" />
                      <span>Kirim ke WhatsApp Dapur</span>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="flex w-full items-center justify-center gap-2 rounded-[2px] border border-[#e8e1df] bg-white px-5 py-3 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] text-[#161211] hover:border-[#d9291a] hover:text-[#d9291a] cursor-pointer transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-[#d9291a]" aria-hidden="true" />
                          <span>Ringkasan Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" aria-hidden="true" />
                          <span>Salin Ringkasan Pesanan</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleStartNewOrder}
                      className="w-full py-2 font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-[#5a5250] hover:text-[#d9291a] cursor-pointer transition-colors"
                    >
                      Selesai &amp; Buat Pesanan Baru
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Itemized List */}
                  <ul className="divide-y divide-[#e8e1df] rounded-[4px] border border-[#e8e1df] bg-white px-4">
                    {items.map((item) => (
                      <li key={item.cartKey} className="py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-display text-base font-extrabold uppercase tracking-tight text-[#161211]">
                              {item.title}
                            </h4>
                            <p className="mt-1.5 font-mono-ui text-xs font-bold text-[#d9291a]">
                              {formatRupiah(item.unitPrice * item.quantity)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              aria-label={`Kurangi ${item.title}`}
                              onClick={() => onUpdateQuantity(item.cartKey, -1)}
                              className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-[#e8e1df] text-[#161211] hover:bg-[#faf7f6] cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span className="font-mono-ui min-w-[24px] text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={!operatingHours.isOpen}
                              aria-label={`Tambah ${item.title}`}
                              onClick={() => onUpdateQuantity(item.cartKey, 1)}
                              className={`flex h-8 w-8 items-center justify-center rounded-[2px] border border-[#e8e1df] transition-colors ${
                                operatingHours.isOpen
                                  ? 'text-[#161211] hover:bg-[#faf7f6] cursor-pointer'
                                  : 'bg-[#faf7f6] text-[#5a5250]/45 cursor-not-allowed'
                              }`}
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Hapus ${item.title}`}
                              onClick={() => onRemoveItem(item.cartKey)}
                              className="ml-1 flex h-8 w-8 items-center justify-center rounded-[2px] text-[#5a5250] hover:text-[#d9291a] cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Order Form */}
                  <form
                    id="bakr-checkout-form"
                    onSubmit={handleConfirmOrder}
                    className="space-y-4 rounded-[4px] border border-[#e8e1df] bg-white p-4 sm:p-5"
                  >
                    <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-[#161211]">
                      Detail Pengiriman
                    </h3>

                    <div>
                      <label
                        htmlFor="cust-name"
                        className="block font-mono-ui text-[10px] font-bold uppercase tracking-[0.08em] text-[#161211]"
                      >
                        Nama Pemesan
                      </label>
                      <input
                        id="cust-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Mis. Andi Wijaya"
                        className="mt-1.5 w-full rounded-[2px] border border-[#e8e1df] bg-[#faf7f6] px-3.5 py-2.5 text-sm text-[#161211] placeholder:text-[#5a5250]/60 focus:border-[#d9291a] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cust-phone"
                        className="block font-mono-ui text-[10px] font-bold uppercase tracking-[0.08em] text-[#161211]"
                      >
                        Nomor WhatsApp
                      </label>
                      <input
                        id="cust-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0812xxxxxxxx"
                        className="mt-1.5 w-full rounded-[2px] border border-[#e8e1df] bg-[#faf7f6] px-3.5 py-2.5 text-sm text-[#161211] placeholder:text-[#5a5250]/60 focus:border-[#d9291a] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="block font-mono-ui text-[10px] font-bold uppercase tracking-[0.08em] text-[#161211]">
                        Metode Pengambilan
                      </span>
                      <div className="mt-1.5 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderMethod('delivery')}
                          className={`rounded-[2px] border px-3 py-2 font-mono-ui text-[11px] font-bold uppercase cursor-pointer transition-colors ${
                            orderMethod === 'delivery'
                              ? 'border-[#d9291a] bg-[#d9291a] text-white'
                              : 'border-[#e8e1df] text-[#5a5250] hover:border-[#d9291a]/50'
                          }`}
                        >
                          Antar Kurir
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderMethod('pickup')}
                          className={`rounded-[2px] border px-3 py-2 font-mono-ui text-[11px] font-bold uppercase cursor-pointer transition-colors ${
                            orderMethod === 'pickup'
                              ? 'border-[#d9291a] bg-[#d9291a] text-white'
                              : 'border-[#e8e1df] text-[#5a5250] hover:border-[#d9291a]/50'
                          }`}
                        >
                          Ambil di Dapur
                        </button>
                      </div>
                    </div>

                    {orderMethod === 'delivery' && (
                      <div>
                        <label
                          htmlFor="cust-address"
                          className="block font-mono-ui text-[10px] font-bold uppercase tracking-[0.08em] text-[#161211]"
                        >
                          Alamat Lengkap
                        </label>
                        <textarea
                          id="cust-address"
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Jalan, nomor rumah, dan patokan terdekat"
                          className="mt-1.5 w-full rounded-[2px] border border-[#e8e1df] bg-[#faf7f6] px-3.5 py-2 text-sm text-[#161211] placeholder:text-[#5a5250]/60 focus:border-[#d9291a] focus:bg-white focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="cust-notes"
                        className="block font-mono-ui text-[10px] font-bold uppercase tracking-[0.08em] text-[#161211]"
                      >
                        Catatan Tambahan (Opsional)
                      </label>
                      <input
                        id="cust-notes"
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Mis. pisahkan saus pedas"
                        className="mt-1.5 w-full rounded-[2px] border border-[#e8e1df] bg-[#faf7f6] px-3.5 py-2.5 text-sm text-[#161211] placeholder:text-[#5a5250]/60 focus:border-[#d9291a] focus:bg-white focus:outline-none"
                      />
                    </div>

                    {formError && (
                      <p role="alert" className="text-xs font-semibold text-[#d9291a]">
                        {formError}
                      </p>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* Footer Checkout Bar */}
            {items.length > 0 && !submittedCode && (
              <div className="border-t border-[#e8e1df] bg-white px-4 py-3.5 sm:px-6 sm:py-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono-ui text-[11px] font-bold uppercase tracking-[0.06em] text-[#5a5250]">
                    Total Pembayaran
                  </span>
                  <span className="font-mono-ui text-xl font-bold text-[#d9291a]">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <button
                  type="submit"
                  form="bakr-checkout-form"
                  disabled={!operatingHours.isOpen}
                  className={`w-full rounded-[2px] px-5 py-3.5 font-mono-ui text-xs font-bold uppercase tracking-[0.06em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9291a] ${
                    operatingHours.isOpen
                      ? 'bg-[#d9291a] text-white cursor-pointer hover:bg-[#b81f12]'
                      : 'bg-[#e8e1df] text-[#5a5250] cursor-not-allowed'
                  }`}
                >
                  {operatingHours.isOpen
                    ? 'Buat Ringkasan Pesanan'
                    : 'Pemesanan Tutup (09.00 – 17.00 WIB)'}
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
