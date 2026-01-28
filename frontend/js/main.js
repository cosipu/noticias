// JavaScript principal - Funciones globales y utilidades

const API_URL = '/api';

// Función para hacer fetch con manejo de errores
async function fetchAPI(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('authToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la petición');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en fetchAPI:', error);
    throw error;
  }
}

// Cargar noticias destacadas en la home
async function loadFeaturedNews() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const grid = document.getElementById('news-grid');
  
  if (!grid) return;
  
  try {
    const data = await fetchAPI('/noticias?limit=6');
    
    loading.style.display = 'none';
    
    if (data.noticias && data.noticias.length > 0) {
      grid.innerHTML = data.noticias.map(noticia => `
        <div class="card">
          ${noticia.imagen_url ? `<img src="${noticia.imagen_url}" alt="${noticia.titulo}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 1rem;">` : ''}
          <div class="card-meta">
            <span>${noticia.categoria}</span> • 
            <span>${formatDate(noticia.fecha_creacion)}</span>
          </div>
          <h3>${escapeHTML(noticia.titulo)}</h3>
          <p>${escapeHTML(noticia.resumen)}</p>
          <a href="/noticia/${noticia.slug || noticia.id}" class="btn btn-small mt-2">Leer más →</a>
        </div>
      `).join('');
    } else {
      grid.innerHTML = '<p class="text-center">No hay noticias disponibles</p>';
    }
  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = 'Error al cargar noticias: ' + err.message;
  }
}

// Formatear fecha
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es', options);
}

// Escapar HTML para prevenir XSS
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Generar ID de sesión único para el foro
function getSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
}

// Generar UUID simple
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Modo oscuro
function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  
  if (darkMode) {
    document.body.classList.add('dark-mode');
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  
  // Cargar noticias si estamos en la home
  if (document.getElementById('news-grid')) {
    loadFeaturedNews();
  }
});
