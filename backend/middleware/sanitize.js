import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Sanitizar HTML para prevenir XSS
export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href']
  });
};

// Sanitizar texto plano
export const sanitizeText = (text) => {
  if (!text) return '';
  return text.trim().substring(0, 10000); // límite de caracteres
};

// Validar y sanitizar datos de noticia
export const sanitizeNoticia = (data) => {
  return {
    titulo: sanitizeText(data.titulo),
    resumen: sanitizeText(data.resumen),
    contenido: sanitizeHTML(data.contenido),
    categoria: sanitizeText(data.categoria),
    imagen_url: sanitizeText(data.imagen_url),
    slug: generateSlug(data.titulo)
  };
};

// Validar y sanitizar datos de post del foro
export const sanitizePost = (data) => {
  const maxLength = parseInt(process.env.MAX_POST_LENGTH) || 2000;
  
  return {
    titulo: data.titulo ? sanitizeText(data.titulo).substring(0, 255) : null,
    contenido: sanitizeText(data.contenido).substring(0, maxLength)
  };
};

// Generar slug desde título
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
