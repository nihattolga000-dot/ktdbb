// DEMO verisi — gerçek galeri fotoğraflarıyla değiştirin

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
  category: string;
}

// Galeri için proje görsellerini tekrar kullanıyoruz (demo amaçlı)
export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: '/images/project_culture.jpg',
    alt: 'Kültürel Miras Sergisi',
    caption: 'Kültürel Miras Sergisi',
    category: 'Kültür',
  },
  {
    id: 2,
    src: '/images/project_youth.jpg',
    alt: 'Gençlik Akademisi',
    caption: 'Gençlik Akademisi',
    category: 'Gençlik',
  },
  {
    id: 3,
    src: '/images/project_world.jpg',
    alt: 'Türk Dünyası Zirvesi',
    caption: 'Türk Dünyası Zirvesi',
    category: 'Etkinlik',
  },
  {
    id: 4,
    src: '/images/project_social.jpg',
    alt: 'Sosyal Sorumluluk Projesi',
    caption: 'Sosyal Sorumluluk Projesi',
    category: 'Sosyal',
  },
  {
    id: 5,
    src: '/images/news2.jpg',
    alt: 'Kültür Festivali',
    caption: 'Kültür Festivali',
    category: 'Etkinlik',
  },
  {
    id: 6,
    src: '/images/news1.jpg',
    alt: 'Kültür Forumu',
    caption: 'Kültür Forumu',
    category: 'Etkinlik',
  },
  {
    id: 7,
    src: '/images/news3.jpg',
    alt: 'Eğitim Atölyesi',
    caption: 'Eğitim Atölyesi',
    category: 'Eğitim',
  },
  {
    id: 8,
    src: '/images/about_image.jpg',
    alt: 'Yönetim Kurulu Toplantısı',
    caption: 'Yönetim Kurulu Toplantısı',
    category: 'Kurumsal',
  },
];
