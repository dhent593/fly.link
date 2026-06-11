'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { Lock, ArrowRight, ShieldAlert, KeyRound, AlertTriangle, Send } from 'lucide-react';

export default function RedirectPage() {
    const { slug } = useParams();
    const [linkData, setLinkData] = useState(null);
    const [inputPass, setInputPass] = useState('');
    const [error, setError] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [shake, setShake] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        const fetchSlug = async () => {
            const { data } = await supabase.from('links').select('*').eq('slug', slug).single();
            if (!data) {
                setNotFound(true);
            } else {
                setLinkData(data);
                // Jika tidak ada password, langsung hitung klik & alihkan
                if (!data.password) {
                    executeRedirect(data);
                }
            }
        };
        fetchSlug();
    }, [slug]);

    const executeRedirect = async (data) => {
        setRedirecting(true);
        // Tambah jumlah klik
        await supabase.from('links').update({ clicks: (data.clicks || 0) + 1 }).eq('id', data.id);
        window.location.replace(data.original_url);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (inputPass === linkData.password) {
            setError(false);
            executeRedirect(linkData);
        } else {
            setError(true);
            setShake(true);
            setInputPass('');
            // Reset shake animation class after it finishes
            setTimeout(() => setShake(false), 500);
        }
    };

    // Tampilan jika Tautan tidak ditemukan (Gaya Premium 404)
    if (notFound) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden font-sans transition-colors duration-500">
                {/* Glow spheres */}
                <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-md w-full glass-premium p-8 rounded-[32px] border border-card-border text-center relative overflow-hidden shadow-2xl relative z-10 animate-scale-in">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <ShieldAlert className="text-red-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold font-display text-foreground mb-2">Tautan Tidak Ditemukan</h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-8 font-semibold">
                        Maaf, tautan pendek yang Anda tuju tidak valid, sudah dihapus, atau masa aktifnya telah habis.
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-foreground font-bold text-xs py-3.5 px-6 rounded-2xl border border-card-border transition-all duration-300 shadow-sm"
                    >
                        Kembali ke Beranda <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        );
    }

    // Tampilan Loading Redirection / Redirecting state
    if (!linkData || redirecting) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden font-sans transition-colors duration-500">
                {/* Glow spheres */}
                <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>
                
                <div className="text-center relative z-10">
                    <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/5 animate-spin" style={{ animationDuration: '3s' }}>
                        <Send className="text-cyan-500 w-8 h-8 -rotate-45 transform translate-x-[-1px] translate-y-[1px]" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground font-display">Memproses Pengalihan...</h3>
                    <p className="text-xs text-slate-400 mt-2 font-semibold animate-pulse">Menghubungkan Anda ke tujuan secara aman.</p>
                </div>
            </div>
        );
    }

    // Tampilan jika Butuh Password (Password Lock Screen)
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative overflow-hidden font-sans transition-colors duration-500">
            {/* Glow spheres */}
            <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-yellow-500/10 rounded-full blur-[110px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none"></div>

            <main className="max-w-md w-full relative z-10 animate-fade-in-up">
                <div className={`glass-premium p-8 md:p-10 rounded-[32px] border border-card-border text-center relative overflow-hidden shadow-2xl ${shake ? 'animate-shake' : ''} transition-all`}>
                    
                    {/* Glowing lock header */}
                    <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <KeyRound className="text-yellow-500 w-8 h-8 animate-pulse" />
                    </div>
 
                    <h2 className="text-2xl font-bold font-display text-foreground mb-2">Tautan Terkunci</h2>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8 max-w-xs mx-auto font-semibold">
                        Tautan ini diamankan secara eksklusif. Masukkan kata sandi yang valid untuk dapat melanjutkan ke tujuan asli di <span className="text-cyan-500">flyku.vercel.app</span>.
                    </p>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors w-4.5 h-4.5" />
                            <input
                                type="password"
                                required
                                value={inputPass}
                                onChange={(e) => setInputPass(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.02] border border-card-border text-sm text-foreground placeholder-slate-400 focus:bg-white/[0.05] focus:border-yellow-500/40 text-center outline-none transition-all duration-300"
                                placeholder="Masukkan kata sandi..."
                            />
                        </div>

                        {/* Error message with warning icon */}
                        {error && (
                            <div className="flex items-center gap-1.5 justify-center text-red-500 text-xs font-bold py-1 animate-pulse">
                                <AlertTriangle className="w-4 h-4" /> Kata sandi salah! Silakan coba lagi.
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold py-4 rounded-2xl text-xs tracking-wider uppercase shadow-lg shadow-yellow-500/10 transition-all duration-300 cursor-pointer active:scale-98"
                        >
                            Buka Tautan
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}