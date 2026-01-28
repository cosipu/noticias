import { query } from '../config/database.js';

// Script de migración - Crear todas las tablas

const migrations = [
  // Tabla de noticias mejorada
  `CREATE TABLE IF NOT EXISTS noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    bajada VARCHAR(500),
    resumen TEXT NOT NULL,
    contenido TEXT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    imagen_url VARCHAR(500),
    imagen_principal BOOLEAN DEFAULT false,
    slug VARCHAR(255) UNIQUE NOT NULL,
    publicada BOOLEAN DEFAULT false,
    destacada BOOLEAN DEFAULT false,
    autor VARCHAR(100),
    numero_comentarios INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Índices para noticias
  `CREATE INDEX IF NOT EXISTS idx_noticias_categoria ON noticias(categoria)`,
  `CREATE INDEX IF NOT EXISTS idx_noticias_fecha ON noticias(fecha_creacion DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_noticias_publicada ON noticias(publicada)`,
  `CREATE INDEX IF NOT EXISTS idx_noticias_destacada ON noticias(destacada)`,

  // Tabla de hilos del foro
  `CREATE TABLE IF NOT EXISTS foro_hilos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    autor_id VARCHAR(50) NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    activo BOOLEAN DEFAULT true,
    archivado BOOLEAN DEFAULT false,
    sticky BOOLEAN DEFAULT false,
    comentarios_count INTEGER DEFAULT 0,
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Índices para hilos
  `CREATE INDEX IF NOT EXISTS idx_hilos_fecha ON foro_hilos(fecha_creacion DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_hilos_actividad ON foro_hilos(ultima_actividad DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_hilos_archivado ON foro_hilos(archivado)`,

  // Tabla de comentarios del foro (jerárquica)
  `CREATE TABLE IF NOT EXISTS foro_comentarios (
    id SERIAL PRIMARY KEY,
    hilo_id INTEGER NOT NULL REFERENCES foro_hilos(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES foro_comentarios(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    autor_id VARCHAR(50) NOT NULL,
    ip_hash VARCHAR(64) NOT NULL,
    likes INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Índices para comentarios
  `CREATE INDEX IF NOT EXISTS idx_comentarios_hilo ON foro_comentarios(hilo_id)`,
  `CREATE INDEX IF NOT EXISTS idx_comentarios_parent ON foro_comentarios(parent_id)`,
  `CREATE INDEX IF NOT EXISTS idx_comentarios_fecha ON foro_comentarios(fecha_creacion ASC)`,

  // Tabla de moderación (bloqueos temporales)
  `CREATE TABLE IF NOT EXISTS moderacion_bloqueos (
    id SERIAL PRIMARY KEY,
    ip_hash VARCHAR(64) NOT NULL UNIQUE,
    razon TEXT,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NOT NULL,
    activo BOOLEAN DEFAULT true
  )`,

  // Índice para bloqueos
  `CREATE INDEX IF NOT EXISTS idx_bloqueos_ip ON moderacion_bloqueos(ip_hash)`,
  `CREATE INDEX IF NOT EXISTS idx_bloqueos_activo ON moderacion_bloqueos(activo)`,

  // Tabla de administradores
  `CREATE TABLE IF NOT EXISTS administradores (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Función para actualizar timestamp de noticias
  `CREATE OR REPLACE FUNCTION actualizar_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,

  // Trigger para actualizar timestamp
  `DROP TRIGGER IF EXISTS trigger_actualizar_noticias ON noticias`,
  `CREATE TRIGGER trigger_actualizar_noticias
  BEFORE UPDATE ON noticias
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_timestamp()`,

  // Función para actualizar última actividad del hilo
  `CREATE OR REPLACE FUNCTION actualizar_actividad_hilo()
  RETURNS TRIGGER AS $$
  BEGIN
    UPDATE foro_hilos 
    SET ultima_actividad = CURRENT_TIMESTAMP,
        comentarios_count = comentarios_count + 1
    WHERE id = NEW.hilo_id;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,

  // Trigger para actualizar actividad
  `DROP TRIGGER IF EXISTS trigger_actividad_hilo ON foro_comentarios`,
  `CREATE TRIGGER trigger_actividad_hilo
  AFTER INSERT ON foro_comentarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_actividad_hilo()`
];

async function migrate() {
  console.log('🔄 Iniciando migración de base de datos...\n');
  
  try {
    for (let i = 0; i < migrations.length; i++) {
      console.log(`Ejecutando migración ${i + 1}/${migrations.length}...`);
      await query(migrations[i]);
    }
    
    console.log('\n✅ Migración completada exitosamente');
    console.log('\n📊 Tablas creadas:');
    console.log('  - noticias');
    console.log('  - foro_hilos');
    console.log('  - foro_respuestas');
    console.log('  - moderacion_bloqueos');
    console.log('  - administradores');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    process.exit();
  }
}

migrate();
