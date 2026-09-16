import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Briefcase, Loader2, Edit2, X, Image as ImageIcon, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  status: 'PLANNING' | 'ONGOING' | 'COMPLETED';
  imageUrl: string | null;
  createdAt: string;
}

export default function ProjectsManagement() {
  const { token, user } = useAuth();
  const r = user?.role;
  const canManage = r === 'PRESIDENT' || r === 'TESKILAT_BASKANI';
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'PLANNING' | 'ONGOING' | 'COMPLETED'>('PLANNING');
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
      const res = await fetch('http://localhost:5000/api/projects', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Başlık ve açıklama zorunludur.');
      return;
    }
    setSubmitting(true);
    setError('');
    
    try {
      let finalImageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        if (!uploadRes.ok) throw new Error('Görsel yüklenemedi');
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;
      }

      const url = editingId ? `http://localhost:5000/api/projects/${editingId}` : 'http://localhost:5000/api/projects';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, status, imageUrl: finalImageUrl })
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

  const handleEdit = (item: ProjectItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setStatus(item.status);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStatus('PLANNING');
    setImageFile(null);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Projeyi silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'PLANNING': return <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Planlanıyor</span>;
      case 'ONGOING': return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Devam Ediyor</span>;
      case 'COMPLETED': return <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">Tamamlandı</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2 uppercase tracking-tight">Proje Yönetimi</h1>
        <p className="text-neutral-400">Teşkilatımızın yürüttüğü ve planladığı projeleri yönetin.</p>
      </div>

      {/* FORM CARD */}
      {canManage && (
      <div className="bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-neutral-900 to-[#0e0e12] border-b border-neutral-800/60 px-6 py-5 flex items-center gap-3">
          {editingId ? <Edit2 size={22} className="text-blue-500" /> : <Plus size={22} className="text-[#cc1616]" />}
          <h2 className="text-lg font-bold text-white tracking-wide uppercase">
            {editingId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
          </h2>
        </div>
        
        <div className="p-6 lg:p-8">
          {error && <div className="bg-[#cc1616]/10 border border-[#cc1616]/30 text-[#ff4d4d] px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Proje Başlığı</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                  className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Proje Durumu</label>
                <div className="relative">
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-[#cc1616] transition-colors cursor-pointer"
                  >
                    <option value="PLANNING">Planlanıyor</option>
                    <option value="ONGOING">Devam Ediyor</option>
                    <option value="COMPLETED">Tamamlandı</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">▼</div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Proje Detayları</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required
                className="w-full bg-[#050505] border border-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616] transition-colors resize-none scrollbar-thin scrollbar-thumb-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Proje Kapak Görseli</label>
              <div className="relative group w-full md:w-1/2">
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full bg-[#050505] border border-dashed border-neutral-700 rounded-xl p-6 flex flex-col items-center justify-center text-neutral-500 group-hover:border-[#cc1616] group-hover:text-[#cc1616] transition-colors">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium text-center">{imageFile ? imageFile.name : 'Görsel yüklemek için tıkla'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-800/50">
              <button type="submit" disabled={submitting}
                className={`${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-[#cc1616] hover:bg-[#a01010] shadow-[#cc1616]/20'} text-white font-bold tracking-wide uppercase text-sm py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-50`}
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : (editingId ? 'Güncelle' : 'Projeyi Ekle')}
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
          <Briefcase size={20} className="text-[#cc1616]" />
          Tüm Projeler
        </h2>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={32} className="text-[#cc1616] animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-[#0e0e12] border border-neutral-800 border-dashed rounded-2xl">
            <Briefcase size={48} className="mx-auto text-neutral-700 mb-4" />
            <p className="text-neutral-500 font-medium">Kayıtlı proje bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="group flex flex-col bg-[#0e0e12] border border-neutral-800/60 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all shadow-xl">
                <div className="relative h-48 bg-[#050505] overflow-hidden shrink-0 border-b border-neutral-800/60">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={40} className="text-neutral-800" />
                    </div>
                  )}
                  {/* Status overlay */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(item.status)}
                  </div>
                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Link to={`/proje/${item.id}`} target="_blank" className="bg-neutral-800/80 hover:bg-neutral-700 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-sm" title="Görüntüle">
                      <Eye size={16} />
                    </Link>
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
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-white mb-3 leading-snug">{item.title}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-3 mt-auto">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
