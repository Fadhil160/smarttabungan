import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  CreditCard, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Wallet
} from 'lucide-react';

interface EWalletAccount {
  id: string;
  walletName: 'GoPay' | 'ShopeePay' | 'DANA';
  accountNumber: string;
  balance: number;
  currency: string;
  lastSync: string;
  syncFrequency: string;
  isActive: boolean;
}

interface EWalletTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: string;
  balance: number;
}

const EWalletIntegration: React.FC = () => {
  const { token } = useApp();
  const [accounts, setAccounts] = useState<EWalletAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<EWalletAccount | null>(null);
  const [transactions, setTransactions] = useState<EWalletTransaction[]>([]);

  // Form state for connecting e-wallet
  const [connectForm, setConnectForm] = useState({
    walletName: '',
    accountNumber: '',
    balance: ''
  });

  const supportedWallets = ['GoPay', 'ShopeePay', 'DANA'];

  useEffect(() => {
    fetchEWalletAccounts();
  }, []);

  const fetchEWalletAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ewallet/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
      }
    } catch (error) {
      console.error('Error fetching e-wallet accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectEWalletAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ewallet/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          walletName: connectForm.walletName,
          accountNumber: connectForm.accountNumber,
          balance: Number(connectForm.balance)
        })
      });

      const data = await response.json();
      if (data.success) {
        setShowConnectModal(false);
        setConnectForm({ walletName: '', accountNumber: '', balance: '' });
        fetchEWalletAccounts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error connecting e-wallet account:', error);
      alert('Gagal menghubungkan e-wallet');
    }
  };

  const syncEWalletAccount = async (accountId: string) => {
    try {
      setSyncing(accountId);
      const response = await fetch(`/api/ewallet/sync/${accountId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchEWalletAccounts();
        alert(`Sinkronisasi berhasil! ${data.data.syncedTransactions} transaksi baru.`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error syncing e-wallet account:', error);
      alert('Gagal sinkronisasi e-wallet');
    } finally {
      setSyncing(null);
    }
  };

  const disconnectEWalletAccount = async (accountId: string) => {
    if (!confirm('Apakah Anda yakin ingin memutuskan e-wallet ini?')) return;

    try {
      const response = await fetch(`/api/ewallet/disconnect/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchEWalletAccounts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error disconnecting e-wallet account:', error);
      alert('Gagal memutuskan e-wallet');
    }
  };

  const fetchEWalletTransactions = async (accountId: string) => {
    try {
      const response = await fetch(`/api/ewallet/transactions/${accountId}?limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Integrasi E-Wallet
          </h1>
          <p className="text-gray-600">
            Hubungkan akun e-wallet Anda untuk sinkronisasi otomatis transaksi dan saldo
          </p>
        </div>

        {/* Connect E-Wallet Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowConnectModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Hubungkan E-Wallet
          </button>
        </div>

        {/* E-Wallet Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {accounts.map(account => (
            <div key={account.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Wallet className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.walletName}</h3>
                    <p className="text-sm text-gray-500">{account.accountNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => syncEWalletAccount(account.id)}
                    disabled={syncing === account.id}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                    title="Sync"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing === account.id ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setSelectedAccount(account)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Transactions"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => disconnectEWalletAccount(account.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Disconnect"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Saldo</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(account.balance, account.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tipe Rekening</span>
                  <span className="text-sm text-gray-900">{account.walletName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Sync Terakhir</span>
                  <span className="text-sm text-gray-900">
                    {account.lastSync ? formatDate(account.lastSync) : 'Belum pernah'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Frekuensi Sync</span>
                  <span className="text-sm text-gray-900 capitalize">{account.syncFrequency}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="flex items-center">
                    {account.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${account.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {account.isActive ? 'Terhubung' : 'Terputus'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {accounts.length === 0 && (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada e-wallet terhubung
            </h3>
            <p className="text-gray-500 mb-6">
              Hubungkan e-wallet Anda untuk mulai sinkronisasi transaksi otomatis
            </p>
            <button
              onClick={() => setShowConnectModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Hubungkan E-Wallet Pertama
            </button>
          </div>
        )}

        {/* Connect E-Wallet Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Hubungkan E-Wallet</h2>
              <form onSubmit={connectEWalletAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-Wallet
                  </label>
                  <select
                    value={connectForm.walletName}
                    onChange={(e) => setConnectForm({...connectForm, walletName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih E-Wallet</option>
                    {supportedWallets.map(wallet => (
                      <option key={wallet} value={wallet}>{wallet}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Akun E-Wallet
                  </label>
                  <input
                    type="text"
                    value={connectForm.accountNumber}
                    onChange={(e) => setConnectForm({...connectForm, accountNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nomor akun e-wallet"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saldo Awal
                  </label>
                  <input
                    type="number"
                    value={connectForm.balance}
                    onChange={(e) => setConnectForm({ ...connectForm, balance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan saldo awal"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Hubungkan
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Transactions Modal */}
        {selectedAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Transaksi - {selectedAccount.walletName}
                </h2>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <button
                  onClick={() => fetchEWalletTransactions(selectedAccount.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Muat Transaksi
                </button>
              </div>

              {transactions.length > 0 && (
                <div className="space-y-3">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <DollarSign className={`w-4 h-4 ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}
                          {formatCurrency(transaction.amount, 'IDR')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Saldo: {formatCurrency(transaction.balance, 'IDR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Klik "Muat Transaksi" untuk melihat data transaksi</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EWalletIntegration;