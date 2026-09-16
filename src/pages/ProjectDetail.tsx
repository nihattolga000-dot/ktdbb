import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Activity } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function getStatus(s:string){
  if(s==="ONGOING")   return {label:"Devam Ediyor",color:"#22c55e",bg:"#22c55e15",border:"#22c55e30"};
  if(s==="COMPLETED") return {label:"Tamamlandı",  color:"#3b82f6",bg:"#3b82f615",border:"#3b82f630"};
  return                      {label:"Planlanıyor", color:"#f59e0b",bg:"#f59e0b15",border:"#f59e0b30"};
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/${id}`)
      .then(r => r.json())
      .then(d => { setProject(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{minHeight:"100vh",background:"var(--color-bg-primary)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:40,height:40,border:"2px solid #cc161640",borderTopColor:"#cc1616",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/>
        <p style={{color:"#666",fontFamily:"Oswald,sans-serif",letterSpacing:"0.3em",fontSize:11,textTransform:"uppercase"}}>Yükleniyor</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!project || project.error) return (
    <div style={{minHeight:"100vh",background:"var(--color-bg-primary)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:24}}>
      <Activity size={48} color="#333"/>
      <p style={{color:"#666",fontFamily:"Oswald,sans-serif",letterSpacing:"0.2em",textTransform:"uppercase"}}>Proje Bulunamadı</p>
      <Link to="/" style={{color:"#cc1616",fontSize:13,textDecoration:"none"}}>← Ana Sayfaya Dön</Link>
    </div>
  );

  const st = getStatus(project.status);
  const dateStr = new Date(project.createdAt).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});

  return (
    <div style={{background:"var(--color-bg-primary)",minHeight:"100vh",color:"#f0f0f0"}}>
      <Navbar />

      {/* BACKGROUND GLOW */}
      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        {project.imageUrl && (
          <img src={project.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"blur(80px) brightness(0.2) saturate(1.5)",transform:"scale(1.2)"}}/>
        )}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,#070709cc,#070709)"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:1280,margin:"0 auto",padding:"120px 32px 80px"}}>
        <Link to="/" style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:32,color:"#888",fontSize:12,textDecoration:"none",letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,transition:"color 0.2s"}}>
          <ArrowLeft size={14}/> Ana Sayfaya Dön
        </Link>

        {/* 2-COLUMN LAYOUT */}
        <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.3fr)",gap:64,alignItems:"start"}}>
          
          {/* LEFT: IMAGE */}
          <div style={{position:"sticky",top:120}}>
            <div style={{position:"relative",marginBottom:32}}>
              <div style={{position:"absolute",inset:-1,background:"linear-gradient(135deg,#cc1616,transparent 60%)",borderRadius:16,opacity:0.5}}/>
              {project.imageUrl
                ? <img src={project.imageUrl} alt={project.title} style={{width:"100%",height:"auto",borderRadius:14,display:"block",boxShadow:"0 32px 64px color-mix(in srgb, var(--color-bg-primary) 70%, transparent)",position:"relative"}}/>
                : <div style={{aspectRatio:"16/9",background:"#111",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}><Activity size={56} color="#333"/></div>
              }
            </div>
          </div>

          {/* RIGHT: TITLE, META & CONTENT */}
          <div>
            <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:8,background:"#cc161620",border:"1px solid #cc161640",borderRadius:20,padding:"6px 16px"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#cc1616",animation:"pulse 2s infinite"}}/>
                <span style={{color:"#cc1616",fontSize:10,fontWeight:700,letterSpacing:"0.25em",textTransform:"uppercase",fontFamily:"Oswald,sans-serif"}}>PROJE</span>
              </span>
              <span style={{display:"inline-flex",alignItems:"center",gap:7,background:st.bg,border:`1px solid ${st.border}`,borderRadius:20,padding:"6px 16px"}}>
                <span style={{color:st.color,fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase"}}>{st.label}</span>
              </span>
            </div>

            <h1 style={{fontFamily:"Oswald,sans-serif",fontSize:"clamp(2.5rem,4vw,4rem)",fontWeight:700,lineHeight:1.05,letterSpacing:"-0.01em",textTransform:"uppercase",margin:"0 0 32px",color:"var(--color-text-primary)"}}>
              {project.title}
            </h1>

            <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:48}}>
              <MetaBadge icon={<Calendar size={14} color="#cc1616"/>} label={dateStr}/>
            </div>

            <div>
              <h2 style={{fontFamily:"Oswald,sans-serif",fontSize:18,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--color-text-primary)",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
                <span style={{display:"block",width:24,height:2,background:"#cc1616"}}/>
                Proje Detayı
              </h2>
              <div style={{color:"#999",lineHeight:1.8,fontSize:15,wordBreak:"break-word",overflowWrap:"break-word"}}>
                {project.description?.split("\n").map((p:string,i:number) => p.trim() ? <p key={i} style={{margin:"0 0 20px"}}>{p}</p> : null)}
              </div>
            </div>

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
