import { useState, type FormEvent } from 'react';
import { MapPin, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { contactConfig } from '../data/config';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  birthDate?: string;
  livesInKayseri?: string;
  education?: string;
  ideology?: string;
  politicalParty?: string;
  definitionTurkculuk?: string;
  turanMeaning?: string;
  reasonToJoin?: string;
  favoriteLeader?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  [key: string]: string | undefined;
}

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  birthDate: '',
  livesInKayseri: '',
  education: '',
  ideology: '',
  politicalParty: '',
  definitionTurkculuk: '',
  turanMeaning: '',
  reasonToJoin: '',
  favoriteLeader: '',
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Ad Soyad alanı zorunludur.';
    if (!form.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin.';
    }
    if (!form.message.trim()) newErrors.message = 'Mesaj alanı zorunludur.';

    if (form.subject === 'uyelik') {
      const requiredFields = [
        'birthDate', 'livesInKayseri', 'education', 'ideology',
        'politicalParty', 'favoriteLeader', 'definitionTurkculuk',
        'turanMeaning', 'reasonToJoin'
      ] as const;

      requiredFields.forEach(field => {
        if (!form[field]?.trim()) {
          newErrors[field] = 'Bu alan zorunludur.';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Sunucu hatası');
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      alert('Mesajınız gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="iletisim"
      className="section-padding bg-bozkurt-pattern"
      style={{
        background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient light */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(204,22,22,0.05) 0%, transparent 60%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, rgba(204,22,22,0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-custom relative z-10">
        <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="editorial-eyebrow">İletişim</div>
          <h2 className="editorial-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            BİZİMLE <span style={{ color: '#cc1616' }}>İLETİŞİME GEÇİN</span>
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', marginTop: '1rem', fontSize: '1.1rem' }}>
            Stratejik iş birlikleri, projeler ve üyelik talepleri için yönetim merkezimizle irtibata geçin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: MapPin, title: 'Merkez Yerleşke', desc: contactConfig.address },
              { icon: Phone, title: 'İletişim Hattı', desc: contactConfig.phone },
              { icon: Mail, title: 'E-Posta', desc: contactConfig.email },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group"
                style={{
                  background: 'color-mix(in srgb, var(--color-bg-primary) 60%, transparent)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '2rem',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(30,30,30,0.8)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(204,22,22,0.3)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(10px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'color-mix(in srgb, var(--color-bg-primary) 60%, transparent)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    background: 'linear-gradient(135deg, rgba(204,22,22,0.2) 0%, rgba(204,22,22,0.05) 100%)',
                    border: '1px solid rgba(204,22,22,0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease'
                  }}
                  className="icon-container"
                >
                  <Icon size={24} color="#cc1616" />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}


          </div>

          {/* Right: Premium Form */}
          <div
            style={{
              background: 'linear-gradient(145deg, color-mix(in srgb, var(--color-bg-card) 95%, transparent) 0%, color-mix(in srgb, var(--color-bg-primary) 98%, transparent) 100%)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '3rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px color-mix(in srgb, var(--color-bg-primary) 50%, transparent)',
            }}
          >
            {submitted ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4rem 1rem',
                  textAlign: 'center',
                  gap: '1.5rem',
                  animation: 'fadeIn 0.5s ease-out'
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(34,197,94,0.1)',
                    border: '2px solid rgba(34,197,94,0.3)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle size={40} color="#22c55e" />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontWeight: 700,
                      fontSize: '1.5rem',
                      color: 'var(--color-text-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Mesajınız İletildi
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                    İlgili birimimiz en kısa sürede sizinle iletişime geçecektir.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.8rem 2rem',
                    background: 'transparent',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-border)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="premium-form">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                  {/* Name Input */}
                  <div className="input-group">
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={errors.name ? 'has-error' : ''}
                    />
                    <label>Ad Soyad *</label>
                    <span className="focus-border"></span>
                    {errors.name && <p className="error-msg">{errors.name}</p>}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="input-group">
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={errors.email ? 'has-error' : ''}
                      />
                      <label>E-posta *</label>
                      <span className="focus-border"></span>
                      {errors.email && <p className="error-msg">{errors.email}</p>}
                    </div>

                    <div className="input-group">
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                      <label>Telefon</label>
                      <span className="focus-border"></span>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="input-group select-group">
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="" disabled hidden></option>
                      <option value="uyelik">Üyelik Başvurusu</option>
                      <option value="isbirligi">İş Birliği Talebi</option>
                      <option value="etkinlik">Etkinlik Bilgisi</option>
                      <option value="gonullu">Gönüllü Olmak İstiyorum</option>
                      <option value="diger">Diğer</option>
                    </select>
                    <label>Konu</label>
                    <span className="focus-border"></span>
                  </div>

                  {/* Uyelik Formu Sorulari */}
                  {form.subject === 'uyelik' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem', padding: '2rem', background: 'var(--color-border)', borderRadius: '12px', border: '1px dashed rgba(204,22,22,0.3)' }}>
                      <h4 style={{ color: '#cc1616', fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '-1rem' }}>Üyelik Başvuru Formu</h4>

                      <div className="input-group">
                        <input type="text" required value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className={errors.birthDate ? 'has-error' : ''} />
                        <label>Doğum tarihiniz nedir? *</label>
                        <span className="focus-border"></span>
                        {errors.birthDate && <p className="error-msg">{errors.birthDate}</p>}
                      </div>

                      <div className="input-group">
                        <input type="text" required value={form.livesInKayseri} onChange={(e) => setForm({ ...form, livesInKayseri: e.target.value })} className={errors.livesInKayseri ? 'has-error' : ''} />
                        <label>Kayseri'de mi yaşıyorsunuz? *</label>
                        <span className="focus-border"></span>
                        {errors.livesInKayseri && <p className="error-msg">{errors.livesInKayseri}</p>}
                      </div>

                      <div className="input-group">
                        <input type="text" required value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} className={errors.education ? 'has-error' : ''} />
                        <label>Eğitim durumunuz nedir? *</label>
                        <span className="focus-border"></span>
                        {errors.education && <p className="error-msg">{errors.education}</p>}
                      </div>

                      <div className="input-group">
                        <input type="text" required value={form.ideology} onChange={(e) => setForm({ ...form, ideology: e.target.value })} className={errors.ideology ? 'has-error' : ''} />
                        <label>İdeolojik görüşünüz nedir? *</label>
                        <span className="focus-border"></span>
                        {errors.ideology && <p className="error-msg">{errors.ideology}</p>}
                      </div>

                      <div className="input-group">
                        <input type="text" required value={form.politicalParty} onChange={(e) => setForm({ ...form, politicalParty: e.target.value })} className={errors.politicalParty ? 'has-error' : ''} />
                        <label>Aktif bir siyasi parti üyeliğiniz var mı? Varsa göreviniz nedir? *</label>
                        <span className="focus-border"></span>
                        {errors.politicalParty && <p className="error-msg">{errors.politicalParty}</p>}
                      </div>

                      <div className="input-group">
                        <input type="text" required value={form.favoriteLeader} onChange={(e) => setForm({ ...form, favoriteLeader: e.target.value })} className={errors.favoriteLeader ? 'has-error' : ''} />
                        <label>Tarihte en beğendiğiniz lider kimdir? *</label>
                        <span className="focus-border"></span>
                        {errors.favoriteLeader && <p className="error-msg">{errors.favoriteLeader}</p>}
                      </div>

                      <div className="input-group">
                        <textarea rows={2} required value={form.definitionTurkculuk} onChange={(e) => setForm({ ...form, definitionTurkculuk: e.target.value })} className={errors.definitionTurkculuk ? 'has-error' : ''}></textarea>
                        <label>Türkçülüğün tanımı sizin için nedir? *</label>
                        <span className="focus-border"></span>
                        {errors.definitionTurkculuk && <p className="error-msg">{errors.definitionTurkculuk}</p>}
                      </div>

                      <div className="input-group">
                        <textarea rows={2} required value={form.turanMeaning} onChange={(e) => setForm({ ...form, turanMeaning: e.target.value })} className={errors.turanMeaning ? 'has-error' : ''}></textarea>
                        <label>Turan deyince aklınıza ne geliyor? *</label>
                        <span className="focus-border"></span>
                        {errors.turanMeaning && <p className="error-msg">{errors.turanMeaning}</p>}
                      </div>

                      <div className="input-group">
                        <textarea rows={2} required value={form.reasonToJoin} onChange={(e) => setForm({ ...form, reasonToJoin: e.target.value })} className={errors.reasonToJoin ? 'has-error' : ''}></textarea>
                        <label>Derneğimize katılmak istemenizdeki sebep nedir? *</label>
                        <span className="focus-border"></span>
                        {errors.reasonToJoin && <p className="error-msg">{errors.reasonToJoin}</p>}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div className="input-group">
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={errors.message ? 'has-error' : ''}
                    ></textarea>
                    <label>{form.subject === 'uyelik' ? 'Eklemek İstedikleriniz (Opsiyonel Değil, Zorunlu) *' : 'Mesajınız *'}</label>
                    <span className="focus-border"></span>
                    {errors.message && <p className="error-msg">{errors.message}</p>}
                  </div>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: '3rem',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '1.2rem',
                    background: loading ? '#333' : 'linear-gradient(90deg, #a81010 0%, #cc1616 50%, #a81010 100%)',
                    backgroundSize: '200% auto',
                    color: 'var(--color-text-primary)',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.5s',
                    boxShadow: loading ? 'none' : '0 10px 20px -10px rgba(204,22,22,0.6)',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundPosition = 'right center';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundPosition = 'left center';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: '2px solid var(--color-text-muted)',
                          borderTopColor: 'var(--color-text-primary)',
                          animation: 'spin 0.8s linear infinite',
                          display: 'inline-block',
                        }}
                      />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      Mesajı İlet
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .premium-form .input-group {
          position: relative;
        }

        .premium-form input,
        .premium-form textarea,
        .premium-form select {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-border);
          padding: 0.5rem 0;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: var(--color-text-primary);
          outline: none;
          transition: border-color 0.3s;
        }

        .premium-form textarea {
          resize: vertical;
          min-height: 40px;
        }

        .premium-form label {
          position: absolute;
          top: 0.5rem;
          left: 0;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          pointer-events: none;
          transition: 0.3s ease all;
          font-weight: 500;
        }

        /* Floating label mechanics */
        .premium-form input:focus ~ label,
        .premium-form input:valid ~ label,
        .premium-form textarea:focus ~ label,
        .premium-form textarea:valid ~ label,
        .premium-form select:focus ~ label,
        .premium-form select:valid ~ label {
          top: -1rem;
          font-size: 0.7rem;
          color: #cc1616;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Focus border animation */
        .premium-form .focus-border {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #cc1616;
          transition: 0.4s;
        }

        .premium-form input:focus ~ .focus-border,
        .premium-form textarea:focus ~ .focus-border,
        .premium-form select:focus ~ .focus-border {
          width: 100%;
        }

        .premium-form .has-error {
          border-bottom-color: #cc1616;
        }
        
        .premium-form .error-msg {
          position: absolute;
          bottom: -1.2rem;
          left: 0;
          font-size: 0.7rem;
          color: #cc1616;
        }

        .premium-form select option {
          background: var(--color-bg-card);
          color: var(--color-text-primary);
        }
      `}</style>
    </section>
  );
}
