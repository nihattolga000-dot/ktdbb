import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Image as ImageIcon, Loader2, Edit2, X } from 'lucide-react';
import { uploadToSupabase } from '../lib/supabase';

interface GalleryImage {
  id: string;
  imageUrl: string;
}

interface GalleryItem {
  id: string;
  title: string | null;
  imageUrl: string; // Cover
  date: string;
  images: GalleryImage[];
  createdAt: string;
}

export default function GalleryManagement() {
  const { token, user } = useAuth();
  const r = user?.role;
  const canManage = r === 'PRESIDENT' || r === 'SOSYAL_MEDYA_SORUMLUSU';
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps, react/set-state-in-effect */
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/gallery', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && imageFiles.length === 0) {
      setError('En az bir görsel seçmek zorunludur.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      let finalImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => uploadToSupabase(file, 'tdb-gallery'));
        finalImageUrls = await Promise.all(uploadPromises);
      }

      const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, 
          date,
          ...(finalImageUrls.length > 0 && { imageUrls: finalImageUrls }) 
        })
      });

      if (res.ok) {
        resetForm();
        fetchItems();
      } else {
        const data = await res.json();
        setError(data.error || 'Bir hata oluştu.');
      }
    } catch (err: any) {
      setError(err.message || 'Sunucu bağlantı hatası.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setTitle(item.title || '');
    setDate(item.date ? new Date(item.date).toISOString().split('T')[0] : '');
    setImageFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDate('');
    setImageFiles([]);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu görseli silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2 uppercase tracking-tight">Galeri Yönetimi</h1>
        <p className="text-neutral-400">Teşkilat etkinliklerinden fotoğrafları buradan galeriye ekleyebilirsiniz.</p>
      </div>

      {/* FORM CARD */}
      {canManage && (
      <div className="bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-neutral-900 to-[#0e0e12] border-b border-neutral-800/60 px-6 py-5 flex items-center gap-3">
          {editingId ? <Edit2 size={22} className="text-blue-500" /> : <Plus size={22} className="text-[#cc1616]" />}
          <h2 className="text-lg font-bold text-white tracking-wide uppercase">
            {editingId ? 'Görsel Bilgisini Düzenle' : 'Yeni Görsel Ekle'}
          </h2>
        </div>
        
        <div className="p-6 lg:p-8">
          {error && <div className="bg-[#cc1616]/10 border border-[#cc1616]/30 text-[#ff4d4d] px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Albüm Başlığı / Etkinlik Adı</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: 3 Mayıs Etkinliği"
                  className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Etkinlik Tarihi</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors"
                  required
                />
              </div>
            </div>

            {!editingId && (
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Görselleri Seç (Çoklu Seçim Yapabilirsiniz)</label>
                <div className="relative group w-full">
                  <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} required={!editingId}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full bg-[#050505] border border-dashed border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center text-neutral-500 group-hover:border-[#cc1616] group-hover:text-[#cc1616] transition-colors">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium text-center">{imageFiles.length > 0 ? `${imageFiles.length} görsel seçildi` : 'Görselleri seçmek için tıklayın veya sürükleyin'}</span>
                  </div>
                </div>
              </div>
            )}
            
            {imageFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {imageFiles.map((file, i) => (
                  <div key={i} className="border border-neutral-800 rounded-xl overflow-hidden w-24 h-24 relative bg-[#050505] flex items-center justify-center">
                    <img src={URL.createObjectURL(file)} alt="Önizleme" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-800/50">
              <button type="submit" disabled={submitting}
                className={`${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-[#cc1616] hover:bg-[#a01010] shadow-[#cc1616]/20'} text-white font-bold tracking-wide uppercase text-sm py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-50`}
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : (editingId ? 'Güncelle' : 'Sisteme Ekle')}
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
          <ImageIcon size={20} className="text-[#cc1616]" />
          Galeri Görselleri
        </h2>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={32} className="text-[#cc1616] animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-[#0e0e12] border border-neutral-800 border-dashed rounded-2xl">
            <ImageIcon size={48} className="mx-auto text-neutral-700 mb-4" />
            <p className="text-neutral-500 font-medium">Henüz galeriye görsel eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="group flex flex-col bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all shadow-xl">
                <div className="relative aspect-video w-full overflow-hidden bg-[#050505]">
                  <img src={item.imageUrl} alt={item.title || 'Galeri görseli'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                    <ImageIcon size={14} /> {item.images?.length || 0}
                  </div>
                  
                  {/* Actions overlay */}
                  {canManage && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button onClick={() => handleEdit(item)} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl" title="Albümü Düzenle">
                      <Edit2 size={20} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="bg-[#cc1616] hover:bg-red-700 text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl" title="Albümü Sil">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  )}
                </div>
                <div className="p-4 border-t border-neutral-800/60">
                  <h3 className="font-semibold text-white text-sm truncate mb-1">{item.title || 'İsimsiz Albüm'}</h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    {item.date ? new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih Yok'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
