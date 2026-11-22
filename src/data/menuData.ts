import {
  BurgerMenuItem,
  FaqItem,
} from '../types/burger';

export const HERO_BURGER_IMAGE = '/assets/aistudio/smokey_brisk.JPG_59f262b2.jpeg';
export const KITCHEN_CRAFT_IMAGE = '/assets/aistudio/dapur_79a4bd71.jpeg';

export const MENU_ITEMS: BurgerMenuItem[] = [
  {
    id: 'smokey-brisk',
    name: 'SMOKEY BRISK',
    category: 'burger',
    price: 45000,
    weightInfo: 'Smoke Brisket + 80g Patty',
    spiceInfo: 'Gurih Asap',
    bunInfo: 'Sesame Brioche',
    description:
      'Slice smoke brisket, 80 gr beef patty, melt cheese, pickles, pineapple slice, caramelized onion, lettuce, signature BAKR. sauce.',
    image: HERO_BURGER_IMAGE,
    featuredSpan: true,
    highlightNote: 'Signature Menu',
  },
  {
    id: 'mighty-double',
    name: 'MIGHTY DOUBLE',
    category: 'burger',
    price: 45000,
    weightInfo: 'Two 80g Smashed Patties',
    spiceInfo: 'Gurih Creamy',
    bunInfo: 'Brioche Mentega',
    description:
      'Double melted cheese, two 80gr smashed patties, sweet caramelized onion, and spesial signature BAKR. sauce.',
    image: '/assets/aistudio/mighty_double_4e0486f9.jpeg',
    highlightNote: 'Double Smash',
  },
  {
    id: 'mighty-classic',
    name: 'MIGHTY CLASSIC',
    category: 'burger',
    price: 35000,
    weightInfo: '100g Beef Patty',
    spiceInfo: 'Tidak Pedas',
    bunInfo: 'Brioche Mentega',
    description:
      '100 gr beef patty, melt cheese, pickles, caramelized onion, lettuce, signature BAKR. sauce.',
    image: '/assets/aistudio/mighty_classic_458a8b3e.jpeg',
    highlightNote: 'Classic Choice',
  },
  {
    id: 'the-punchy-rice',
    name: 'THE PUNCHY (RICE)',
    category: 'rice-pasta',
    price: 35000,
    weightInfo: 'Smoke Brisket + Rice',
    spiceInfo: 'Sambal Matah',
    bunInfo: 'Hearty Rice Bowl',
    description: 'Tender smoke brisket, sambal matah, fried spinach and a rich egg.',
    image: '/assets/aistudio/the_punchy__rice__7eaae9ea.jpeg',
    highlightNote: 'Rice Bowl',
  },
  {
    id: 'the-smoked-aglio',
    name: 'THE SMOKED AGLIO',
    category: 'rice-pasta',
    price: 35000,
    weightInfo: 'Smoke Brisket + Pasta',
    spiceInfo: 'Spicy Garlicky',
    bunInfo: 'Aglio Olio',
    description:
      'Tender smoked brisket combined with the bold, garlicky kick of classic spicy aglio olio.',
    image: '/assets/aistudio/the_smoked_aglio_7369a645.jpeg',
    highlightNote: 'Pasta',
  },
];

export const KITCHEN_PILLARS = [
  {
    index: '01',
    title: 'Smoked Brisket Burgers',
    detail: 'Juicy, smoky, stacked high, and built for serious two-handed bites.',
  },
  {
    index: '02',
    title: 'Brisket Rice Bowls',
    detail:
      'Warm, fragrant rice loaded with tender, charred-edge brisket that soaks up every drop of savory richness.',
  },
  {
    index: '03',
    title: 'Brisket Aglio Olio',
    detail:
      'Garlic, olive oil, a gentle kick of heat, and melt-in-your-mouth smoked brisket tossed together for a smoky-meets-savory pasta upgrade.',
  },
  {
    index: '04',
    title: 'And Plenty More',
    detail:
      'Fresh drops, secret specials, and creative menu experiments that keep things exciting every time you pull up.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-delivery',
    topic: 'Area Pengantaran',
    question: 'Area mana saja yang dijangkau kurir BAKR. dan bagaimana kondisi burger saat tiba?',
    answer:
      'Kami melayani pemesanan dan pengantaran dari dapur BAKR Smoke di Taman Cilegon Indah, Cilegon, Banten serta sekitarnya. Setiap burger dibungkus penahan panas dan dikirim tepat setelah selesai dipanggang agar roti tetap lembut dan daging tetap juicy.',
  },
  {
    id: 'faq-sourcing',
    topic: 'Bahan & Kehalalan',
    question: 'Dari mana asal daging dan bahan bakunya, serta apakah semua menu 100% halal?',
    answer:
      'Seluruh bahan kami 100% halal dan tanpa daging babi ataupun alkohol. Kami menggunakan potongan daging sapi lokal pilihan (chuck dan brisket rasio lemak 80/20) yang digiling segar setiap pagi tanpa campuran daging beku, roti brioche dan potato bun panggang harian, serta sayuran hidroponik segar.',
  },
  {
    id: 'faq-wholesale',
    topic: 'Grosir & Acara',
    question: 'Apakah BAKR. menerima pesanan jumlah besar, acara kantor, atau kerja sama kemitraan?',
    answer:
      'Ya, kami melayani pemesanan partai besar untuk makan siang kantor, acara komunitas, hingga perayaan pribadi mulai dari 15 hingga 200+ porsi dengan harga paket khusus. Untuk kebutuhan rutin, acara pop-up, atau pertanyaan pasokan grosir/kemitraan, silakan hubungi tim dapur kami melalui WhatsApp agar jadwal panggang bertahap bisa disiapkan.',
  },
  {
    id: 'faq-notes',
    topic: 'Waktu & Alergen',
    question: 'Berapa lama waktu pemanggangan dan bisakah memberi catatan alergen atau pemisahan saus?',
    answer:
      'Pesanan satuan dipanggang dadakan selama 10–15 menit setelah konfirmasi masuk. Anda dapat menuliskan catatan khusus—seperti tanpa acar, tanpa bawang, atau pemisahan saus—langsung pada kolom catatan di formulir pengiriman keranjang.',
  },
  {
    id: 'faq-pricing',
    topic: 'Pemesanan Langsung',
    question: 'Apa keuntungan memesan langsung melalui situs ini dibanding aplikasi pesan-antar?',
    answer:
      'Semua harga menu di situs ini merupakan harga langsung dapur tanpa markup komisi aplikasi pihak ketiga. Anda dapat memilih varian menu signature kami lalu mengirim ringkasan pesanan otomatis ke WhatsApp dapur dalam satu klik.',
  },
];

export const BAKR_CONTACT = {
  whatsappNumber: '6281214261516',
  whatsappBaseUrl: 'https://wa.me/6281214261516',
  instagramHandle: '@bakr.smoke',
  instagramUrl: 'https://www.instagram.com/bakr.smoke/',
  mapsShareUrl: 'https://maps.app.goo.gl/aZanPjWnXTJW8u6C9?g_st=iw',
  mapsSearchQuery:
    'BAKR Smoke, Taman Cilegon Indah Cluster Helikonia C4 No.9, Sukmajaya, Jombang, Cilegon, Banten 42422',
} as const;

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

