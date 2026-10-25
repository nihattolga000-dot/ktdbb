import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, MapPin, ArrowLeft, Calendar, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageGalleryViewer from "../components/ImageGalleryViewer";
import { API_BASE_URL } from "../data/config";
import { parseImageUrls } from "../utils/imageUtils";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setEvent(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormMessage("Başvurunuz alındı, sizi bekliyoruz!");
        setName("");
        setPhone("");
        setEmail("");
      } else {
        const d = await res.json();
        setFormStatus("error");
        setFormMessage(d.error || "Bir hata oluştu.");
      }
    } catch {
      setFormStatus("error");
      setFormMessage("Sunucu bağlantı hatası.");
    }
  };

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

  if (!event || event.error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center flex-col gap-6 px-4">
        <Calendar size={48} className="text-neutral-700" />
        <p className="text-neutral-400 font-['Oswald'] tracking-widest text-lg uppercase">Etkinlik Bulunamadı</p>
        <Link to="/" className="text-[#cc1616] hover:underline text-sm flex items-center gap-2">
          ← Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const evDate = new Date(event.eventDate);
  const dateStr = evDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = evDate.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const images = parseImageUrls(event.imageUrl);
  const coverImage = images[0] || null;
  const isPast = evDate.getTime() < Date.now();

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
          
          {/* SOL: GÖRSEL / GALERİ & HAKKINDA BİLGİSİ */}
          <div className="lg:col-span-6 w-full flex flex-col gap-6">
            <ImageGalleryViewer
              images={images}
              title={event.title}
              aspectRatio="4/3"
              fallbackIcon={<Calendar size={56} className="text-[var(--color-text-muted)]" />}
            />

            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-8 backdrop-blur-md shadow-xl transition-colors duration-300">
              <h2 className="font-['Oswald'] text-lg sm:text-xl uppercase tracking-wider text-[var(--color-text-primary)] mb-4 flex items-center gap-3">
                <span className="w-6 h-0.5 bg-[#cc1616] rounded-full" />
                Etkinlik Hakkında
              </h2>
              <div className="text-[var(--color-text-secondary)] leading-relaxed text-sm sm:text-base space-y-4 break-words font-sans">
                {event.description?.split("\n").map((p: string, i: number) =>
                  p.trim() ? <p key={i}>{p}</p> : null
                )}
              </div>
            </div>
          </div>

          {/* SAĞ: BAŞLIK, ROZETLER & KATILIM FORMU */}
          <div className="lg:col-span-6 w-full flex flex-col">
            
            {/* ETİKET */}
            <div className="mb-3.5">
              {isPast ? (
                <span className="inline-flex items-center gap-2 bg-neutral-500/10 border border-neutral-500/30 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase font-['Oswald'] text-[var(--color-text-secondary)]">
                  <CheckCircle2 size={12} className="text-neutral-400" />
                  GEÇMİŞ ETKİNLİK / TAMAMLANDI
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 bg-[#cc1616]/10 border border-[#cc1616]/30 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase font-['Oswald'] text-[#cc1616]">
                  <span className="w-2 h-2 rounded-full bg-[#cc1616] animate-pulse" />
                  YAKLAŞAN ETKİNLİK
                </span>
              )}
            </div>

            {/* BAŞLIK */}
            <h1 className="font-['Oswald'] text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[var(--color-text-primary)] leading-[1.15] mb-4 sm:mb-5 break-words">
              {event.title}
            </h1>

            {/* TARİH, SAAT, KONUM BİLGİLERİ */}
            <div className="flex flex-wrap gap-2.5 mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
                <Calendar size={14} className="text-[#cc1616]" />
                <span>{dateStr}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
                <Clock size={14} className="text-[#cc1616]" />
                <span>{timeStr}</span>
              </div>
              {event.location && (
                <div className="inline-flex items-center gap-2 bg-[#cc1616]/10 border border-[#cc1616]/30 rounded-xl px-3.5 py-2 text-xs font-medium text-[#cc1616] shadow-sm">
                  <MapPin size={14} className="text-[#cc1616]" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* BAŞVURU FORMU VEYA TAMAMLANDI MESAJI */}
            {isPast ? (
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-xl text-center">
                <div className="w-14 h-14 rounded-2xl bg-neutral-500/10 border border-neutral-500/20 text-neutral-400 flex items-center justify-center mx-auto mb-4">
                  <Clock size={28} />
                </div>
                <h3 className="font-['Oswald'] text-xl uppercase tracking-wider text-[var(--color-text-primary)] mb-2">
                  Etkinlik Tamamlandı
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm max-w-md mx-auto leading-relaxed">
                  Bu etkinliğin tarihi sona ermiştir ve yeni katılım başvurusu kabul edilmemektedir. Güncel etkinliklerimiz için ajandamızı takip edebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md transition-colors duration-300">
                <div className="bg-gradient-to-r from-[#cc1616]/15 to-transparent border-b border-[var(--color-border)] p-5 sm:p-7">
                  <h3 className="font-['Oswald'] text-xl sm:text-2xl uppercase tracking-wider text-[var(--color-text-primary)] mb-1">
                    Etkinliğe Başvur
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-xs sm:text-sm">Lütfen katılım formunu eksiksiz doldurun.</p>
                </div>

              <div className="p-5 sm:p-7">
                {formStatus === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle2 size={52} className="text-emerald-500 mx-auto mb-4" />
                    <h4 className="text-emerald-500 font-['Oswald'] uppercase tracking-wider text-xl mb-2">
                      Başvurunuz Alındı!
                    </h4>
                    <p className="text-[var(--color-text-secondary)] text-sm max-w-sm mx-auto">{formMessage}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                    {formStatus === "error" && (
                      <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-500 text-xs">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{formMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>

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
                      className="mt-2 w-full py-3.5 sm:py-4 px-6 rounded-xl font-['Oswald'] font-bold text-sm uppercase tracking-widest text-white bg-gradient-to-r from-[#cc1616] to-[#a01010] hover:from-[#e01818] hover:to-[#b51212] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#cc1616]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                    >
                      {formStatus === "submitting" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Başvuruyu Gönder
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
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
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
        className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[#cc1616] focus:ring-1 focus:ring-[#cc1616]/50 transition-all"
      />
    </div>
  );
}
