import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Trash2, Mail, Users, Eye, X, Loader2, Mailbox } from 'lucide-react';

export default function ApplicationsManagement() {
  const { token } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewingApp, setViewingApp] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApps = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      }
    } catch (err) {
      console.error('Başvurular getirilemedi', err);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps, react/set-state-in-effect */
  useEffect(() => {
    fetchApps();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm('Bu başvuruyu onaylamak ve WhatsApp davet linkini mail olarak göndermek istediğinize emin misiniz?')) return;
    setProcessingId(id);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu');

      setSuccess('Başvuru onaylandı ve mail gönderildi.');
      fetchApps();
      setTimeout(() => setSuccess(''), 3000);
      if (viewingApp?.id === id) setViewingApp(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu başvuruyu reddedip/silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setApps(apps.filter(a => a.id !== id));
        if (viewingApp?.id === id) setViewingApp(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-neutral-400">
        <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-xs tracking-[0.2em] uppercase font-oswald">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-oswald uppercase text-white tracking-wide flex items-center gap-3">
            <Users className="text-red-600" />
            Üyelik Başvuruları
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Gelen üyelik başvurularını inceleyin, onaylayın ve otomatik WhatsApp linki gönderin.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
          {success}
        </div>
      )}

      {/* Applications List */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-oswald text-white uppercase tracking-wide">Başvuru Listesi ({apps.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">İsim</th>
                  <th className="px-6 py-4 font-medium tracking-wider">E-Posta</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Tarih</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Durum</th>
                  <th className="px-6 py-4 font-medium tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                      Henüz bir başvuru bulunmuyor.
                    </td>
                  </tr>
                ) : apps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-200">{app.name}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">{app.email}</td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      {app.status === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] uppercase font-bold tracking-wider">
                          <CheckCircle size={12} />
                          ONAYLANDI
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] uppercase font-bold tracking-wider">
                          <Loader2 size={12} />
                          BEKLİYOR
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewingApp(app)}
                          className="flex items-center gap-2 text-neutral-400 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all border border-white/5"
                          title="İncele"
                        >
                          <Eye size={16} />
                          <span className="text-xs font-medium uppercase tracking-wider">İncele</span>
                        </button>
                        {app.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleApprove(app.id)}
                            disabled={processingId === app.id}
                            className="text-neutral-500 hover:text-green-500 hover:bg-green-500/10 p-2 rounded-lg transition-all disabled:opacity-50"
                            title="Onayla ve Mail Gönder"
                          >
                            {processingId === app.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                          title="Sil / Reddet"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Application Detail Modal */}
        {viewingApp && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-white/5 p-5 flex items-center justify-between z-20">
                <h3 className="font-oswald text-xl uppercase tracking-wide text-white flex items-center gap-2">
                  <Mailbox size={20} className="text-[#cc1616]" />
                  Başvuru Detayı
                </h3>
                <button onClick={() => setViewingApp(null)} className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Ad Soyad</div>
                    <div className="text-white font-medium">{viewingApp.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Telefon</div>
                    <div className="text-white font-medium">{viewingApp.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">E-Posta</div>
                    <div className="text-white font-medium flex items-center gap-2">
                      <Mail size={14} className="text-neutral-400" />
                      {viewingApp.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Başvuru Tarihi</div>
                    <div className="text-white font-medium">{new Date(viewingApp.createdAt).toLocaleDateString('tr-TR')}</div>
                  </div>
                </div>

                {/* Questionnaire */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-[#cc1616] uppercase tracking-widest mb-4">Üyelik Soruları</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { q: 'Doğum Tarihi', a: viewingApp.birthDate },
                      { q: "Kayseri'de mi yaşıyor?", a: viewingApp.livesInKayseri },
                      { q: 'Eğitim Durumu', a: viewingApp.education },
                      { q: 'İdeolojik Görüş', a: viewingApp.ideology },
                      { q: 'Siyasi Parti Üyeliği', a: viewingApp.politicalParty },
                      { q: 'En Beğenilen Lider', a: viewingApp.favoriteLeader },
                      { q: 'Türkçülüğün Tanımı', a: viewingApp.definitionTurkculuk },
                      { q: 'Turan Ne Demek', a: viewingApp.turanMeaning },
                      { q: 'Katılma Sebebi', a: viewingApp.reasonToJoin },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">{item.q}</div>
                        <div className="text-sm text-neutral-200">{item.a || '-'}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 mt-3">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">Eklenen Mesaj</div>
                    <div className="text-sm text-neutral-200 whitespace-pre-wrap">{viewingApp.message || '-'}</div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/5 p-5 flex justify-end gap-3 z-20 rounded-b-2xl">
                {viewingApp.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleApprove(viewingApp.id)}
                    disabled={processingId === viewingApp.id}
                    className="px-6 py-2.5 bg-green-600/10 hover:bg-green-600/20 text-green-500 border border-green-600/30 font-bold tracking-wider uppercase text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg"
                  >
                    {processingId === viewingApp.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    Onayla ve Davet Gönder
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
