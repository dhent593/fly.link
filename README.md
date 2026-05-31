# nasku.cloud - Premium URL Shortener Platform

**nasku.cloud** adalah aplikasi pemendek tautan (URL Shortener) modern dengan antarmuka kelas premium minimalis gelap, efek *glassmorphism*, mikro-animasi dinamis, dan performa instan. Proyek ini dibangun menggunakan **Next.js 16 (App Router)** dan terintegrasi dengan **Supabase** untuk otentikasi serta penyimpanan data relasional.

---

## Fitur Utama

1.  **Pengalihan Instan 0ms**: Infrastruktur pemendek tautan super cepat dengan latensi minimal.
2.  **Pembuat QR Code Otomatis**: Menghasilkan kode QR instan yang dapat diunduh langsung sebagai berkas PNG beresolusi tinggi.
3.  **Proteksi Kata Sandi (Password Lock)**: Mengamankan tautan pendek dengan sandi kustom agar hanya dapat diakses oleh pihak berwenang.
4.  **Edit Tautan Dinamis**: Mengubah tautan asli, kata sandi, dan slug kustom dari dasbor secara real-time.
5.  **Analitik Dasbor Real-time**: Melacak jumlah kunjungan (klik), tanggal pembuatan, dan status penguncian dalam antarmuka dasbor beranimasi halus.
6.  **Sistem Toast Notification Kustom**: Menggantikan alert bawaan browser dengan notifikasi pop-up animasi yang premium.
7.  **Auto-Login & Verifikasi Surel Pintar**: Alur otentikasi bebas error, mendukung masuk otomatis serta layar petunjuk verifikasi surel yang interaktif.

---

## Teknologi yang Digunakan

*   **Framework**: [Next.js 16.2.6 (App Router)](https://nextjs.org/) dengan [React 19](https://react.dev/)
*   **Database & Auth**: [Supabase (@supabase/supabase-js)](https://supabase.com/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **QR Code**: `qrcode.react`

---

## Panduan Instalasi & Persiapan Project

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lain atau untuk diunggah ke GitHub:

### 1. Kloning Repositori
Kloning repositori ini dari GitHub ke direktori lokal Anda:
```bash
git clone <URL_REPOSITORI_ANDA>
cd nasku-shortener
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
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY_SUPABASE_ANDA>
```

### 4. Konfigurasi Database Supabase (SQL Schema)
Masuk ke dasbor Supabase Anda, buka **SQL Editor**, dan jalankan perintah SQL berikut untuk membuat tabel `links` beserta kebijakan keamanan RLS (Row-Level Security) yang dibutuhkan:

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

-- 3. Buat Kebijakan RLS agar pengguna hanya dapat mengakses tautan miliknya sendiri
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

*Atau jika ingin menggunakan `npm run dev` biasa di PowerShell, Anda harus membuka blokir terminal terlebih dahulu dengan:*
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

Buka **[http://localhost:3000](http://localhost:3000)** di browser Anda untuk melihat aplikasi yang berjalan secara lokal.

### 6. Membuat Build Produksi
Untuk memastikan tidak ada kesalahan kompilasi dan memproduksi aplikasi web siap-rilis yang dioptimalkan penuh:
```bash
npm run build
```

Hasil kompilasi siap-pakai akan disimpan di dalam folder tersembunyi `.next/`.

---

## Struktur Folder Utama

```txt
nasku-shortener/
├── app/                  # Direktori Next.js App Router
│   ├── [slug]/           # Rute dinamis untuk pengalihan & kunci sandi tautan
│   ├── dashboard/        # Dasbor manajemen tautan pengguna
│   ├── fitur/            # Subhalaman detail Fitur Premium
│   ├── keamanan/         # Subhalaman detail Keamanan Data
│   ├── tentang/          # Subhalaman detail Visi Misi Tentang Kami
│   ├── globals.css       # Desain global, Google Fonts, & Token Warna
│   └── page.js           # Landing page utama & alur otentikasi login/register
├── lib/                  # Konfigurasi pembantu relasional
│   └── supabase.js       # Inisialisasi Klien API Supabase
└── package.json          # Berkas konfigurasi dependencies npm
```

---

&copy; 2026 nasku.cloud. Dibuat dengan presisi tinggi dan estetika modern kelas premium.
