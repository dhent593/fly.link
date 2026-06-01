'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Send, ArrowRight, Zap, CheckCircle, AlertTriangle, Info, X, Mail, Lock, Link2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const [isLoginView, setIsLoginView] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [tempSlug, setTempSlug] = useState('');
  const [showVerifyScreen, setShowVerifyScreen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Toast State
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  // Safe client-side reading of URL parameters and session checking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authVal = params.get('auth');
      if (authVal === 'login') {
        setIsLoginView(true);
        setAuthMode('login');
      } else if (authVal === 'register') {
        setIsLoginView(true);
        setAuthMode('register');
      }
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
      }
    };
    checkSession();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    // Auto-hide
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleAuth = async (e, type) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Email dan password wajib diisi!', 'error');
      return;
    }
    setLoading(true);

    if (type === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Login berhasil! Mengalihkan...', 'success');
        setTimeout(() => router.push('/dashboard'), 800);
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        showToast(error.message, 'error');
      } else {
        // Jika auto-sign-in aktif dan ada session instan
        if (data?.session) {
          showToast('Pendaftaran berhasil! Masuk otomatis...', 'success');
          setTimeout(() => router.push('/dashboard'), 800);
        } else {
          // Memerlukan konfirmasi email
          setShowVerifyScreen(true);
        }
      }
    }
    setLoading(false);
  };

  const handleQuickShorten = (e) => {
    e.preventDefault();
    if (!tempUrl) {
      showToast('Masukkan URL panjang terlebih dahulu!', 'error');
      return;
    }
    // Simpan ke localStorage agar bisa di-prefill di dasbor setelah login
    localStorage.setItem('pendingUrl', tempUrl);
    if (tempSlug) {
      localStorage.setItem('pendingSlug', tempSlug);
    }
    
    if (isLoggedIn) {
      showToast('Mengalihkan ke dasbor untuk memproses tautan Anda...', 'success');
      setTimeout(() => router.push('/dashboard'), 600);
    } else {
      showToast('Silakan masuk atau daftar terlebih dahulu untuk menyimpan tautan!', 'info');
      setTimeout(() => {
        setIsLoginView(true);
        setAuthMode('login');
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans flex flex-col justify-between transition-colors duration-500">
      {/* Background Decorative Glowing Elements */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Toast Notification Component */}
      {toast.visible && (
        <div className="fixed bottom-5 right-5 z-50 animate-slide-in flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all max-w-sm glass" style={{
          borderColor: toast.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : toast.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.2)',
          background: 'var(--card-bg)'
        }}>
          {toast.type === 'success' && (
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <Info className="text-cyan-500 w-5 h-5 flex-shrink-0" />
            </div>
          )}
          <div className="text-xs font-semibold text-foreground max-w-[200px] leading-relaxed">{toast.message}</div>
          <button onClick={() => setToast(prev => ({ ...prev, visible: false }))} className="text-slate-400 hover:text-foreground ml-auto transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Unified Reusable Navbar */}
      <Navbar 
        onLoginClick={() => { setIsLoginView(true); setAuthMode('login'); }}
        onRegisterClick={() => { setIsLoginView(true); setAuthMode('register'); }}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col justify-center">
        {showVerifyScreen ? (
          <main className="w-full flex items-center justify-center py-12 animate-fade-in-up">
            <div className="max-w-md w-full glass-premium p-8 md:p-10 rounded-[32px] border border-card-border text-center relative overflow-hidden shadow-2xl animate-scale-in">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/20 to-transparent blur-xl rounded-full"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
                <Mail className="text-cyan-500 w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold font-display text-foreground mb-3">Verifikasi Email Anda</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Kami telah mengirimkan tautan konfirmasi ke <span className="font-bold text-foreground text-base">{email}</span>.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mb-8">
                Silakan klik tautan di dalam email tersebut (periksa juga folder spam atau promosi jika tidak ditemukan) untuk mengaktifkan akun Anda sebelum masuk.
              </p>

              <button
                onClick={() => {
                  setShowVerifyScreen(false);
                  setIsLoginView(true);
                  setAuthMode('login');
                }}
                className="w-full bg-white/5 hover:bg-white/10 text-foreground font-semibold text-xs py-3.5 px-6 rounded-2xl border border-card-border transition-all duration-300 cursor-pointer active:scale-95"
              >
                Kembali ke Login
              </button>
            </div>
          </main>
        ) : isLoginView ? (
          <main className="w-full flex items-center justify-center py-12 animate-fade-in-up">
            <div className="max-w-md w-full glass-premium p-8 md:p-10 rounded-[32px] border border-card-border relative overflow-hidden shadow-2xl animate-scale-in">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/20 to-transparent blur-xl rounded-full"></div>

              {/* Back Icon button */}
              <button onClick={() => setIsLoginView(false)} className="absolute top-6 left-6 text-slate-400 hover:text-foreground transition-colors p-2 hover:bg-white/5 rounded-xl cursor-pointer">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>

              <div className="text-center mt-6 mb-8">
                <div className="font-extrabold text-2xl tracking-tighter text-foreground flex items-center justify-center gap-2 mb-3 select-none">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Send className="text-white w-4 h-4 -rotate-45 transform translate-x-[-1px] translate-y-[1px]" />
                  </div>
                  fly<span className="text-cyan-500">.link</span>
                </div>
                <h2 className="text-xl font-bold font-display text-foreground">
                  {authMode === 'login' ? 'Selamat Datang Kembali' : 'Daftar Akun Baru'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {authMode === 'login' ? 'Masuk untuk mengelola tautan pendek Anda.' : 'Mulai penyingkatan tautan premium sekarang.'}
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => handleAuth(e, authMode)}>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors w-4.5 h-4.5" />
                  <input
                    type="email"
                    required
                    placeholder="Alamat Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-card-border text-sm text-foreground placeholder-slate-500 focus:bg-white/[0.06] focus:border-cyan-500/50 outline-none transition-all duration-300"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors w-4.5 h-4.5" />
                  <input
                    type="password"
                    required
                    placeholder="Kata Sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-card-border text-sm text-foreground placeholder-slate-500 focus:bg-white/[0.06] focus:border-cyan-500/50 outline-none transition-all duration-300"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex justify-center items-center cursor-pointer"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : authMode === 'login' ? 'Masuk' : 'Daftar Gratis'}
                  </button>

                  <p className="text-xs text-slate-500 text-center mt-6">
                    {authMode === 'login' ? (
                      <>
                        Belum punya akun?{' '}
                        <button type="button" onClick={() => setAuthMode('register')} className="text-cyan-500 font-semibold hover:underline cursor-pointer">
                          Daftar sekarang
                        </button>
                      </>
                    ) : (
                      <>
                        Sudah punya akun?{' '}
                        <button type="button" onClick={() => setAuthMode('login')} className="text-cyan-500 font-semibold hover:underline cursor-pointer">
                          Masuk sekarang
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </form>

              <button
                onClick={() => setIsLoginView(false)}
                className="w-full mt-8 text-xs text-slate-400 hover:text-foreground transition-colors text-center block cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </main>
        ) : (
          /* TAMPILAN BERANDA UTAMA */
          <main className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 flex-1 animate-fade-in-up">
            {/* Kiri: Teks & Input Singkat */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/15 text-xs text-cyan-400 font-bold tracking-wide uppercase shadow-sm">
                <Zap className="w-3.5 h-3.5 animate-pulse" /> Manajemen Tautan Modern
              </div>
              
              <h1 className="text-4.5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05] font-display">
                Buat Tautan Pendek dengan{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
                  Cepat
                </span>{' '}
                dan Sekali Klik.
              </h1>
              
              <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
                Platform penyingkat URL modern. Melacak klik secara instan, mengamankan rute dengan password, dan membagikan QR Code dalam estetika kelas premium yang super ringan.
              </p>

              <form onSubmit={handleQuickShorten} className="bg-white/[0.02] p-2 rounded-2xl border border-card-border flex flex-col md:flex-row gap-2 max-w-2xl mx-auto lg:mx-0 shadow-2xl shadow-black/40 focus-within:border-cyan-500/30 transition-all duration-300">
                <input
                  type="url"
                  required
                  placeholder="Masukkan tautan panjangmu..."
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-3 bg-transparent border-0 outline-none text-foreground placeholder-slate-400 text-sm focus:ring-0"
                />
                <div className="flex items-center bg-white/[0.02] border border-card-border rounded-xl px-3 py-1.5 focus-within:border-cyan-500/30 transition-all">
                  <span className="text-slate-500 text-xs font-semibold select-none">fly.link/</span>
                  <input
                    type="text"
                    placeholder="kustom-slug"
                    value={tempSlug}
                    onChange={(e) => setTempSlug(e.target.value)}
                    className="bg-transparent border-0 outline-none text-foreground placeholder-slate-400 text-sm w-28 focus:ring-0 pl-1"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-98"
                >
                  Singkatkan <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Feature Points */}
              <div className="grid grid-cols-3 gap-6 pt-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-foreground font-extrabold text-2xl font-display">99.9%</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-semibold">Uptime Stabil</div>
                </div>
                <div>
                  <div className="text-foreground font-extrabold text-2xl font-display">0ms</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-semibold">Pengalihan Cepat</div>
                </div>
                <div>
                  <div className="text-foreground font-extrabold text-2xl font-display">100%</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-semibold">Keamanan Sandi</div>
                </div>
              </div>
            </div>

            {/* Kanan: Visual Premium Illustration */}
            <div className="relative h-[400px] w-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/5 rounded-full blur-[100px] opacity-70"></div>

              {/* Premium Dashboard Graphic Mockup */}
              <div className="relative z-10 w-full max-w-md glass-premium p-6 rounded-[28px] border border-card-border shadow-2xl transform rotate-[-1deg] hover:rotate-0 transition-all duration-500 hover:scale-[1.01]">
                {/* Header Mockup */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-card-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-cyan-600/20 rounded-xl border border-cyan-500/20 flex items-center justify-center">
                      <Zap className="text-cyan-500 w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="h-3.5 w-24 bg-slate-700 rounded-full mb-1.5"></div>
                      <div className="h-2 w-14 bg-slate-800 rounded-full"></div>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-extrabold text-green-500 tracking-wider uppercase">
                    Aktif
                  </div>
                </div>

                {/* Dashboard Chart Mockup */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Statistik Klik Mingguan</span>
                    <span className="text-cyan-500 font-extrabold">+1,420 Klik</span>
                  </div>
                  
                  {/* Bars */}
                  <div className="h-20 flex items-end gap-3 px-2 pt-2 border-b border-card-border">
                    <div className="flex-1 bg-slate-800 rounded-t-md h-[40%]"></div>
                    <div className="flex-1 bg-slate-800 rounded-t-md h-[55%]"></div>
                    <div className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-md h-[85%] relative shadow-lg shadow-cyan-500/20"></div>
                    <div className="flex-1 bg-slate-800 rounded-t-md h-[60%]"></div>
                    <div className="flex-1 bg-slate-800 rounded-t-md h-[45%]"></div>
                    <div className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-md h-[95%] relative shadow-lg shadow-indigo-500/20"></div>
                    <div className="flex-1 bg-slate-800 rounded-t-md h-[30%]"></div>
                  </div>

                  {/* Bottom details */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/[0.02] border border-card-border rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Tautan Pendek</div>
                      <div className="text-foreground font-extrabold text-xs sm:text-sm mt-1">fly.link/promo</div>
                    </div>
                    <div className="bg-white/[0.02] border border-card-border rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Total Kunjungan</div>
                      <div className="text-foreground font-extrabold text-xs sm:text-sm mt-1">8,491 Klik</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* Unified Reusable Footer */}
      <Footer />
    </div>
  );
}