// ============================================================
// Site Konfigürasyon Dosyası — Kayseri Turancı Dernekler Birliği
// Buradan iletişim bilgileri ve sosyal medya linklerini
// kolayca güncelleyebilirsiniz.
// ============================================================

/**
 * API sunucusunun base URL'i.
 * - Geliştirme: .env.local dosyasında VITE_API_URL=http://localhost:5000
 * - Canlı sunucu: .env.production dosyasında VITE_API_URL=https://kayseritdb.com.tr
 *   (veya boş bırakırsanız aynı origin'den /api/... olarak istek atar)
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL ?? '';

export const siteConfig = {
  name: 'Kayseri Turancı Dernekler Birliği',
  shortName: 'KTDB',
  tagline: 'Türk Dünyası İçin Birlikte',
  city: 'Kayseri',
  description:
    'Kayseri Turancı Dernekler Birliği; Türk dünyası arasındaki kültürel, sosyal ve gönüllü bağları güçlendirmek, ortak değerleri yaşatmak ve gelecek nesillere aktarmak amacıyla Kayseri\'de çalışmalar yürütür.',
  url: 'https://kayseritdb.com.tr',
} as const;

export const contactConfig = {
  address: 'Kayseri, Türkiye',
  phone: 'Bilgi eklenecek',
  email: 'kayseritdb@gmail.com ',
  workHours: 'Pazartesi – Cuma: 09:00 – 18:00',
} as const;

export const socialConfig = {
  instagram: 'https://www.instagram.com/tdb.kayserii/',
  twitter: 'https://x.com/tdbkayserii?s=11',
} as const;

// İstatistikler — kolayca güncellenebilir
export const statsConfig = [
  { value: 80, label: 'Etkinlik', suffix: '+' },
  { value: 25, label: 'Proje', suffix: '+' },
  { value: 1200, label: 'Gönüllü', suffix: '+' },
  { value: 12, label: 'İlçe', suffix: '+' },
] as const;
