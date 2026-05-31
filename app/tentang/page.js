'use client';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles, Smile, Star, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TentangPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden flex flex-col justify-between transition-colors duration-500">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[10%] left-[10%] w-[320px] h-[320px] bg-pink-500/5 dark:bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[380px] h-[380px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Modular Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 relative z-10 flex flex-col justify-center animate-fade-in-up">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/15 text-[10px] text-pink-600 dark:text-pink-400 font-bold tracking-wider uppercase">
            Cerita fly.link
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display">
            Membangun Jembatan Digital yang{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500">
              Lebih Bersih & Cepat
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            fly.link lahir dari kegelisahan kami terhadap penyingkat tautan tradisional yang penuh dengan iklan pop-up yang mengganggu, waktu tunggu sengaja, dan antarmuka usang.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-display text-foreground">Visi & Filosofi Kami</h3>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Kami percaya bahwa sebuah tautan adalah jembatan digital yang menghubungkan ide, karya, bisnis, dan manusia. Jembatan tersebut haruslah **cepat**, **indah**, dan **aman**.
            </p>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Kami menolak menggunakan halaman perantara berisi iklan yang memperlambat koneksi Anda. Filosofi utama fly.link adalah **Kecepatan Instan Tanpa Kompromi**.
            </p>

            <div className="pt-2 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 flex-shrink-0">
                  <Sparkles size={12} />
                </div>
                <span className="text-xs sm:text-sm text-foreground font-semibold">Bebas Iklan Pengganggu 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 flex-shrink-0">
                  <Heart size={12} />
                </div>
                <span className="text-xs sm:text-sm text-foreground font-semibold">Dibuat dengan Presisi Visual Tinggi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Smile size={12} />
                </div>
                <span className="text-xs sm:text-sm text-foreground font-semibold">Navigasi Dasbor Super Intuitif</span>
              </div>
            </div>
          </div>

          {/* Visual Block */}
          <div className="glass p-6 md:p-8 rounded-[32px] border border-card-border relative overflow-hidden space-y-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-500/10 to-transparent blur-xl rounded-full"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Star size={20} className="fill-pink-500/10 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h4 className="font-bold text-foreground font-display text-sm">Prinsip Kami</h4>
                <p className="text-[10px] text-slate-400">Filosofi Inti Pengembangan</p>
              </div>
            </div>

            <blockquote className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-pink-500/50 pl-4 py-1">
              "Sebuah alat (utility) yang baik bukan hanya tentang fungsinya yang bekerja, melainkan tentang bagaimana antarmuka tersebut membuat penggunanya tersenyum karena kemudahan dan keindahannya."
            </blockquote>

            <div className="pt-2 border-t border-card-border flex justify-between items-center text-[10px] text-slate-400">
              <span>Rilis Platform v2.0</span>
              <span className="flex items-center gap-1 text-pink-500 font-bold uppercase tracking-wider cursor-pointer hover:underline" onClick={() => router.push('/')}>
                Gunakan Sekarang <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-premium p-8 rounded-[32px] border border-card-border text-center space-y-6">
          <h2 className="text-2xl font-bold font-display text-foreground">Bergabung Bersama Kami</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Mulailah mengelola tautan digital Anda dalam platform terindah, tercepat, dan teraman secara gratis.
          </p>
          <button
            onClick={() => router.push('/?auth=register')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-95"
          >
            Mulai Sekarang
          </button>
        </div>
      </main>

      {/* Modular Footer */}
      <Footer />
    </div>
  );
}
