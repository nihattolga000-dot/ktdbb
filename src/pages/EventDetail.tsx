import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, MapPin, ArrowLeft, Calendar, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"idle"|"submitting"|"success"|"error">("idle");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(r => r.json())
      .then(d => { setEvent(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormMessage("Başvurunuz alındı, sizi bekliyoruz!");
        setName(""); setPhone(""); setEmail("");
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

  if (loading) return (
    <div style={{minHeight:"100vh",background:"var(--color-bg-primary)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:40,height:40,border:"2px solid #cc161640",borderTopColor:"#cc1616",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/>
        <p style={{color:"#666",fontFamily:"Oswald,sans-serif",letterSpacing:"0.3em",fontSize:11,textTransform:"uppercase"}}>Yükleniyor</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!event || event.error) return (
    <div style={{minHeight:"100vh",background:"var(--color-bg-primary)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:24}}>
      <Calendar size={48} color="#333"/>
      <p style={{color:"#666",fontFamily:"Oswald,sans-serif",letterSpacing:"0.2em",textTransform:"uppercase"}}>Etkinlik Bulunamadı</p>
      <Link to="/" style={{color:"#cc1616",fontSize:13,textDecoration:"none"}}>← Ana Sayfaya Dön</Link>
    </div>
  );

  const evDate = new Date(event.eventDate);
  const dateStr = evDate.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});
  const timeStr = evDate.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});

  return (
    <div style={{background:"var(--color-bg-primary)",minHeight:"100vh",color:"#f0f0f0"}}>
      <Navbar />

      {/* BACKGROUND GLOW */}
      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        {event.imageUrl && (
          <img src={event.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"blur(80px) brightness(0.2) saturate(1.5)",transform:"scale(1.2)"}}/>
        )}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,#070709cc,#070709)"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:1280,margin:"0 auto",padding:"120px 32px 80px"}}>
        <Link to="/" style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:32,color:"#888",fontSize:12,textDecoration:"none",letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,transition:"color 0.2s"}}>
          <ArrowLeft size={14}/> Ana Sayfaya Dön
        </Link>

        {/* 2-COLUMN LAYOUT */}
        <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.3fr)",gap:64,alignItems:"start"}}>
          
          {/* LEFT: IMAGE & DESC */}
          <div style={{position:"sticky",top:120}}>
            <div style={{position:"relative",marginBottom:32}}>
              <div style={{position:"absolute",inset:-1,background:"linear-gradient(135deg,#cc1616,transparent 60%)",borderRadius:16,opacity:0.5}}/>
              {event.imageUrl
                ? <img src={event.imageUrl} alt={event.title} style={{width:"100%",height:"auto",borderRadius:14,display:"block",boxShadow:"0 32px 64px color-mix(in srgb, var(--color-bg-primary) 70%, transparent)",position:"relative"}}/>
                : <div style={{aspectRatio:"3/4",background:"#111",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}><Calendar size={56} color="#333"/></div>
              }
            </div>

            <div>
              <h2 style={{fontFamily:"Oswald,sans-serif",fontSize:18,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--color-text-primary)",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
                <span style={{display:"block",width:24,height:2,background:"#cc1616"}}/>
                Hakkında
              </h2>
              <div style={{color:"#999",lineHeight:1.8,fontSize:14,wordBreak:"break-word",overflowWrap:"break-word"}}>
                {event.description?.split("\n").map((p:string,i:number) => p.trim() ? <p key={i} style={{margin:"0 0 16px"}}>{p}</p> : null)}
              </div>
            </div>
          </div>

          {/* RIGHT: TITLE, META & FORM */}
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#cc161620",border:"1px solid #cc161640",borderRadius:20,padding:"6px 16px",marginBottom:20}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#cc1616",animation:"pulse 2s infinite"}}/>
              <span style={{color:"#cc1616",fontSize:10,fontWeight:700,letterSpacing:"0.25em",textTransform:"uppercase",fontFamily:"Oswald,sans-serif"}}>Yaklaşan Etkinlik</span>
            </div>

            <h1 style={{fontFamily:"Oswald,sans-serif",fontSize:"clamp(2.5rem,4vw,4rem)",fontWeight:700,lineHeight:1.05,letterSpacing:"-0.01em",textTransform:"uppercase",margin:"0 0 32px",color:"var(--color-text-primary)"}}>
              {event.title}
            </h1>

            <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:48}}>
              <MetaBadge icon={<Calendar size={14} color="#cc1616"/>} label={dateStr}/>
              <MetaBadge icon={<Clock size={14} color="#cc1616"/>} label={timeStr}/>
              <MetaBadge icon={<MapPin size={14} color="#cc1616"/>} label={event.location} accent/>
            </div>

            {/* THE FORM */}
            <div style={{background:"#0e0e12",border:"1px solid #ffffff0d",borderRadius:20,overflow:"hidden",boxShadow:"0 24px 64px color-mix(in srgb, var(--color-bg-primary) 50%, transparent)"}}>
              <div style={{background:"linear-gradient(135deg,#cc161615,#cc161605)",borderBottom:"1px solid #cc161620",padding:"24px 32px"}}>
                <h3 style={{fontFamily:"Oswald,sans-serif",fontSize:22,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--color-text-primary)",margin:"0 0 6px"}}>
                  Etkinliğe Başvur
                </h3>
                <p style={{color:"#666",fontSize:13,margin:0,letterSpacing:"0.05em"}}>Lütfen katılım formunu eksiksiz doldurun.</p>
              </div>

              <div style={{padding:"32px"}}>
                {formStatus === "success" ? (
                  <div style={{textAlign:"center",padding:"32px 0"}}>
                    <CheckCircle2 size={56} color="#22c55e" style={{margin:"0 auto 16px",display:"block"}}/>
                    <h4 style={{color:"#22c55e",fontFamily:"Oswald,sans-serif",textTransform:"uppercase",letterSpacing:"0.1em",fontSize:20,margin:"0 0 8px"}}>Başvurunuz Alındı!</h4>
                    <p style={{color:"#666",fontSize:14}}>{formMessage}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:24}}>
                    {formStatus === "error" && (
                      <div style={{display:"flex",gap:10,alignItems:"flex-start",background:"#cc161610",border:"1px solid #cc161630",borderRadius:10,padding:"16px"}}>
                        <AlertCircle size={18} color="#cc1616" style={{flexShrink:0,marginTop:2}}/>
                        <span style={{color:"#cc1616",fontSize:13}}>{formMessage}</span>
                      </div>
                    )}

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
                      <FormField label="Ad Soyad" id="f-name" type="text" value={name} onChange={setName} placeholder="Adınız Soyadınız" required/>
                      <FormField label="Telefon" id="f-phone" type="tel" value={phone} onChange={setPhone} placeholder="05XX XXX XX XX" required/>
                    </div>
                    <FormField label="E-posta" id="f-email" type="email" value={email} onChange={setEmail} placeholder="ornek@mail.com" required/>

                    <button type="submit" disabled={formStatus === "submitting"} style={{
                      marginTop: 16,
                      background: formStatus === "submitting" ? "#333" : "linear-gradient(135deg,#cc1616,#a01010)",
                      color:"var(--color-text-primary)",border:"none",borderRadius:10,padding:"18px 24px",
                      fontFamily:"Oswald,sans-serif",fontWeight:700,fontSize:14,
                      letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",
                      display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                      transition:"all 0.3s",boxShadow: formStatus === "submitting" ? "none" : "0 8px 32px #cc161650"
                    }}>
                      {formStatus === "submitting"
                        ? <><div style={{width:16,height:16,border:"2px solid #ffffff30",borderTopColor:"var(--color-text-primary)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> Gönderiliyor...</>
                        : <><Send size={16}/> Başvuruyu Gönder</>
                      }
                    </button>
                  </form>
                )}
              </div>
            </div>
            {/* END FORM */}

          </div>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <Footer/>
      </div>
      
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        body{background:#070709}
      `}</style>
    </div>
  );
}

function MetaBadge({icon,label,accent}:{icon:React.ReactNode;label:string;accent?:boolean}) {
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:8,
      background: accent ? "#cc161620" : "#ffffff08",
      border: accent ? "1px solid #cc161640" : "1px solid #ffffff10",
      borderRadius:24,padding:"10px 18px"
    }}>
      {icon}
      <span style={{color: accent ? "#ff6b6b" : "#ccc",fontSize:13,fontWeight:500,letterSpacing:"0.05em"}}>{label}</span>
    </div>
  );
}

function FormField({label,id,type,value,onChange,placeholder,required}:{
  label:string;id:string;type:string;value:string;
  onChange:(v:string)=>void;placeholder:string;required?:boolean
}) {
  return (
    <div>
      <label htmlFor={id} style={{display:"block",color:"#777",fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10}}>{label}</label>
      <input id={id} type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required={required}
        style={{width:"100%",background:"var(--color-bg-primary)",border:"1px solid #ffffff15",borderRadius:10,padding:"14px 16px",color:"#f0f0f0",fontSize:15,outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"}}
        onFocus={e=>(e.target.style.borderColor="#cc1616")}
        onBlur={e=>(e.target.style.borderColor="#ffffff15")}
      />
    </div>
  );
}
