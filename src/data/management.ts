export interface ManagementMember {
  id: string;
  name: string;
  role: string;
  image?: string;
}

// İl Başkanı
export const presidentMember: ManagementMember = {
  id: 'baskan-1',
  name: 'Rabia COŞKUN',
  role: 'İl Başkanı',
  image: '/images/661439943_18087937406581627_3186380093622717994_n.jpg',
};

// Başkan Yardımcıları
export const vicePresidents: ManagementMember[] = [
  {
    id: 'baskan-yrd-1',
    name: 'Ayşe COŞKUN',
    role: 'Başkan Yardımcısı',
    image: '', // Örn: '/images/baskan-yardimcisi-1.jpg'
  },
  {
    id: 'baskan-yrd-2',
    name: 'Fatih Efe ÖZDEMİR',
    role: 'Başkan Yardımcısı',
    image: '',
  },
  {
    id: 'baskan-yrd-3',
    name: 'Mustafa KÖŞK',
    role: 'Başkan Yardımcısı',
    image: '/images/mustafa_kosk.jpeg',
  },
];

// Genel Yönetim Üyeleri
export const generalBoardMembers: ManagementMember[] = [
  {
    id: 'yonetim-1',
    name: 'Doğan BAYHAN',
    role: 'Genel Yönetim Üyesi',
    image: '/images/dogan_bayhan.jpeg',
  },
  {
    id: 'yonetim-2',
    name: 'Ömer TEKE',
    role: 'Genel Yönetim Üyesi',
    image: '',
  },
  {
    id: 'yonetim-3',
    name: 'Ali KALAY',
    role: 'Genel Yönetim Üyesi',
    image: '',
  },
  {
    id: 'yonetim-4',
    name: 'Taha TUTUŞ',
    role: 'Genel Yönetim Üyesi',
    image: '',
  },
  {
    id: 'yonetim-5',
    name: 'Enes DEMİR',
    role: 'Genel Yönetim Üyesi',
    image: '/images/enes_demirv2.jpeg',
  },
  {
    id: 'yonetim-6',
    name: 'Akif UYUMAZ',
    role: 'Genel Yönetim Üyesi',
    image: '',
  },
  {
    id: 'yonetim-7',
    name: 'Alperen DOĞAN',
    role: 'Genel Yönetim Üyesi',
    image: '',
  },

];

