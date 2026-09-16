// DEMO verisi — gerçek haber bilgileriyle değiştirin

export interface NewsItem {
  id: number;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  link?: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    date: '8 Eylül 2026',
    category: 'Etkinlik',
    title: 'Kültür Forumumuz 500 Katılımcıyla Kapılarını Açtı',
    excerpt:
      'Turancı Dernekler Birliği\'nin bu yıl düzenlediği Kültür Forumu, Türk dünyasından gelen 500\'ü aşkın katılımcıyla gerçekleşti.',
    image: '/images/news1.jpg',
    link: '#',
  },
  {
    id: 2,
    date: '22 Ağustos 2026',
    category: 'Faaliyet',
    title: 'Geleneksel Sanatlar Festivali Büyük İlgi Gördü',
    excerpt:
      'Türk dünyasının geleneksel müzik ve dans topluluklarının sahne aldığı festival, on binlerce ziyaretçiyi ağırladı.',
    image: '/images/news2.jpg',
    link: '#',
  },
  {
    id: 3,
    date: '5 Ağustos 2026',
    category: 'Eğitim',
    title: 'Gençlik Akademisi\'nde Yeni Dönem Başladı',
    excerpt:
      'Türk Dünyası Gençlik Akademisi\'nin yeni dönemi, 18 farklı ülkeden 120 genç katılımcıyla yoğun bir eğitim programıyla başladı.',
    image: '/images/news3.jpg',
    link: '#',
  },
];
