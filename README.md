# ✈️ fly.link - Premium URL Shortener Platform

**fly.link** (atau **fly**) adalah aplikasi pemendek tautan (URL Shortener) modern dan SaaS-ready yang mengusung filosofi: **Ringan, Cepat, dan Modern**. Dibangun dengan antarmuka kelas premium murni gelap (*pure space dark mode*), efek *neo-glassmorphism*, mikro-animasi transisi *slide-out* yang mulus, dan performa instan mendekati nol milidetik.

Proyek ini dibangun menggunakan **Next.js 16 (App Router)**, Tailwind CSS v4, Lucide Icons, dan terintegrasi secara penuh dengan **Supabase** untuk otentikasi sesi aman serta penyimpanan data relasional.

---

## ✨ Fitur Utama (SaaS-Ready)

1.  **Pengalihan Instan 0ms**: Infrastruktur pemendek tautan super cepat dengan latensi minimal mendekati nol milidetik.
2.  **Smart Active Session Detection**: Sistem pintar di beranda dan navigasi yang mendeteksi sesi masuk aktif, mengganti tombol otentikasi dengan akses cepat "Ke Dasbor" secara mulus.
3.  **Dedicated Kelola Tautan Workspace**: Tab panel khusus untuk mencari tautan kustom atau URL asli secara real-time, lengkap dengan sorting klik terbanyak dan abjad.
4.  **Dedicated QR Generator Workspace**: Pembuat QR Code mandiri beresolusi HD untuk teks/tautan bebas, lengkap dengan slider resolusi dan pengunduhan instan PNG.
5.  **Proteksi Kata Sandi (Password Lock)**: Mengamankan tautan pendek dengan sandi kustom agar hanya dapat diakses oleh pihak berwenang dengan layar kunci interaktif beranimasi *shake*.
6.  **Pengaturan Profil & Sandi (Supabase Integrated)**: Panel akun fungsional untuk memperbarui nama tampilan profil (`display_name`) dan mengubah kata sandi akun secara live menggunakan API Supabase.
7.  **Desain Edge Inset Glassmorphism**: Estetika murni gelap ber-blur tinggi dengan sorotan bayangan *top-edge inset* sehalus rambut khas macOS/iOS, bebas dari garis outline putih tebal yang mengganggu.
8.  **Animasi Transisi Samping Seluler (Left Slide-in Drawer)**: Sidebar navigasi seluler dasbor meluncur masuk dan keluar dari samping kiri layar secara *butter-smooth*.

---

## 🛠️ Teknologi yang Digunakan

*   **Framework**: [Next.js 16.2.6 (App Router)](https://nextjs.org/) dengan [React 19](https://react.dev/)
*   **Database & Auth**: [Supabase (@supabase/supabase-js)](https://supabase.com/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **QR Code**: `qrcode.react`

---

## 🚀 Panduan Instalasi & Persiapan Proyek Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

### 1. Kloning Repositori
Kloning repositori ini dari GitHub ke direktori lokal Anda:
```bash
git clone <URL_REPOSITORI_GITHUB_ANDA>
cd fly-shortener
```

### 2. Instalasi Dependensi
Instal semua pustaka (dependencies) yang dibutuhkan menggunakan npm:
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan (Environment Variables)
Buat berkas bernama **`.env.local`** di direktori utama (root) proyek Anda dan tambahkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_ID>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<PUBLISHABLE_KEY_SUPABASE_ANDA>
```

### 4. Konfigurasi Database Supabase (SQL Schema)
Masuk ke dasbor Supabase Anda, buka **SQL Editor**, buat **New Query**, dan jalankan perintah SQL berikut untuk membuat tabel `links` beserta kebijakan keamanan RLS (Row-Level Security) yang dibutuhkan:

```sql
-- 1. Buat Tabel links
create table public.links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  original_url text not null,
  slug text unique not null,
  password text,
  clicks integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Aktifkan Row-Level Security (RLS) demi keamanan data pengguna
alter table public.links enable row level security;

-- 3. Buat Kebijakan RLS agar pengguna hanya dapat mengelola data milik sendiri
create policy "Pengguna hanya dapat mengelola data milik sendiri"
  on public.links
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 5. Menjalankan Server Development Lokal
Di sistem operasi **Windows** (terutama jika menggunakan terminal PowerShell), jalankan perintah berikut untuk menghindari kebijakan pembatasan eksekusi skrip:

```powershell
# Jalankan menggunakan ekstensi CMD secara langsung
npm.cmd run dev
```

Buka **[http://localhost:3000](http://localhost:3000)** di browser Anda untuk melihat aplikasi yang berjalan secara lokal.

### 6. Membuat Build Produksi
Untuk memastikan tidak ada kesalahan kompilasi dan memproduksi aplikasi web siap-rilis yang dioptimalkan penuh:
```bash
npm.cmd run build
```

---

## 🌐 Panduan Deployment di Vercel

1. Hubungkan akun GitHub Anda ke [Vercel](https://vercel.com/).
2. Impor repositori `fly-shortener`.
3. Di bagian **Environment Variables**, tambahkan dua pasang variabel berikut:
   - `NEXT_PUBLIC_SUPABASE_URL` = *URL Proyek Supabase Anda*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *Publishable Key Supabase Anda*
4. Klik **Deploy**. Vercel akan meluncurkan aplikasi Anda secara otomatis di CDN global super cepat!

---

## 📁 Struktur Folder Utama

```txt
fly-shortener/
├── app/                  # Direktori Next.js App Router
│   ├── [slug]/           # Rute dinamis untuk pengalihan & kunci sandi tautan
│   ├── dashboard/        # Dasbor manajemen tab terpadu pengguna
│   ├── fitur/            # Subhalaman detail Fitur Premium
│   ├── keamanan/         # Subhalaman detail Keamanan Data
│   ├── tentang/          # Subhalaman detail Visi Misi Tentang Kami
│   ├── globals.css       # Desain global, Google Fonts, & Inset Shadows
│   └── page.js           # Landing page utama & alur otentikasi login/register
├── components/           # Komponen modular reusable
│   ├── Navbar.js         # Header responsif & Drawer seluler teranimasi
│   └── Footer.js         # Tampilan Hak Cipta fly.link baru
├── lib/                  # Konfigurasi pembantu relasional
│   └── supabase.js       # Inisialisasi API Supabase Client & Fallbacks
└── package.json          # Berkas konfigurasi dependencies npm
```

---

&copy; {new Date().getFullYear()} **fly.link**. Dibuat dengan presisi tinggi dan estetika modern kelas premium.
