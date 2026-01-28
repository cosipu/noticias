# 🚀 Guía de Inicio Rápido

## 📦 Instalación Local

### 1. Instalar dependencias

```powershell
cd backend
npm install
```

### 2. Configurar variables de entorno

Copiar el archivo de ejemplo y editarlo:

```powershell
cp .env.example .env
```

Editar el archivo `.env` con tus valores (especialmente `DATABASE_URL`).

### 3. Configurar base de datos

Si estás usando Railway PostgreSQL, copiar la `DATABASE_URL` desde Railway.

Si usas PostgreSQL local:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/noticias
```

### 4. Ejecutar migraciones

```powershell
npm run db:migrate
```

### 5. Cargar datos iniciales (opcional)

```powershell
npm run db:seed
```

Esto creará:
- Administrador por defecto (usuario/password desde .env)
- 2 noticias de ejemplo
- 1 hilo de bienvenida en el foro

### 6. Iniciar servidor de desarrollo

```powershell
npm run dev
```

El servidor estará disponible en: http://localhost:3000

## 🌐 URLs Disponibles

- **Home**: http://localhost:3000
- **Noticias**: http://localhost:3000/noticias
- **Foro**: http://localhost:3000/foro
- **Admin**: http://localhost:3000/admin
- **Reglas**: http://localhost:3000/reglas
- **Acerca**: http://localhost:3000/acerca

## 🔑 Credenciales por Defecto

- **Usuario**: admin
- **Password**: (el que configuraste en .env)

**⚠️ CAMBIAR EN PRODUCCIÓN**

## 🧪 Probar la Aplicación

1. Abrir http://localhost:3000
2. Verificar que el contador regresivo funciona
3. Ver las noticias de ejemplo
4. Ir al foro y crear un hilo de prueba
5. Login en /admin con las credenciales
6. Crear una nueva noticia desde el panel

## 📝 API Endpoints

### Noticias
- `GET /api/noticias` - Listar noticias
- `GET /api/noticias/:id` - Ver noticia
- `POST /api/noticias` - Crear (requiere auth)
- `PUT /api/noticias/:id` - Editar (requiere auth)
- `DELETE /api/noticias/:id` - Eliminar (requiere auth)

### Foro
- `GET /api/foro/hilos` - Listar hilos
- `GET /api/foro/hilos/:id` - Ver hilo
- `POST /api/foro/hilos` - Crear hilo
- `POST /api/foro/hilos/:id/respuestas` - Responder

### Auth
- `POST /api/auth/login` - Login de admin
- `POST /api/auth/verify` - Verificar token

## 🐛 Troubleshooting

### Error de conexión a base de datos

Verificar que PostgreSQL está corriendo y `DATABASE_URL` es correcta.

### Puerto 3000 ya en uso

Cambiar en `.env`:
```env
PORT=3001
```

### Migraciones fallan

Verificar permisos de la base de datos y que el usuario tiene privilegios CREATE.

## 📚 Próximos Pasos

1. Leer [README.md](../README.md) para arquitectura completa
2. Ver [DEPLOYMENT.md](DEPLOYMENT.md) para despliegue en Railway
3. Personalizar estilos en `/frontend/css/styles.css`
4. Ajustar la fecha del contador en `/frontend/js/countdown.js`

## 🤝 Desarrollo

### Estructura de carpetas

```
noticias/
├── backend/
│   ├── config/         # Configuración DB
│   ├── controllers/    # Lógica de negocio
│   ├── database/       # Migraciones y seeds
│   ├── middleware/     # Autenticación, seguridad
│   ├── routes/         # Rutas API
│   └── server.js       # Servidor principal
├── frontend/
│   ├── css/            # Estilos
│   ├── js/             # JavaScript
│   └── *.html          # Páginas
└── docs/               # Documentación
```

### Agregar nueva funcionalidad

1. Backend: Crear controlador en `/backend/controllers`
2. Backend: Crear ruta en `/backend/routes`
3. Frontend: Crear página HTML en `/frontend`
4. Frontend: Crear JS específico en `/frontend/js`

¡Listo para empezar! 🎉
