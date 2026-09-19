import { FileText, Image as ImageIcon, Calendar, Briefcase, Users, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Area */}
      <div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3 uppercase tracking-tight">
          Y�netim Paneli
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
          Sisteme ho� geldin, <strong className="text-white">{user?.name}</strong>. Sol men�den yetkili oldu�un sekmeleri se�erek i�erik g�ncellemelerini h�zl�ca yapabilirsin.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <DashboardCard 
          title="Galeri Durumu" 
          count="12" 
          label="Foto�raf" 
          icon={<ImageIcon size={28} className="text-[#cc1616]" />} 
          accentColor="#cc1616"
        />

        <DashboardCard 
          title="Aktif Haberler" 
          count="8" 
          label="Yay�nlanan" 
          icon={<FileText size={28} className="text-[#cc1616]" />} 
          accentColor="#cc1616"
        />

        <DashboardCard 
          title="Etkinlikler" 
          count="3" 
          label="Yakla�an" 
          icon={<Calendar size={28} className="text-neutral-300" />} 
          accentColor="#555555"
        />

        <DashboardCard 
          title="Projeler" 
          count="5" 
          label="Devam Eden" 
          icon={<Briefcase size={28} className="text-neutral-300" />} 
          accentColor="#555555"
        />

        {user?.role === 'PRESIDENT' && (
          <DashboardCard 
            title="Kay�tl� �yeler" 
            count="24" 
            label="Aktif �ye" 
            icon={<Users size={28} className="text-blue-500" />} 
            accentColor="#3b82f6"
          />
        )}
        
        <DashboardCard 
          title="Sistem Durumu" 
          count="Aktif" 
          label="Sorun Yok" 
          icon={<Activity size={28} className="text-green-500" />} 
          accentColor="#22c55e"
        />

      </div>

    </div>
  );
}

function DashboardCard({ title, count, label, icon, accentColor }: { title: string, count: string, label: string, icon: React.ReactNode, accentColor: string }) {
  return (
    <div className="group relative bg-[#0e0e12] border border-neutral-800/60 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:-translate-y-1">
      {/* Glow Effect on Hover */}
      <div 
        className="absolute -inset-1 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl rounded-3xl"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="relative z-10 flex items-start justify-between mb-4">
        <h3 className="font-semibold text-neutral-300 tracking-wide">{title}</h3>
        <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white tracking-tight">{count}</span>
          <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">{label}</span>
        </div>
      </div>
    </div>
  );
}
