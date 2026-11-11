import { User, Shield } from 'lucide-react';
import {
  presidentMember,
  vicePresidents,
  generalBoardMembers,
  type ManagementMember,
} from '../data/management';

function MemberCard({
  member,
  highlight = false,
}: {
  member: ManagementMember;
  highlight?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 w-full h-full flex flex-col justify-between ${
        highlight
          ? 'border-2 border-red-600/60 shadow-xl shadow-red-600/15'
          : 'border border-[var(--color-border)] hover:border-red-600/50 hover:shadow-lg hover:shadow-red-600/10'
      }`}
      style={{
        background: 'var(--color-bg-card)',
      }}
    >
      <div>
        {/* Üst Kırmızı Vurgu Çizgisi */}
        <div
          className={`h-1 w-full transition-all duration-300 ${
            highlight
              ? 'bg-gradient-to-r from-red-700 via-red-500 to-red-700'
              : 'bg-transparent group-hover:bg-red-600'
          }`}
        />

        {/* Fotoğraf Alanı */}
        <div
          className="relative w-full aspect-[4/5] overflow-hidden bg-black/20 flex items-center justify-center"
          style={{
            background: 'color-mix(in srgb, var(--color-bg-elevated) 80%, black)',
          }}
        >
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-[var(--color-text-muted)] group-hover:text-red-500/80 transition-colors">
              <div className="w-16 h-16 rounded-full border border-[var(--color-border)] flex items-center justify-center mb-3 bg-white/5">
                <User className="w-8 h-8 stroke-[1.5]" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider opacity-75">
                Fotoğraf
              </span>
            </div>
          )}

          {/* Hafif karartma gradyanı */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Görev Rozeti (Fotoğraf üzerinde) */}
          <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md backdrop-blur-md ${
                highlight
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                  : 'bg-black/70 text-red-400 border border-red-500/30'
              }`}
            >
              {member.role}
            </span>
          </div>
        </div>
      </div>

      {/* Bilgi Kutusu (İsim Soyisim ve Görev) */}
      <div className="p-4 flex flex-col justify-between items-center text-center flex-grow">
        <h3
          className={`font-['Oswald'] uppercase tracking-wide text-lg sm:text-xl font-bold transition-colors text-[var(--color-text-primary)] ${
            highlight ? 'group-hover:text-red-600' : 'group-hover:text-red-500'
          }`}
        >
          {member.name}
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
          {member.role}
        </p>
      </div>
    </div>
  );
}

export default function Management() {
  return (
    <section
      id="yonetim"
      className="section-padding bg-bozkurt-pattern"
      style={{
        background: 'color-mix(in srgb, var(--color-bg-card) 35%, transparent)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-custom relative z-10 w-full">
        {/* Bölüm Başlığı */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-eyebrow justify-center">
            <Shield className="w-4 h-4 text-red-600 mr-1" />
            TEŞKİLAT YAPISI
          </div>
          <h2 className="section-title uppercase tracking-wide">
            YÖNETİM KADROSU
          </h2>
          <div className="w-20 h-1 bg-red-600 mx-auto my-4 rounded-full" />
          <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed">
            Kayseri Turancı Dernekler Birliği İl Yönetim Kurulu ve Teşkilat Kadrosu
          </p>
        </div>

        {/* ========================================== */}
        {/* 1. SEVİYE: İL BAŞKANI                      */}
        {/* ========================================== */}
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-12 bg-red-600/40" />
            <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
              İl Başkanı
            </span>
            <span className="h-px w-12 bg-red-600/40" />
          </div>

          <div className="w-[300px] max-w-[300px]">
            <MemberCard member={presidentMember} highlight={true} />
          </div>
        </div>

        {/* Hiyerarşi Bağlantı Çizgisi */}
        <div className="w-full flex justify-center my-8">
          <div className="w-0.5 h-10 bg-gradient-to-b from-red-600 via-red-600/50 to-transparent" />
        </div>

        {/* ========================================== */}
        {/* 2. SEVİYE: BAŞKAN YARDIMCILARI             */}
        {/* ========================================== */}
        {vicePresidents.length > 0 && (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="h-px w-12 bg-red-600/30" />
              <span className="text-xs font-bold tracking-widest text-[var(--color-text-secondary)] uppercase">
                Başkan Yardımcıları
              </span>
              <span className="h-px w-12 bg-red-600/30" />
            </div>

            <div className="w-full flex flex-wrap justify-center items-stretch gap-6">
              {vicePresidents.map((member) => (
                <div
                  key={member.id}
                  className="w-[300px] max-w-[300px] flex-shrink-0"
                >
                  <MemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hiyerarşi Bağlantı Çizgisi */}
        <div className="w-full flex justify-center my-8">
          <div className="w-0.5 h-10 bg-gradient-to-b from-red-600 via-red-600/50 to-transparent" />
        </div>

        {/* ========================================== */}
        {/* 3. SEVİYE: GENEL YÖNETİM ÜYELERİ           */}
        {/* ========================================== */}
        {generalBoardMembers.length > 0 && (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="h-px w-12 bg-red-600/30" />
              <span className="text-xs font-bold tracking-widest text-[var(--color-text-secondary)] uppercase">
                Genel Yönetim Kurulu Üyeleri
              </span>
              <span className="h-px w-12 bg-red-600/30" />
            </div>

            <div className="w-full flex flex-wrap justify-center items-stretch gap-6">
              {generalBoardMembers.map((member) => (
                <div
                  key={member.id}
                  className="w-[280px] max-w-[280px] flex-shrink-0"
                >
                  <MemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
