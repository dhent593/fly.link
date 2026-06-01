'use client';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Key, Server, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function KeamananPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden flex flex-col justify-between transition-colors duration-500">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Modular Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 relative z-10 flex flex-col justify-center animate-fade-in-up">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/15 text-[10px] text-purple-400 font-bold tracking-wider uppercase">
            Privasi & Proteksi
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight font-display">
            Infrastruktur Keamanan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500">
              Kelas Dunia
            </span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Keamanan tautan dan data pribadi Anda adalah prioritas mutlak kami. Kami menerapkan standar perlindungan terenkripsi untuk mengamankan data Anda di setiap tahap.
          </p>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Pillar 1 */}
          <div className="glass p-6 rounded-[24px] border border-card-border space-y-4 hover:border-purple-500/20 transition-all duration-300 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-105 transition-transform">
              <Lock size={20} />
            </div>
            <h3 className="text-base font-bold text-foreground font-display">Proteksi Link Terenkripsi</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tautan yang Anda proteksi dengan kata sandi disimpan menggunakan standar hash searah yang aman. Akses tidak sah diblokir sepenuhnya sebelum permintaan menyentuh server tujuan Anda.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass p-6 rounded-[24px] border border-card-border space-y-4 hover:border-cyan-500/20 transition-all duration-300 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 group-hover:scale-105 transition-transform">
              <Key size={20} />
            </div>
            <h3 className="text-base font-bold text-foreground font-display">Otentikasi Token JWT</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sesi login Anda dilindungi oleh JSON Web Token (JWT) terenkripsi dari Supabase. Sesi dipulihkan secara instan dari penyimpanan terproteksi lokal peramban, mencegah ancaman pembajakan sesi.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass p-6 rounded-[24px] border border-card-border space-y-4 hover:border-indigo-500/20 transition-all duration-300 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-105 transition-transform">
              <Server size={20} />
            </div>
            <h3 className="text-base font-bold text-foreground font-display">Row-Level Security (RLS)</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Database PostgreSQL kami menerapkan Row-Level Security (RLS) yang ketat. Ini menjamin bahwa data tautan Anda terisolasi secara mutlak di tingkat database, sehingga pengguna lain tidak dapat membaca atau memodifikasinya.
            </p>
          </div>
        </div>

        {/* Security Alert Section */}
        <div className="glass p-6 rounded-[28px] border border-card-border flex flex-col md:flex-row items-center gap-6 mb-16 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 flex-shrink-0 animate-pulse">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-foreground font-display text-sm">Pencegahan Penyalahgunaan (Spam & Phishing)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kami secara aktif menyaring tautan yang ditujukan untuk penipuan, phishing, atau penyebaran malware. fly.link berkomitmen penuh untuk menjaga integritas rute pengalihan agar internet menjadi tempat yang lebih aman.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-premium p-8 rounded-[32px] border border-card-border text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto">
            <Shield className="text-cyan-500 w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground">Privasi Anda Adalah Hak Mutlak</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            fly.link tidak pernah menjual data klik atau tautan pribadi Anda kepada pihak ketiga mana pun.
          </p>
          <button
            onClick={() => router.push('/?auth=login')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition shadow-lg shadow-cyan-500/10 cursor-pointer active:scale-95"
          >
            Masuk dengan Aman
          </button>
        </div>
      </main>

      {/* Modular Footer */}
      <Footer />
    </div>
  );
}
