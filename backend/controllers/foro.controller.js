import { query } from '../config/database.js';
import { sanitizePost } from '../middleware/sanitize.js';
import { hashIP } from '../middleware/rateLimiter.js';
import { v4 as uuidv4 } from 'uuid';

// Generar ID anónimo temporal basado en sesión
const generateAnonId = (req) => {
  const sessionId = req.headers['x-session-id'] || uuidv4();
  const hash = hashIP(sessionId).substring(0, 8).toUpperCase();
  return `Anon_${hash}`;
};

// Verificar si IP está bloqueada
const isBlocked = async (ipHash) => {
  const result = await query(`
    SELECT * FROM moderacion_bloqueos
    WHERE ip_hash = $1 AND activo = true AND fecha_fin > NOW()
  `, [ipHash]);
  
  return result.rows.length > 0;
};

// Obtener todos los hilos
export const getAllHilos = async (req, res) => {
  try {
    const { ordenar = 'recientes', limit = 20, offset = 0 } = req.query;
    
    let orderBy = 'fecha_creacion DESC';
    if (ordenar === 'activos') {
      orderBy = 'ultima_actividad DESC';
    }
    
    const queryText = `
      SELECT id, titulo, contenido, autor_id, respuestas_count, 
             sticky, archivado, ultima_actividad, fecha_creacion
      FROM foro_hilos
      WHERE archivado = false
      ORDER BY sticky DESC, ${orderBy}
      LIMIT $1 OFFSET $2
    `;
    
    const result = await query(queryText, [limit, offset]);
    
    res.json({
      hilos: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error al obtener hilos:', error);
    res.status(500).json({ error: 'Error al obtener hilos' });
  }
};

// Obtener hilo con respuestas
export const getHiloById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener hilo
    const hiloResult = await query(`
      SELECT * FROM foro_hilos WHERE id = $1
    `, [id]);
    
    if (hiloResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hilo no encontrado' });
    }
    
    // Obtener respuestas
    const respuestasResult = await query(`
      SELECT id, contenido, autor_id, fecha_creacion
      FROM foro_respuestas
      WHERE hilo_id = $1
      ORDER BY fecha_creacion ASC
    `, [id]);
    
    res.json({
      hilo: hiloResult.rows[0],
      respuestas: respuestasResult.rows
    });
  } catch (error) {
    console.error('Error al obtener hilo:', error);
    res.status(500).json({ error: 'Error al obtener hilo' });
  }
};

// Crear nuevo hilo
export const createHilo = async (req, res) => {
  try {
    const ipHash = hashIP(req.ip);
    
    // Verificar si está bloqueado
    if (await isBlocked(ipHash)) {
      return res.status(403).json({ error: 'Estás bloqueado temporalmente' });
    }
    
    const postData = sanitizePost(req.body);
    const autorId = generateAnonId(req);
    
    if (!postData.titulo || !postData.contenido) {
      return res.status(400).json({ error: 'Título y contenido son requeridos' });
    }
    
    const queryText = `
      INSERT INTO foro_hilos (titulo, contenido, autor_id, ip_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [postData.titulo, postData.contenido, autorId, ipHash];
    const result = await query(queryText, values);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear hilo:', error);
    res.status(500).json({ error: 'Error al crear hilo' });
  }
};

// Crear respuesta a hilo
export const createRespuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const ipHash = hashIP(req.ip);
    
    // Verificar si está bloqueado
    if (await isBlocked(ipHash)) {
      return res.status(403).json({ error: 'Estás bloqueado temporalmente' });
    }
    
    const postData = sanitizePost(req.body);
    const autorId = generateAnonId(req);
    
    if (!postData.contenido) {
      return res.status(400).json({ error: 'Contenido es requerido' });
    }
    
    // Verificar que el hilo existe y no está archivado
    const hiloResult = await query(`
      SELECT id FROM foro_hilos WHERE id = $1 AND archivado = false
    `, [id]);
    
    if (hiloResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hilo no encontrado o archivado' });
    }
    
    const queryText = `
      INSERT INTO foro_respuestas (hilo_id, contenido, autor_id, ip_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [id, postData.contenido, autorId, ipHash];
    const result = await query(queryText, values);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear respuesta:', error);
    res.status(500).json({ error: 'Error al crear respuesta' });
  }
};

// Eliminar post (moderador)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo } = req.query; // 'hilo' o 'respuesta'
    
    if (tipo === 'hilo') {
      const result = await query('DELETE FROM foro_hilos WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Hilo no encontrado' });
      }
    } else {
      const result = await query('DELETE FROM foro_respuestas WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Respuesta no encontrada' });
      }
    }
    
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ error: 'Error al eliminar post' });
  }
};

// Archivar hilo (moderador)
export const archivarHilo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      UPDATE foro_hilos SET archivado = true WHERE id = $1 RETURNING id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hilo no encontrado' });
    }
    
    res.json({ message: 'Hilo archivado exitosamente' });
  } catch (error) {
    console.error('Error al archivar hilo:', error);
    res.status(500).json({ error: 'Error al archivar hilo' });
  }
};

// Bloquear IP (moderador)
export const bloquearIP = async (req, res) => {
  try {
    const { ip_hash, razon, duracion_horas = 24 } = req.body;
    
    const queryText = `
      INSERT INTO moderacion_bloqueos (ip_hash, razon, fecha_fin)
      VALUES ($1, $2, NOW() + INTERVAL '${duracion_horas} hours')
      ON CONFLICT (ip_hash) 
      DO UPDATE SET fecha_fin = EXCLUDED.fecha_fin, activo = true
      RETURNING *
    `;
    
    const result = await query(queryText, [ip_hash, razon]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al bloquear IP:', error);
    res.status(500).json({ error: 'Error al bloquear IP' });
  }
};
