import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, FileText, Loader2, Edit2, X, Image as ImageIcon, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../data/config';
import { compressImage } from '../utils/imageCompressor';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function NewsManagement() {
  const { token, user } = useAuth();
  const r = user?.role;
  const canManage = r === 'PRESIDENT' || r === 'SOSYAL_MEDYA_SORUMLUSU';
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps, react/set-state-in-effect */
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/news`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setError('');
      const compressed = await compressImage(file);
      setImageFile(file);
      setImagePreview(compressed);
    } catch (err: any) {
      setError(err.message || 'Görsel işlenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Başlık ve içerik zorunludur.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      let finalImageUrl = existingImageUrl;
      if (imagePreview) {
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ image: imagePreview })
        });
        if (!uploadRes.ok) {
          throw new Error('Görsel yüklenirken hata oluştu.');
        }
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;
      }

      const url = editingId 
        ? `${API_BASE_URL}/api/news/${editingId}` 
        : `${API_BASE_URL}/api/news`;
        
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, 
          content, 
          imageUrl: finalImageUrl
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

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(item.imageUrl || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        alert('Silme işlemi başarısız.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(d);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2 uppercase tracking-tight">Haber Yönetimi</h1>
        <p className="text-neutral-400">Teşkilat haberlerini ve duyurularını buradan yönetebilirsiniz.</p>
      </div>

      {/* FORM CARD */}
      {canManage && (
      <div className="bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-neutral-900 to-[#0e0e12] border-b border-neutral-800/60 px-6 py-5 flex items-center gap-3">
          {editingId ? <Edit2 size={22} className="text-blue-500" /> : <Plus size={22} className="text-[#cc1616]" />}
          <h2 className="text-lg font-bold text-white tracking-wide uppercase">
            {editingId ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}
          </h2>
        </div>
        
        <div className="p-6 lg:p-8">
          {error && <div className="bg-[#cc1616]/10 border border-[#cc1616]/30 text-[#ff4d4d] px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Haber Başlığı</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors"
                placeholder="Örn: Yeni Dönem Başlıyor..."
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Haber İçeriği</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors resize-none scrollbar-thin scrollbar-thumb-neutral-800"
                placeholder="Haber metnini buraya giriniz..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Kapak Görseli</label>
              {(imagePreview || existingImageUrl) ? (
                <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-[#050505] p-3 flex items-center gap-4">
                  <img 
                    src={imagePreview || existingImageUrl || ''} 
                    alt="Önizleme" 
                    className="w-24 h-24 object-cover rounded-lg border border-neutral-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {imageFile ? imageFile.name : 'Mevcut Görsel'}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {imagePreview ? 'Yeni görsel seçildi ve optimize edildi.' : 'Değiştirmek istemiyorsanız bu görsel korunur.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setExistingImageUrl(null);
                      }}
                      className="mt-2 text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <X size={14} /> Görseli Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group w-full">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full bg-[#050505] border border-dashed border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center text-neutral-500 group-hover:border-[#cc1616] group-hover:text-[#cc1616] transition-colors">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">Görsel seçmek veya sürüklemek için tıklayın</span>
                    <span className="text-xs text-neutral-500 mt-1">JPG, PNG, WebP (Otomatik optimize edilir)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-800/50">
              <button 
                type="submit" 
                disabled={submitting}
                className={`${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-[#cc1616] hover:bg-[#a01010] shadow-[#cc1616]/20'} text-white font-bold tracking-wide uppercase text-sm py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-50`}
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : (editingId ? 'Güncelle' : 'Haberi Yayınla')}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold tracking-wide uppercase text-sm py-3 px-8 rounded-xl transition-colors flex items-center gap-2"
                >
                  <X size={18} />
                  İptal
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
          <FileText size={20} className="text-[#cc1616]" />
          Yayınlanmış Haberler
        </h2>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={32} className="text-[#cc1616] animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-[#0e0e12] border border-neutral-800 border-dashed rounded-2xl">
            <FileText size={48} className="mx-auto text-neutral-700 mb-4" />
            <p className="text-neutral-500 font-medium">Henüz kayıtlı haber bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="group flex flex-col bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all shadow-xl">
                {/* Image Area */}
                <div className="relative h-48 bg-[#050505] overflow-hidden shrink-0 border-b border-neutral-800/60">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={40} className="text-neutral-800" />
                    </div>
                  )}
                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Link
                      to={`/haber/${item.id}`}
                      target="_blank"
                      className="bg-neutral-800/80 hover:bg-neutral-700 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-sm"
                      title="Görüntüle"
                    >
                      <Eye size={16} />
                    </Link>
                    {canManage && (
                      <>
                        <button 
                          onClick={() => handleEdit(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-sm"
                          title="Düzenle"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="bg-[#cc1616] hover:bg-red-700 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-sm"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-[#cc1616] text-[0.65rem] font-bold uppercase tracking-widest mb-2">
                    {formatDate(item.createdAt)}
                  </div>
                  <h3 className="font-bold text-lg text-white mb-3 leading-snug line-clamp-2">{item.title}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-3 mb-0 flex-1">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
