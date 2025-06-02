import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { Transaction, CategoryData } from '@/types';
import TransactionList from './TransactionList';
import StatsCards from './StatsCards';
import ChartsSection from './ChartsSection';
import TransactionModal from './TransactionModal';

interface DashboardProps {
  transactions: Transaction[];
  monthlyStats: {
    income: number;
    expenses: number;
    balance: number;
  } | null;
}

const Dashboard = ({ transactions, monthlyStats }: DashboardProps) => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const getCategoryColor = (category: string): string => {
    const colors = [
      '#f59e0b', '#d97706', '#b45309', '#92400e',
      '#fbbf24', '#f3a857', 'ea8f47', '#dc7633'
    ];
    const index = category.length % colors.length;
    return colors[index];
  };

  const categoryData: CategoryData[] = useMemo(() => {
    const categories = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const existing = acc.find(c => c.name === transaction.category);
        if (existing) {
          existing.amount += transaction.amount;
        } else {
          acc.push({
            name: transaction.category,
            amount: transaction.amount,
            color: getCategoryColor(transaction.category)
          });
        }
        return acc;
      }, [] as CategoryData[]);
    
    return categories.sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-amber-950/30 to-black text-amber-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header con animación de entrada */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-amber-100 animate-fade-in-up">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-amber-200 mb-2 animate-slide-in-right">
              💰 MoneyTracker Colombia
            </h1>
            <p className="text-amber-300/80 text-sm md:text-base animate-slide-in-right animation-delay-200">
              Gestiona tus finanzas en pesos colombianos con elegancia
            </p>
            <div className="flex items-center justify-center md:justify-start mt-2 text-amber-400/70 text-xs md:text-sm animate-slide-in-right animation-delay-300">
              <TrendingUp className="w-4 h-4 mr-1 animate-bounce-subtle" />
              <span>Diseñado para Colombia 🇨🇴</span>
            </div>
          </div>
        </div>

        {/* Stats Cards con animación de entrada escalonada */}
        <div className="animate-fade-in-up animation-delay-300">
          <StatsCards monthlyStats={monthlyStats} />
        </div>

        {/* Charts con animación de entrada */}
        <div className="animate-fade-in-up animation-delay-500">
          <ChartsSection categoryData={categoryData} transactions={transactions} monthlyStats={monthlyStats} />
        </div>

        {/* Transaction List */}
        {/* La lista de transacciones se renderiza en Index.tsx según la pestaña activa */}

        {/* Transaction Form Modal */}
        {/* El modal se maneja en Index.tsx */}
      </div>
    </div>
  );
};

export default Dashboard;
