import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Calendar, Loader2, Edit2, X, Image as ImageIcon, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { uploadToSupabase } from '../lib/supabase';

interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl: string | null;
}

interface EventRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function EventsManagement() {
  const { token, user } = useAuth();
  const r = user?.role;
  const canManage = r === 'PRESIDENT' || r === 'TESKILAT_BASKANI';
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Registrations state
  const [viewingEventId, setViewingEventId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps, react/set-state-in-effect */
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/events', {
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

  const handleViewRegistrations = async (id: string) => {
    setViewingEventId(id);
    setLoadingRegistrations(true);
    setRegistrations([]);
    try {
      const res = await fetch(`/api/events/${id}/registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !eventDate || !location) {
      setError('Tüm zorunlu alanları doldurun.');
      return;
    }
    setSubmitting(true);
    setError('');
    
    try {
      let finalImageUrl = null;
      if (imageFile) {
        finalImageUrl = await uploadToSupabase(imageFile, 'tdb-gallery');
      }

      const url = editingId ? `/api/events/${editingId}` : '/api/events';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, eventDate, location, imageUrl: finalImageUrl })
      });

      if (res.ok) {
        resetForm();
        fetchItems();
      } else {
        const data = await res.json();
        setError(data.error || 'Hata oluştu');
      }
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: EventItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    // Format date for datetime-local input (YYYY-MM-DDThh:mm)
    const d = new Date(item.eventDate);
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
    setEventDate(localISOTime);
    setLocation(item.location);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setEventDate('');
    setLocation('');
    setImageFile(null);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Emin misiniz?')) return;
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2 uppercase tracking-tight">Etkinlik Yönetimi</h1>
        <p className="text-neutral-400">Gelecek ve geçmiş tüm etkinlikleri buradan organize edebilirsiniz.</p>
      </div>

      {/* FORM CARD */}
      {canManage && (
      <div className="bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-neutral-900 to-[#0e0e12] border-b border-neutral-800/60 px-6 py-5 flex items-center gap-3">
          {editingId ? <Edit2 size={22} className="text-blue-500" /> : <Plus size={22} className="text-[#cc1616]" />}
          <h2 className="text-lg font-bold text-white tracking-wide uppercase">
            {editingId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Planla'}
          </h2>
        </div>
        
        <div className="p-6 lg:p-8">
          {error && <div className="bg-[#cc1616]/10 border border-[#cc1616]/30 text-[#ff4d4d] px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Etkinlik Adı</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                  className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Tarih ve Saat</label>
                <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required
                  className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Konum / Adres</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required
                  className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Açıklama</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required
                className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors resize-none scrollbar-thin scrollbar-thumb-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Afiş Görseli</label>
              <div className="relative group w-full md:w-1/2">
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full bg-[#050505] border border-dashed border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center text-neutral-500 group-hover:border-[#cc1616] group-hover:text-[#cc1616] transition-colors">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium text-center">{imageFile ? imageFile.name : 'Görsel yükle'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-800/50">
              <button type="submit" disabled={submitting}
                className={`${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-[#cc1616] hover:bg-[#a01010] shadow-[#cc1616]/20'} text-white font-bold tracking-wide uppercase text-sm py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-50`}
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : (editingId ? 'Güncelle' : 'Planla')}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold tracking-wide uppercase text-sm py-3 px-8 rounded-xl transition-colors flex items-center gap-2">
                  <X size={18} /> İptal
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      )}

      {/* LIST SECTION */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
          <Calendar size={20} className="text-[#cc1616]" />
          Yaklaşan ve Geçmiş Etkinlikler
        </h2>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={32} className="text-[#cc1616] animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-[#0e0e12] border border-neutral-800 border-dashed rounded-2xl">
            <Calendar size={48} className="mx-auto text-neutral-700 mb-4" />
            <p className="text-neutral-500 font-medium">Henüz kayıtlı etkinlik bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="group flex flex-col bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all shadow-xl">
                <div className="relative h-56 bg-[#050505] overflow-hidden shrink-0 border-b border-neutral-800/60 p-4 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <Calendar size={40} className="text-neutral-800" />
                  )}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Link to={`/etkinlik/${item.id}`} target="_blank" className="bg-neutral-800/80 hover:bg-neutral-700 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-sm" title="Görüntüle">
                      <Eye size={16} />
                    </Link>
                    {canManage && (
                      <>
                        <button onClick={() => handleViewRegistrations(item.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-sm" title="Katılımcıları Gör">
                          <Users size={16} />
                        </button>
                        <button onClick={() => handleEdit(item)} className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-sm" title="Düzenle">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="bg-[#cc1616] hover:bg-red-700 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-sm" title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[#cc1616] text-[0.65rem] font-bold uppercase tracking-widest mb-2 flex justify-between">
                    <span>{formatDate(item.eventDate)}</span>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2 leading-snug">{item.title}</h3>
                  <p className="text-neutral-400 text-sm mb-3 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-neutral-600"/> {item.location}</p>
                  <p className="text-neutral-500 text-sm line-clamp-2 mt-auto">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REGISTRATIONS MODAL */}
      {viewingEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e0e12] border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-neutral-900/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="text-emerald-500" size={24} /> Katılımcı Listesi
              </h3>
              <button onClick={() => setViewingEventId(null)} className="text-neutral-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-neutral-800">
              {loadingRegistrations ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-10 text-neutral-500">Bu etkinliğe henüz kayıt olan kimse yok.</div>
              ) : (
                <div className="space-y-4">
                  {registrations.map(reg => (
                    <div key={reg.id} className="bg-[#050505] border border-neutral-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-white">{reg.name}</div>
                        <div className="text-sm text-neutral-400 mt-1">{reg.email}</div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-emerald-500 font-medium">{reg.phone}</div>
                        <div className="text-xs text-neutral-600 mt-1">{formatDate(reg.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
