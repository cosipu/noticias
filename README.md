# Medio de Noticias con Foro Anónimo

Plataforma de noticias con foro anónimo estilo 4chan, enfocada en el gobierno entrante.

## 🎯 Características Principales

- **Contador Regresivo**: 4 años desde el 11 de marzo
- **Sistema de Noticias**: CRUD completo con panel de administración
- **Foro Anónimo**: Sin registro, totalmente anónimo, estilo 4chan
- **Base de Datos**: PostgreSQL en Railway
- **Seguridad**: Rate limiting, sanitización XSS/SQL, captcha

## 🏗️ Arquitectura

```
noticias/
├── backend/          # Node.js + Express API
├── frontend/         # HTML + CSS + JS
├── database/         # Esquemas y migraciones
└── docs/            # Documentación
```

## 🚀 Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL (Railway)
- **Seguridad**: express-rate-limit, helmet, DOMPurify
- **Validación**: express-validator

## 📦 Instalación

### 1. Clonar el repositorio
```bash
cd noticias
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en `/backend`:
```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@host:puerto/dbname
JWT_SECRET=tu_secreto_super_seguro_aqui
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_password_seguro
```

### 4. Inicializar base de datos
```bash
npm run db:migrate
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```

## 🗄️ Base de Datos en Railway

### Crear base de datos PostgreSQL:

1. Ir a [Railway.app](https://railway.app)
2. Crear nuevo proyecto
3. Añadir PostgreSQL
4. Copiar `DATABASE_URL` al archivo `.env`

### Ejecutar migraciones:
```bash
cd backend
npm run db:migrate
```

## 🔐 Seguridad

- **Anonimato**: No se almacenan IPs en la base de datos
- **Rate Limiting**: 100 requests/15min por IP
- **Sanitización**: Protección contra XSS y SQL Injection
- **Captcha**: Validación simple para publicar
- **IDs Temporales**: Sesiones anónimas con identificadores únicos

## 🎨 Frontend

Servir archivos estáticos desde `/frontend`:
```
http://localhost:3000/            # Home con contador
http://localhost:3000/noticias    # Listado de noticias
http://localhost:3000/foro        # Foro anónimo
http://localhost:3000/admin       # Panel de administración
```

## 📡 API Endpoints

### Noticias
- `GET /api/noticias` - Listar noticias
- `GET /api/noticias/:id` - Ver noticia
- `POST /api/noticias` - Crear noticia (admin)
- `PUT /api/noticias/:id` - Editar noticia (admin)
- `DELETE /api/noticias/:id` - Eliminar noticia (admin)

### Foro
- `GET /api/foro/hilos` - Listar hilos
- `GET /api/foro/hilos/:id` - Ver hilo completo
- `POST /api/foro/hilos` - Crear hilo
- `POST /api/foro/hilos/:id/respuestas` - Responder a hilo
- `DELETE /api/foro/posts/:id` - Eliminar post (moderador)

### Autenticación
- `POST /api/auth/login` - Login de administrador
- `POST /api/auth/verify` - Verificar token

## 🚢 Despliegue en Railway

1. Conectar repositorio a Railway
2. Configurar variables de entorno
3. Railway detectará automáticamente Node.js
4. Deploy automático desde `main`

### Variables de entorno en Railway:
```
DATABASE_URL=(automático)
JWT_SECRET=tu_secreto
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password_seguro
PORT=3000
```

## 📝 Roadmap

- [x] Estructura base
- [x] API REST
- [x] Foro anónimo
- [x] Contador regresivo
- [ ] Modo oscuro
- [ ] SEO optimization
- [ ] CDN para assets
- [ ] WebSocket para actualizaciones en tiempo real

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

## 🤝 Contribución

Proyecto cerrado - No se aceptan contribuciones externas
