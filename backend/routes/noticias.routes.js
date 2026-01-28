import express from 'express';
import {
  getAllNoticias,
  getNoticiaById,
  createNoticia,
  updateNoticia,
  deleteNoticia,
  getCategorias
} from '../controllers/noticias.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Validaciones
const noticiaValidation = [
  body('titulo').trim().notEmpty().withMessage('Título es requerido'),
  body('resumen').trim().notEmpty().withMessage('Resumen es requerido'),
  body('contenido').trim().notEmpty().withMessage('Contenido es requerido'),
  body('categoria').trim().notEmpty().withMessage('Categoría es requerida')
];

// Rutas públicas
router.get('/', getAllNoticias);
router.get('/categorias', getCategorias);
router.get('/:id', getNoticiaById);

// Rutas protegidas (admin)
router.post('/', authMiddleware, adminMiddleware, noticiaValidation, createNoticia);
router.put('/:id', authMiddleware, adminMiddleware, noticiaValidation, updateNoticia);
router.delete('/:id', authMiddleware, adminMiddleware, deleteNoticia);

export default router;
