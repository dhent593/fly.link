'use client';

export default function Footer() {
  return (
    <footer className="w-full text-center py-8 text-xs text-slate-500 border-t border-card-border bg-[#07090e]/50 backdrop-blur-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">flyku.vercel.app</span>. Dibuat dengan presisi tinggi dan estetika modern kelas premium.
      </div>
    </footer>
  );
}
