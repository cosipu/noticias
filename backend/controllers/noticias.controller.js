import { query } from '../config/database.js';
import { sanitizeNoticia } from '../middleware/sanitize.js';

// Obtener todas las noticias publicadas
export const getAllNoticias = async (req, res) => {
  try {
    const { categoria, limit = 20, offset = 0 } = req.query;
    
    let queryText = `
      SELECT id, titulo, resumen, categoria, imagen_url, slug, fecha_creacion
      FROM noticias
      WHERE publicada = true
    `;
    
    const params = [];
    
    if (categoria) {
      queryText += ' AND categoria = $1';
      params.push(categoria);
    }
    
    queryText += ` ORDER BY fecha_creacion DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    res.json({
      noticias: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
};

// Obtener una noticia por ID o slug
export const getNoticiaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Detectar si es un ID numérico o un slug
    const isNumericId = /^\d+$/.test(id);
    
    let queryText, params;
    if (isNumericId) {
      queryText = `
        SELECT * FROM noticias
        WHERE id = $1 AND publicada = true
      `;
      params = [parseInt(id)];
    } else {
      queryText = `
        SELECT * FROM noticias
        WHERE slug = $1 AND publicada = true
      `;
      params = [id];
    }
    
    const result = await query(queryText, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    res.status(500).json({ error: 'Error al obtener noticia' });
  }
};

// Crear noticia (admin)
export const createNoticia = async (req, res) => {
  try {
    const noticiaData = sanitizeNoticia(req.body);
    const { publicada = false } = req.body;
    
    const queryText = `
      INSERT INTO noticias (titulo, resumen, contenido, categoria, imagen_url, slug, publicada)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      noticiaData.titulo,
      noticiaData.resumen,
      noticiaData.contenido,
      noticiaData.categoria,
      noticiaData.imagen_url,
      noticiaData.slug,
      publicada
    ];
    
    const result = await query(queryText, values);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear noticia:', error);
    res.status(500).json({ error: 'Error al crear noticia' });
  }
};

// Actualizar noticia (admin)
export const updateNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const noticiaData = sanitizeNoticia(req.body);
    const { publicada } = req.body;
    
    const queryText = `
      UPDATE noticias
      SET titulo = $1, resumen = $2, contenido = $3, categoria = $4, 
          imagen_url = $5, slug = $6, publicada = $7
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [
      noticiaData.titulo,
      noticiaData.resumen,
      noticiaData.contenido,
      noticiaData.categoria,
      noticiaData.imagen_url,
      noticiaData.slug,
      publicada,
      id
    ];
    
    const result = await query(queryText, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    res.status(500).json({ error: 'Error al actualizar noticia' });
  }
};

// Eliminar noticia (admin)
export const deleteNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM noticias WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    
    res.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
};

// Obtener categorías disponibles
export const getCategorias = async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT categoria, COUNT(*) as count
      FROM noticias
      WHERE publicada = true
      GROUP BY categoria
      ORDER BY categoria
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};
