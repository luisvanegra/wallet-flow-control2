import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, BarChart3 } from 'lucide-react';
import { Transaction, CategoryData } from '@/types';
import ExpenseChart from './ExpenseChart';
import MonthlyFinancialChart from './MonthlyFinancialChart';

interface ChartsSectionProps {
  categoryData: CategoryData[];
  transactions: Transaction[];
  monthlyStats: { income: number; expenses: number; balance: number; };
}

const ChartsSection = ({ categoryData, transactions, monthlyStats }: ChartsSectionProps) => {
  // No renderizar gráficos si no hay transacciones
  if (transactions.length === 0) {
    return (
      <Card className="glass-effect amber-glow border-gold">
        <CardContent className="p-6 text-center text-amber-200">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-amber-400/50" />
          <h3 className="text-lg font-medium mb-2">Sin datos para mostrar gráficos</h3>
          <p className="text-sm text-amber-300/70">Agrega algunas transacciones para ver tus estadísticas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card className="glass-effect amber-glow border-gold group hover:scale-[1.01] transition-all duration-300">
        <CardHeader className="border-b border-amber-500/20">
          <CardTitle className="flex items-center text-amber-300 text-lg md:text-xl">
            <PieChart className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            📊 Gastos por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <ExpenseChart data={categoryData} />
        </CardContent>
      </Card>

      <Card className="glass-effect amber-glow border-gold group hover:scale-[1.01] transition-all duration-300">
        <CardHeader className="border-b border-amber-500/20">
          <CardTitle className="flex items-center text-amber-300 text-lg md:text-xl">
            📈 Tendencia Mensual (Ingresos vs Gastos)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <MonthlyFinancialChart monthlyStats={monthlyStats} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
