import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Car, Utensils, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const RecentTransactions: React.FC = () => {
  const { transactions, categories } = useApp();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Get category info and icon
  const getCategoryInfo = (transaction: any) => {
    if (transaction.type === 'income') return { icon: ArrowUpRight, color: '#10B981' };
    
    // Use category object if available, otherwise find by name
    const category = transaction.category || categories.find(cat => cat.name === transaction.categoryName);
    
    if (category) {
      const getIconComponent = (iconName: string) => {
        switch (iconName) {
          case 'ShoppingBag': return ShoppingBag;
          case 'Car': return Car;
          case 'Utensils': return Utensils;
          default: return DollarSign;
        }
      };
      
      return {
        icon: getIconComponent(category.icon || 'DollarSign'),
        color: category.color || '#6B7280'
      };
    }
    
    // Fallback for unknown categories
    const categoryName = transaction.category?.name || transaction.categoryName || (transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran');
    if (categoryName.toLowerCase().includes('makan')) return { icon: Utensils, color: '#F59E0B' };
    if (categoryName.toLowerCase().includes('transport')) return { icon: Car, color: '#3B82F6' };
    if (categoryName.toLowerCase().includes('belanja')) return { icon: ShoppingBag, color: '#8B5CF6' };
    
    return { icon: transaction.type === 'expense' ? ArrowDownLeft : ArrowUpRight, color: '#6B7280' };
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800 font-inter">
          Transaksi Terbaru
        </h3>
        <button
          className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          onClick={() => navigate('/transactions')}
        >
          Lihat Semua
        </button>
      </div>
      
      <div className="space-y-4">
        {transactions.slice(0, 5).map((transaction) => {
          const categoryInfo = getCategoryInfo(transaction);
          const Icon = categoryInfo.icon;
          const categoryName = transaction.category?.name || (transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran');
          return (
            <div key={transaction.id} className="flex items-center space-x-4 p-3 hover:bg-neutral-50 rounded-xl transition-colors">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: `${categoryInfo.color}20`, 
                  color: categoryInfo.color 
                }}
              >
                <Icon size={20} />
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-neutral-800">{transaction.description}</p>
                <p className="text-sm text-neutral-500">{categoryName} • {formatDate(transaction.date)}</p>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-secondary-600' : 'text-neutral-800'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;