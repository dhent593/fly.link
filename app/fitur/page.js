'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Shield, QrCode, BarChart3, ChevronRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FiturPage() {
  const router = useRouter();

  useEffect(() => {
    document.title = 'Flyku - Fitur';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden flex flex-col justify-between transition-colors duration-500">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[25%] right-[10%] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Modular Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 relative z-10 flex flex-col justify-center animate-fade-in-up">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/15 text-[10px] text-cyan-400 font-bold tracking-wider uppercase">
            Platform Fungsional
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display">
            Semua Fitur yang Anda Butuhkan dalam{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
              Satu Tempat
            </span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            flyku.vercel.app dirancang secara khusus untuk memberikan kecepatan pengalihan instan, analisis lengkap, dan keamanan tangguh tanpa batasan.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Card 1 */}
          <div className="glass p-6 md:p-8 rounded-[28px] border border-card-border flex flex-col justify-between hover:border-cyan-500/20 dark:hover:border-white/10 hover:bg-white/[0.01] transition-all duration-300 group cursor-default">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                <Zap size={22} className="fill-cyan-500/10" />
              </div>
              <h3 className="text-lg font-bold text-foreground font-display">Pengalihan Instan 0ms</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kami memahami pentingnya waktu. Infrastruktur flyku.vercel.app menjamin tautan Anda dialihkan seketika dengan latensi mendekati nol milidetik.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-cyan-500">
              Performa Ekstrim <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass p-6 md:p-8 rounded-[28px] border border-card-border flex flex-col justify-between hover:border-purple-500/20 dark:hover:border-white/10 hover:bg-white/[0.01] transition-all duration-300 group cursor-default">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                <Shield size={22} className="fill-purple-500/10" />
              </div>
              <h3 className="text-lg font-bold text-foreground font-display">Proteksi Kata Sandi</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Butuh membagikan tautan khusus hanya untuk sekelompok orang? Kunci tautan pendek Anda dengan kata sandi kustom agar hanya pihak berwenang yang dapat membukanya.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-purple-500">
              Keamanan Terjamin <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass p-6 md:p-8 rounded-[28px] border border-card-border flex flex-col justify-between hover:border-indigo-500/20 dark:hover:border-white/10 hover:bg-white/[0.01] transition-all duration-300 group cursor-default">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <QrCode size={22} />
              </div>
              <h3 className="text-lg font-bold text-foreground font-display">Pembuat QR Code Otomatis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Setiap tautan yang Anda buat akan langsung memicu pembuatan kode QR yang elegan. Anda dapat langsung mengunduhnya sebagai gambar PNG beresolusi tinggi untuk dicetak atau dibagikan.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-indigo-500">
              Siap Cetak & Bagikan <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass p-6 md:p-8 rounded-[28px] border border-card-border flex flex-col justify-between hover:border-emerald-500/20 dark:hover:border-white/10 hover:bg-white/[0.01] transition-all duration-300 group cursor-default">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <BarChart3 size={22} />
              </div>
              <h3 className="text-lg font-bold text-foreground font-display">Analitik Klik Real-time</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dapatkan wawasan berharga tentang klik tautan Anda. Pantau metrik kunjungan total, klik per hari, tanggal pembuatan, dan status penguncian dalam satu dasbor yang dinamis.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-500">
              Statistik Akurat <ChevronRight size={14} />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-premium p-8 rounded-[32px] border border-card-border text-center space-y-6">
          <h2 className="text-2xl font-bold font-display text-foreground">Mulai Singkatkan Tautan Anda Sekarang</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Dapatkan akses penuh ke seluruh fitur premium di atas secara gratis tanpa biaya berlangganan bulanan.
          </p>
          <button
            onClick={() => router.push('/?auth=register')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-95"
          >
            Mulai Gratis
          </button>
        </div>
      </main>

      {/* Modular Footer */}
      <Footer />
    </div>
  );
}
