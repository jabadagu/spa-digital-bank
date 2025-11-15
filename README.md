# 🏦 SPA Digital Bank

Una aplicación web moderna para servicios bancarios digitales construida con React, TypeScript y styled-components.

## ✨ Características

- **🎨 Diseño Moderno**: Interfaz intuitiva y responsive
- **🌍 Internacionalización**: Soporte para múltiples idiomas (ES/EN)
- **📱 Responsive**: Optimizado para dispositivos móviles y desktop
- **🎭 Animaciones**: Transiciones suaves con Framer Motion
- **🧪 Testing Completo**: >92% de cobertura de código
- **♿ Accesibilidad**: Cumple estándares WCAG
- **🔒 Validación**: Formularios con validación robusta usando Zod
- **🚀 Deploy Automático**: Integración continua con GitHub Pages

## 🚀 Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **Estilos**: styled-components, Framer Motion
- **Testing**: Jest, Testing Library
- **Linting**: ESLint, TypeScript strict
- **i18n**: react-i18next
- **Formularios**: react-hook-form + Zod
- **Deploy**: GitHub Pages + GitHub Actions

## 🌐 Demo Live

🔗 **[Ver aplicación en vivo](https://jabadagu.github.io/app/)**

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jabadagu/spa-digital-bank.git

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Ejecutar tests
npm test

# Build para producción
npm run build

# Deploy a GitHub Pages
npm run deploy
```

## 🚀 Despliegue

### Despliegue Automático
Cada push a la rama `main` activa automáticamente:
1. Ejecución de tests
2. Build de la aplicación
3. Deploy a GitHub Pages

### Despliegue Manual
```bash
npm run deploy
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/          # Páginas principales
├── hooks/          # Custom hooks
├── services/       # Servicios API
├── utils/          # Utilidades
├── contexts/       # Contextos React
├── i18n/           # Configuración internacionalización
├── styles/         # Temas y estilos globales
└── types/          # Definiciones TypeScript
```

## 📊 Métricas de Calidad

- ✅ **Cobertura de Tests**: 92.91%
- ✅ **Test Suites**: 16/16 pasando
- ✅ **Tests Totales**: 43/43 pasando
- ✅ **TypeScript**: Strict mode
- ✅ **ESLint**: Sin errores

## 🌟 Funcionalidades

### 🏠 Página Principal
- Lista de productos bancarios
- Paginación inteligente
- Búsqueda y filtrado

### 📞 Página de Contacto
- Formulario validado
- Múltiples tipos de documento
- Envío simulado con feedback

### 📄 Detalle de Producto
- Información completa del producto
- Navegación optimizada
- Animaciones fluidas

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm test             # Ejecutar tests
npm run test:ui      # Tests con interfaz
npm run lint         # Linting del código
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**jabadagu** - [GitHub Profile](https://github.com/jabadagu)

---

⭐ ¡Dale una estrella si te gustó el proyecto!
