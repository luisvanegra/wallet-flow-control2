import TransactionForm from './TransactionForm';
import { Transaction } from '@/types';

interface TransactionModalProps {
  showTransactionForm: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

const TransactionModal = ({ showTransactionForm, addTransaction, onClose }: TransactionModalProps) => {
  if (!showTransactionForm) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect amber-glow border-gold rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-amber-300 text-center">
            💰 Nueva Transacción
          </h2>
          <p className="text-amber-200/70 text-center text-sm mt-1">
            Registra tus ingresos y gastos en pesos colombianos
          </p>
        </div>
        <TransactionForm 
          onSubmit={addTransaction}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default TransactionModal;
