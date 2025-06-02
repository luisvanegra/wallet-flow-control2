import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Lock, Palette, Zap, Shield, Code, Database, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
// import SimpleParallax from "simple-parallax-js"; // Comentado o eliminado si no se usa

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// TODO: 1. Descarga un archivo JSON de animación gratuito de LottieFiles.com (ej. buscando "finance" o "money").
// TODO: 2. Guarda el archivo JSON en tu proyecto, por ejemplo en la ruta src/lotties/finance-animation.json
// TODO: 3. Descomenta la siguiente línea y actualiza la ruta si guardaste el archivo en otro lugar.
// import animationData from '../lotties/finance-animation.json';

const Home = () => {
  // Configuración para la animación Lottie
  // TODO: Descomenta la propiedad 'animationData' y usa tus datos importados.
  /* Eliminado:
  const defaultOptions = {
    loop: true,
    autoplay: true,
    // animationData: animationData, // <-- Descomenta y usa tus datos aquí
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  */

  // Data para las secciones (ajusta según necesites)
  const features = [
    {
      title: 'Gestión Financiera',
      icon: <BarChart3 className="h-7 w-7 text-amber-400 mr-3 group-hover:rotate-6 transition-transform" />,
      items: ['Registro de transacciones', 'Dashboard interactivo', 'Reportes avanzados', 'Exportación a Excel'],
    },
    {
      title: 'Diseño Elegante',
      icon: <Palette className="h-7 w-7 text-amber-400 mr-3 group-hover:rotate-6 transition-transform" />,
      items: ['Tema Ámbar/Dorado', 'Efectos Glass', 'Diseño Responsivo', 'Animaciones Suaves'],
    },
    {
      title: 'Seguridad Robusta',
      icon: <Shield className="h-7 w-7 text-amber-400 mr-3 group-hover:rotate-6 transition-transform" />,
      items: ['Autenticación JWT', 'Encriptación bcrypt', 'Rate Limiting', 'Validación de datos'],
    },
  ];

  const techStack = [
    {
      name: 'React',
      icon: <Code className="h-12 w-12 text-amber-400 group-hover:rotate-6 transition-transform" />,
      description: 'Frontend',
    },
    {
      name: 'Node.js',
      icon: <Code className="h-12 w-12 text-amber-400 group-hover:rotate-6 transition-transform" />,
      description: 'Backend',
    },
    {
      name: 'MySQL',
      icon: <Database className="h-12 w-12 text-amber-400 group-hover:rotate-6 transition-transform" />,
      description: 'Base de Datos',
    },
    {
      name: 'Railway',
      icon: <Cloud className="h-12 w-12 text-amber-400 group-hover:rotate-6 transition-transform" />,
      description: 'Deployment',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-amber-950/30 to-black text-amber-100 relative overflow-hidden">
      {/* Fondo con efecto */}

      {/* Encabezado Hero con Glassmorphism y Sombra */}
      <div className="relative z-10 py-12 sm:py-20 md:py-28 lg:py-36">
        {/* Eliminada la división en columnas, volvemos a centrar el contenido */}
        <div className="glass-effect amber-glow border-gold rounded-xl p-6 sm:p-8 md:p-10 max-w-4xl mx-auto text-center shadow-2xl animate-fade-in-up">
          {/* Columna de Texto y Botón */}
          {/* Contenido centrado */}
             <div className="flex justify-center mb-6 animate-fade-in animation-delay-100">
                <img
                  src="/images/MoneyTracker_LOGO.png"
                  alt="MoneyTracker Logo"
                  className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 object-contain transform hover:scale-110 transition-transform duration-300"
                />
              </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-amber-200 mb-4 animate-slide-in-right animation-delay-200">
              MoneyTracker
              <span className="block text-amber-400">Gestión Financiera Elegante</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-amber-300/80 max-w-2xl mx-auto animate-slide-in-right animation-delay-300">
              Una aplicación fullstack de gestión financiera personal con diseño elegante en tonos ámbar y dorado.
            </p>
            <div className="mt-8 animate-fade-in-up animation-delay-400">
              <Link to="/dashboard">
                <Button className="bg-amber-600 hover:bg-amber-700 text-black font-semibold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                  Comenzar Ahora
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          {/* Columna de Animación Lottie */}
          {/* Eliminada la columna de animación */}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-12 sm:py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-base text-amber-400 font-semibold tracking-wide uppercase animate-fade-in">Características</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-100 animate-fade-in-up">
            Todo lo que necesitas para tus finanzas
          </p>

          {/* Características Cards */}
          <div className="mt-12">
            {/* Swiper para móviles, Grid para desktop */}
            <div className="sm:hidden">
              <Swiper
                spaceBetween={20}
                slidesPerView={1.2}
                centeredSlides={true}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
              >
                {features.map((feature, index) => (
                  <SwiperSlide key={index} className="pb-4">
                     <Card className="glass-effect amber-glow border-gold group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
                      <CardHeader className="border-b border-amber-500/20">
                        <CardTitle className="flex items-center justify-center text-amber-300 text-xl font-semibold">
                          {feature.icon}
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-left">
                        <ul className="space-y-3 text-amber-200/80 text-base">
                          {feature.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center transform hover:translate-x-1 transition-transform duration-200"><ArrowRight className="h-4 w-4 text-amber-500 mr-2" />{item}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Grid para sm y pantallas más grandes */}
            <div className="hidden sm:grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
               {features.map((feature, index) => (
                   <Card key={index} className="glass-effect amber-glow border-gold group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up animation-delay-100">
                      <CardHeader className="border-b border-amber-500/20">
                        <CardTitle className="flex items-center justify-center text-amber-300 text-xl font-semibold">
                          {feature.icon}
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-left">
                        <ul className="space-y-3 text-amber-200/80 text-base">
                          {feature.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center transform hover:translate-x-1 transition-transform duration-200"><ArrowRight className="h-4 w-4 text-amber-500 mr-2" />{item}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="relative z-10 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-base text-amber-400 font-semibold tracking-wide uppercase animate-fade-in">Tech Stack</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-100 animate-fade-in-up">
            Construido con las mejores tecnologías modernas
          </p>
          {/* Stack Tecnológico Cards */}
           <div className="mt-12">
             {/* Swiper para móviles, Grid para desktop */}
             <div className="sm:hidden">
                <Swiper
                  spaceBetween={20}
                  slidesPerView={1.5}
                  centeredSlides={true}
                   onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}
                >
                  {techStack.map((tech, index) => (
                    <SwiperSlide key={index} className="pb-4">
                      <Card className="glass-effect amber-glow border-gold flex flex-col items-center justify-center p-6 group hover:scale-[1.05] transition-all duration-300 animate-fade-in-up">
                          {tech.icon}
                          <CardTitle className="text-lg font-semibold text-amber-300 mt-4">{tech.name}</CardTitle>
                          <CardDescription className="text-amber-200/70 text-center text-sm mt-1">{tech.description}</CardDescription>
                      </Card>
                    </SwiperSlide>
                  ))}
                </Swiper>
             </div>

              {/* Grid para sm y pantallas más grandes */}
              <div className="hidden sm:grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
                 {techStack.map((tech, index) => (
                    <Card key={index} className="glass-effect amber-glow border-gold flex flex-col items-center justify-center p-6 group hover:scale-[1.05] transition-all duration-300 animate-fade-in-up animation-delay-100">
                        {tech.icon}
                        <CardTitle className="text-lg font-semibold text-amber-300 mt-4">{tech.name}</CardTitle>
                        <CardDescription className="text-amber-200/70 text-center text-sm mt-1">{tech.description}</CardDescription>
                    </Card>
                  ))}
              </div>
           </div>
        </div>
      </div>

      {/* Llamado a la Acción Final */}
      <div className="relative z-10 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="glass-effect amber-glow border-gold p-8 sm:p-10 shadow-2xl transform hover:scale-[1.02] transition-all duration-500 animate-fade-in-up animation-delay-500">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-amber-200 mb-4">
                ¿Listo para comenzar?
              </CardTitle>
              <CardDescription className="text-lg text-amber-300/80 max-w-2xl mx-auto">
                Comienza a gestionar tus finanzas hoy con MoneyTracker. Es rápido, seguro y elegante.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-8">
               <Link to="/dashboard">
                <Button className="bg-amber-600 hover:bg-amber-700 text-black font-semibold px-10 py-7 rounded-full text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group animate-pulse-subtle">
                  Comenzar Ahora
                  <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Aquí podrías añadir secciones adicionales como testimonios o demo */}
      {/* TODO: Implementar sección de testimonios/demo */}

      {/* Footer (Opcional) */}
      {/* <footer className="glass-effect border-t border-amber-500/20 py-8 text-center text-amber-300/70 text-sm">
        <p>© 2023 MoneyTracker. Todos los derechos reservados.</p>
      </footer> */}
    </div>
  );
};

export default Home;