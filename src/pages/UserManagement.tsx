import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Trash2, Users, Shield, RefreshCw, Edit2, X, Loader2 } from 'lucide-react';

export default function UserManagement() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('MEMBER');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Kullanıcılar getirilemedi', err);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps, react/set-state-in-effect */
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const url = editingId 
        ? `/api/users/${editingId}` 
        : '/api/users';
        
      const body = editingId 
        ? JSON.stringify({ name, email }) 
        : JSON.stringify({ email, password, name, role });

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu');

      setSuccess(editingId ? 'Kullanıcı güncellendi.' : 'Yeni üye kaydedildi.');
      resetForm();
      fetchUsers();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setEmail('');
    setPassword('');
    setName('');
    setRole('KOMISYON_SOSYAL_MEDYA');
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Bu üyeyi silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Kullanıcı silinemedi');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Kullanıcı silinirken bir hata oluştu');
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Rol güncellenemedi');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Rol güncellenirken bir hata oluştu');
    }
  };

  const getRoleBadgeColor = (r: string) => {
    if (r === 'PRESIDENT') return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (r === 'VICE_PRESIDENT' || r === 'SECRETARY' || r === 'TESKILAT_BASKANI') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    if (r === 'SOSYAL_MEDYA_SORUMLUSU') return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (r.startsWith('KOMISYON')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-neutral-500/10 text-neutral-300 border-neutral-500/20';
  };

  if (user?.role !== 'PRESIDENT') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-20 h-20 bg-[#cc1616]/10 text-[#cc1616] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(204,22,22,0.15)]">
          <Shield size={36} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Erişim Reddedildi</h2>
        <p className="text-neutral-400 text-center max-w-md leading-relaxed">
          Bu sayfayı görüntülemek ve yönetmek için <strong className="text-white">İl Başkanı</strong> yetkisine sahip olmalısınız.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 uppercase tracking-tight">Üye Yönetimi</h1>
          <p className="text-neutral-400">Yönetim kurulu üyelerini ve komisyonları buradan yönetebilirsiniz.</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center justify-center gap-2 bg-[#0e0e12] border border-neutral-800 hover:border-neutral-600 text-neutral-300 px-5 py-2.5 rounded-xl transition-all font-medium text-sm w-full sm:w-auto">
          <RefreshCw size={16} /> Yenile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ADD USER FORM */}
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl lg:col-span-1 lg:sticky lg:top-24">
          <div className="bg-gradient-to-r from-neutral-900 to-[#0e0e12] border-b border-neutral-800/60 px-6 py-5 flex items-center gap-3">
            {editingId ? <Edit2 size={22} className="text-blue-500" /> : <UserPlus size={22} className="text-[#cc1616]" />}
            <h2 className="text-lg font-bold text-white tracking-wide uppercase">
              {editingId ? 'Üyeyi Düzenle' : 'Yeni Üye'}
            </h2>
          </div>

          <div className="p-6">
            {error && <div className="bg-[#cc1616]/10 border border-[#cc1616]/30 text-[#ff4d4d] px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium">{error}</div>}
            {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 font-medium">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Ad Soyad</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                  className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616]/50 focus:ring-1 focus:ring-[#cc1616]/50 transition-all shadow-inner" 
                  placeholder="Ahmet Yılmaz" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">E-posta</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                  className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616]/50 focus:ring-1 focus:ring-[#cc1616]/50 transition-all shadow-inner" 
                  placeholder="admin@kayseritdb.org" 
                />
              </div>
              
              {!editingId && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Geçici Şifre</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                      className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#cc1616]/50 focus:ring-1 focus:ring-[#cc1616]/50 transition-all shadow-inner" 
                      placeholder="••••••••" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Görev / Rol</label>
                    <div className="relative">
                      <select value={role} onChange={(e) => setRole(e.target.value)} 
                        className="w-full bg-[#050505] border border-white/10 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-[#cc1616]/50 focus:ring-1 focus:ring-[#cc1616]/50 transition-all cursor-pointer shadow-inner"
                      >
                        <option value="PRESIDENT">İl Başkanı</option>
                        <option value="VICE_PRESIDENT">İl Başkan Yrd.</option>
                        <option value="SECRETARY">İl Sekreteri</option>
                        <option value="TESKILAT_BASKANI">İl Teşkilat Başkanı</option>
                        <option value="SOSYAL_MEDYA_SORUMLUSU">Sosyal Medya Sorumlusu</option>
                        <option value="KOMISYON_SOSYAL_MEDYA">Sosyal Medya Komisyonu</option>
                        <option value="KOMISYON_TESKILAT">Teşkilatlanma Komisyonu</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">▼</div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex gap-2 pt-2 border-t border-neutral-800/50 mt-4">
                <button type="submit" disabled={submitting} 
                  className={`flex-1 ${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-[#cc1616] hover:bg-[#a01010] shadow-[#cc1616]/20'} text-white font-bold tracking-wide uppercase text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50`}
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 rounded-xl font-bold transition-all flex items-center justify-center">
                    <X size={20} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* USER LIST */}
        <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl lg:col-span-2 flex flex-col h-fit">
          <div className="bg-gradient-to-r from-neutral-900 to-[#0e0e12] border-b border-neutral-800/60 px-6 py-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Users size={22} className="text-[#cc1616]" />
              <h2 className="text-lg font-bold text-white tracking-wide uppercase">Sistem Üyeleri</h2>
            </div>
            <span className="bg-[#cc1616]/10 text-[#ff4d4d] text-xs font-bold px-2 py-1 rounded border border-[#cc1616]/20">{users.length} Kayıt</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 size={32} className="text-[#cc1616] animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-[10px] text-neutral-500 uppercase tracking-widest bg-neutral-900/40 border-b border-neutral-800/60">
                  <tr>
                    <th className="px-6 py-4 font-bold">Kullanıcı Bilgisi</th>
                    <th className="px-6 py-4 font-bold">Yetki / Rol</th>
                    <th className="px-6 py-4 font-bold text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/40">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-neutral-300 font-bold text-sm border border-neutral-700 shadow-inner">
                            {u.name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-bold">{u.name}</p>
                            <p className="text-neutral-500 text-[11px] uppercase tracking-wide mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {u.id === user?.id ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-[0.65rem] font-bold uppercase tracking-widest ${getRoleBadgeColor(u.role)}`}>
                            {u.role === 'PRESIDENT' ? 'İL BAŞKANI' : u.role}
                          </span>
                        ) : (
                          <div className="relative max-w-[200px]">
                            <select 
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className={`appearance-none w-full bg-[#050505] border text-[10px] font-bold uppercase tracking-widest rounded px-3 py-1.5 outline-none transition-colors cursor-pointer ${getRoleBadgeColor(u.role)} hover:border-neutral-500`}
                            >
                              <option value="PRESIDENT">İl Başkanı</option>
                              <option value="VICE_PRESIDENT">İl Başkan Yrd.</option>
                              <option value="SECRETARY">İl Sekreteri</option>
                              <option value="TESKILAT_BASKANI">İl Teşkilat Başkanı</option>
                              <option value="SOSYAL_MEDYA_SORUMLUSU">Sosyal Medya Sorumlusu</option>
                              <option value="KOMISYON_SOSYAL_MEDYA">Sosyal Medya Komisyonu</option>
                              <option value="KOMISYON_TESKILAT">Teşkilatlanma Komisyonu</option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-neutral-400 text-xs">▼</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id !== user?.id ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(u)} className="text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 lg:focus:opacity-100" title="Düzenle">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDeleteUser(u.id)} className="text-neutral-500 hover:text-[#ff4d4d] hover:bg-[#cc1616]/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 lg:focus:opacity-100" title="Sil">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-neutral-600 text-[10px] uppercase font-bold tracking-widest px-2">Korumalı</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-neutral-500 font-medium">
                        Sistemde kayıtlı başka üye bulunmuyor.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
