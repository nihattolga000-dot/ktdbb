import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  CalendarCheck
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageGalleryViewer from "../components/ImageGalleryViewer";
import { API_BASE_URL } from "../data/config";
import { parseImageUrls } from "../utils/imageUtils";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [otherEvents, setOtherEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    // Seçili etkinliği getir
    fetch(`${API_BASE_URL}/api/events/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setEvent(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Diğer etkinlikleri getir
    fetch(`${API_BASE_URL}/api/events`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOtherEvents(data.filter((e: any) => e.id !== id).slice(0, 3));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setFormMessage("");

    try {
      // Backend /events/:id/register endpoint'ini kullanır
      const res = await fetch(`${API_BASE_URL}/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormStatus("success");
        setFormMessage(data.message || "Başvurunuz başarıyla alındı.");
        setName("");
        setPhone("");
        setEmail("");
      } else {
        setFormStatus("error");
        setFormMessage(data.error || "Başvuru kaydedilirken bir hata oluştu.");
      }
    } catch {
      setFormStatus("error");
      setFormMessage("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyiniz.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-3 border-[#cc1616]/20 border-t-[#cc1616] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)] font-['Oswald'] tracking-[0.25em] text-xs uppercase">
            Etkinlik Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!event || event.error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center flex-col gap-6 px-4">
        <div className="w-20 h-20 rounded-3xl bg-[#cc1616]/10 border border-[#cc1616]/20 flex items-center justify-center text-[#cc1616]">
          <Calendar size={36} />
        </div>
        <div className="text-center">
          <h2 className="text-[var(--color-text-primary)] font-['Oswald'] text-2xl uppercase tracking-wider mb-2">
            Etkinlik Bulunamadı
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm max-w-sm mb-6">
            Aradığınız etkinlik bulunamadı veya katılım süresi dolmuş olabilir.
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

  // Tarih Çözümleme (eventDate veya date veya createdAt)
  const rawDateStr = event.eventDate || event.date || event.createdAt;
  const evDate = rawDateStr ? new Date(rawDateStr) : new Date();
  const isValidDate = !isNaN(evDate.getTime());

  const dateStr = isValidDate
    ? evDate.toLocaleDateString("tr-TR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Tarih Belirtilmedi";

  const timeStr = isValidDate
    ? evDate.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Saat Belirtilmedi";

  const images = parseImageUrls(event.imageUrl);
  const isPast = isValidDate && evDate.getTime() < Date.now();

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen text-[var(--color-text-primary)] selection:bg-[#cc1616] selection:text-white transition-colors duration-300">
      <Navbar />

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#cc1616]/10 via-[#cc1616]/3 to-transparent blur-[130px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-36 sm:pt-40 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB & AKSİYON BARI */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <Link to="/" className="hover:text-[#cc1616] transition-colors font-medium">
              Ana Sayfa
            </Link>
            <ChevronRight size={14} className="opacity-50" />
            <Link to="/#etkinlikler" className="hover:text-[#cc1616] transition-colors font-medium">
              Etkinlikler
            </Link>
            <ChevronRight size={14} className="opacity-50" />
            <span className="text-[var(--color-text-primary)] font-semibold truncate max-w-[180px] sm:max-w-xs">
              {event.title}
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

        {/* FULL-WIDTH HEADER ALANI (Desktop ve Mobilde Asla Kesilmez) */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3.5">
            {isPast ? (
              <span className="inline-flex items-center gap-2 bg-neutral-500/10 border border-neutral-500/25 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase font-['Oswald'] text-[var(--color-text-secondary)]">
                <CheckCircle2 size={12} className="text-neutral-400" />
                GEÇMİŞ ETKİNLİK / TAMAMLANDI
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-[#cc1616]/10 border border-[#cc1616]/25 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase font-['Oswald'] text-[#cc1616]">
                <span className="w-2 h-2 rounded-full bg-[#cc1616] animate-pulse" />
                YAKLAŞAN ETKİNLİK
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-medium">
              <Calendar size={13} className="text-[#cc1616]" /> {dateStr}
            </span>
          </div>

          <h1 className="font-['Oswald'] text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] leading-[1.1] mb-6 break-words">
            {event.title}
          </h1>

          {/* HIZLI BİLGİ ROZETLERİ (TARİH, SAAT, MEKAN) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#cc1616]/10 text-[#cc1616] flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-bold">
                  Etkinlik Tarihi
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] truncate mt-0.5">
                  {dateStr}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#cc1616]/10 text-[#cc1616] flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-bold">
                  Başlama Saati
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] truncate mt-0.5">
                  {timeStr}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#cc1616]/10 text-[#cc1616] flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-bold">
                  Konum / Buluşma
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] truncate mt-0.5">
                  {event.location || "Kayseri"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ANA İKİLİ IZGARA (Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* SOL SÜTUN: GÖRSEL / GALERİ & ETKİNLİK DETAY AÇIKLAMASI (lg:col-span-7) */}
          <div className="lg:col-span-7 w-full flex flex-col gap-6">
            <ImageGalleryViewer
              images={images}
              title={event.title}
              aspectRatio="16/10"
              fallbackIcon={<CalendarCheck size={40} />}
            />

            {/* AÇIKLAMA METNİ KARTI */}
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-lg transition-colors duration-300">
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[var(--color-border)]">
                <span className="w-8 h-1 bg-[#cc1616] rounded-full" />
                <h2 className="font-['Oswald'] text-lg uppercase tracking-wider text-[var(--color-text-primary)] font-bold">
                  Etkinlik Programı ve Detayları
                </h2>
              </div>

              <div className="prose prose-neutral max-w-none text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base space-y-4 font-sans break-words">
                {event.description ? (
                  event.description.split("\n").map((p: string, i: number) =>
                    p.trim() ? (
                      <p key={i} className="text-justify sm:text-left leading-relaxed">
                        {p}
                      </p>
                    ) : null
                  )
                ) : (
                  <p className="text-[var(--color-text-muted)] italic">
                    Bu etkinlik için henüz detaylı açıklama metni girilmemiştir.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SAĞ SÜTUN: BAŞVURU FORMU VEYA BİLGİLENDİRME (lg:col-span-5) */}
          <div className="lg:col-span-5 w-full flex flex-col lg:sticky lg:top-28">
            {isPast ? (
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-8 shadow-lg text-center transition-colors duration-300">
                <div className="w-16 h-16 rounded-2xl bg-neutral-500/10 border border-neutral-500/20 text-neutral-400 flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} />
                </div>
                <h3 className="font-['Oswald'] text-xl uppercase tracking-wider text-[var(--color-text-primary)] mb-2 font-bold">
                  Etkinlik Tamamlandı
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
                  Bu etkinliğin tarihi sona ermiştir ve yeni katılım başvurusu kabul edilmemektedir. Güncel faaliyetlerimiz için ajandamızı takip edebilirsiniz.
                </p>
                <Link
                  to="/#etkinlikler"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] text-xs font-['Oswald'] uppercase tracking-wider font-bold hover:bg-[#cc1616] hover:text-white transition-all"
                >
                  Tüm Etkinliklere Göz At
                </Link>
              </div>
            ) : (
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-xl transition-colors duration-300">
                <div className="bg-gradient-to-r from-[#cc1616]/10 to-transparent border-b border-[var(--color-border)] p-6">
                  <div className="flex items-center gap-2 text-[#cc1616] font-['Oswald'] text-xs font-bold uppercase tracking-widest mb-1">
                    <Sparkles size={14} /> KATILIM ÜCRETSİZDİR
                  </div>
                  <h3 className="font-['Oswald'] text-2xl uppercase tracking-wider text-[var(--color-text-primary)] font-bold">
                    Etkinliğe Başvur
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-xs mt-1">
                    Lütfen katılım formunu eksiksiz doldurunuz.
                  </p>
                </div>

                <div className="p-6 sm:p-7">
                  {formStatus === "success" ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={36} />
                      </div>
                      <h4 className="text-emerald-500 font-['Oswald'] uppercase tracking-wider text-xl font-bold mb-2">
                        Başvurunuz Alındı!
                      </h4>
                      <p className="text-[var(--color-text-secondary)] text-sm max-w-sm mx-auto">
                        {formMessage}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      {formStatus === "error" && (
                        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-500 text-xs">
                          <AlertCircle size={18} className="shrink-0 mt-0.5" />
                          <span>{formMessage}</span>
                        </div>
                      )}

                      <FormField
                        label="Ad Soyad"
                        id="f-name"
                        type="text"
                        value={name}
                        onChange={setName}
                        placeholder="Adınız Soyadınız"
                        required
                      />

                      <FormField
                        label="Telefon"
                        id="f-phone"
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="05XX XXX XX XX"
                        required
                      />

                      <FormField
                        label="E-posta"
                        id="f-email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="ornek@mail.com"
                        required
                      />

                      <button
                        type="submit"
                        disabled={formStatus === "submitting"}
                        className="mt-2 w-full py-4 px-6 rounded-2xl font-['Oswald'] font-bold text-sm uppercase tracking-widest text-white bg-gradient-to-r from-[#cc1616] to-[#a01010] hover:from-[#e01818] hover:to-[#b51212] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#cc1616]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                      >
                        {formStatus === "submitting" ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Kaydediliyor...</span>
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Başvuruyu Tamamla</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DİĞER ETKİNLİKLER (ALT ÖNERİ ALANI) */}
        {otherEvents.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[#cc1616] font-['Oswald'] text-xs font-bold uppercase tracking-widest">
                  FAALİYET PROGRAMI
                </span>
                <h3 className="font-['Oswald'] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[var(--color-text-primary)]">
                  Diğer Faaliyetlerimiz
                </h3>
              </div>
              <Link
                to="/#etkinlikler"
                className="text-xs font-semibold text-[#cc1616] hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                Tümünü Gör <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherEvents.map((ev) => {
                const evImgs = parseImageUrls(ev.imageUrl);
                const evCover = evImgs[0] || null;
                const oDate = ev.eventDate || ev.date || ev.createdAt;
                const otherDate = oDate ? new Date(oDate).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                }) : "";

                return (
                  <Link
                    key={ev.id}
                    to={`/etkinlik/${ev.id}`}
                    className="group bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[#cc1616]/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg-elevated)] min-h-[160px]">
                      {evCover ? (
                        <img
                          src={evCover}
                          alt={ev.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                          <CalendarCheck size={32} />
                        </div>
                      )}
                      {otherDate && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10">
                          {otherDate}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-['Oswald'] text-lg font-bold uppercase tracking-tight text-[var(--color-text-primary)] group-hover:text-[#cc1616] transition-colors line-clamp-2 mb-2">
                          {ev.title}
                        </h4>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                          {ev.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#cc1616]" /> {ev.location || "Kayseri"}
                        </span>
                        <span className="text-[#cc1616] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Katıl <ChevronRight size={12} />
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

function FormField({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl px-4 py-3.5 text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[#cc1616] focus:ring-1 focus:ring-[#cc1616]/50 transition-all shadow-inner"
      />
    </div>
  );
}
