'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Send, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar({ onLoginClick, onRegisterClick, isDashboard = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
      }
    };
    checkSession();
  }, []);

  const handleNavClick = (path) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleAuthAction = (mode) => {
    setIsOpen(false);
    if (pathname === '/') {
      if (mode === 'login' && onLoginClick) onLoginClick();
      if (mode === 'register' && onRegisterClick) onRegisterClick();
    } else {
      // Redirect to home with query parameters to trigger auth modal
      router.push(`/?auth=${mode}`);
    }
  };

  const navLinks = [
    { name: 'Fitur', path: '/fitur' },
    { name: 'Keamanan', path: '/keamanan' },
    { name: 'Tentang Kami', path: '/tentang' },
  ];

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-50 animate-fade-in-up">
      <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between border border-card-border relative shadow-lg">
        {/* Logo Branding */}
        <div 
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 group-active:scale-95 transition-transform duration-300">
            <Send className="text-white w-4 h-4 -rotate-45 transform translate-x-[-1px] translate-y-[1px]" />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-foreground font-display">
            fly<span className="text-cyan-500 font-bold">.link</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className={`hover:text-foreground relative py-1 cursor-pointer transition-colors duration-200 ${
                pathname === link.path ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              {link.name}
              {pathname === link.path && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!isDashboard && (
            isLoggedIn ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 cursor-pointer active:scale-95"
              >
                Ke Dasbor
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleAuthAction('login')}
                  className="px-5 py-2.5 text-xs font-bold text-foreground bg-white/[0.02] border border-card-border hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
                >
                  Masuk
                </button>
                <button
                  onClick={() => handleAuthAction('register')}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition-all shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 cursor-pointer active:scale-95"
                >
                  Daftar Gratis
                </button>
              </>
            )
          )}
        </div>

        {/* Mobile Header Menu Button */}
        <div className="flex md:hidden items-center">
          {/* Hamburger Icon */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-white/[0.02] border border-card-border text-foreground cursor-pointer active:scale-95 transition-all"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu - SOLID DARK BACKDROP & SMOOTH CLOSE TRANSITION */}
      <div className={`absolute top-[88px] left-4 right-4 z-40 md:hidden bg-[#0a0d18] rounded-2xl p-6 border border-white/10 shadow-2xl transition-all duration-300 ease-out ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-[-10px] pointer-events-none'
      }`}>
        <nav className="flex flex-col gap-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className={`text-left py-2 hover:text-foreground transition-colors ${
                pathname === link.path ? 'text-cyan-400 font-bold border-l-2 border-cyan-500 pl-3' : 'pl-3'
              }`}
            >
              {link.name}
            </button>
          ))}

          {!isDashboard && (
            <div className="flex flex-col gap-2.5 pt-4 border-t border-white/5">
              {isLoggedIn ? (
                <button
                  onClick={() => { setIsOpen(false); router.push('/dashboard'); }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-cyan-500/10 active:scale-95 transition-transform cursor-pointer"
                >
                  Ke Dasbor
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthAction('login')}
                    className="w-full bg-white/[0.02] border border-card-border text-foreground hover:bg-white/[0.06] py-3 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-transform cursor-pointer"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => handleAuthAction('register')}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-cyan-500/10 active:scale-95 transition-transform cursor-pointer"
                  >
                    Daftar Gratis
                  </button>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
