import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, X } from 'lucide-react';
import { Transaction } from '@/types';
import api from '@/lib/axios';

interface Category {
  id: number;
  name: string;
  subcategories: string[];
  type: 'income' | 'expense';
  color: string;
  icon: string;
  is_default: number;
}

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

const TransactionForm = ({ onSubmit, onClose }: TransactionFormProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [amountInput, setAmountInput] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'expense' as 'expense' | 'income',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 0,
    subcategory: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        console.log('Respuesta de categorías:', response.data);
        if (response.data.success) {
          const categoriesData = response.data.data.categories;
          console.log('Categorías cargadas:', categoriesData);
          setCategories(categoriesData);
          
          // Si hay categorías, establecer la primera del tipo actual como valor por defecto
          const filteredByType = categoriesData.filter(cat => cat.type === formData.type);
          if (filteredByType.length > 0) {
            const firstCategory = filteredByType[0];
            setFormData(prev => ({
              ...prev,
              category: firstCategory.id,
              subcategory: firstCategory.subcategories?.[0] || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const formatColombian = (value: number): string => {
    if (isNaN(value)) return '';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Eliminar todos los caracteres no numéricos
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue === '') {
      setAmount(0);
      setAmountInput('');
      return;
    }

    const numValue = parseInt(numericValue, 10);
    
    if (!isNaN(numValue)) {
      setAmount(numValue);
      setAmountInput(formatColombian(numValue));
    }
  };

  const handleTypeChange = (value: string) => {
    const newType = value as 'expense' | 'income';
    const filteredByType = categories.filter(cat => cat.type === newType);
    
    setFormData(prev => ({
      ...prev,
      type: newType,
      category: filteredByType[0]?.id || 0,
      subcategory: filteredByType[0]?.subcategories?.[0] || ''
    }));
  };

  const handleCategoryChange = (value: string) => {
    console.log('Cambiando categoría a:', value);
    const categoryId = parseInt(value, 10);
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    console.log('Categoría seleccionada:', selectedCategory);
    
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subcategory: selectedCategory?.subcategories?.[0] || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find(cat => cat.id === formData.category);
    onSubmit({
      ...formData,
      amount: amount,
      category: selectedCategory?.name || '',
      subcategory: formData.subcategory
    });
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const selectedSubcategories = selectedCategory?.subcategories || [];
  const selectedCategoryHasSubcategories = selectedSubcategories.length > 0;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 scale-up-bottom-left">
      <Card className="w-full max-w-md glass-effect amber-glow border-gold shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-amber-500/30">
          <div>
            <CardTitle className="flex items-center space-x-2 text-amber-200">
              <img src="/images/MoneyTracker_LOGO.png" alt="MoneyTracker Logo" className="h-5 w-5" />
              <span>Nueva Transacción</span>
            </CardTitle>
            <CardDescription className="text-amber-300/80">
              Registra un nuevo ingreso o gasto
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-amber-500 hover:text-amber-400 hover:bg-amber-900/30">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-amber-200">Monto</Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 1000000"
                  value={amountInput}
                  onChange={handleAmountChange}
                  required
                  className="bg-amber-900/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date" className="text-amber-200">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="bg-amber-900/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-amber-200">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="bg-amber-900/20 border-amber-500/30 text-amber-100">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent className="bg-amber-900/90 border-amber-500/30">
                  <SelectItem value="income" className="text-amber-100 hover:bg-amber-800/50">Ingreso</SelectItem>
                  <SelectItem value="expense" className="text-amber-100 hover:bg-amber-800/50">Gasto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-amber-200">Categoría</Label>
              <Select
                value={formData.category.toString()}
                onValueChange={handleCategoryChange}
                disabled={loading}
              >
                <SelectTrigger className="bg-amber-900/20 border-amber-500/30 text-amber-100">
                  <SelectValue placeholder={loading ? "Cargando..." : "Selecciona la categoría"} />
                </SelectTrigger>
                <SelectContent className="bg-amber-900/90 border-amber-500/30">
                  {filteredCategories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()} 
                      className="text-amber-100 hover:bg-amber-800/50"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory" className="text-amber-200">Subcategoría</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
                disabled={loading || !formData.category}
              >
                <SelectTrigger className="bg-amber-900/20 border-amber-500/30 text-amber-100">
                  <SelectValue placeholder={loading ? "Cargando..." : (selectedCategoryHasSubcategories ? "Selecciona la subcategoría" : "Sin subcategorías") } />
                </SelectTrigger>
                <SelectContent className="bg-amber-900/90 border-amber-500/30">
                  {selectedSubcategories.map((subcategory) => (
                      <SelectItem 
                        key={subcategory} 
                        value={subcategory} 
                        className="text-amber-100 hover:bg-amber-800/50"
                      >
                        {subcategory}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-amber-200">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe la transacción..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-amber-900/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-amber-500/30 text-amber-100 hover:bg-amber-900/30 hover:text-amber-50 transition-all bg-amber-900/20">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className={`flex-1 font-semibold ${
                  formData.type === 'income' 
                    ? 'bg-green-700 hover:bg-green-800 text-white'
                    : 'bg-red-700 hover:bg-red-800 text-white'
                }`}
              >
                Guardar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;
