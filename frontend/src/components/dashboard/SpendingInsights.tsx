import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const SpendingInsights: React.FC = () => {
  const { transactions, categories } = useApp();

  // Calculate spending insights
  const calculateSpendingInsights = () => {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    
    const currentMonthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= currentMonth && tx.type === 'expense';
    });

    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    const prevMonthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= prevMonth && txDate < currentMonth && tx.type === 'expense';
    });

    // Calculate category spending
    const getCategorySpending = (transactions: any[]) => {
      const categoryTotals = new Map();
      
      transactions.forEach(tx => {
        const category = categories.find(cat => cat.id === tx.categoryId);
        if (category) {
          const current = categoryTotals.get(category.name) || 0;
          categoryTotals.set(category.name, current + tx.amount);
        }
      });

      return categoryTotals;
    };

    const currentCategorySpending = getCategorySpending(currentMonthTransactions);
    const prevCategorySpending = getCategorySpending(prevMonthTransactions);

    // Calculate insights
    const insights = [];

    // Top spending category
    let topCategory = '';
    let topAmount = 0;
    currentCategorySpending.forEach((amount, category) => {
      if (amount > topAmount) {
        topAmount = amount;
        topCategory = category;
      }
    });

    if (topCategory) {
      const prevAmount = prevCategorySpending.get(topCategory) || 0;
      const change = prevAmount > 0 ? ((topAmount - prevAmount) / prevAmount) * 100 : 0;
      
      insights.push({
        type: 'top-spending',
        title: `Kategori Terbesar: ${topCategory}`,
        description: `Rp ${topAmount.toLocaleString('id-ID')} (${change >= 0 ? '+' : ''}${change.toFixed(1)}% dari bulan lalu)`,
        icon: change > 10 ? TrendingUp : change < -10 ? TrendingDown : CheckCircle,
        color: change > 10 ? 'text-red-600' : change < -10 ? 'text-green-600' : 'text-blue-600',
        bgColor: change > 10 ? 'bg-red-50' : change < -10 ? 'bg-green-50' : 'bg-blue-50'
      });
    }

    // Spending trend
    const currentTotal = Array.from(currentCategorySpending.values()).reduce((sum, amount) => sum + amount, 0);
    const prevTotal = Array.from(prevCategorySpending.values()).reduce((sum, amount) => sum + amount, 0);
    const totalChange = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0;

    if (Math.abs(totalChange) > 5) {
      insights.push({
        type: 'trend',
        title: totalChange > 0 ? 'Pengeluaran Meningkat' : 'Pengeluaran Menurun',
        description: `${Math.abs(totalChange).toFixed(1)}% dari bulan lalu`,
        icon: totalChange > 0 ? TrendingUp : TrendingDown,
        color: totalChange > 0 ? 'text-red-600' : 'text-green-600',
        bgColor: totalChange > 0 ? 'bg-red-50' : 'bg-green-50'
      });
    }

    // Budget alert (if spending is high)
    if (currentTotal > 5000000) { // > 5 juta
      insights.push({
        type: 'alert',
        title: 'Pengeluaran Tinggi',
        description: 'Pertimbangkan untuk mengontrol pengeluaran bulan ini',
        icon: AlertTriangle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      });
    }

    // Savings opportunity
    const topCategories = Array.from(currentCategorySpending.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (topCategories.length > 0) {
      const biggestCategory = topCategories[0];
      const biggestAmount = biggestCategory[1];
      const percentage = (biggestAmount / currentTotal) * 100;

      if (percentage > 40) {
        insights.push({
          type: 'opportunity',
          title: 'Peluang Penghematan',
          description: `${biggestCategory[0]} adalah ${percentage.toFixed(1)}% dari total pengeluaran`,
          icon: Lightbulb,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        });
      }
    }

    return insights;
  };

  const insights = calculateSpendingInsights();

  // Add sample insights for demonstration if no real data
  const sampleInsights = [
    {
      type: 'top-spending',
      title: 'Kategori Terbesar: Makanan & Minuman',
      description: 'Rp 2.500.000 (+15.2% dari bulan lalu)',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      type: 'trend',
      title: 'Pengeluaran Meningkat',
      description: '12.5% dari bulan lalu',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      type: 'opportunity',
      title: 'Peluang Penghematan',
      description: 'Makanan & Minuman adalah 45.2% dari total pengeluaran',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const displayInsights = insights.length > 0 ? insights : sampleInsights;
  const isSampleData = insights.length === 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">
            Insight Pengeluaran
          </h3>
          <div className="flex items-center space-x-2">
            {isSampleData && (
              <div className="p-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">Data contoh</p>
              </div>
            )}
            <Lightbulb className="w-5 h-5 text-neutral-400" />
          </div>
        </div>
      
      <div className="space-y-4">
        {displayInsights.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <div key={index} className={`p-4 rounded-lg ${insight.bgColor} border border-current border-opacity-20`}>
              <div className="flex items-start space-x-3">
                <IconComponent className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                <div className="flex-1">
                  <h4 className={`font-medium ${insight.color} mb-1`}>
                    {insight.title}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpendingInsights; 