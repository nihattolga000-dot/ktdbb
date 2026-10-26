import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Activity, 
  Share2, 
  Check, 
  Sparkles, 
  ChevronRight,
  FolderGit2
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageGalleryViewer from "../components/ImageGalleryViewer";
import { API_BASE_URL } from "../data/config";
import { parseImageUrls } from "../utils/imageUtils";

function getStatus(s: string) {
  if (s === "ONGOING") {
    return {
      label: "Devam Ediyor",
      color: "#16a34a",
      bg: "rgba(22, 163, 74, 0.12)",
      border: "rgba(22, 163, 74, 0.28)",
      dotColor: "#22c55e"
    };
  }
  if (s === "COMPLETED") {
    return {
      label: "Tamamlandı",
      color: "#2563eb",
      bg: "rgba(37, 99, 235, 0.12)",
      border: "rgba(37, 99, 235, 0.28)",
      dotColor: "#3b82f6"
    };
  }
  return {
    label: "Planlanıyor",
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.12)",
    border: "rgba(217, 119, 6, 0.28)",
    dotColor: "#f59e0b"
  };
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [otherProjects, setOtherProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    // Seçili projeyi getir
    fetch(`${API_BASE_URL}/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProject(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Diğer projeleri getir
    fetch(`${API_BASE_URL}/api/projects`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOtherProjects(data.filter((p: any) => p.id !== id).slice(0, 3));
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
            Proje Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!project || project.error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center flex-col gap-6 px-4">
        <div className="w-20 h-20 rounded-3xl bg-[#cc1616]/10 border border-[#cc1616]/20 flex items-center justify-center text-[#cc1616]">
          <Activity size={36} />
        </div>
        <div className="text-center">
          <h2 className="text-[var(--color-text-primary)] font-['Oswald'] text-2xl uppercase tracking-wider mb-2">
            Proje Bulunamadı
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm max-w-sm mb-6">
            Aradığınız proje yayından kaldırılmış veya bağlantı adresi değişmiş olabilir.
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

  const st = getStatus(project.status);
  const dateStr = new Date(project.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const images = parseImageUrls(project.imageUrl);

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen text-[var(--color-text-primary)] selection:bg-[#cc1616] selection:text-white transition-colors duration-300">
      <Navbar />

      {/* AMBIENT BACKGROUND GLOW (Açık ve Koyu Temada Premium Atmosfer) */}
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
            <Link to="/#projeler" className="hover:text-[#cc1616] transition-colors font-medium">
              Projeler
            </Link>
            <ChevronRight size={14} className="opacity-50" />
            <span className="text-[var(--color-text-primary)] font-semibold truncate max-w-[200px] sm:max-w-xs">
              {project.title}
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
          
          {/* SOL SÜTUN: GÖRSEL / GALERİ & PROJE ÖZET BİLGİLERİ (lg:col-span-5) */}
          <div className="lg:col-span-5 w-full flex flex-col gap-6 lg:sticky lg:top-28">
            <ImageGalleryViewer
              images={images}
              title={project.title}
              aspectRatio="16/10"
              fallbackIcon={<FolderGit2 size={40} />}
            />

            {/* PROJE KÜNYESİ (BİLGİ KARTI) */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm transition-colors duration-300">
              <h3 className="font-['Oswald'] text-sm uppercase tracking-wider text-[var(--color-text-primary)] font-bold mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[#cc1616]" />
                Proje Künyesi
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-muted)] font-medium">Proje Durumu</span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[11px]"
                    style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dotColor }} />
                    {st.label}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-muted)] font-medium">Yayın Tarihi</span>
                  <span className="text-[var(--color-text-primary)] font-semibold flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#cc1616]" />
                    {dateStr}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-muted)] font-medium">Yürütücü Kurum</span>
                  <span className="text-[var(--color-text-primary)] font-semibold">
                    Kayseri TDB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ SÜTUN: BAŞLIK, ROZETLER & DETAYLI AÇIKLAMA METNİ (lg:col-span-7) */}
          <div className="lg:col-span-7 w-full flex flex-col">
            
            {/* ETİKETLER */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="inline-flex items-center gap-2 bg-[#cc1616]/10 border border-[#cc1616]/25 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase font-['Oswald'] text-[#cc1616]">
                <span className="w-2 h-2 rounded-full bg-[#cc1616] animate-pulse" />
                KTDB PROJESİ
              </span>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-wider uppercase font-['Oswald']"
                style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}
              >
                {st.label}
              </span>
            </div>

            {/* PROJE BAŞLIĞI */}
            <h1 className="font-['Oswald'] text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] leading-[1.12] mb-6 break-words">
              {project.title}
            </h1>

            {/* PROJE AÇIKLAMASI (EDİTÖRYAL İÇERİK KARTI) */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-10 shadow-lg transition-colors duration-300">
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-[var(--color-border)]">
                <span className="w-8 h-1 bg-[#cc1616] rounded-full" />
                <h2 className="font-['Oswald'] text-lg uppercase tracking-wider text-[var(--color-text-primary)] font-bold">
                  Proje Kapsamı ve Raporu
                </h2>
              </div>

              {/* METİN BÖLÜMÜ */}
              <div className="prose prose-neutral max-w-none text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base space-y-5 font-sans break-words">
                {project.description ? (
                  project.description.split("\n").map((p: string, i: number) =>
                    p.trim() ? (
                      <p key={i} className="text-justify sm:text-left leading-relaxed">
                        {p}
                      </p>
                    ) : null
                  )
                ) : (
                  <p className="text-[var(--color-text-muted)] italic">
                    Bu proje hakkında detaylı açıklama metni henüz eklenmemiştir.
                  </p>
                )}
              </div>

              {/* DİPNOT / DAYANIŞMA METNİ */}
              <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--color-bg-elevated)]/40 rounded-2xl p-5">
                <div>
                  <p className="font-['Oswald'] text-sm uppercase tracking-wider text-[var(--color-text-primary)] font-bold">
                    Turan Ülküsü İçin Çalışıyoruz
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Projelerimize katılmak veya destek vermek için derneğimizle iletişime geçebilirsiniz.
                  </p>
                </div>
                <Link
                  to="/#iletisim"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#cc1616] text-white text-xs font-['Oswald'] uppercase tracking-wider font-bold hover:bg-[#a81010] transition-colors shrink-0"
                >
                  İletişime Geç
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* DİĞER PROJELERİMİZ (ALT ÖNERİ ALANI) */}
        {otherProjects.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[#cc1616] font-['Oswald'] text-xs font-bold uppercase tracking-widest">
                  KEŞFETMEYE DEVAM EDİN
                </span>
                <h3 className="font-['Oswald'] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[var(--color-text-primary)]">
                  Diğer Projelerimiz
                </h3>
              </div>
              <Link
                to="/#projeler"
                className="text-xs font-semibold text-[#cc1616] hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                Tümünü Gör <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProjects.map((p) => {
                const pImages = parseImageUrls(p.imageUrl);
                const pCover = pImages[0] || null;
                const pStatus = getStatus(p.status);

                return (
                  <Link
                    key={p.id}
                    to={`/proje/${p.id}`}
                    className="group bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[#cc1616]/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-elevated)]">
                      {pCover ? (
                        <img
                          src={pCover}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                          <FolderGit2 size={32} />
                        </div>
                      )}
                      <span
                        className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full backdrop-blur-md"
                        style={{ background: pStatus.bg, color: pStatus.color, border: `1px solid ${pStatus.border}` }}
                      >
                        {pStatus.label}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-['Oswald'] text-lg font-bold uppercase tracking-tight text-[var(--color-text-primary)] group-hover:text-[#cc1616] transition-colors line-clamp-2 mb-2">
                          {p.title}
                        </h4>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                        <span>{new Date(p.createdAt).toLocaleDateString("tr-TR")}</span>
                        <span className="text-[#cc1616] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          İncele <ChevronRight size={12} />
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
