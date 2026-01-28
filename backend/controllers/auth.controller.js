import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

// Login de administrador
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }
    
    // Buscar administrador
    const result = await query(`
      SELECT * FROM administradores WHERE username = $1 AND activo = true
    `, [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const admin = result.rows[0];
    
    // Verificar password
    const isValid = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
};

// Verificar token
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Token inválido' });
  }
};

// Crear primer administrador (solo si no existe ninguno)
export const createFirstAdmin = async (username, password) => {
  try {
    // Verificar si ya existe algún admin
    const existingAdmin = await query('SELECT id FROM administradores LIMIT 1');
    
    if (existingAdmin.rows.length > 0) {
      console.log('Ya existe al menos un administrador');
      return;
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    await query(`
      INSERT INTO administradores (username, password_hash, role)
      VALUES ($1, $2, 'admin')
    `, [username, passwordHash]);
    
    console.log('✅ Administrador creado exitosamente');
  } catch (error) {
    console.error('Error al crear administrador:', error);
  }
};
