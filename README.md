# 💰 MoneyTracker Colombia

Una aplicación web moderna para gestionar tus finanzas personales en pesos colombianos, con un diseño elegante y funcionalidades intuitivas.

[🚀 Ver Demo en Vercel](https://wallet-flow-control.vercel.app/)

## 🌟 Características Principales

- 📊 Dashboard interactivo con estadísticas en tiempo real
- 💹 Gráficos animados de ingresos y gastos
- 📱 Diseño responsive y moderno
- 🎨 Interfaz con efectos de cristal y animaciones suaves
- 🔒 Autenticación segura
- 💾 Persistencia de datos en base de datos MySQL
- 🌐 API RESTful para gestión de datos

## 🚀 Tecnologías Utilizadas

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- Lucide Icons
- React Router DOM
- Axios

### Backend
- Node.js + Express
- TypeScript
- MySQL
- Prisma ORM
- JWT para autenticación

## 🛠️ Instalación

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

4. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto
   - Crea un archivo `.env` en el directorio `backend`

5. Inicia el servidor de desarrollo:
```bash
# Terminal 1 (Frontend)
npm run dev

# Terminal 2 (Backend)
cd backend
npm run dev
```

## 📁 Estructura del Proyecto

```
wallet-flow-control/
├── src/                    # Código fuente del frontend
│   ├── app/               # Configuración de la aplicación
│   ├── components/        # Componentes React
│   ├── contexts/          # Contextos de React
│   ├── hooks/             # Hooks personalizados
│   ├── lib/               # Utilidades y configuraciones
│   ├── pages/             # Páginas de la aplicación
│   └── types/             # Definiciones de tipos TypeScript
├── backend/               # Código fuente del backend
│   ├── database/         # Scripts y esquemas de la base de datos
│   └── src/              # Código fuente del servidor
│       ├── routes/       # Rutas de la API
│       ├── controllers/  # Controladores
│       └── middleware/   # Middleware
└── public/               # Archivos estáticos
```

## 🎨 Características de la UI

- **Efecto Cristal**: Interfaz con efecto de cristal (glassmorphism)
- **Animaciones Suaves**: Transiciones y animaciones en todos los elementos
- **Tema Ámbar**: Paleta de colores cálida y profesional
- **Diseño Responsive**: Adaptable a todos los dispositivos
- **Interactividad**: Efectos hover y feedback visual

## 🔐 Autenticación

- Registro de usuarios
- Inicio de sesión
- Recuperación de contraseña
- Tokens JWT para sesiones seguras

## 📊 Funcionalidades

- Registro de ingresos y gastos
- Categorización de transacciones
- Estadísticas mensuales
- Gráficos de tendencias
- Exportación de datos

## 🤝 Contribuir

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 👥 Autores

- **Luis Vanegas** - *Desarrollo* - [LuisVanegasCOL](https://github.com/LuisVanegasCOL)

## 🙏 Agradecimientos

- [Shadcn/ui](https://ui.shadcn.com/) por los componentes base
- [Lucide Icons](https://lucide.dev/) por los íconos
- [Tailwind CSS](https://tailwindcss.com/) por el framework de estilos
