import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import AuthForm from '@/components/AuthForm';
import { Transaction, User } from '@/types';
import api from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import UserProfile from '@/components/UserProfile';

interface DashboardStats {
  income: number;
  expenses: number;
  balance: number;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Mock user authentication
  useEffect(() => {
    const mockUser = localStorage.getItem('moneyTracker_user');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
      loadTransactions();
    }
  }, []);

  // Cargar usuario desde localStorage al inicio
  useEffect(() => {
    const storedUser = localStorage.getItem('moneyTracker_user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // El token ya se configura en el interceptor de axios
    } else {
       // Si no hay usuario o token, redirigir al login/registro
       // navigate('/'); // Asumiendo que la ruta / es la de AuthForm
    }
  }, [/* navigate */]); // Agregar navigate si lo usas dentro

  // Función para cargar transacciones desde el backend
  const loadTransactions = useCallback(async () => {
    if (!user) return; // No cargar si no hay usuario autenticado

    setLoadingTransactions(true);
    setTransactionsError(null);
    try {
      const response = await api.get('/transactions');
      if (response.data.success) {
        setTransactions(response.data.data.transactions);
      } else {
        setTransactionsError(response.data.message || 'Error al cargar transacciones');
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      setTransactionsError(error.response?.data?.message || 'Error de red al cargar transacciones');
    } finally {
      setLoadingTransactions(false);
    }
  }, [user]);

  // Función para cargar estadísticas del dashboard
  const loadDashboardStats = useCallback(async () => {
    if (!user) return; // No cargar si no hay usuario autenticado

    setLoadingStats(true);
    setStatsError(null);
    try {
      const currentMonth = new Date().getMonth() + 1; // getMonth() es base 0
      const currentYear = new Date().getFullYear();
      const response = await api.get('/transactions/stats', {
        params: {
          month: currentMonth,
          year: currentYear
        }
      });
      if (response.data.success) {
        setDashboardStats(response.data.data.summary);
      } else {
        setStatsError(response.data.message || 'Error al cargar estadísticas');
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      setStatsError(error.response?.data?.message || 'Error de red al cargar estadísticas');
    } finally {
      setLoadingStats(false);
    }
  }, [user]);

  // Cargar transacciones y estadísticas cuando el usuario se establezca
  useEffect(() => {
    if (user) {
      loadTransactions();
      loadDashboardStats(); // Cargar estadísticas también
    }
  }, [user, loadTransactions, loadDashboardStats]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('moneyTracker_user', JSON.stringify(userData));
    // El token ya se guarda en el interceptor de axios durante el login
    // loadTransactions() se llamará automáticamente debido al useEffect que depende de 'user'
  };

  const handleLogout = () => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('moneyTracker_user');
    localStorage.removeItem('token'); // Eliminar también el token
    // navigate('/'); // Opcional: redirigir a la página de inicio de sesión
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    console.log('Attempting to add transaction:', transaction);
    setLoadingTransactions(true); // Opcional: mostrar estado de carga
    setTransactionsError(null); // Limpiar errores previos
    try {
      const response = await api.post('/transactions', transaction);
      console.log('API Response:', response.data);
      if (response.data.success) {
        // Después de agregar, recargar la lista de transacciones
        loadTransactions();
        loadDashboardStats(); // Recargar estadísticas después de agregar
        setShowTransactionForm(false);
      } else {
        setTransactionsError(response.data.message || 'Error al agregar transacción');
        setLoadingTransactions(false); // Detener carga si hay error de la API
      }
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      setTransactionsError(error.response?.data?.message || 'Error de red al agregar transacción');
      setLoadingTransactions(false); // Detener carga si hay error de red
    }
  };

  const deleteTransaction = async (id: string) => {
     setLoadingTransactions(true); // Opcional: mostrar estado de carga
     setTransactionsError(null); // Limpiar errores previos
    try {
      // El endpoint es /transactions/:id, así que construimos la URL
      const response = await api.delete(`/transactions/${id}`);
      if (response.data.success) {
        // Después de eliminar, recargar la lista de transacciones
        loadTransactions();
        loadDashboardStats(); // Recargar estadísticas después de eliminar
      } else {
         setTransactionsError(response.data.message || 'Error al eliminar transacción');
         setLoadingTransactions(false); // Detener carga si hay error de la API
      }
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      setTransactionsError(error.response?.data?.message || 'Error de red al eliminar transacción');
      setLoadingTransactions(false); // Detener carga si hay error de red
    }
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const totalIncome = dashboardStats?.income || 0;
  const totalExpenses = dashboardStats?.expenses || 0;
  const balance = dashboardStats?.balance || 0;

  // Función para formatear moneda colombiana
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-amber-950/30 to-black">
      {/* Header */}
      <header className="glass-effect border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/images/MoneyTracker_LOGO.png" alt="MoneyTracker Logo" className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-gradient">MoneyTracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-amber-200">Hola, {user.name}</span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-amber-500/30 text-amber-100 hover:bg-amber-900/30 hover:text-amber-50 transition-all bg-amber-900/20"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="glass-effect border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-amber-500 text-amber-300'
                  : 'border-transparent text-amber-200/70 hover:text-amber-300 hover:border-amber-500/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-amber-500 text-amber-300'
                  : 'border-transparent text-amber-200/70 hover:text-amber-300 hover:border-amber-500/50'
              }`}
            >
              Transacciones
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-amber-500 text-amber-300'
                  : 'border-transparent text-amber-200/70 hover:text-amber-300 hover:border-amber-500/50'
              }`}
            >
              Perfil
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-effect amber-glow border-gold">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-200">Total Ingresos</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</div>
              </CardContent>
            </Card>

            <Card className="glass-effect amber-glow border-gold">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-200">Total Gastos</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</div>
              </CardContent>
            </Card>

            <Card className="glass-effect amber-glow border-gold">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-200">Balance</CardTitle>
                <BarChart3 className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(balance)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Transaction Button */}
        {activeTab === 'transactions' && (
          <div className="mb-6">
            <Button
              onClick={() => setShowTransactionForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-black font-semibold hover:wobble-horizontal-bottom"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva Transacción
            </Button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'dashboard' ? (
          <Dashboard transactions={transactions} monthlyStats={dashboardStats} />
        ) : activeTab === 'transactions' ? (
          <TransactionList 
            transactions={transactions}
            onDelete={deleteTransaction}
            loading={loadingTransactions}
            error={transactionsError}
          />
        ) : activeTab === 'profile' ? (
          <UserProfile user={user} />
        ) : null}

        {/* Mostrar mensajes de carga o error */}
        {activeTab === 'transactions' && loadingTransactions && <div className="text-center text-blue-500">Cargando transacciones...</div>}
        {activeTab === 'transactions' && transactionsError && <div className="text-center text-red-500">{transactionsError}</div>}

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <TransactionForm
            onSubmit={addTransaction}
            onClose={() => setShowTransactionForm(false)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-effect mt-8 py-4 text-center border-t border-amber-500/30 text-amber-200/70">
        <p>
          Desarrollado por{' '}
          <a 
            href="https://github.com/LuisVanegasCOL" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-amber-100 transition-colors"
          >
            Luis Vanegas
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
