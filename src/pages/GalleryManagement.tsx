import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Image as ImageIcon, Loader2, Edit2, X } from 'lucide-react';
import { API_BASE_URL } from '../data/config';
import MultiImageUploader from '../components/admin/MultiImageUploader';

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
  const [images, setImages] = useState<string[]>([]);
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
    if (images.length === 0) {
      setError('En az bir görsel seçmek zorunludur.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      if (editingId) {
        // Tekil güncelleme - görseli önce sunucuya yükle, ardından URL'i kaydet
        const uploaded = await uploadSingleImage(images[0]);
        const imageUrl = uploaded?.imageUrl || images[0];
        const res = await fetch(`${API_BASE_URL}/api/gallery/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ 
            title, 
            imageUrl
          })
        });

        if (res.ok) {
          resetForm();
          fetchItems();
        } else {
          const data = await res.json();
          setError(data.error || 'Bir hata oluştu.');
        }
      } else if (images.length === 1) {
        // Tekil ekleme - önce görseli sunucuya yükleyelim
        const uploaded = await uploadSingleImage(images[0]);
        const imageUrl = uploaded?.imageUrl || images[0];
        const res = await fetch(`${API_BASE_URL}/api/gallery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ 
            title: title || undefined, 
            imageUrl
          })
        });

        if (res.ok) {
          resetForm();
          fetchItems();
        } else {
          const data = await res.json();
          setError(data.error || 'Bir hata oluştu.');
        }
      } else {
        // Toplu ekleme - önce tüm görselleri /api/upload ile sunucuya gönder, sonra batch oluştur
        const uploadedItems = await Promise.all(images.map(img => uploadSingleImage(img)));
        const items = uploadedItems.map((u, idx) => ({
          title: title || undefined,
          imageUrl: u?.imageUrl || images[idx]
        }));
        const res = await fetch(`${API_BASE_URL}/api/gallery/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ items })
        });

        if (res.ok) {
          resetForm();
          fetchItems();
        } else {
          const data = await res.json();
          setError(data.error || 'Toplu fotoğraflar eklenemedi.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Sunucu bağlantı hatası.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: Base64 string'i Blob -> File yapıp /api/upload endpoint'ine gönderir
  const uploadSingleImage = async (base64: string): Promise<{ imageUrl: string } | null> => {
    try {
      // Base64 -> Blob
      const response = await fetch(base64);
      const blob = await response.blob();
      const file = new File([blob], `upload_${Date.now()}.jpg`, { type: blob.type });
      const form = new FormData();
      form.append('image', file);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      if (!res.ok) return null;
      const data = await res.json();
      return { imageUrl: data.imageUrl };
    } catch (e) {
      console.error('Görsel upload hatası', e);
      return null;
    }
  };



  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setTitle(item.title || '');
    setImages([item.imageUrl]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setImages([]);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu görseli silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchItems();
      } else {
        alert('Görsel silinemedi');
      }
    } catch (err) {
      console.error(err);
      alert('Görsel silinemedi');
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit', month: 'long', year: 'numeric'
    }).format(new Date(dateString));
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
            {editingId ? 'Görsel Bilgisini Düzenle' : 'Yeni Görsel Ekle (Çoklu Yükleme)'}
          </h2>
        </div>
        
        <div className="p-6 lg:p-8">
          {error && <div className="bg-[#cc1616]/10 border border-[#cc1616]/30 text-[#ff4d4d] px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                Görsel Başlığı / Albüm Adı (Opsiyonel)
              </label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: 3 Mayıs Türkçülük Günü"
                className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors"
              />
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Birden fazla fotoğraf seçtiğinizde bu başlık tüm seçilen fotoğraflara atanır.
              </p>
            </div>

            <div>
              <MultiImageUploader
                images={images}
                onChange={setImages}
                maxImages={editingId ? 1 : 30}
                label="Galeri Fotoğrafları"
                helperText={
                  editingId
                    ? 'Görseli değiştirmek için yeni bir görsel seçebilirsiniz.'
                    : 'Tek seferde 30 adete kadar fotoğraf seçebilir ve galeriye topluca ekleyebilirsiniz.'
                }
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-800/50">
              <button type="submit" disabled={submitting || images.length === 0}
                className={`${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-[#cc1616] hover:bg-[#a01010] shadow-[#cc1616]/20'} text-white font-bold tracking-wide uppercase text-sm py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-50`}
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : editingId ? (
                  'Güncelle'
                ) : images.length > 1 ? (
                  `Tümünü Galeriye Ekle (${images.length} Fotoğraf)`
                ) : (
                  'Galeriye Ekle'
                )}
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
          Galeri Görselleri ({items.length})
        </h2>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={32} className="text-[#cc1616] animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-[#0e0e12] border border-neutral-800 border-dashed rounded-2xl">
            <ImageIcon size={48} className="mx-auto text-neutral-700 mb-4" />
            <p className="text-neutral-500 font-medium">Henüz galeride görsel bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="group flex flex-col bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all shadow-xl">
                <div className="relative aspect-video bg-[#050505] overflow-hidden shrink-0 border-b border-neutral-800/60">
                  <img src={item.imageUrl} alt={item.title || 'Galeri'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {canManage && (
                      <>
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
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white mb-1 line-clamp-1">{item.title || 'Başlıksız Görsel'}</h3>
                  </div>
                  <div className="text-neutral-500 text-[0.7rem] uppercase tracking-wider mt-2">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
