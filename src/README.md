# SIMRS Mini - Rumah Sakit Sehat Sentosa

Sistem Informasi Manajemen Rumah Sakit (SIMRS) adalah aplikasi web fullstack untuk mengelola operasional rumah sakit dengan 3 role pengguna: **Pasien**, **Dokter**, dan **Admin**.

## 🏥 Fitur Utama

### 👤 Pasien
- **Profil & Asuransi**: Kelola data pribadi dan informasi asuransi (BPJS, Private, Umum)
- **Daftar Berobat**: Daftarkan diri untuk berobat dengan memilih poli dan jadwal kunjungan
- **Riwayat Berobat**: Lihat riwayat pendaftaran dan status verifikasi
- **Rekam Medis**: Akses rekam medis lengkap dengan diagnosis dan resep dokter
- **Status Pembayaran**: Monitor transaksi dan status pembayaran

### 👨‍⚕️ Dokter
- **Pasien Hari Ini**: Lihat daftar pasien yang terjadwal untuk hari ini
- **Pemeriksaan Pasien**: Input hasil pemeriksaan, diagnosis, dan resep obat
- **Riwayat Pemeriksaan**: Lihat rekam medis yang pernah dibuat

### 🛡️ Admin
- **Kelola Data Pasien**: CRUD data pasien (Create, Read, Update, Delete)
- **Kelola Data Dokter**: CRUD data dokter dan spesialisasi
- **Verifikasi Pendaftaran**: Setujui atau tolak pendaftaran pasien
- **Data Pemeriksaan**: Lihat semua rekam medis dari dokter
- **Kelola Transaksi**: Manajemen transaksi pembayaran
- **Laporan**: Ringkasan statistik dan keuangan (bisa dicetak)

## 🎨 Design System

### Warna
- **Primary Blue**: `#1A73E8` - Untuk elemen utama
- **Success Green**: `#34A853` - Untuk status berhasil
- **Background Gray**: `#F5F7FA` - Background aplikasi
- **Border Gray**: `#E8ECF1` - Border dan divider
- **Text Dark**: `#1F2937` - Teks utama

### Typography
- **Heading**: Poppins (Bold, Semibold)
- **Body**: Inter (Regular, Medium)

### Components
- **Card**: Rounded 12px dengan shadow soft
- **Button**: Rounded 8-12px dengan transisi smooth
- **Badge**: Status dengan warna berbeda (Menunggu: Blue, Proses: Yellow, Lunas: Green, Ditolak: Red)

## 🗄️ Database Schema

### Tabel `users`
- `id`: Primary Key
- `username`: String (unique)
- `password`: String
- `role`: 'pasien' | 'dokter' | 'admin'
- `pasien_id`: Foreign Key (nullable)
- `dokter_id`: Foreign Key (nullable)

### Tabel `pasien`
- `id`: Primary Key
- `nama`: String
- `nik`: String
- `umur`: Integer
- `alamat`: Text
- `no_hp`: String
- `asuransi`: 'BPJS' | 'Private' | 'Umum'
- `keluhan_terakhir`: Text

### Tabel `dokter`
- `id`: Primary Key
- `nama`: String
- `spesialis`: String
- `jadwal_praktek`: String

### Tabel `pendaftaran`
- `id`: Primary Key
- `pasien_id`: Foreign Key
- `tanggal_daftar`: Timestamp
- `jadwal_kunjungan`: Timestamp
- `tujuan_poli`: String
- `status_pendaftaran`: 'Menunggu Verifikasi' | 'Disetujui' | 'Ditolak' | 'Selesai Diperiksa'

### Tabel `rekam_medis`
- `id`: Primary Key
- `pasien_id`: Foreign Key
- `dokter_id`: Foreign Key
- `tanggal_kunjungan`: Timestamp
- `keluhan`: Text
- `hasil_pemeriksaan`: Text
- `resep_obat`: Text
- `catatan_tambahan`: Text

### Tabel `transaksi`
- `id`: Primary Key
- `pasien_id`: Foreign Key
- `pendaftaran_id`: Foreign Key (nullable)
- `total_biaya`: Integer
- `metode_pembayaran`: 'Cash' | 'QRIS' | 'Transfer'
- `status_pembayaran`: 'Siap Dibayar' | 'Menunggu Verifikasi' | 'Lunas'
- `tanggal`: Timestamp

### Tabel `detail_transaksi_obat`
- `id`: Primary Key
- `transaksi_id`: Foreign Key
- `nama_obat`: String
- `harga_satuan`: Integer
- `jumlah`: Integer
- `subtotal`: Integer

## 👥 Akun Demo

### Pasien
- **Username**: `pasien1` / **Password**: `123`
- **Username**: `pasien2` / **Password**: `123`

### Dokter
- **Username**: `dokter1` / **Password**: `123`
- **Username**: `dokter2` / **Password**: `123`

### Admin
- **Username**: `admin1` / **Password**: `123`

## 📊 Data Dummy (Seed)

Aplikasi sudah dilengkapi dengan data dummy lengkap:
- ✅ 3 Pasien
- ✅ 2 Dokter
- ✅ 3 Pendaftaran dengan status berbeda
- ✅ 2 Rekam Medis
- ✅ 3 Transaksi dengan status berbeda
- ✅ 4 Detail Obat

## 🚀 Teknologi

### Frontend
- **React 18** dengan TypeScript
- **Tailwind CSS v4** untuk styling
- **Lucide React** untuk icons
- **LocalStorage** untuk persistence (simulasi database)

### Backend (Untuk Deployment Production)
- **Node.js + Express** (recommended)
- **PostgreSQL** di Railway
- **REST API** dengan JSON

## 💡 Fitur Khusus

### ✨ Responsive Design
- Layout responsif untuk desktop dan mobile
- Sidebar collapse pada layar kecil

### 🖨️ Cetak Laporan
- Fitur print laporan dengan styling khusus
- Header dan footer otomatis saat cetak

### 🎯 UX Features
- Loading states
- Success notifications
- Form validation
- Confirmation dialogs
- Real-time data updates

### 🔐 Authentication
- Login berbasis role
- Session management
- Protected routes

## 📁 Struktur Proyek

```
/
├── components/
│   ├── LandingPage.tsx          # Halaman utama
│   ├── LoginPage.tsx            # Halaman login
│   ├── pasien/                  # Komponen pasien
│   │   ├── PasienDashboard.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProfilAsuransi.tsx
│   │   ├── RiwayatBerobat.tsx
│   │   ├── DaftarBerobat.tsx
│   │   ├── RekamMedis.tsx
│   │   └── StatusPembayaran.tsx
│   ├── dokter/                  # Komponen dokter
│   │   ├── DokterDashboard.tsx
│   │   ├── DokterSidebar.tsx
│   │   ├── PasienHariIni.tsx
│   │   └── RiwayatPemeriksaan.tsx
│   └── admin/                   # Komponen admin
│       ├── AdminDashboard.tsx
│       ├── AdminSidebar.tsx
│       ├── KelolaPasien.tsx
│       ├── KelolaDokter.tsx
│       ├── VerifikasiPendaftaran.tsx
│       ├── DataPemeriksaan.tsx
│       ├── KelolaTransaksi.tsx
│       └── Laporan.tsx
├── utils/
│   └── seedData.ts              # Data seed & helper functions
├── styles/
│   └── globals.css              # Global styles
├── App.tsx                      # Main app component
└── README.md                    # Dokumentasi
```

## 🎓 Penggunaan untuk Tugas Kuliah

Aplikasi ini cocok untuk:
- ✅ Tugas Rekayasa Perangkat Lunak
- ✅ Tugas Basis Data
- ✅ Tugas Pemrograman Web
- ✅ Tugas Sistem Informasi Manajemen

### Deliverables
1. **Aplikasi Web** - Sudah jadi dan berfungsi penuh
2. **Flowchart** - Buat flowchart proses login, pemeriksaan, transaksi
3. **UML Use Case** - Diagram aktor (Pasien, Dokter, Admin) dan use case
4. **ERD** - Entity Relationship Diagram dari 7 tabel database
5. **Struktur Navigasi** - Sitemap halaman aplikasi
6. **Storyboard** - User flow untuk setiap role

## 🌐 Deployment

### Option 1: Deployment Lokal
1. Buka aplikasi di browser
2. Semua data tersimpan di LocalStorage
3. Cocok untuk demo dan testing

### Option 2: Deployment Production (Future)

**Backend (Railway)**:
```bash
# Setup PostgreSQL di Railway
# Deploy Express API
# Set environment variables
```

**Frontend (Vercel)**:
```bash
# Build React app
# Deploy ke Vercel
# Update API URL ke Railway
```

## 📝 Catatan Pengembangan

### Saat ini (LocalStorage)
- Data disimpan di browser (localStorage)
- Data hilang jika localStorage dibersihkan
- Cocok untuk development dan demo

### Production (Database Real)
- Implementasi PostgreSQL di Railway
- Backend Express dengan REST API
- Frontend tetap sama, hanya ganti API calls

## 🎯 Roadmap

### v1.0 (Current)
- ✅ Basic CRUD operations
- ✅ Role-based authentication
- ✅ Dashboard untuk 3 role
- ✅ Rekam medis dan transaksi

### v2.0 (Future)
- ⬜ Real-time notifications
- ⬜ Export laporan ke PDF/Excel
- ⬜ Upload foto pasien
- ⬜ Chat dokter-pasien
- ⬜ Appointment reminder

## 👨‍💻 Developer

Aplikasi ini dibuat sebagai template SIMRS yang siap pakai untuk keperluan akademis dan demo.

## 📄 License

Free to use for educational purposes.

---

**RS Sehat Sentosa** - Sistem Informasi Manajemen Rumah Sakit
© 2025 All Rights Reserved
