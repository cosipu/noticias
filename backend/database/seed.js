import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

// Script de seed - Datos iniciales para la base de datos

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...\n');
  
  try {
    // 1. Crear administrador por defecto
    console.log('👤 Creando administrador...');
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    await query(`
      INSERT INTO administradores (username, password_hash, role)
      VALUES ($1, $2, 'admin')
      ON CONFLICT (username) DO NOTHING
    `, [username, passwordHash]);
    
    console.log(`✅ Administrador creado: ${username}`);
    
    // 2. Crear noticias de ejemplo
    console.log('\n📰 Creando noticias de ejemplo...');
    
    const noticiasEjemplo = [
      {
        titulo: 'Inicio del nuevo gobierno: 11 de marzo',
        resumen: 'Hoy marca el comienzo de una nueva etapa en la historia del país con la asunción del nuevo gobierno.',
        contenido: 'El día 11 de marzo marca un hito histórico con el inicio del nuevo período gubernamental. Este medio seguirá de cerca todas las decisiones, políticas y acciones del nuevo gobierno durante los próximos 4 años. Nuestro compromiso es mantener informada a la ciudadanía de manera objetiva y transparente.',
        categoria: 'Política',
        publicada: true
      },
      {
        titulo: 'Bienvenidos al medio informativo ciudadano',
        resumen: 'Presentamos esta plataforma de información independiente enfocada en el seguimiento del gobierno.',
        contenido: 'Este es un espacio creado para la ciudadanía, donde podrán encontrar noticias verificadas sobre las acciones del gobierno, así como participar en debates a través de nuestro foro anónimo. La transparencia y el libre intercambio de ideas son fundamentales para una democracia saludable.',
        categoria: 'Institucional',
        publicada: true
      }
    ];
    
    for (const noticia of noticiasEjemplo) {
      const slug = noticia.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      await query(`
        INSERT INTO noticias (titulo, resumen, contenido, categoria, slug, publicada)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [noticia.titulo, noticia.resumen, noticia.contenido, noticia.categoria, slug, noticia.publicada]);
      
      console.log(`✅ Noticia creada: ${noticia.titulo}`);
    }
    
    // 3. Crear hilo de ejemplo en el foro
    console.log('\n💬 Creando hilo de bienvenida en el foro...');
    
    await query(`
      INSERT INTO foro_hilos (titulo, contenido, autor_id, ip_hash, sticky)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      'Bienvenidos al foro',
      'Este es el foro anónimo del medio. Aquí pueden discutir libremente sobre las noticias y el gobierno. Recuerden leer las reglas antes de publicar.',
      'Anon_ADMIN',
      'initial_hash',
      true
    ]);
    
    console.log('✅ Hilo de bienvenida creado');
    
    console.log('\n✅ Seed completado exitosamente');
    console.log('\n📋 Credenciales de administrador:');
    console.log(`   Usuario: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  CAMBIAR PASSWORD EN PRODUCCIÓN\n');
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    process.exit();
  }
}

seed();
