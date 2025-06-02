import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface StatsCardsProps {
  monthlyStats: {
    income: number;
    expenses: number;
    balance: number;
  };
}

const StatsCards = ({ monthlyStats }: StatsCardsProps) => {
  // Mostrar indicador de carga o guiones si monthlyStats es null
  if (!monthlyStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-amber-200">
        <Card className="glass-effect amber-glow border-gold">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <p>Cargando...</p>
          </CardContent>
        </Card>
        <Card className="glass-effect amber-glow border-gold">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <p>Cargando...</p>
          </CardContent>
        </Card>
        <Card className="glass-effect amber-glow border-gold">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
            <p>Cargando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income Card */}
      <Card className="glass-effect amber-glow border-gold group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
        <CardHeader className="border-b border-amber-500/20">
          <CardTitle className="flex items-center text-amber-300 text-lg md:text-xl">
            <TrendingUp className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            💰 Total Ingresos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="text-2xl md:text-3xl font-bold text-green-400 animate-slide-in-right">
            {monthlyStats ? `$ ${monthlyStats.income.toLocaleString('es-CO')}` : 'Cargando...'}
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses Card */}
      <Card className="glass-effect amber-glow border-gold group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up animation-delay-100">
        <CardHeader className="border-b border-amber-500/20">
          <CardTitle className="flex items-center text-amber-300 text-lg md:text-xl">
            <TrendingDown className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            💸 Total Gastos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="text-2xl md:text-3xl font-bold text-red-400 animate-slide-in-right animation-delay-200">
            {monthlyStats ? `$ ${monthlyStats.expenses.toLocaleString('es-CO')}` : 'Cargando...'}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Income Card */}
      <Card className="glass-effect amber-glow border-gold group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up animation-delay-200">
        <CardHeader className="border-b border-amber-500/20">
          <CardTitle className="flex items-center text-amber-300 text-lg md:text-xl">
            <DollarSign className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            💰 Ingresos del Mes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="text-2xl md:text-3xl font-bold text-green-400 animate-slide-in-right animation-delay-300">
            {monthlyStats ? `$ ${monthlyStats.income.toLocaleString('es-CO')}` : 'Cargando...'}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Balance Card */}
      <Card className="glass-effect amber-glow border-gold group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up animation-delay-300">
        <CardHeader className="border-b border-amber-500/20">
          <CardTitle className="flex items-center text-amber-300 text-lg md:text-xl">
            <BarChart3 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            💰 Balance Total
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="text-2xl md:text-3xl font-bold text-amber-400 animate-slide-in-right animation-delay-400">
            {monthlyStats ? `$ ${monthlyStats.balance.toLocaleString('es-CO')}` : 'Cargando...'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Función para formatear moneda colombiana
export const formatColombianCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default StatsCards;
