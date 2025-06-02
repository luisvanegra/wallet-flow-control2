import { useEffect, useRef } from 'react';

interface MonthlyFinancialChartProps {
  monthlyStats: { income: number; expenses: number; balance: number; } | null;
}

const MonthlyFinancialChart = ({ monthlyStats }: MonthlyFinancialChartProps) => {
  // Handle case with no data
  if (!monthlyStats) {
    return (
      <div className="flex items-center justify-center h-64 text-amber-300/70">
        Cargando datos del gráfico mensual...
      </div>
    );
  }

  // Calculate max amount for scaling bar heights
  const maxAmount = Math.max(monthlyStats.income, monthlyStats.expenses);

  // Helper to get bar height in percentage
  const getBarHeight = (amount: number) => {
    if (maxAmount === 0) return 0;
    const height = (amount / maxAmount) * 100;
    return Math.max(height, 5); // Mínimo 5% de altura
  };

  return (
    <div className="space-y-4 text-amber-100">
      {/* Chart Area */}
      <div className="h-64 flex items-end justify-center space-x-8">
        {/* Income Bar */}
        <div className="flex-1 flex flex-col items-center space-y-2">
          <div className="w-full flex items-end justify-center">
            <div
              className="w-1/2 bg-green-600 rounded-t-lg hover:shadow-lg hover:shadow-green-200 hover:-translate-y-1 transition-all duration-500 ease-out"
              style={{ 
                height: `${getBarHeight(monthlyStats.income)}%`,
                minHeight: '20px', // Altura mínima en píxeles
                transition: 'height 0.5s ease-out, transform 0.3s ease-out, box-shadow 0.3s ease-out'
              }}
            />
          </div>
          <span className="mt-2 text-xs text-amber-300">
            Ingresos
          </span>
          <span className="text-sm font-semibold text-green-400">
            {`$ ${monthlyStats.income.toLocaleString('es-CO')}`}
          </span>
        </div>
        
        {/* Expense Bar */}
        <div className="flex-1 flex flex-col items-center space-y-2">
          <div className="w-full flex items-end justify-center">
            <div
              className="w-1/2 bg-red-600 rounded-t-lg hover:shadow-lg hover:shadow-red-200 hover:-translate-y-1 transition-all duration-500 ease-out"
              style={{ 
                height: `${getBarHeight(monthlyStats.expenses)}%`,
                minHeight: '20px', // Altura mínima en píxeles
                transition: 'height 0.5s ease-out, transform 0.3s ease-out, box-shadow 0.3s ease-out'
              }}
            />
          </div>
          <span className="mt-2 text-xs text-amber-300">
            Gastos
          </span>
          <span className="text-sm font-semibold text-red-400">
            {`$ ${monthlyStats.expenses.toLocaleString('es-CO')}`}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 pt-4 border-t border-amber-500/20 text-amber-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-600 rounded" />
          <span className="text-sm">Ingresos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-600 rounded" />
          <span className="text-sm">Gastos</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyFinancialChart; 