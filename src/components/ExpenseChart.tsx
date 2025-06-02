import { CategoryData } from '@/types';

interface ExpenseChartProps {
  data: CategoryData[];
}

const ExpenseChart = ({ data }: ExpenseChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-amber-300/70">
        No hay datos de gastos para mostrar.
      </div>
    );
  }

  // Calculate max amount for scaling bar heights
  const maxAmount = Math.max(...data.map(item => item.amount));

  // Helper to get bar height in percentage
  const getBarHeight = (amount: number) => {
    if (maxAmount === 0) return 0;
    const height = (amount / maxAmount) * 100;
    return Math.max(height, 5); // Mínimo 5% de altura
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.name} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-amber-200">{item.name}</span>
            <span className="text-amber-300">
              {`$ ${item.amount.toLocaleString('es-CO')}`}
            </span>
          </div>
          <div className="h-2 bg-amber-900/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out hover:shadow-lg hover:shadow-amber-200/20"
              style={{
                width: `${getBarHeight(item.amount)}%`,
                backgroundColor: item.color,
                minWidth: '20px',
                transition: 'width 0.5s ease-out, box-shadow 0.3s ease-out'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseChart;
