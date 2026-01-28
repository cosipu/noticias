import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Importar rutas
import noticiasRoutes from './routes/noticias.routes.js';
import foroRoutes from './routes/foro.routes.js';
import authRoutes from './routes/auth.routes.js';

// Importar middleware
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Configurar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tudominio.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Parsear body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting global
app.use(rateLimiter);

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
app.use('/api/noticias', noticiasRoutes);
app.use('/api/foro', foroRoutes);
app.use('/api/auth', authRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Servir frontend para rutas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/noticias', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/noticias.html'));
});

app.get('/noticia/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/noticia.html'));
});

app.get('/foro', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/foro.html'));
});

app.get('/hilo/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/hilo.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.get('/reglas', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/reglas.html'));
});

app.get('/acerca', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/acerca.html'));
});

// Manejador de errores
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

export default app;
