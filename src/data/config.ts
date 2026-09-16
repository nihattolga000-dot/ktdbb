// ============================================================
// Site Konfigürasyon Dosyası — Kayseri Turancı Dernekler Birliği
// Buradan iletişim bilgileri ve sosyal medya linklerini
// kolayca güncelleyebilirsiniz.
// ============================================================

export const siteConfig = {
  name: 'Kayseri Turancı Dernekler Birliği',
  shortName: 'KTDB',
  tagline: 'Türk Dünyası İçin Birlikte',
  city: 'Kayseri',
  description:
    'Kayseri Turancı Dernekler Birliği; Türk dünyası arasındaki kültürel, sosyal ve gönüllü bağları güçlendirmek, ortak değerleri yaşatmak ve gelecek nesillere aktarmak amacıyla Kayseri\'de çalışmalar yürütür.',
  url: 'https://kayserituranci.org',
} as const;

export const contactConfig = {
  address: 'Kayseri, Türkiye',
  phone: 'Bilgi eklenecek',
  email: 'kayseritdb@gmail.com ',
  workHours: 'Pazartesi – Cuma: 09:00 – 18:00',
} as const;

export const socialConfig = {
  instagram: 'https://www.instagram.com/tdb.kayserii/',
  twitter: 'https://x.com/tdbkayseri',
} as const;

// İstatistikler — kolayca güncellenebilir
export const statsConfig = [
  { value: 80, label: 'Etkinlik', suffix: '+' },
  { value: 25, label: 'Proje', suffix: '+' },
  { value: 1200, label: 'Gönüllü', suffix: '+' },
  { value: 12, label: 'İlçe', suffix: '+' },
] as const;
