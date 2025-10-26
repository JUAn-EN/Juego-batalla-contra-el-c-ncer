# 🦸‍♂️ VitaGuard Heroes - Guardianes de la Vida 🦸‍♀️

## 📋 Descripción del Proyecto

**VitaGuard Heroes** es un juego educativo interactivo 2D diseñado para crear conciencia sobre la prevención del cáncer. A través de gamificación, los usuarios aprenden sobre diferentes tipos de cáncer, técnicas de autoexamen, y la importancia de la detección temprana.

## 🎯 Misión

Educar y empoderar a las personas para que se conviertan en "héroes de la prevención", proporcionando conocimientos vitales sobre:
- 🎀 Cáncer de Mama
- 👨 Cáncer de Próstata  
- 👩 Cáncer Cervical
- 🫁 Cáncer de Pulmón

## ⭐ Características Principales

### 🎮 Experiencia de Juego
- **Interfaz Animada**: Menú principal con animaciones fluidas y partículas
- **Sistema de Niveles**: 4 tipos de cáncer, cada uno como un nivel diferente
- **Sistema de Puntuación**: Medallas y logros por completar misiones
- **Progreso del Usuario**: Seguimiento de estadísticas y niveles completados

### 📚 Contenido Educativo
- **Información Médica Actualizada**: Datos verificados sobre cada tipo de cáncer
- **Técnicas de Prevención**: Guías paso a paso para autoexámenes
- **Factores de Riesgo**: Educación sobre qué aumenta el riesgo de cáncer
- **Detección Temprana**: Importancia y métodos de detección precoz

### 👤 Sistema de Usuarios
- **Registro y Login**: Creación de perfiles de "héroe"
- **Seguimiento de Progreso**: Estadísticas personalizadas
- **Sistema de Logros**: Badges y reconocimientos
- **Tabla de Líderes**: Competencia amigable entre usuarios

### 🔧 Funciones Técnicas
- **Responsive Design**: Compatible con dispositivos móviles y desktop
- **Modo Debug**: Panel de desarrollo con herramientas de diagnóstico
- **Accesibilidad**: Soporte para usuarios con diferentes necesidades
- **API RESTful**: Backend robusto con endpoints educativos

## 🏗️ Estructura del Proyecto

```
cancer-prevention-game/
├── 📁 client/                 # Frontend (HTML, CSS, JS)
│   ├── 📁 css/               # Hojas de estilo
│   │   ├── styles.css        # Estilos principales
│   │   ├── menu.css         # Estilos del menú
│   │   └── animations.css   # Animaciones CSS
│   ├── 📁 js/               # Scripts JavaScript
│   │   ├── main.js          # Archivo principal
│   │   ├── menu.js          # Gestión del menú
│   │   ├── auth.js          # Autenticación
│   │   └── animations.js    # Animaciones JS
│   ├── 📁 assets/           # Recursos multimedia
│   │   ├── 📁 images/       # Imágenes del juego
│   │   └── 📁 sounds/       # Efectos de sonido
│   └── index.html           # Página principal
├── 📁 server/               # Backend (Node.js)
│   ├── 📁 routes/           # Rutas de la API
│   ├── 📁 models/           # Modelos de datos
│   ├── 📁 config/           # Configuración
│   └── app.js              # Servidor principal
├── 📁 database/             # Scripts de base de datos
├── package.json             # Dependencias del proyecto
└── README.md               # Este archivo
```

## 🚀 Instalación y Ejecución

### 📋 Requisitos Previos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)
- Navegador web moderno

### 🔧 Instalación

1. **Clonar o descargar el proyecto**:
   ```bash
   cd cancer-prevention-game
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor**:
   ```bash
   npm start
   ```
   
   O para desarrollo:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 🎮 Cómo Jugar

### 🏠 Menú Principal
1. **Registro**: Crea tu perfil de héroe con un nombre único
2. **Explorar Misiones**: Revisa los 4 tipos de cáncer disponibles
3. **Comenzar Misión**: Selecciona un nivel para empezar a aprender

### 🎯 Niveles del Juego
- **🎀 Nivel 1 - Cáncer de Mama**: Básico - Aprende autoexploración
- **👨 Nivel 2 - Cáncer de Próstata**: Intermedio - Detección temprana  
- **👩 Nivel 3 - Cáncer Cervical**: Intermedio - Prevención y vacunación
- **🫁 Nivel 4 - Cáncer de Pulmón**: Avanzado - Factores de riesgo

### 🏆 Sistema de Recompensas
- **Puntos**: Gana puntos por completar actividades
- **Medallas**: Obtén medallas por logros específicos
- **Niveles**: Sube de nivel con tu experiencia acumulada
- **Logros**: Desbloquea badges especiales

## 🔍 Funciones Especiales

### 🔧 Modo Debug
Activa el modo desarrollador con `Ctrl + Shift + D` para acceder a:
- Panel de estado del juego
- Herramientas de desarrollo
- Logs en tiempo real
- Funciones de testing

### ⌨️ Atajos de Teclado
- `Ctrl + P`: Pausar/Reanudar
- `Ctrl + M`: Silenciar/Activar sonido
- `F11`: Pantalla completa
- `Esc`: Cerrar modales
- `1-6`: Acceso rápido a botones del menú

### ♿ Accesibilidad
- Alto contraste disponible
- Navegación por teclado
- Texto ampliado
- Reducción de animaciones

## 🌐 API Endpoints

### 📊 Información del Juego
- `GET /api/game/info` - Información general del juego
- `GET /api/game/stats` - Estadísticas globales
- `GET /api/health` - Estado del servidor

### 🩺 Contenido Médico
- `GET /api/cancer/:type` - Información detallada por tipo de cáncer
- `GET /api/health/tips` - Consejos de salud aleatorios
- `GET /api/resources` - Recursos educativos y enlaces útiles

## 🎨 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS y animaciones
- **JavaScript (ES6+)**: Lógica del cliente, clases y módulos
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografía (Poppins)

### Backend
- **Node.js**: Servidor de aplicaciones
- **Express.js**: Framework web
- **CORS**: Manejo de políticas de origen cruzado
- **Body-parser**: Procesamiento de requests

### Almacenamiento
- **LocalStorage**: Datos del usuario y configuración
- **JSON**: Formato de intercambio de datos

## 🔮 Desarrollo Futuro

### 🎮 Funcionalidades de Juego
- [ ] Implementación completa de los 4 niveles de juego
- [ ] Minijuegos interactivos para cada tipo de cáncer
- [ ] Sistema de preguntas y respuestas
- [ ] Simuladores de autoexamen

### 💾 Backend Avanzado
- [ ] Base de datos MongoDB/PostgreSQL
- [ ] Sistema de autenticación JWT
- [ ] API de estadísticas avanzadas
- [ ] Sistema de notificaciones

### 📱 Características Adicionales
- [ ] Aplicación móvil (PWA)
- [ ] Modo multijugador
- [ ] Integración con redes sociales
- [ ] Certificados de completación

### 🌍 Expansión
- [ ] Más tipos de cáncer
- [ ] Múltiples idiomas
- [ ] Contenido por edades
- [ ] Integración con sistemas de salud

## 🤝 Contribuciones

Este proyecto está diseñado para tener un impacto positivo en la salud pública. Las contribuciones son bienvenidas:

1. **Fork** el proyecto
2. **Crear** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🩺 Aviso Médico

> **Importante**: Este juego es únicamente para fines educativos. No reemplaza el consejo médico profesional, diagnóstico o tratamiento. Siempre consulta con profesionales de la salud para obtener información médica específica.

## 📞 Contacto

Para preguntas, sugerencias o colaboraciones:

- **Email**: info@vitaguardheroes.com
- **Website**: [www.vitaguardheroes.com](http://www.vitaguardheroes.com)
- **GitHub**: [VitaGuard Heroes Repository](https://github.com/vitaguard/heroes)

## 🙏 Agradecimientos

- **Organizaciones Médicas**: Por proporcionar información verificada sobre el cáncer
- **Comunidad de Desarrollo**: Por las herramientas y librerías utilizadas
- **Beta Testers**: Por sus valiosos comentarios y sugerencias
- **Profesionales de la Salud**: Por la revisión del contenido médico

---

### 🦸‍♂️ ¡Únete a la misión de salvar vidas a través de la prevención! 🦸‍♀️

**VitaGuard Heroes** - *Donde la educación se convierte en superpoder* 💪✨