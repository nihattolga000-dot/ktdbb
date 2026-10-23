import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Image as ImageIcon, Loader2, Edit2, X } from 'lucide-react';
import { API_BASE_URL } from '../data/config';

interface GalleryItem {
  id: string;
  title: string | null;
  imageUrl: string;
  createdAt: string;
}

export default function GalleryManagement() {
  const { token, user } = useAuth();
  const r = user?.role;
  const canManage = r === 'PRESIDENT' || r === 'SOSYAL_MEDYA_SORUMLUSU';
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps, react/set-state-in-effect */
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`, {
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
    if (!editingId && !imageFile) {
      setError('Bir görsel seçmek zorunludur.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      let finalImageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Görsel yüklenirken hata oluştu.');
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;
      }

      const url = editingId ? `${API_BASE_URL}/api/gallery/${editingId}` : `${API_BASE_URL}/api/gallery`;
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, 
          ...(finalImageUrl && { imageUrl: finalImageUrl }) 
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
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setImageFile(null);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu görseli silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
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
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Görsel Başlığı (Opsiyonel)</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: 3 Mayıs Etkinliği"
                className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors"
              />
            </div>

            {!editingId && (
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Görsel Seç (Zorunlu)</label>
                <div className="relative group w-full">
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} required={!editingId}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full bg-[#050505] border border-dashed border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center text-neutral-500 group-hover:border-[#cc1616] group-hover:text-[#cc1616] transition-colors">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium text-center">{imageFile ? imageFile.name : 'Görsel seçmek için tıklayın'}</span>
                  </div>
                </div>
              </div>
            )}
            
            {imageFile && (
              <div className="mt-4 border border-neutral-800 rounded-xl overflow-hidden w-48 h-32 relative bg-[#050505] flex items-center justify-center">
                <img src={URL.createObjectURL(imageFile)} alt="Önizleme" className="max-w-full max-h-full object-cover" />
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
                  
                  {/* Actions overlay */}
                  {canManage && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button onClick={() => handleEdit(item)} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl" title="Görseli Düzenle">
                      <Edit2 size={20} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="bg-[#cc1616] hover:bg-red-700 text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl" title="Görseli Sil">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  )}
                </div>
                {item.title && (
                  <div className="p-4 border-t border-neutral-800/60">
                    <h3 className="font-semibold text-white text-sm truncate">{item.title}</h3>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
