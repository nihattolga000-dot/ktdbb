import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const rulers = [
  {
    name: 'Teoman',
    title: 'Asya Hun İmparatorluğu',
    years: 'M.Ö. 220 — M.Ö. 209',
    quote: 'Boyları birleştiren ve yayı geren her yiğit benim evladımdır.',
    desc: 'Tarihte bilinen ilk Türk devleti olan Asya Hun İmparatorluğu\'nun kurucusu. Dağınık Türk boylarını bir araya getiren ilk ulu önder.',
  },
  {
    name: 'Mete Han',
    title: 'Asya Hun İmparatorluğu',
    years: 'M.Ö. 209 — M.Ö. 174',
    quote: 'Benden eyerimi, atımı, çadırımı isteyin vereyim; fakat vatanımdan hiç kimse bir karış toprak istemesin, vermem!',
    desc: 'Türk tarihinin ilk düzenli ordusunu kuran, onluk sistemi getiren, vatan sevgisinin ve toprak bütünlüğünün tarihsel sembolü olan ulu hakan.',
  },
  {
    name: 'Çiçi Yabgu',
    title: 'Batı Hun İmparatorluğu',
    years: 'M.Ö. 56 — M.Ö. 36',
    quote: 'Boyun eğmeyeceğiz! İstiklalimizi feda etmeyi barbarlık ve yüz karası sayarız.',
    desc: 'İstiklal ve özgürlük uğruna Çin egemenliğini reddedip kahramanca savaşarak şehit düşen, Türk bağımsızlık karakterinin ilk ve en asil sembollerinden biri.',
  },
  {
    name: 'Uldız',
    title: 'Avrupa Hun İmparatorluğu',
    years: '390 — 412',
    quote: 'Güneşin battığı yere kadar her yeri zapt edebilirim!',
    desc: 'Kavimler Göçü sonrası Avrupa Hun İmparatorluğu\'nun temellerini atan ve Roma\'ya Türk\'ün gücünü ilk gösteren stratejik deha.',
  },
  {
    name: 'Attila',
    title: 'Avrupa Hun İmparatorluğu',
    years: '395 — 453',
    quote: 'Ben ve milletim Tanrının kırbacıyız. Tanrı yoldan çıkan milletleri cezalandırmak için bizi gönderir.',
    desc: 'Avrupa\'ya diz çöktüren, cesareti ve askeri dehasıyla tarihe adını "Tanrının Kırbacı" olarak altın harflerle yazdıran büyük başbuğ.',
  },
  {
    name: 'Bumin Kağan',
    title: 'Göktürk Kağanlığı',
    years: '? — 552',
    quote: 'İlimiz, töremiz var olsun! Üstte mavi gök, altta yağız yer kılındıkta, ikisi arasında Türk milleti var edilmiştir.',
    desc: 'Türk adını resmi devlet adı olarak kullanan ilk devleti kurarak Ötüken\'de Göktürk Kağanlığı\'nın bayrağını dalgalandıran ulu kağan.',
  },
  {
    name: 'Bilge Kağan',
    title: 'II. Göktürk Kağanlığı',
    years: '683 — 734',
    quote: 'Ey Türk titre ve kendine dön! Üstte mavi gök çökmedikçe, altta yağız yer delinmedikçe, senin ilini ve töreni kim bozabilir?',
    desc: 'Türk milletine ebedi bir öğüt olan Orhun Abideleri\'ni diktiren, devleti zirveye taşıyan bilge lider.',
  },
  {
    name: 'Satuk Buğra Han',
    title: 'Karahanlı Devleti',
    years: '920 — 955',
    quote: 'Kılıcımızla kurduğumuz bu devlet, imanımızla ebediyete kadar payidar kalacaktır.',
    desc: 'Türk tarihinde İslamiyet\'i resmi din olarak kabul eden ilk devleti yöneten, Türk-İslam medeniyetinin öncü hükümdarı.',
  },
  {
    name: 'Tuğrul Bey',
    title: 'Büyük Selçuklu İmparatorluğu',
    years: '990 — 1063',
    quote: 'Ben ki doğunun ve batının hükümdarıyım!',
    desc: 'Selçuklu Devleti\'nin kurucusu. İslam dünyasını birleştiren ve Türklere Anadolu\'nun, Ortadoğu\'nun yollarını açan başbuğ.',
  },
  {
    name: 'Sultan Alp Arslan',
    title: 'Büyük Selçuklu İmparatorluğu',
    years: '1029 — 1072',
    quote: 'Size öyle bir vatan bırakıyorum ki; ebediyen sizin olacaktır!',
    desc: 'Anadolu\'nun kapılarını Türklere ebediyen açan, Malazgirt ovasında Bizans\'ı dize getiren yenilmez kahraman.',
  },
  {
    name: 'Sultan Melikşah',
    title: 'Büyük Selçuklu İmparatorluğu',
    years: '1055 — 1092',
    quote: 'Bizim sınırlarımız, ordularımızın mızraklarının ulaştığı yerdedir.',
    desc: 'Selçuklu İmparatorluğu\'na en parlak dönemini yaşatan; devlet sınırlarını Çin\'den Marmara\'ya kadar genişleten kudretli sultan.',
  },
  {
    name: 'I. Alaeddin Keykubad',
    title: 'Anadolu Selçuklu Devleti',
    years: '1190 — 1237',
    quote: 'Adaletin olmadığı yerde mülk, mülkün olmadığı yerde devlet ayakta kalamaz.',
    desc: 'Anadolu Selçuklu Devleti\'ni en parlak çağına ulaştıran, Anadolu\'yu Türk-İslam eserleriyle donatan ulu sultan.',
  },
  {
    name: 'Osman Gazi',
    title: 'Osmanlı İmparatorluğu',
    years: '1258 — 1326',
    quote: 'Maksadımız kuru bir kavga veya cihangirlik davası değil, İ\'la-yi Kelimetullah\'tır.',
    desc: 'Üç kıta yedi denize hükmedecek, 6 asır sürecek cihanşümul Osmanlı İmparatorluğu\'nun kurucusu ve fikir babası.',
  },
  {
    name: 'Yıldırım Bayezid',
    title: 'Osmanlı İmparatorluğu',
    years: '1360 — 1403',
    quote: 'Benim adım Yıldırım! Ben, göklerden inen ateşim!',
    desc: 'Atının üstünden inmeyen, savaş meydanlarındaki hızıyla "Yıldırım" unvanını alan, Haçlı ordularını darmadağın eden cengaver.',
  },
  {
    name: 'Emir Timur',
    title: 'Timur İmparatorluğu',
    years: '1336 — 1405',
    quote: 'Biz ki Mülk-i Turan, Emir-i Türkistan\'ız, biz ki milletlerin en kadimi ve en ulusu Türk\'ün başbuğuyuz!',
    desc: 'Asla yenilgi yüzü görmemiş askeri bir deha; Turan coğrafyasını tek bayrak altında toplayan büyük cihangir.',
  },
  {
    name: 'Fatih Sultan Mehmet',
    title: 'Osmanlı İmparatorluğu',
    years: '1432 — 1481',
    quote: 'Benim kudretimin ulaştığı yere, onların hayalleri dahi ulaşamaz!',
    desc: 'Çağ açıp çağ kapatan, İstanbul\'u fethederek Peygamber övgüsüne mazhar olan dünya imparatoru.',
  },
  {
    name: 'Babür Şah',
    title: 'Babür İmparatorluğu',
    years: '1483 — 1530',
    quote: 'Kılıç ve kalem aynı elde birleşirse, o devlet yenilmez olur.',
    desc: 'Hindistan\'da yüzlerce yıl sürecek devasa bir Türk imparatorluğu kuran; aynı zamanda edebiyatçı ve büyük komutan.',
  },
  {
    name: 'Yavuz Sultan Selim',
    title: 'Osmanlı İmparatorluğu',
    years: '1470 — 1520',
    quote: 'Cesaret insanı zafere, kararsızlık tehlikeye, korkaklık ise ölüme götürür.',
    desc: 'Kısa saltanatına koca bir cihan sığdıran, Türk-İslam dünyasını tek bayrak altında toplayan efsanevi kumandan.',
  },
  {
    name: 'Kanuni Sultan Süleyman',
    title: 'Osmanlı İmparatorluğu',
    years: '1494 — 1566',
    quote: 'Halk içinde muteber bir nesne yok devlet gibi, olmaya devlet cihanda bir nefes sıhhat gibi.',
    desc: 'Adaleti ve kanunlarıyla dünyaya nizam veren, Türk cihan hakimiyetinin zirvesindeki muhteşem süleyman.',
  },
  {
    name: 'Mustafa Kemal Atatürk',
    title: 'Türkiye Cumhuriyeti',
    years: '1881 — 1938',
    quote: 'Muhtaç olduğun kudret, damarlarındaki asil kanda mevcuttur!',
    desc: 'Devletimizin kurucusu, milli şuurun ve bağımsızlık ateşinin sarsılmaz mimarı. Cumhuriyet\'in ve modern Türkiye\'nin ulu önderi.',
  }
];

export default function TurkicThinkers({ className = '' }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rulers.length);
    }, 18000); // 18 seconds

    return () => clearInterval(interval);
  }, []);

  const currentRuler = rulers[currentIndex];

  return (
    <div className={`w-full max-w-[500px] pointer-events-none ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-auto relative pl-8 py-2 group"
        >
          {/* Static Background Line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-900/40 to-transparent" />
          
          {/* Animated Progress Line */}
          <div className="absolute left-0 top-0 w-1 shadow-[0_0_15px_rgba(220,38,38,0.6)] z-10">
            <motion.div 
              className="w-full bg-red-600"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 18, ease: "linear" }}
              key={`progress-${currentIndex}`}
            />
          </div>
          
          <div className="mb-6 relative">
             <Quote size={28} className="text-red-600/40 absolute -left-4 -top-3 rotate-180" />
             <blockquote className="text-[#f5f5f5] font-serif italic text-2xl lg:text-3xl leading-snug drop-shadow-xl text-balance">
               "{currentRuler.quote}"
             </blockquote>
          </div>

          <div className="relative z-10">
             <h4 className="font-oswald font-bold text-2xl tracking-[0.1em] uppercase text-white drop-shadow-md mb-2">
               {currentRuler.name}
             </h4>
             <div className="flex items-center gap-3 flex-wrap mb-4">
               <span className="text-[#cc1616] font-semibold text-xs tracking-[0.25em] uppercase">
                 {currentRuler.title}
               </span>
               <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
               <span className="text-white/50 text-xs font-bold tracking-widest">
                 {currentRuler.years}
               </span>
             </div>
             
             <p className="text-white/70 text-sm leading-relaxed font-light drop-shadow-md border-t border-white/10 pt-4">
               {currentRuler.desc}
             </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
