import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Newspaper } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageGalleryViewer from "../components/ImageGalleryViewer";
import { API_BASE_URL } from "../data/config";
import { parseImageUrls } from "../utils/imageUtils";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setNews(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#cc1616]/30 border-t-[#cc1616] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 font-['Oswald'] tracking-[0.3em] text-xs uppercase">Yükleniyor</p>
        </div>
      </div>
    );
  }

  if (!news || news.error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center flex-col gap-6 px-4">
        <Newspaper size={48} className="text-neutral-700" />
        <p className="text-neutral-400 font-['Oswald'] tracking-widest text-lg uppercase">Haber Bulunamadı</p>
        <Link to="/" className="text-[#cc1616] hover:underline text-sm flex items-center gap-2">
          ← Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const dateStr = new Date(news.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const images = parseImageUrls(news.imageUrl);
  const coverImage = images[0] || null;

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen text-[var(--color-text-primary)] selection:bg-[#cc1616] selection:text-white transition-colors duration-300">
      <Navbar />

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {coverImage && (
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover filter blur-[100px] opacity-20 dark:opacity-30 dark:brightness-[0.25] brightness-[0.7] saturate-150 scale-125"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)]/85 via-[var(--color-bg-primary)]/95 to-[var(--color-bg-primary)]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* GERİ DÖN LİNKİ */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs uppercase tracking-wider font-semibold transition-all py-2 px-3.5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-border-light)] shadow-sm active:scale-95"
        >
          <ArrowLeft size={14} /> Ana Sayfaya Dön
        </Link>

        {/* RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* SOL: GÖRSEL / GALERİ */}
          <div className="lg:col-span-6 w-full lg:sticky lg:top-28">
            <ImageGalleryViewer
              images={images}
              title={news.title}
              aspectRatio="16/10"
              fallbackIcon={<Newspaper size={56} className="text-[var(--color-text-muted)]" />}
            />
          </div>

          {/* SAĞ: BAŞLIK, TARİH & İÇERİK */}
          <div className="lg:col-span-6 w-full flex flex-col">
            
            {/* ETİKET */}
            <div className="mb-3.5">
              <span className="inline-flex items-center gap-2 bg-[#cc1616]/10 border border-[#cc1616]/30 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase font-['Oswald'] text-[#cc1616]">
                <span className="w-2 h-2 rounded-full bg-[#cc1616] animate-pulse" />
                GÜNDEM
              </span>
            </div>

            {/* BAŞLIK */}
            <h1 className="font-['Oswald'] text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] leading-[1.15] mb-4 sm:mb-5 break-words">
              {news.title}
            </h1>

            {/* TARİH */}
            <div className="flex flex-wrap gap-2.5 mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
                <Calendar size={14} className="text-[#cc1616]" />
                <span>{dateStr}</span>
              </div>
            </div>

            {/* İÇERİK KARTI */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-8 backdrop-blur-md shadow-xl transition-colors duration-300">
              <h2 className="font-['Oswald'] text-lg sm:text-xl uppercase tracking-wider text-[var(--color-text-primary)] mb-4 flex items-center gap-3">
                <span className="w-6 h-0.5 bg-[#cc1616] rounded-full" />
                Haber Detayı
              </h2>
              <div className="text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base space-y-4 break-words font-sans">
                {news.content?.split("\n").map((p: string, i: number) =>
                  p.trim() ? <p key={i}>{p}</p> : null
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
