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

// Cargar noticia principal (hero) en la home
async function loadHeroNews() {
  try {
    const data = await fetchAPI('/noticias?limit=1');
    
    if (data.noticias && data.noticias.length > 0) {
      const noticia = data.noticias[0];
      
      const heroTitle = document.getElementById('hero-title');
      const heroImage = document.getElementById('hero-image');
      const heroExcerpt = document.getElementById('hero-excerpt');
      const heroDate = document.getElementById('hero-date');
      const heroAuthor = document.getElementById('hero-author-name');
      const heroCategory = document.getElementById('hero-category');
      const heroLink = document.getElementById('hero-link');
      
      if (heroTitle) heroTitle.textContent = escapeHTML(noticia.titulo);
      if (heroImage) heroImage.src = noticia.imagen_url || '/images/placeholder.svg';
      if (heroImage) heroImage.alt = escapeHTML(noticia.titulo);
      if (heroExcerpt) heroExcerpt.textContent = escapeHTML(noticia.resumen || noticia.bajada || 'Noticia destacada');
      if (heroDate) heroDate.textContent = formatDate(noticia.fecha_creacion);
      if (heroAuthor) heroAuthor.textContent = noticia.autor || 'Redacción';
      if (heroCategory) heroCategory.textContent = (noticia.categoria || 'POLÍTICA').toUpperCase();
      if (heroLink) heroLink.href = `/noticia/${noticia.slug || noticia.id}`;
      
      // Mostrar autor si existe
      const heroAuthorDiv = document.getElementById('hero-author');
      if (noticia.autor && heroAuthorDiv) {
        heroAuthorDiv.style.display = 'inline-flex';
      }
    }
  } catch (err) {
    console.error('Error al cargar noticia hero:', err);
  }
}

// Cargar noticias secundarias en grid
async function loadSecondaryNews() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const grid = document.getElementById('news-grid');
  
  if (!grid) return;
  
  try {
    const data = await fetchAPI('/noticias?limit=9&skip=1');
    
    if (loading) loading.style.display = 'none';
    
    if (data.noticias && data.noticias.length > 0) {
      grid.innerHTML = data.noticias.map(noticia => `
        <article class="news-card">
          ${noticia.imagen_url ? `<img src="${noticia.imagen_url}" alt="${escapeHTML(noticia.titulo)}" class="news-card-image">` : ''}
          <div class="news-card-content">
            <span class="news-card-category">${(noticia.categoria || 'POLÍTICA').toUpperCase()}</span>
            <h3 class="news-card-title">
              <a href="/noticia/${noticia.slug || noticia.id}">${escapeHTML(noticia.titulo)}</a>
            </h3>
            <p class="news-card-excerpt">${escapeHTML(noticia.resumen || noticia.bajada || '')}</p>
            <div class="news-card-meta">
              <span>${formatDate(noticia.fecha_creacion)}</span>
              <span>${noticia.numero_comentarios || 0} 💬</span>
            </div>
          </div>
        </article>
      `).join('');
    } else {
      grid.innerHTML = '<p class="text-center">No hay noticias disponibles</p>';
    }
  } catch (err) {
    if (loading) loading.style.display = 'none';
    if (error) {
      error.style.display = 'block';
      error.textContent = 'Error al cargar noticias: ' + err.message;
    }
    console.error('Error al cargar noticias:', err);
  }
}

// Cargar trending (noticias más comentadas)
async function loadTrendingNews() {
  try {
    const data = await fetchAPI('/noticias?limit=5&sort=comentarios');
    const trendingList = document.getElementById('trending-list');
    
    if (!trendingList) return;
    
    if (data.noticias && data.noticias.length > 0) {
      trendingList.innerHTML = data.noticias.map(noticia => `
        <li><a href="/noticia/${noticia.slug || noticia.id}">${escapeHTML(noticia.titulo)}</a></li>
      `).join('');
    }
  } catch (err) {
    console.error('Error al cargar trending:', err);
  }
}

// Actualizar estadísticas
async function updateStats() {
  try {
    const data = await fetchAPI('/noticias?limit=1000');
    
    if (data.noticias) {
      const newsCount = document.getElementById('news-count');
      const commentCount = document.getElementById('comment-count');
      
      if (newsCount) newsCount.textContent = data.noticias.length;
      
      // Contar comentarios totales
      let totalComments = 0;
      data.noticias.forEach(n => {
        totalComments += (n.numero_comentarios || 0);
      });
      
      if (commentCount) commentCount.textContent = totalComments;
    }
  } catch (err) {
    console.error('Error al actualizar estadísticas:', err);
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
  
  // Cargar contenido de la home si estamos en ella
  if (document.getElementById('news-grid')) {
    loadHeroNews();      // Cargar noticia principal
    loadSecondaryNews(); // Cargar grid de noticias
    loadTrendingNews();  // Cargar trending
    updateStats();       // Actualizar estadísticas
  }
});
