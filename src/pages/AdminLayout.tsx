import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, Image as ImageIcon, FileText, Calendar, Briefcase, ArrowLeft, Menu, X, Mailbox } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const r = user?.role;
  const isPresident = r === 'PRESIDENT';
  const isVP = r === 'VICE_PRESIDENT';

  const canViewUsers = isPresident;
  const canManageSocialMedia = isPresident || r === 'SOSYAL_MEDYA_SORUMLUSU';
  const canViewSocialMedia = canManageSocialMedia || isVP || r === 'KOMISYON_SOSYAL_MEDYA';

  const canManageEvents = isPresident || r === 'TESKILAT_BASKANI';
  const canViewEvents = canManageEvents || isVP || r === 'KOMISYON_TESKILAT';

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0a0a0c] text-neutral-100 font-sans selection:bg-red-500/30">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0d0d0f] border-b border-white/5 sticky top-0 z-40 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#cc1616] to-[#7a0d0d] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 border border-white/10">
            <span className="font-bold text-white text-xs tracking-wider">KT</span>
          </div>
          <h2 className="font-display text-lg font-bold text-white tracking-widest uppercase">Admin</h2>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* OVERLAY FOR MOBILE */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0d0d0f]/95 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col 
        transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Subtle gradient background effect */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#cc1616]/10 to-transparent pointer-events-none" />
        
        <div className="mb-8 relative z-10 hidden lg:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#cc1616] to-[#7a0d0d] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 border border-white/10">
              <span className="font-bold text-white tracking-wider">KT</span>
            </div>
            <h2 className="font-display text-xl font-bold text-white tracking-widest uppercase">Admin</h2>
          </div>
          
          {user && (
            <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Hoş Geldin</p>
              <p className="text-white font-medium truncate text-sm">{user.name}</p>
              <div className="mt-2 inline-flex items-center px-2 py-1 rounded-md bg-[#cc1616]/10 text-[#ff4d4d] text-[0.65rem] font-bold uppercase tracking-widest border border-[#cc1616]/20">
                {user.role.replace('KOMISYON_', 'K_')}
              </div>
            </div>
          )}
        </div>
        
        <nav className="flex flex-col gap-1.5 flex-1 relative z-10 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-white/10">
          <Link 
            to="/admin" 
            onClick={closeMenu}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border border-transparent ${isActive('/admin') ? 'bg-[#cc1616]/10 text-[#ff4d4d] border-[#cc1616]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} className={isActive('/admin') ? 'text-[#ff4d4d]' : 'text-neutral-500'} />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          {canViewUsers && (
            <>
              <Link 
                to="/admin/users" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border border-transparent ${isActive('/admin/users') ? 'bg-[#cc1616]/10 text-[#ff4d4d] border-[#cc1616]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                <Users size={18} className={isActive('/admin/users') ? 'text-[#ff4d4d]' : 'text-neutral-500'} />
                <span className="font-medium text-sm">Üye Yönetimi</span>
              </Link>
              <Link 
                to="/admin/applications" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border border-transparent ${isActive('/admin/applications') ? 'bg-[#cc1616]/10 text-[#ff4d4d] border-[#cc1616]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                <Mailbox size={18} className={isActive('/admin/applications') ? 'text-[#ff4d4d]' : 'text-neutral-500'} />
                <span className="font-medium text-sm">Başvurular</span>
              </Link>
            </>
          )}

          {canViewSocialMedia && (
            <>
              <Link 
                to="/admin/gallery" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border border-transparent ${isActive('/admin/gallery') ? 'bg-[#cc1616]/10 text-[#ff4d4d] border-[#cc1616]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                <ImageIcon size={18} className={isActive('/admin/gallery') ? 'text-[#ff4d4d]' : 'text-neutral-500'} />
                <span className="font-medium text-sm">Galeri Yönetimi</span>
              </Link>

              <Link 
                to="/admin/news" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border border-transparent ${isActive('/admin/news') ? 'bg-[#cc1616]/10 text-[#ff4d4d] border-[#cc1616]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                <FileText size={18} className={isActive('/admin/news') ? 'text-[#ff4d4d]' : 'text-neutral-500'} />
                <span className="font-medium text-sm">Haberler</span>
              </Link>
            </>
          )}

          {canViewEvents && (
            <>
              <Link 
                to="/admin/events" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border border-transparent ${isActive('/admin/events') ? 'bg-[#cc1616]/10 text-[#ff4d4d] border-[#cc1616]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                <Calendar size={18} className={isActive('/admin/events') ? 'text-[#ff4d4d]' : 'text-neutral-500'} />
                <span className="font-medium text-sm">Etkinlikler</span>
              </Link>
              
              <Link 
                to="/admin/event-applications" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border border-transparent ${isActive('/admin/event-applications') ? 'bg-[#cc1616]/10 text-[#ff4d4d] border-[#cc1616]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                <Users size={18} className={isActive('/admin/event-applications') ? 'text-[#ff4d4d]' : 'text-neutral-500'} />
                <span className="font-medium text-sm">Etkinlik Başvuruları</span>
              </Link>

              <Link 
                to="/admin/projects" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border border-transparent ${isActive('/admin/projects') ? 'bg-[#cc1616]/10 text-[#ff4d4d] border-[#cc1616]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
              >
                <Briefcase size={18} className={isActive('/admin/projects') ? 'text-[#ff4d4d]' : 'text-neutral-500'} />
                <span className="font-medium text-sm">Projeler</span>
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex flex-col gap-2 mt-auto pt-6 border-t border-white/5 relative z-10 shrink-0">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400 hover:text-white hover:border-white/10 hover:bg-white/5 transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Siteye Dön</span>
          </button>
          
          <button 
            onClick={logout} 
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#cc1616]/5 border border-[#cc1616]/10 text-neutral-400 hover:text-[#ff4d4d] hover:border-[#cc1616]/30 hover:bg-[#cc1616]/10 transition-all"
          >
            <LogOut size={16} />
            <span className="font-medium text-sm">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 lg:p-10 lg:pl-16 overflow-y-auto relative min-h-screen">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#cc1616] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
