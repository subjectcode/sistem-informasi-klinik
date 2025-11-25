export interface User {
  id: number;
  username: string;
  password: string;
  role: 'dokter' | 'pasien' | 'admin';
  pasien_id?: number;
}

export interface Pasien {
  id: number;
  nama: string;
  umur: number;
  keluhan: string;
  catatan_dokter: string;
}

export interface Transaksi {
  id: number;
  pasien_id: number;
  obat: string;
  harga: number;
  status_pembayaran: 'Lunas' | 'Belum Lunas';
  tanggal: string;
}

/**
 * USER DEFAULT
 * - Beberapa akun pasien, dokter, dan admin
 * - pasien_id mengarah ke id di defaultPasien
 */
const defaultUsers: User[] = [
  // --- Akun lama (boleh tetap dipakai) ---
  { id: 1, username: 'dokter1',  password: '123', role: 'dokter' },
  { id: 2, username: 'pasien1',  password: '123', role: 'pasien', pasien_id: 1 },
  { id: 3, username: 'pasien2',  password: '123', role: 'pasien', pasien_id: 2 },
  { id: 4, username: 'admin1',   password: '123', role: 'admin' },

  // --- Akun tambahan pasien (mapping ke pasien 1–3) ---
  { id: 5, username: 'pasien3',  password: '123', role: 'pasien', pasien_id: 3 },
  { id: 6, username: 'andi',     password: '123', role: 'pasien', pasien_id: 1 },
  { id: 7, username: 'budi',     password: '123', role: 'pasien', pasien_id: 2 },
  { id: 8, username: 'citra',    password: '123', role: 'pasien', pasien_id: 3 },

  // --- Akun dokter tambahan (tanpa relasi pasien) ---
  { id: 9,  username: 'dokter2', password: '123', role: 'dokter' },

  // --- Admin tambahan ---
  { id: 10, username: 'admin2',  password: '123', role: 'admin' },
  { id: 11, username: 'kasir1',  password: '123', role: 'admin' },
];

/**
 * DATA PASIEN
 */
const defaultPasien: Pasien[] = [
  {
    id: 1,
    nama: 'Andi Wijaya',
    umur: 23,
    keluhan: 'Batuk & demam',
    catatan_dokter:
      'Diduga ISPA, istirahat + obat batuk. Kontrol kembali jika demam tidak turun dalam 3 hari.',
  },
  {
    id: 2,
    nama: 'Budi Santoso',
    umur: 30,
    keluhan: 'Sakit kepala',
    catatan_dokter:
      'Kemungkinan migrain, diberikan analgesik. Hindari stress dan kurangi screen time.',
  },
  {
    id: 3,
    nama: 'Citra Dewi',
    umur: 25,
    keluhan: 'Sakit perut',
    catatan_dokter:
      'Diduga gangguan lambung, diberikan antasida dan edukasi pola makan.',
  },
];

/**
 * DATA TRANSAKSI
 */
const defaultTransaksi: Transaksi[] = [
  {
    id: 1,
    pasien_id: 1,
    obat: 'Obat Batuk Sirup',
    harga: 50000,
    status_pembayaran: 'Lunas',
    tanggal: '2025-11-20',
  },
  {
    id: 2,
    pasien_id: 2,
    obat: 'Analgesik',
    harga: 75000,
    status_pembayaran: 'Belum Lunas',
    tanggal: '2025-11-22',
  },
  {
    id: 3,
    pasien_id: 1,
    obat: 'Parasetamol',
    harga: 25000,
    status_pembayaran: 'Lunas',
    tanggal: '2025-11-20',
  },
  {
    id: 4,
    pasien_id: 3,
    obat: 'Antasida',
    harga: 60000,
    status_pembayaran: 'Belum Lunas',
    tanggal: '2025-11-23',
  },
];

/**
 * INISIALISASI DATA KE localStorage
 * -> SELALU overwrite (biar data baru pasti kepakai)
 */
export function initializeData() {
  localStorage.setItem('users', JSON.stringify(defaultUsers));
  localStorage.setItem('pasien', JSON.stringify(defaultPasien));
  localStorage.setItem('transaksi', JSON.stringify(defaultTransaksi));
}

/**
 * HELPER FUNCTIONS
 */
export function getUsers(): User[] {
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : [];
}

export function getPasien(): Pasien[] {
  const data = localStorage.getItem('pasien');
  return data ? JSON.parse(data) : [];
}

export function getPasienById(id: number): Pasien | undefined {
  const pasien = getPasien();
  return pasien.find((p) => p.id === id);
}

export function updatePasien(id: number, updates: Partial<Pasien>) {
  const pasien = getPasien();
  const index = pasien.findIndex((p) => p.id === id);
  if (index !== -1) {
    pasien[index] = { ...pasien[index], ...updates };
    localStorage.setItem('pasien', JSON.stringify(pasien));
  }
}

export function getTransaksi(): Transaksi[] {
  const data = localStorage.getItem('transaksi');
  return data ? JSON.parse(data) : [];
}

export function getTransaksiByPasienId(pasienId: number): Transaksi[] {
  const transaksi = getTransaksi();
  return transaksi.filter((t) => t.pasien_id === pasienId);
}

export function addTransaksi(transaksi: Omit<Transaksi, 'id'>) {
  const allTransaksi = getTransaksi();
  const newId =
    allTransaksi.length > 0
      ? Math.max(...allTransaksi.map((t) => t.id)) + 1
      : 1;
  const newTransaksi = { ...transaksi, id: newId };
  allTransaksi.push(newTransaksi);
  localStorage.setItem('transaksi', JSON.stringify(allTransaksi));
}

export function authenticateUser(
  username: string,
  password: string,
): User | null {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  return user || null;
}
