// Types
export interface User {
  id: number;
  username: string;
  password: string;
  role: 'pasien' | 'dokter' | 'admin';
  pasien_id?: number;
  dokter_id?: number;
}

export interface Pasien {
  id: number;
  nama: string;
  nik: string;
  umur: number;
  alamat: string;
  no_hp: string;
  asuransi: 'BPJS' | 'Private' | 'Umum';
  keluhan_terakhir: string;
}

export interface Dokter {
  id: number;
  nama: string;
  spesialis: string;
  jadwal_praktek: string;
}

export interface Pendaftaran {
  id: number;
  pasien_id: number;
  tanggal_daftar: string;
  jadwal_kunjungan: string;
  tujuan_poli: string;
  status_pendaftaran:
    | 'Menunggu Verifikasi'
    | 'Disetujui'
    | 'Ditolak'
    | 'Selesai Diperiksa';
}

export interface RekamMedis {
  id: number;
  pasien_id: number;
  dokter_id: number;
  tanggal_kunjungan: string;
  keluhan: string;
  hasil_pemeriksaan: string;
  resep_obat: string;
  catatan_tambahan: string;
}

export interface Transaksi {
  id: number;
  pasien_id: number;
  pendaftaran_id?: number;
  total_biaya: number;
  metode_pembayaran: 'Cash' | 'QRIS' | 'Transfer';
  status_pembayaran: 'Siap Dibayar' | 'Menunggu Verifikasi' | 'Lunas';
  tanggal: string;
}

export interface DetailTransaksiObat {
  id: number;
  transaksi_id: number;
  nama_obat: string;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
}

// Seed Data
const seedUsers: User[] = [
  // Pasien account
  { id: 1, username: 'pasien1', password: '123', role: 'pasien', pasien_id: 1 },
  { id: 2, username: 'pasien2', password: '123', role: 'pasien', pasien_id: 2 },
  { id: 3, username: 'pasien3', password: '123', role: 'pasien', pasien_id: 3 },

  // Dokter account
  { id: 4, username: 'dokter1', password: '123', role: 'dokter', dokter_id: 1 },
  { id: 5, username: 'dokter2', password: '123', role: 'dokter', dokter_id: 2 },

  // Admin account
  { id: 6, username: 'admin1', password: '123', role: 'admin' },

  // Tambahan agar username terlihat lebih natural
  { id: 7, username: 'rahmat', password: '123', role: 'pasien', pasien_id: 1 },
  { id: 8, username: 'siti',   password: '123', role: 'pasien', pasien_id: 2 },
  { id: 9, username: 'budi',   password: '123', role: 'pasien', pasien_id: 3 },

  { id: 10, username: 'drandi', password: '123', role: 'dokter', dokter_id: 1 },
  { id: 11, username: 'drbudi', password: '123', role: 'dokter', dokter_id: 2 },

  { id: 12, username: 'admin2', password: '123', role: 'admin' },
  { id: 13, username: 'kasir1', password: '123', role: 'admin' },
];

const seedPasien: Pasien[] = [
  {
    id: 1,
    nama: 'Rahmat Hidayat',
    nik: '3201012345678901',
    umur: 25,
    alamat: 'Jl. Mawar No. 10, Jakarta Selatan',
    no_hp: '081234567890',
    asuransi: 'BPJS',
    keluhan_terakhir: 'Demam dan batuk',
  },
  {
    id: 2,
    nama: 'Siti Aminah',
    nik: '3201012345678902',
    umur: 32,
    alamat: 'Jl. Melati No. 5, Jakarta Pusat',
    no_hp: '081298765432',
    asuransi: 'Umum',
    keluhan_terakhir: 'Sakit kepala berkepanjangan',
  },
  {
    id: 3,
    nama: 'Budi Santoso',
    nik: '3201012345678903',
    umur: 45,
    alamat: 'Jl. Anggrek No. 15, Jakarta Timur',
    no_hp: '081234509876',
    asuransi: 'Private',
    keluhan_terakhir: 'Nyeri sendi',
  },
];

const seedDokter: Dokter[] = [
  {
    id: 1,
    nama: 'dr. Andi Pratama',
    spesialis: 'Umum',
    jadwal_praktek: 'Senin-Jumat: 08:00-15:00',
  },
  {
    id: 2,
    nama: 'dr. Budi Setiawan, Sp.PD',
    spesialis: 'Penyakit Dalam',
    jadwal_praktek: 'Senin-Kamis: 10:00-14:00',
  },
];

const seedPendaftaran: Pendaftaran[] = [
  {
    id: 1,
    pasien_id: 1,
    tanggal_daftar: '2025-11-25T08:30:00',
    jadwal_kunjungan: '2025-11-25T10:00:00',
    tujuan_poli: 'Poli Umum',
    status_pendaftaran: 'Menunggu Verifikasi',
  },
  {
    id: 2,
    pasien_id: 2,
    tanggal_daftar: '2025-11-24T09:00:00',
    jadwal_kunjungan: '2025-11-25T11:00:00',
    tujuan_poli: 'Poli Penyakit Dalam',
    status_pendaftaran: 'Disetujui',
  },
  {
    id: 3,
    pasien_id: 3,
    tanggal_daftar: '2025-11-23T14:00:00',
    jadwal_kunjungan: '2025-11-24T09:00:00',
    tujuan_poli: 'Poli Umum',
    status_pendaftaran: 'Selesai Diperiksa',
  },
];

const seedRekamMedis: RekamMedis[] = [
  {
    id: 1,
    pasien_id: 3,
    dokter_id: 1,
    tanggal_kunjungan: '2025-11-24T09:30:00',
    keluhan: 'Nyeri sendi pada lutut kanan',
    hasil_pemeriksaan:
      'Pasien mengalami peradangan ringan pada sendi lutut. Tidak ditemukan tanda-tanda kerusakan struktural.',
    resep_obat: 'Ibuprofen 400mg 3x1, Vitamin D 1000IU 1x1',
    catatan_tambahan:
      'Disarankan untuk mengurangi aktivitas berat, kompres dingin jika nyeri, kontrol 1 minggu',
  },
  {
    id: 2,
    pasien_id: 2,
    dokter_id: 2,
    tanggal_kunjungan: '2025-11-20T11:00:00',
    keluhan: 'Sakit kepala berkepanjangan, mual',
    hasil_pemeriksaan:
      'Tekanan darah 140/90. Kemungkinan tension headache dengan komponen hipertensi ringan.',
    resep_obat: 'Paracetamol 500mg 3x1, Amlodipine 5mg 1x1',
    catatan_tambahan:
      'Pasien dianjurkan untuk mengurangi stress, istirahat cukup, dan diet rendah garam',
  },
];

const seedTransaksi: Transaksi[] = [
  {
    id: 1,
    pasien_id: 1,
    pendaftaran_id: 1,
    total_biaya: 150000,
    metode_pembayaran: 'Cash',
    status_pembayaran: 'Siap Dibayar',
    tanggal: '2025-11-25T08:30:00',
  },
  {
    id: 2,
    pasien_id: 2,
    pendaftaran_id: 2,
    total_biaya: 250000,
    metode_pembayaran: 'QRIS',
    status_pembayaran: 'Lunas',
    tanggal: '2025-11-24T09:00:00',
  },
  {
    id: 3,
    pasien_id: 3,
    pendaftaran_id: 3,
    total_biaya: 320000,
    metode_pembayaran: 'Transfer',
    status_pembayaran: 'Lunas',
    tanggal: '2025-11-24T09:00:00',
  },
];

const seedDetailObat: DetailTransaksiObat[] = [
  {
    id: 1,
    transaksi_id: 2,
    nama_obat: 'Paracetamol 500mg',
    harga_satuan: 5000,
    jumlah: 10,
    subtotal: 50000,
  },
  {
    id: 2,
    transaksi_id: 2,
    nama_obat: 'Amlodipine 5mg',
    harga_satuan: 8000,
    jumlah: 10,
    subtotal: 80000,
  },
  {
    id: 3,
    transaksi_id: 3,
    nama_obat: 'Ibuprofen 400mg',
    harga_satuan: 6000,
    jumlah: 15,
    subtotal: 90000,
  },
  {
    id: 4,
    transaksi_id: 3,
    nama_obat: 'Vitamin D 1000IU',
    harga_satuan: 12000,
    jumlah: 10,
    subtotal: 120000,
  },
];

// Initialize data
export function initializeData() {
  // SELALU overwrite supaya seed baru kepakai
  localStorage.setItem('rs_users', JSON.stringify(seedUsers));
  localStorage.setItem('rs_pasien', JSON.stringify(seedPasien));
  localStorage.setItem('rs_dokter', JSON.stringify(seedDokter));
  localStorage.setItem('rs_pendaftaran', JSON.stringify(seedPendaftaran));
  localStorage.setItem('rs_rekam_medis', JSON.stringify(seedRekamMedis));
  localStorage.setItem('rs_transaksi', JSON.stringify(seedTransaksi));
  localStorage.setItem('rs_detail_obat', JSON.stringify(seedDetailObat));
}

// Helper functions
export function authenticateUser(
  username: string,
  password: string,
): User | null {
  const users: User[] = JSON.parse(localStorage.getItem('rs_users') || '[]');
  return (
    users.find(
      (u) => u.username === username && u.password === password,
    ) || null
  );
}

export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem('rs_users') || '[]');
}

export function getPasien(): Pasien[] {
  return JSON.parse(localStorage.getItem('rs_pasien') || '[]');
}

export function getPasienById(id: number): Pasien | undefined {
  return getPasien().find((p) => p.id === id);
}

export function updatePasien(id: number, data: Partial<Pasien>) {
  const list = getPasien();
  const index = list.findIndex((p) => p.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    localStorage.setItem('rs_pasien', JSON.stringify(list));
  }
}

export function addPasien(data: Omit<Pasien, 'id'>): Pasien {
  const list = getPasien();
  const newId = list.length > 0 ? Math.max(...list.map((p) => p.id)) + 1 : 1;
  const newPasien = { ...data, id: newId };
  list.push(newPasien);
  localStorage.setItem('rs_pasien', JSON.stringify(list));
  return newPasien;
}

export function deletePasien(id: number) {
  const list = getPasien().filter((p) => p.id !== id);
  localStorage.setItem('rs_pasien', JSON.stringify(list));
}

export function getDokter(): Dokter[] {
  return JSON.parse(localStorage.getItem('rs_dokter') || '[]');
}

export function getDokterById(id: number): Dokter | undefined {
  return getDokter().find((d) => d.id === id);
}

export function addDokter(data: Omit<Dokter, 'id'>): Dokter {
  const list = getDokter();
  const newId = list.length > 0 ? Math.max(...list.map((d) => d.id)) + 1 : 1;
  const newDokter = { ...data, id: newId };
  list.push(newDokter);
  localStorage.setItem('rs_dokter', JSON.stringify(list));
  return newDokter;
}

export function updateDokter(id: number, data: Partial<Dokter>) {
  const list = getDokter();
  const index = list.findIndex((d) => d.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    localStorage.setItem('rs_dokter', JSON.stringify(list));
  }
}

export function getPendaftaran(): Pendaftaran[] {
  return JSON.parse(localStorage.getItem('rs_pendaftaran') || '[]');
}

export function getPendaftaranByPasienId(
  pasienId: number,
): Pendaftaran[] {
  return getPendaftaran().filter((p) => p.pasien_id === pasienId);
}

export function addPendaftaran(
  data: Omit<Pendaftaran, 'id'>,
): Pendaftaran {
  const list = getPendaftaran();
  const newId = list.length > 0 ? Math.max(...list.map((p) => p.id)) + 1 : 1;
  const newPendaftaran = { ...data, id: newId };
  list.push(newPendaftaran);
  localStorage.setItem('rs_pendaftaran', JSON.stringify(list));
  return newPendaftaran;
}

export function updatePendaftaran(id: number, data: Partial<Pendaftaran>) {
  const list = getPendaftaran();
  const index = list.findIndex((p) => p.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    localStorage.setItem('rs_pendaftaran', JSON.stringify(list));
  }
}

export function getRekamMedis(): RekamMedis[] {
  return JSON.parse(localStorage.getItem('rs_rekam_medis') || '[]');
}

export function getRekamMedisByPasienId(
  pasienId: number,
): RekamMedis[] {
  return getRekamMedis().filter((r) => r.pasien_id === pasienId);
}

export function getRekamMedisByDokterId(
  dokterId: number,
): RekamMedis[] {
  return getRekamMedis().filter((r) => r.dokter_id === dokterId);
}

export function addRekamMedis(
  data: Omit<RekamMedis, 'id'>,
): RekamMedis {
  const list = getRekamMedis();
  const newId = list.length > 0 ? Math.max(...list.map((r) => r.id)) + 1 : 1;
  const newRekamMedis = { ...data, id: newId };
  list.push(newRekamMedis);
  localStorage.setItem('rs_rekam_medis', JSON.stringify(list));
  return newRekamMedis;
}

export function getTransaksi(): Transaksi[] {
  return JSON.parse(localStorage.getItem('rs_transaksi') || '[]');
}

export function getTransaksiByPasienId(
  pasienId: number,
): Transaksi[] {
  return getTransaksi().filter((t) => t.pasien_id === pasienId);
}

export function addTransaksi(
  data: Omit<Transaksi, 'id'>,
): Transaksi {
  const list = getTransaksi();
  const newId = list.length > 0 ? Math.max(...list.map((t) => t.id)) + 1 : 1;
  const newTransaksi = { ...data, id: newId };
  list.push(newTransaksi);
  localStorage.setItem('rs_transaksi', JSON.stringify(list));
  return newTransaksi;
}

export function updateTransaksi(id: number, data: Partial<Transaksi>) {
  const list = getTransaksi();
  const index = list.findIndex((t) => t.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    localStorage.setItem('rs_transaksi', JSON.stringify(list));
  }
}

export function getDetailObat(): DetailTransaksiObat[] {
  return JSON.parse(localStorage.getItem('rs_detail_obat') || '[]');
}

export function getDetailObatByTransaksiId(
  transaksiId: number,
): DetailTransaksiObat[] {
  return getDetailObat().filter((d) => d.transaksi_id === transaksiId);
}

export function addDetailObat(
  data: Omit<DetailTransaksiObat, 'id'>,
): DetailTransaksiObat {
  const list = getDetailObat();
  const newId = list.length > 0 ? Math.max(...list.map((d) => d.id)) + 1 : 1;
  const newDetail = { ...data, id: newId };
  list.push(newDetail);
  localStorage.setItem('rs_detail_obat', JSON.stringify(list));
  return newDetail;
}
