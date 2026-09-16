import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Turancı Dernekler Birliği nedir ve amacı neyi hedefler?',
    answer: 'Kayseri Turancı Dernekler Birliği, Türk milletinin birliğini, dirliğini ve Turan ülküsünü savunan derneklerin ortak hareket ettiği bir platformdur. Amacımız, Türk dünyasının kültürel ve entelektüel inşasını sağlamak, milli şuurumuzu gelecek nesillere aktarmak ve milli değerlerimizi korumaktır.',
  },
  {
    question: 'Birliğe katılmak için hangi şartları taşımak gerekir?',
    answer: 'Temel şartımız Türk milletine, Türklük şuuruna ve Atatürk ilkelerine gönülden bağlı olmaktır. Zararlı akımlardan, bölücü ideolojilerden uzak; vatan, millet ve bayrak sevgisini her şeyin üstünde tutan, ahlaklı ve ilkeli her Türk genci birliğimize katılabilir.',
  },
  {
    question: 'Başka bir siyasi parti veya derneğe üye olmam katılımıma engel mi?',
    answer: 'Hayır, engel değildir. Bizim için belirleyici olan, mensup olduğunuz kurumların ve benimsediğiniz görüşlerin Türk milliyetçiliği ülküsüne ve Türkiye Cumhuriyeti\'nin milli menfaatlerine ters düşmemesidir.',
  },
  {
    question: 'Atatürk ve tarihi kişilikler konusundaki duruşunuz nedir?',
    answer: 'Başbuğumuz Mustafa Kemal Atatürk tartışılmaz kırmızı çizgimizdir. Mete Han\'dan Atatürk\'e kadar tarih boyunca Türk milletine hizmet etmiş tüm devlet adamlarımız ve kahramanlarımız ortak değerimizdir; onları birbiriyle ayrıştırmaz, ulu bir çınarın dalları gibi bir bütün olarak sahipleniriz.',
  },
  {
    question: 'Birliğin içerisinde dini veya mezhepsel bir ayrım var mı?',
    answer: 'Kesinlikle yoktur. Ulu Önder Atatürk\'ün dediği gibi "Ne mutlu Türk\'üm diyene" şuuruna sahip olan, Türk milletinin menfaatlerini savunan herkes bizim kandaşımızdır. İnanç ve mezhep meseleleri kişilerin vicdanına aittir, birliğimizin çatısı altında asla bir ayrışma konusu yapılamaz.',
  },
  {
    question: 'Kararlarınızı alırken duygusal mı yoksa rasyonel mi hareket ediyorsunuz?',
    answer: 'Türk milliyetçiliği kalbimizde yanan büyük bir sevdadır ancak kararlarımızda daima "Stratejik Akıl" devrededir. Olaylara anlık heyecanlar veya kışkırtmalarla değil, uzun vadeli tarihsel irademiz ve rasyonel durum analizleriyle yaklaşıyoruz.',
  },
  {
    question: 'Sizin tanımınıza göre Türk Milliyetçiliği nedir?',
    answer: 'Türk Milliyetçiliği; Türk milletini bağımsız, güçlü, müreffeh ve çağdaş bir medeniyet seviyesine ulaştırma ülküsüdür. Bu ülkü, geçmişine sadık kalarak aklın ve bilimin ışığında geleceği inşa etmeyi, Türk\'ün öz değerlerini evrensel gelişmelerle harmanlamayı gerektirir.',
  },
  {
    question: '"Mevcut meselelere Türk ağzıyla bakmak" ne anlama gelir?',
    answer: 'Dünyadaki veya ülkemizdeki siyasi, sosyal ve ekonomik meseleleri değerlendirirken yabancı ideolojilerin veya başka milletlerin penceresinden değil; doğrudan Türk milletinin menfaatleri, güvenliği ve Türk\'ün bin yıllık kültürel kodları açısından değerlendirmek demektir.',
  },
  {
    question: 'Birliğe destek vermek için illa bir derneğe üye olmak mı gerekir?',
    answer: 'Resmi üyelik gücümüze güç katsa da zorunlu değildir. Üye olmadan da etkinliklerimize ve seminerlerimize katılabilir, fikirlerimizi yayabilir ve Turan ülküsüne bulunduğunuz her mecrada (okulda, iş yerinde, sosyal medyada) destek verebilirsiniz.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="sss"
      className="section-padding"
      style={{
        background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container-custom max-w-4xl mx-auto">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div
            className="editorial-eyebrow"
            style={{ justifyContent: 'center', marginBottom: '0.75rem' }}
          >
            Sıkça Sorulan Sorular
          </div>
          <h2 className="editorial-title">MERAK EDİLENLER</h2>
          <p
            style={{
              marginTop: '1rem',
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
              maxWidth: '600px',
              margin: '1rem auto 0',
            }}
          >
            Kayseri Turancı Dernekler Birliği hakkında aklınıza takılan soruların cevaplarını burada bulabilirsiniz.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  background: isOpen ? 'rgba(204,22,22,0.05)' : 'color-mix(in srgb, var(--color-bg-card) 40%, transparent)',
                  border: `1px solid ${isOpen ? 'rgba(204,22,22,0.3)' : 'var(--color-border)'}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                <button
                  onClick={() => toggleOpen(index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  className="group"
                >
                  <span
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      letterSpacing: '0.02em',
                      color: isOpen ? '#cc1616' : 'var(--color-text-primary)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {faq.question}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isOpen ? 'var(--color-red-glow)' : 'var(--color-border)',
                      color: isOpen ? '#cc1616' : 'var(--color-text-muted)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                      marginLeft: '1rem',
                    }}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? '500px' : '0',
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div
                    style={{
                      padding: '0 1.5rem 1.5rem 1.5rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.7,
                      fontSize: '0.95rem',
                    }}
                  >
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
