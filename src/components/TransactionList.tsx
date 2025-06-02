import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}

const TransactionList = ({ transactions, onDelete, loading, error }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Get unique categories
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort by date (newest first)
  const sortedTransactions = filteredTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
        <p className="mt-4 text-amber-200">Cargando transacciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="glass-effect amber-glow border-gold">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <TrendingUp className="h-12 w-12 text-amber-400/50 mb-4" />
          <h3 className="text-lg font-medium text-amber-200">No hay transacciones</h3>
          <p className="text-amber-200/70 text-center mt-2">
            Comienza a registrar tus ingresos y gastos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 text-amber-100">
      {/* Filters */}
      <Card className="glass-effect amber-glow border-gold shadow-2xl">
        <CardHeader className="border-b border-amber-500/30">
          <CardTitle className="flex items-center space-x-2 text-amber-200">
            <Filter className="h-5 w-5 text-amber-400" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-200">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-400/60" />
                <Input
                  placeholder="Buscar transacciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-amber-900/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-200">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-amber-900/20 border-amber-500/30 text-amber-100 data-[placeholder]:text-amber-300/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-amber-950 border-amber-500/30 text-amber-100">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Ingresos</SelectItem>
                  <SelectItem value="expense">Gastos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-200">Categoría</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-amber-900/20 border-amber-500/30 text-amber-100 data-[placeholder]:text-amber-300/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-amber-950 border-amber-500/30 text-amber-100">
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="glass-effect amber-glow border-gold shadow-2xl">
        <CardHeader className="border-b border-amber-500/30">
          <CardTitle className="text-amber-200">Transacciones</CardTitle>
          <CardDescription className="text-amber-300/80">
            {sortedTransactions.length} transacciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {sortedTransactions.length > 0 ? (
              // Lista de transacciones
              sortedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-amber-500/20 rounded-lg hover:bg-amber-900/20 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-700/30 text-green-400'
                        : 'bg-red-700/30 text-red-400'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-amber-100">{transaction.description}</h3>
                        <span className="px-2 py-1 bg-amber-900/30 text-amber-300/80 text-xs rounded">
                          {transaction.category}
                        </span>
                        {transaction.subcategory && (
                          <span className="px-2 py-1 bg-amber-900/30 text-amber-300/80 text-xs rounded">
                            {transaction.subcategory}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-amber-400/70">
                        {new Date(transaction.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`font-bold text-lg ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-amber-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-amber-300/80">
                <div className="text-amber-500/60 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-amber-200 mb-2">
                  No se encontraron transacciones
                </h3>
                <div className="text-amber-400/70">
                  Intenta ajustar los filtros o agregar nuevas transacciones
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionList;
