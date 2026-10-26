import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Newspaper, 
  Share2, 
  Check, 
  ChevronRight,
  Clock,
  Sparkles
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageGalleryViewer from "../components/ImageGalleryViewer";
import { API_BASE_URL } from "../data/config";
import { parseImageUrls } from "../utils/imageUtils";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [otherNews, setOtherNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    // Seçili haberi getir
    fetch(`${API_BASE_URL}/api/news/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setNews(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Diğer haberleri getir
    fetch(`${API_BASE_URL}/api/news`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOtherNews(data.filter((n: any) => n.id !== id).slice(0, 3));
        }
      })
      .catch(() => {});
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-3 border-[#cc1616]/20 border-t-[#cc1616] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)] font-['Oswald'] tracking-[0.25em] text-xs uppercase">
            Haber Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!news || news.error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center flex-col gap-6 px-4">
        <div className="w-20 h-20 rounded-3xl bg-[#cc1616]/10 border border-[#cc1616]/20 flex items-center justify-center text-[#cc1616]">
          <Newspaper size={36} />
        </div>
        <div className="text-center">
          <h2 className="text-[var(--color-text-primary)] font-['Oswald'] text-2xl uppercase tracking-wider mb-2">
            Haber Bulunamadı
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm max-w-sm mb-6">
            Aradığınız haber yayından kaldırılmış veya bağlantı adresi değişmiş olabilir.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#cc1616] text-white font-['Oswald'] text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#cc1616]/25 hover:bg-[#a81010] transition-all"
          >
            <ArrowLeft size={16} /> Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Date(news.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const images = parseImageUrls(news.imageUrl);
  
  // Tahmini okuma süresi
  const wordCount = news.content ? news.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen text-[var(--color-text-primary)] selection:bg-[#cc1616] selection:text-white transition-colors duration-300">
      <Navbar />

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#cc1616]/10 via-[#cc1616]/3 to-transparent blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB & GERİ DÖNÜŞ ÇUBUĞU */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Link to="/" className="hover:text-[#cc1616] transition-colors font-medium">
              Ana Sayfa
            </Link>
            <ChevronRight size={14} className="opacity-50" />
            <Link to="/#haberler" className="hover:text-[#cc1616] transition-colors font-medium">
              Haberler
            </Link>
            <ChevronRight size={14} className="opacity-50" />
            <span className="text-[var(--color-text-primary)] font-semibold truncate max-w-[200px] sm:max-w-xs">
              {news.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[#cc1616] hover:border-[#cc1616]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Bağlantıyı Kopyala"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              <span>{copied ? "Kopyalandı!" : "Paylaş"}</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all shadow-sm active:scale-95"
            >
              <ArrowLeft size={14} /> <span>Geri</span>
            </Link>
          </div>
        </div>

        {/* ANA İKİLİ IZGARA (Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* SOL SÜTUN: GÖRSEL / GALERİ & HABER BİLGİ KARTI (lg:col-span-5) */}
          <div className="lg:col-span-5 w-full flex flex-col gap-6 lg:sticky lg:top-28">
            <ImageGalleryViewer
              images={images}
              title={news.title}
              aspectRatio="16/10"
              fallbackIcon={<Newspaper size={40} />}
            />

            {/* BİLGİ KARTI */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm transition-colors duration-300">
              <h3 className="font-['Oswald'] text-sm uppercase tracking-wider text-[var(--color-text-primary)] font-bold mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[#cc1616]" />
                Haber Bilgileri
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-muted)] font-medium">Yayın Tarihi</span>
                  <span className="text-[var(--color-text-primary)] font-semibold flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#cc1616]" />
                    {dateStr}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-muted)] font-medium">Okuma Süresi</span>
                  <span className="text-[var(--color-text-primary)] font-semibold flex items-center gap-1.5">
                    <Clock size={13} className="text-[#cc1616]" />
                    ~{readTime} dakika
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)] font-medium">Haber Kaynağı</span>
                  <span className="text-[var(--color-text-primary)] font-semibold">
                    KTDB Basın Masası
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ SÜTUN: BAŞLIK, ETİKETLER & DETAYLI HABER METNİ (lg:col-span-7) */}
          <div className="lg:col-span-7 w-full flex flex-col">
            
            {/* ETİKETLER */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="inline-flex items-center gap-2 bg-[#cc1616]/10 border border-[#cc1616]/25 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase font-['Oswald'] text-[#cc1616]">
                <span className="w-2 h-2 rounded-full bg-[#cc1616] animate-pulse" />
                KTDB GÜNDEM
              </span>
              <span className="inline-flex items-center gap-1 text-[var(--color-text-muted)] text-xs font-medium">
                <Calendar size={13} /> {dateStr}
              </span>
            </div>

            {/* HABER BAŞLIĞI */}
            <h1 className="font-['Oswald'] text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] leading-[1.12] mb-6 break-words">
              {news.title}
            </h1>

            {/* HABER İÇERİK KARTI */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-10 shadow-lg transition-colors duration-300">
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-[var(--color-border)]">
                <span className="w-8 h-1 bg-[#cc1616] rounded-full" />
                <h2 className="font-['Oswald'] text-lg uppercase tracking-wider text-[var(--color-text-primary)] font-bold">
                  Haber Metni
                </h2>
              </div>

              {/* METİN BÖLÜMÜ */}
              <div className="prose prose-neutral max-w-none text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base space-y-5 font-sans break-words">
                {news.content ? (
                  news.content.split("\n").map((p: string, i: number) =>
                    p.trim() ? (
                      <p key={i} className="text-justify sm:text-left leading-relaxed">
                        {p}
                      </p>
                    ) : null
                  )
                ) : (
                  <p className="text-[var(--color-text-muted)] italic">
                    Bu haber için henüz detaylı içerik girilmemiştir.
                  </p>
                )}
              </div>

              {/* DİPNOT / BÜLTEN KUTUSU */}
              <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--color-bg-elevated)]/40 rounded-2xl p-5">
                <div>
                  <p className="font-['Oswald'] text-sm uppercase tracking-wider text-[var(--color-text-primary)] font-bold">
                    Kayseri Turancı Dernekler Birliği
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Gelişmelerden ve duyurulardan haberdar olmak için bizi takip edin.
                  </p>
                </div>
                <Link
                  to="/#faaliyetler"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#cc1616] text-white text-xs font-['Oswald'] uppercase tracking-wider font-bold hover:bg-[#a81010] transition-colors shrink-0"
                >
                  Faaliyetlerimizi İncele
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* DİĞER HABERLER (ALT ÖNERİ ALANI) */}
        {otherNews.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[#cc1616] font-['Oswald'] text-xs font-bold uppercase tracking-widest">
                  GÜNCEL GELİŞMELER
                </span>
                <h3 className="font-['Oswald'] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[var(--color-text-primary)]">
                  Son Haberler & Duyurular
                </h3>
              </div>
              <Link
                to="/#haberler"
                className="text-xs font-semibold text-[#cc1616] hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                Tümünü Gör <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherNews.map((n) => {
                const nImages = parseImageUrls(n.imageUrl);
                const nCover = nImages[0] || null;

                return (
                  <Link
                    key={n.id}
                    to={`/haber/${n.id}`}
                    className="group bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[#cc1616]/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-elevated)]">
                      {nCover ? (
                        <img
                          src={nCover}
                          alt={n.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                          <Newspaper size={32} />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10">
                        HABER
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-['Oswald'] text-lg font-bold uppercase tracking-tight text-[var(--color-text-primary)] group-hover:text-[#cc1616] transition-colors line-clamp-2 mb-2">
                          {n.title}
                        </h4>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                          {n.content}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                        <span>{new Date(n.createdAt).toLocaleDateString("tr-TR")}</span>
                        <span className="text-[#cc1616] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Oku <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
