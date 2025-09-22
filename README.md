# 🏹 Hunger Games SLP 2025 - Panel del Capitolio

Sistema completo de Hunger Games SLP 2025 con panel del Capitolio para registro de enfrentamientos en tiempo real.

## ✨ Características

- **🏛️ Panel Público del Capitolio**: Visualización en tiempo real de los resultados de los juegos
- **🔐 Sistema de Autenticación por Códigos**: 2 niveles de administración (Gamemaker y Admin del Capitolio)
- **⚔️ Registro de Enfrentamientos**: Sistema completo para registrar batallas entre distritos
- **🚨 Modo Emergencia**: Datos falsos para demostraciones cuando la base de datos no está disponible
- **🏆 Declaración de Ganador**: Funcionalidad para declarar el ganador final de los juegos
- **✨ Diseño Hermoso**: Tema dorado y oscuro inspirado en el Capitolio
- **💾 Base de Datos Completa**: Esquema completo en Supabase con tiempo real
- **🔄 Actualizaciones en Tiempo Real**: Sincronización automática de datos
- **📱 Responsive**: Diseño adaptable a todos los dispositivos

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS con tema personalizado
- **Base de Datos**: Supabase (PostgreSQL)
- **Iconos**: Lucide React
- **Deployment**: Vercel (recomendado)

## 🚀 Inicio Rápido

### 1. Clona el repositorio
\`\`\`bash
git clone https://github.com/ferisai06/HungerGamesSLP2025.git
cd HungerGamesSLP2025
\`\`\`

### 2. Instala las dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Configura las variables de entorno
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edita `.env.local` con tus credenciales de Supabase:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
\`\`\`

### 4. Configura la base de datos
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el script `database-schema.sql` en el SQL Editor de Supabase
3. Habilita el Realtime para las tablas desde la configuración de Supabase

### 5. Ejecuta el proyecto
\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎮 Uso del Sistema

### Panel Público
- Visualiza el estado actual de los juegos
- Ver tributos activos y eliminados
- Historial de enfrentamientos en tiempo real
- Información del ganador (cuando se declare)

### Panel de Administración

#### Códigos de Acceso
- **Gamemaker**: `GM2025`, `MAKER1`, `ARENA7`
- **Admin del Capitolio**: `SNOW25`, `CAPI01`, `ADMIN9`

#### Funciones de Gamemaker
- Registrar enfrentamientos entre distritos
- Cambiar fases del juego
- Declarar ganador final

#### Funciones de Admin del Capitolio
- Todas las funciones de Gamemaker
- Control total del sistema
- Activar modo emergencia

### Modo Emergencia
Activa datos de prueba cuando:
- La base de datos no está disponible
- Se necesita hacer una demostración
- Hay problemas de conectividad

## 📊 Estructura de la Base de Datos

### Tablas Principales
- **districts**: Información de los 12 distritos y sus tributos
- **battles**: Registro de todos los enfrentamientos
- **game_state**: Estado actual del juego
- **admin_users**: Usuarios administrativos (opcional)

### Fases del Juego
1. **Preparación**: Los tributos se preparan para entrar a la arena
2. **Baño de Sangre**: Enfrentamientos iniciales por suministros
3. **Los Juegos**: Desarrollo principal de los juegos
4. **Gran Final**: Enfrentamientos finales
5. **Terminado**: Juegos concluidos con ganador declarado

## 🎨 Personalización del Tema

El sistema usa un tema personalizado con colores del Capitolio:

- **Dorado**: Colores principales de acento
- **Capitol**: Tonos morados/violetas para el fondo
- **Gradientes**: Efectos visuales atmosféricos
- **Animaciones**: Transiciones suaves y efectos de brillo

## 🔧 Scripts Disponibles

\`\`\`bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Construir para producción
npm run start    # Ejecutar versión de producción
npm run lint     # Verificar código con ESLint
\`\`\`

## 📱 Características Responsive

- **Mobile**: Diseño optimizado para teléfonos
- **Tablet**: Layout adaptado para tabletas
- **Desktop**: Experiencia completa en escritorio
- **4K**: Soporte para pantallas de alta resolución

## 🚀 Deployment en Vercel

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en Vercel
3. Deploy automático en cada push

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👤 Autor

**Fernando Isaí Hernández González**

## 🙏 Agradecimientos

- Inspirado en la saga Hunger Games de Suzanne Collins
- Iconos por [Lucide](https://lucide.dev)
- Hosting por [Vercel](https://vercel.com)
- Base de datos por [Supabase](https://supabase.com)

---

*"Que los juegos... comiencen"* 🏹
