# 🚀 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar tu medio de noticias con foro anónimo en Railway.

## 📋 Prerrequisitos

- Cuenta en [Railway.app](https://railway.app)
- Cuenta en GitHub (para conectar tu repositorio)
- Git instalado localmente

## 🔧 Paso 1: Preparar el Repositorio

### 1.1 Crear repositorio en GitHub

```bash
cd c:\Users\Alfredo\Desktop\noticias
git init
git add .
git commit -m "Initial commit - Medio de noticias con foro anónimo"
```

Crear repositorio en GitHub y hacer push:
```bash
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### 1.2 Crear archivo railway.json (opcional)

Ya está incluido en el proyecto para optimizar el despliegue.

## 🗄️ Paso 2: Crear Base de Datos PostgreSQL en Railway

1. Ir a [Railway.app](https://railway.app)
2. Crear nuevo proyecto: "New Project"
3. Seleccionar "Provision PostgreSQL"
4. Railway creará automáticamente la base de datos
5. En la pestaña "Variables", copiar el valor de `DATABASE_URL`

## 🚂 Paso 3: Desplegar la Aplicación

### 3.1 Conectar Repositorio

1. En Railway, mismo proyecto donde está PostgreSQL
2. Click en "New" → "GitHub Repo"
3. Autorizar Railway a acceder a tu GitHub
4. Seleccionar tu repositorio
5. Railway detectará automáticamente que es Node.js y leerá el `Procfile`

### 3.2 Configurar Variables de Entorno

En Railway, ir a tu servicio → "Variables" y añadir:

```env
DATABASE_URL=(ya configurada automáticamente)
JWT_SECRET=tu_secreto_super_seguro_generar_aleatorio
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TU_PASSWORD_SUPER_SEGURO
PORT=3000
```

**IMPORTANTE:** Genera un JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.3 Configurar Build y Start

Railway ahora leerá el `Procfile` automáticamente:
- **web**: Inicia el servidor en puerto 3000
- **release**: Ejecuta migraciones automáticamente antes de desplegar

No requiere configuración manual en los settings. El `Procfile` se encarga de todo.

## 🔨 Paso 4: Ejecutar Migraciones

### Opción A: Usando Railway CLI (Recomendado)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Linkar al proyecto
railway link

# Ejecutar migraciones
railway run npm run db:migrate

# Ejecutar seed (datos iniciales)
railway run npm run db:seed
```

### Opción B: Desde el panel de Railway

1. Ir a tu servicio en Railway
2. Click en "Deployments"
3. En el deployment actual, click en "View Logs"
4. Usar la terminal integrada para ejecutar:
```bash
npm run db:migrate
npm run db:seed
```

## ✅ Paso 5: Verificar Despliegue

1. Railway te dará una URL automática: `https://tu-app.up.railway.app`
2. Visitar la URL para verificar que el sitio funciona
3. Probar el contador regresivo en la home
4. Ir a `/admin` y hacer login con las credenciales configuradas
5. Probar crear una noticia
6. Visitar `/foro` y crear un hilo de prueba

## 🌐 Paso 6: Configurar Dominio Personalizado (Opcional)

1. En Railway, ir a "Settings" → "Domains"
2. Click en "Generate Domain" para obtener un dominio railway.app
3. O configurar dominio personalizado:
   - Click en "Custom Domain"
   - Añadir tu dominio
   - Configurar DNS según las instrucciones de Railway

## 🔒 Paso 7: Configuración de Seguridad Post-Despliegue

### 7.1 Actualizar CORS en server.js

Si tienes dominio personalizado, actualizar en Railway las variables:

```env
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
```

### 7.2 Cambiar Password de Admin

1. Ir a `/admin`
2. Login con credenciales iniciales
3. Cambiar inmediatamente el password

### 7.3 Habilitar HTTPS

Railway proporciona HTTPS automáticamente, no requiere configuración adicional.

## 📊 Monitoreo y Mantenimiento

### Ver Logs

```bash
# Con Railway CLI
railway logs

# O desde el panel web
# Deployments → View Logs
```

### Reiniciar Servicio

```bash
railway restart
```

### Actualizar después de cambios

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main

# Railway desplegará automáticamente
```

## 🐛 Solución de Problemas Comunes

### Error de conexión a base de datos

```bash
# Verificar que DATABASE_URL está configurada
railway variables

# Verificar que las migraciones se ejecutaron
railway run npm run db:migrate
```

### Error 503 o sitio no carga

```bash
# Ver logs para identificar el error
railway logs

# Verificar que el puerto está correcto
# Railway asigna el puerto automáticamente mediante la variable PORT
```

### Error de CORS

Verificar que en `server.js` el origen permitido incluye tu dominio de Railway.

## 📱 Paso 8: Optimizaciones Opcionales

### 8.1 CDN para Assets (Futuro)

Considerar usar Cloudflare CDN para servir assets estáticos más rápido.

### 8.2 Backup de Base de Datos

Railway permite backups automáticos en planes pagos. Configurar en:
- Settings → Backups

### 8.3 Monitoreo

Integrar con herramientas como:
- Sentry para errores
- Google Analytics para tráfico

## 🎉 ¡Listo!

Tu medio de noticias con foro anónimo está ahora desplegado en Railway.

### URLs importantes:

- **Home**: https://tu-app.up.railway.app
- **Foro**: https://tu-app.up.railway.app/foro
- **Admin**: https://tu-app.up.railway.app/admin
- **API Health**: https://tu-app.up.railway.app/api/health

## 📞 Soporte

Para problemas con Railway: https://railway.app/help
Para problemas del código: Revisar los logs y el archivo README.md
