// DEMO verisi — gerçek proje bilgileriyle değiştirin

export interface Project {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  link?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    category: 'Gençlik Projeleri',
    title: 'Türk Dünyası Gençlik Akademisi',
    description:
      'Türk dünyası ülkelerinden genç liderleri bir araya getiren, liderlik ve kültürel diyalog becerilerini geliştiren kapsamlı eğitim programı.',
    image: '/images/project_youth.jpg',
    link: '#',
  },
  {
    id: 2,
    category: 'Kültür Projeleri',
    title: 'Ortak Miras Sergisi',
    description:
      'Türk dünyasının geleneksel el sanatları, müzik ve edebiyatını modern bir platformda buluşturan kapsamlı kültür sergisi projesi.',
    image: '/images/project_culture.jpg',
    link: '#',
  },
  {
    id: 3,
    category: 'Türk Dünyası Buluşmaları',
    title: 'Uluslararası Türk Dünyası Zirvesi',
    description:
      'Türk dünyası ülkelerinden sivil toplum temsilcileri, akademisyenler ve kanaat önderlerinin bir araya geldiği yıllık uluslararası zirve.',
    image: '/images/project_world.jpg',
    link: '#',
  },
  {
    id: 4,
    category: 'Sosyal Sorumluluk Projeleri',
    title: 'Dayanışma Eli Programı',
    description:
      'İhtiyaç sahibi topluluklara gönüllü destek sağlayan, eğitim ve sosyal yardım odaklı kapsamlı sosyal sorumluluk girişimi.',
    image: '/images/project_social.jpg',
    link: '#',
  },
];
