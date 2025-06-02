import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Mail, Lock, User, MapPin, ArrowLeft } from 'lucide-react';
import { User as UserType } from '@/types';
import api from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  onLogin: (user: UserType) => void;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, formData);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        onLogin(user);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-amber-950/30 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botón de regreso */}
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-amber-400 hover:text-amber-300 hover:bg-amber-900/30 transition-all"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al inicio
        </Button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/images/MoneyTracker_LOGO.png" 
              alt="MoneyTracker Logo" 
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">MoneyTracker</h1>
             
            </div>
          </div>
         
        </div>

        <Card className="glass-effect amber-glow border-gold shadow-2xl">
          <CardHeader className="text-center border-b border-amber-500/20">
            <CardTitle className="text-2xl font-bold text-amber-300">
              ¡Bienvenido!
            </CardTitle>
            <CardDescription className="text-amber-200/70">
              Accede o crea tu cuenta para gestionar tus finanzas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={isLogin ? 'login' : 'register'} className="w-full" onValueChange={(value) => setIsLogin(value === 'login')}>
              <TabsList className="grid w-full grid-cols-2 bg-amber-900/30 border border-amber-500/30">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-black font-semibold"
                >
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-black font-semibold"
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center space-x-2 text-amber-200">
                      <Mail className="h-4 w-4" />
                      <span>Correo electrónico</span>
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={loading}
                      className="bg-amber-900/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center space-x-2 text-amber-200">
                      <Lock className="h-4 w-4" />
                      <span>Contraseña</span>
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={loading}
                      className="bg-amber-900/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-500 text-center">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full gold-gradient text-black font-semibold hover:scale-105 transition-all" disabled={loading}>
                    {loading ? 'Procesando...' : 'Iniciar Sesión'}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-amber-400 hover:text-amber-300 transition-colors underline"
                  >
                    ¿No tienes cuenta? Regístrate
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="flex items-center space-x-2 text-amber-200">
                      <User className="h-4 w-4" />
                      <span>Nombre completo</span>
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Juan Pérez"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                      disabled={loading}
                      className="bg-amber-900/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="flex items-center space-x-2 text-amber-200">
                      <Mail className="h-4 w-4" />
                      <span>Correo electrónico</span>
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={loading}
                      className="bg-amber-900/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="flex items-center space-x-2 text-amber-200">
                      <Lock className="h-4 w-4" />
                      <span>Contraseña</span>
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={loading}
                      className="bg-amber-900/20 border-amber-500/30 text-amber-100 placeholder:text-amber-300/50"
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-500 text-center">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full gold-gradient text-black font-semibold hover:scale-105 transition-all" disabled={loading}>
                    {loading ? 'Procesando...' : 'Registrarse'}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-amber-400 hover:text-amber-300 transition-colors underline"
                  >
                    ¿Ya tienes cuenta? Inicia sesión
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
