import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const GoalProgress: React.FC = () => {
  const { goals } = useApp();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800 font-inter">
          Progress Tujuan Keuangan
        </h3>
        <button
          className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          onClick={() => navigate('/goals')}
        >
          Kelola
        </button>
      </div>
      
      <div className="space-y-6">
        {goals.slice(0, 3).map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center">
                    <Target size={16} className="text-neutral-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{goal.name}</p>
                    <p className="text-sm text-neutral-500">
                      {formatCurrency(goal.currentAmount)} dari {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-800">
                    {progress.toFixed(0)}%
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-neutral-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 bg-primary-500`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        <button className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-500 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center space-x-2">
          <TrendingUp size={20} />
          <span>Tambah Tujuan Baru</span>
        </button>
      </div>
    </div>
  );
};

export default GoalProgress;