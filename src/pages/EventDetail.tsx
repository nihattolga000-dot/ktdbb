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

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen text-neutral-100 selection:bg-[#cc1616] selection:text-white">
      <Navbar />

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {coverImage && (
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover filter blur-[90px] brightness-[0.18] saturate-150 scale-125"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/80 to-[#070709]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        {/* GERİ DÖN LİNKİ */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-neutral-400 hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors py-1.5 px-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10"
        >
          <ArrowLeft size={14} /> Ana Sayfaya Dön
        </Link>

        {/* RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* SOL: GÖRSEL / GALERİ & HAKKINDA BİLGİSİ */}
          <div className="lg:col-span-6 w-full flex flex-col gap-6">
            <ImageGalleryViewer
              images={images}
              title={event.title}
              aspectRatio="4/3"
              fallbackIcon={<Calendar size={56} className="text-neutral-700" />}
            />

            <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
              <h2 className="font-['Oswald'] text-lg sm:text-xl uppercase tracking-wider text-white mb-4 flex items-center gap-3">
                <span className="w-6 h-0.5 bg-[#cc1616] rounded-full" />
                Etkinlik Hakkında
              </h2>
              <div className="text-neutral-300/90 leading-relaxed text-sm sm:text-base space-y-4 break-words">
                {event.description?.split("\n").map((p: string, i: number) =>
                  p.trim() ? <p key={i}>{p}</p> : null
                )}
              </div>
            </div>
          </div>

          {/* SAĞ: BAŞLIK, ROZETLER & KATILIM FORMU */}
          <div className="lg:col-span-6 w-full flex flex-col">
            
            {/* ETİKET */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 bg-[#cc1616]/15 border border-[#cc1616]/30 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase font-['Oswald'] text-[#cc1616]">
                <span className="w-2 h-2 rounded-full bg-[#cc1616] animate-pulse" />
                YAKLAŞAN ETKİNLİK
              </span>
            </div>

            {/* BAŞLIK */}
            <h1 className="font-['Oswald'] text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-[1.1] mb-5 break-words">
              {event.title}
            </h1>

            {/* TARİH, SAAT, KONUM BİLGİLERİ */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-300">
                <Calendar size={14} className="text-[#cc1616]" />
                <span>{dateStr}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-300">
                <Clock size={14} className="text-[#cc1616]" />
                <span>{timeStr}</span>
              </div>
              {event.location && (
                <div className="inline-flex items-center gap-2 bg-[#cc1616]/15 border border-[#cc1616]/30 rounded-xl px-3.5 py-2 text-xs font-medium text-[#ff6b6b]">
                  <MapPin size={14} className="text-[#cc1616]" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* BAŞVURU FORMU KARTI */}
            <div className="bg-[#0e0e12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="bg-gradient-to-r from-[#cc1616]/20 to-transparent border-b border-[#cc1616]/20 p-5 sm:p-7">
                <h3 className="font-['Oswald'] text-xl sm:text-2xl uppercase tracking-wider text-white mb-1">
                  Etkinliğe Başvur
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm">Lütfen katılım formunu eksiksiz doldurun.</p>
              </div>

              <div className="p-5 sm:p-7">
                {formStatus === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle2 size={52} className="text-emerald-500 mx-auto mb-4" />
                    <h4 className="text-emerald-400 font-['Oswald'] uppercase tracking-wider text-xl mb-2">
                      Başvurunuz Alındı!
                    </h4>
                    <p className="text-neutral-400 text-sm max-w-sm mx-auto">{formMessage}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {formStatus === "error" && (
                      <div className="flex items-start gap-3 bg-red-950/40 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs">
                        <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
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
                      className="mt-2 w-full py-4 px-6 rounded-xl font-['Oswald'] font-bold text-sm uppercase tracking-widest text-white bg-gradient-to-r from-[#cc1616] to-[#a01010] hover:from-[#e01818] hover:to-[#b51212] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#cc1616]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
      <label htmlFor={id} className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-neutral-900/90 border border-white/10 rounded-xl px-4 py-3 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#cc1616] focus:ring-1 focus:ring-[#cc1616]/50 transition-all"
      />
    </div>
  );
}
