import express, { Request, Response } from 'express';

const router = express.Router();

// Simpan data e-wallet sementara di memori
const ewallets: any[] = [];

// Endpoint untuk menghubungkan e-wallet
router.post('/connect', (req: Request, res: Response) => {
  const { walletName, accountNumber, balance } = req.body;
  if (!walletName || !accountNumber) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }
  ewallets.push({
    id: Date.now().toString(),
    walletName,
    accountNumber,
    balance: typeof balance === 'number' ? balance : 0,
    currency: 'IDR',
    lastSync: null,
    syncFrequency: 'harian',
    isActive: true
  });
  res.json({ success: true, message: 'E-Wallet berhasil dihubungkan' });
});

// Endpoint untuk mengambil daftar e-wallet
router.get('/accounts', (req: Request, res: Response) => {
  res.json({ success: true, data: ewallets });
});

// Endpoint untuk sinkronisasi e-wallet (dummy)
router.post('/sync/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // Cari ewallet yang sesuai
  const ewallet = ewallets.find((e) => e.id === id);
  if (!ewallet) {
    return res.status(404).json({ success: false, message: 'E-Wallet tidak ditemukan' });
  }
  // Simulasi sinkronisasi: update lastSync dan return jumlah transaksi dummy
  ewallet.balance = Math.floor(Math.random() * 1000000000) + 10000; // update saldo random
  ewallet.lastSync = new Date().toISOString();
  res.json({ success: true, data: { syncedTransactions: 0 } });
});

export default router; 