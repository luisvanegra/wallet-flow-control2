# 📖 Tutorial Completo - MoneyTracker Colombia

Este tutorial te guiará paso a paso en la creación y configuración de MoneyTracker, una aplicación web moderna para gestionar tus finanzas personales en pesos colombianos.

## 📋 Contenido

1. [Configuración Inicial](#1-configuración-inicial)
2. [Estructura del Proyecto](#2-estructura-del-proyecto)
3. [Base de Datos](#3-base-de-datos)
4. [Backend](#4-backend)
5. [Frontend](#5-frontend)
6. [Despliegue](#6-despliegue)
7. [Solución de Problemas](#7-solución-de-problemas)

## 1. Configuración Inicial

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 8.0.0
- MySQL >= 8.0
- Git

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/wallet-flow-control.git
cd wallet-flow-control
```

2. Instala las dependencias del frontend:
```bash
npm install
```

3. Instala las dependencias del backend:
```bash
cd backend
npm install
```

### Variables de Entorno

1. Frontend (.env):
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=MoneyTracker
```

2. Backend (.env):
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://user:password@localhost:3306/moneytracker
JWT_SECRET=tu_jwt_secret_super_seguro
FRONTEND_URL=http://localhost:5173
```

## 2. Estructura del Proyecto

```
wallet-flow-control/
├── src/                    # Frontend
│   ├── app/               # Configuración
│   ├── components/        # Componentes React
│   ├── contexts/          # Contextos
│   ├── hooks/             # Hooks personalizados
│   ├── lib/               # Utilidades
│   ├── pages/             # Páginas
│   └── types/             # Tipos TypeScript
├── backend/               # Backend
│   ├── database/         # Scripts SQL
│   └── src/              # Código servidor
│       ├── routes/       # Rutas API
│       ├── controllers/  # Controladores
│       └── middleware/   # Middleware
└── public/               # Archivos estáticos
```

## 3. Base de Datos

### Configuración

1. Crea la base de datos:
```sql
CREATE DATABASE moneytracker;
```

2. Ejecuta el script de inicialización:
```bash
mysql -u root -p moneytracker < backend/database/schema.sql
```

### Esquema Principal

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
  subcategories JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de transacciones
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
  category VARCHAR(255) NOT NULL,
  subcategory VARCHAR(255),
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 4. Backend

### Configuración del Servidor

1. Estructura de rutas:
```typescript
// backend/src/routes/index.ts
import express from 'express';
import authRoutes from './auth';
import transactionRoutes from './transactions';
import categoryRoutes from './categories';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);

export default router;
```

2. Middleware de autenticación:
```typescript
// backend/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Por favor autentíquese.' });
  }
};
```

### API Endpoints

#### Autenticación
```typescript
// POST /api/auth/register
{
  "name": "Usuario Demo",
  "email": "demo@moneytracker.com",
  "password": "demo123"
}

// POST /api/auth/login
{
  "email": "demo@moneytracker.com",
  "password": "demo123"
}
```

#### Transacciones
```typescript
// GET /api/transactions
// POST /api/transactions
{
  "amount": 1500.00,
  "type": "income",
  "category": "Salario",
  "subcategory": "Mensual",
  "description": "Pago mensual",
  "date": "2024-01-15"
}

// PUT /api/transactions/:id
// DELETE /api/transactions/:id
```

#### Categorías
```typescript
// GET /api/categories
// POST /api/categories
{
  "name": "Alimentación",
  "type": "expense",
  "subcategories": ["Supermercado", "Restaurantes", "Café"]
}
```

## 5. Frontend

### Componentes Principales

1. Dashboard:
```typescript
// src/components/Dashboard.tsx
import { StatsCards } from './StatsCards';
import { ChartsSection } from './ChartsSection';
import { TransactionList } from './TransactionList';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <StatsCards />
      <ChartsSection />
      <TransactionList />
    </div>
  );
};
```

2. Formulario de Transacciones:
```typescript
// src/components/TransactionForm.tsx
import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';

export const TransactionForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    subcategory: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { categories } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de envío
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
};
```

### Hooks Personalizados

1. useAuth:
```typescript
// src/hooks/useAuth.ts
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

2. useTransactions:
```typescript
// src/hooks/useTransactions.ts
import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { transactions, loading, refetch: fetchTransactions };
};
```

## 6. Despliegue

### Railway (Backend)

1. Crea una cuenta en [Railway](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno
4. Despliega el backend

### Vercel (Frontend)

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno
4. Despliega el frontend en [https://wallet-flow-control.vercel.app/](https://wallet-flow-control.vercel.app/)

## 7. Solución de Problemas

### Problemas Comunes

1. Error de conexión a la base de datos:
```bash
ERROR: connect ECONNREFUSED 127.0.0.1:3306
```
Solución: Verifica que MySQL esté corriendo y las credenciales sean correctas.

2. Error CORS:
```bash
ERROR: Access-Control-Allow-Origin
```
Solución: Verifica que FRONTEND_URL esté configurado correctamente en el backend.

3. Token JWT expirado:
```bash
ERROR: Token expired
```
Solución: Renueva el token o ajusta JWT_EXPIRES_IN.

### Comandos Útiles

```bash
# Desarrollo
npm run dev          # Frontend
cd backend && npm run dev  # Backend

# Build
npm run build        # Frontend
cd backend && npm run build  # Backend

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

## 📚 Recursos Adicionales

- [Documentación de React](https://reactjs.org/docs)
- [Documentación de Express](https://expressjs.com)
- [Documentación de MySQL](https://dev.mysql.com/doc)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Shadcn/ui](https://ui.shadcn.com)

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👥 Autor

- **Luis Vanegas** - [LuisVanegasCOL](https://github.com/LuisVanegasCOL)
