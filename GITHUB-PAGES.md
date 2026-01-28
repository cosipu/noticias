# Configuración para GitHub Pages

## ✅ Cambios Realizados

### 1. **Modo Estático Automático**
El sitio ahora detecta automáticamente si está corriendo en GitHub Pages y usa datos de ejemplo (mock data) en lugar de llamar al backend.

**Archivos modificados:**
- `index.html` - Página principal con rutas relativas
- `frontend/js/data-mock.js` - Datos de ejemplo (10 noticias)
- `frontend/js/main.js` - Detección automática de modo estático
- `frontend/css/styles.css` - Diseño completamente responsivo

### 2. **Datos de Ejemplo**
Se incluyeron 10 noticias de ejemplo en diferentes categorías:
- Política
- Economía
- Sociedad
- Seguridad
- Cultura

### 3. **Diseño Responsivo Completo**
Se agregaron media queries para múltiples dispositivos:
- ✅ **Desktop** (1200px+)
- ✅ **Tablets** (768px - 1024px)
- ✅ **Móviles grandes** (480px - 768px)
- ✅ **Móviles pequeños** (360px - 480px)
- ✅ **Orientación horizontal**

**Optimizaciones móviles:**
- Contador adaptativo (2x2 en móviles)
- Navegación compacta
- Grid de noticias en 1 columna
- Botones de ancho completo
- Prevención de zoom en inputs iOS
- Sin scroll horizontal

## 🚀 Cómo Usar en GitHub Pages

### Opción 1: Publicar desde la raíz
1. Sube todo el repositorio a GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main` y carpeta `/ (root)`
4. Guarda y espera 1-2 minutos

### Opción 2: Publicar desde /docs
1. Copia todo el contenido de `/frontend` a `/docs`
2. Copia `index.html` de la raíz a `/docs`
3. Ve a Settings → Pages
4. Selecciona la rama `main` y carpeta `/docs`

## 📱 Características Responsivas

### Mobile First
- Fuentes escalables según tamaño de pantalla
- Imágenes responsive con `max-width: 100%`
- Touch targets de mínimo 44px
- Sin zoom automático en iOS

### Breakpoints
```css
/* Tablets grandes */
@media (max-width: 1200px) { ... }

/* Tablets */
@media (max-width: 1024px) { ... }

/* Móviles grandes */
@media (max-width: 768px) { ... }

/* Móviles pequeños */
@media (max-width: 480px) { ... }

/* Muy pequeños */
@media (max-width: 360px) { ... }

/* Landscape */
@media (max-height: 600px) and (orientation: landscape) { ... }
```

## 🔧 Modo Desarrollo (con Backend)

Para trabajar en local con el backend:

1. El sitio detecta automáticamente `localhost` o `127.0.0.1`
2. En esos casos, usa el backend real en lugar de mock data
3. No necesitas cambiar nada en el código

```javascript
// Detección automática en main.js
const isStaticMode = !window.location.hostname.includes('localhost') 
  && !window.location.hostname.includes('127.0.0.1');
```

## ⚠️ Limitaciones del Modo Estático

En GitHub Pages (modo estático) **NO funcionan**:
- ❌ Login de administrador
- ❌ Crear/editar/eliminar noticias
- ❌ Foro de comentarios
- ❌ Base de datos PostgreSQL

**SÍ funcionan:**
- ✅ Contador de dos fases
- ✅ Visualización de noticias de ejemplo
- ✅ Navegación entre páginas
- ✅ Diseño responsive completo
- ✅ Modo oscuro (localStorage)

## 🎨 Personalización

Para cambiar las noticias de ejemplo, edita:
```javascript
// frontend/js/data-mock.js
const MOCK_NOTICIAS = [
  {
    id: 1,
    titulo: "Tu noticia aquí",
    resumen: "Descripción...",
    categoria: "política",
    // ... más campos
  }
];
```

## 📊 Estructura de Archivos

```
noticias/
├── index.html              # Página principal (GitHub Pages)
├── frontend/
│   ├── css/
│   │   └── styles.css      # Estilos completos con responsive
│   ├── js/
│   │   ├── data-mock.js    # Datos de ejemplo
│   │   ├── main.js         # Lógica principal (auto-detecta modo)
│   │   └── countdown.js    # Contador de dos fases
│   ├── images/
│   │   └── placeholder.svg
│   └── *.html              # Otras páginas
└── backend/                # Solo para desarrollo local
```

## 🐛 Solución de Problemas

### Error: "Failed to load resource: 404"
✅ **Solucionado** - El sitio ahora usa datos mock en GitHub Pages

### No se ven las noticias
1. Abre la consola del navegador (F12)
2. Verifica que `data-mock.js` se cargue antes que `main.js`
3. Comprueba que el orden en `index.html` sea:
   ```html
   <script src="frontend/js/data-mock.js"></script>
   <script src="frontend/js/main.js"></script>
   ```

### El diseño se ve mal en móviles
1. Verifica que `styles.css` se esté cargando
2. Comprueba el viewport meta tag en el `<head>`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

## 📞 Soporte

Si necesitas el backend funcionando (admin, comentarios, etc.), debes desplegarlo en un servidor como:
- Railway
- Heroku
- Render
- Vercel (con Serverless Functions)

Para modo estático en GitHub Pages, todo está configurado y funcionando ✅
