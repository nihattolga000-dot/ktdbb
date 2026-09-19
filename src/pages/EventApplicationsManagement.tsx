import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Users, Calendar } from 'lucide-react';

interface EventRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  event: {
    title: string;
  };
}

export default function EventApplicationsManagement() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  
  const canView = user?.role === 'PRESIDENT' || user?.role === 'VICE_PRESIDENT' || user?.role === 'TESKILAT_BASKANI' || user?.role === 'KOMISYON_TESKILAT';

  useEffect(() => {
    if (canView) {
      fetchItems();
    } else {
      setLoading(false);
    }
  }, [canView]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/event-registrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Users size={64} className="text-neutral-700 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Yetkisiz Erişim</h2>
        <p className="text-neutral-500 text-center max-w-md">Bu sayfayı görüntülemek için Etkinlik Komisyonu yetkisine sahip olmalısınız.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2 uppercase tracking-tight">Etkinlik Başvuruları</h1>
        <p className="text-neutral-400">Tüm etkinliklere yapılan başvuruları ve katılımcı listelerini buradan takip edebilirsiniz.</p>
      </div>

      <div className="bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-neutral-900 to-[#0e0e12] border-b border-neutral-800/60 px-6 py-5 flex items-center gap-3">
          <Users size={22} className="text-emerald-500" />
          <h2 className="text-lg font-bold text-white tracking-wide uppercase">Tüm Katılımcılar</h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={32} className="text-emerald-500 animate-spin" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-[#050505] border border-neutral-800 border-dashed rounded-2xl">
              <Users size={48} className="mx-auto text-neutral-700 mb-4" />
              <p className="text-neutral-500 font-medium">Henüz herhangi bir etkinliğe katılım başvurusu bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(reg => (
                <div key={reg.id} className="bg-[#050505] border border-neutral-800 p-5 rounded-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#cc1616]/10 text-[#ff4d4d] text-xs font-bold uppercase tracking-wider border border-[#cc1616]/20 mb-3">
                      <Calendar size={12} /> {reg.event?.title || 'Bilinmeyen Etkinlik'}
                    </div>
                    <div className="font-bold text-lg text-white">{reg.name}</div>
                    <div className="text-sm text-neutral-400 mt-1">{reg.email}</div>
                  </div>
                  <div className="flex items-end justify-between border-t border-neutral-800 pt-3">
                    <div className="text-emerald-500 font-medium text-sm">{reg.phone}</div>
                    <div className="text-xs text-neutral-600">{formatDate(reg.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
