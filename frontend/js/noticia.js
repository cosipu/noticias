// JavaScript para vista individual de noticia

function getNoticiaId() {
  const path = window.location.pathname;
  const match = path.match(/\/noticia\/(.+)/);
  return match ? match[1] : null;
}

async function cargarNoticia() {
  const noticiaId = getNoticiaId();
  
  if (!noticiaId) {
    mostrarError('ID de noticia inválido');
    return;
  }
  
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const container = document.getElementById('noticia-container');
  
  try {
    loading.style.display = 'block';
    error.style.display = 'none';
    
    const noticia = await fetchAPI(`/noticias/${noticiaId}`);
    
    loading.style.display = 'none';
    
    // Actualizar meta tags
    document.getElementById('meta-description').content = noticia.resumen || noticia.titulo;
    document.getElementById('page-title').textContent = `${noticia.titulo} - Noticias Política`;
    document.title = `${noticia.titulo} - Noticias Política`;
    
    // Renderizar contenido
    const authorLine = noticia.autor ? `<span>Por <strong>${escapeHTML(noticia.autor)}</strong></span>` : '';
    const imageHTML = noticia.imagen_url ? 
      `<div style="margin-bottom: 2rem; border-radius: var(--radius); overflow: hidden;">
         <img src="${noticia.imagen_url}" alt="${escapeHTML(noticia.titulo)}" style="width: 100%; height: auto; display: block;">
       </div>` : '';
    
    container.innerHTML = `
      <div class="article-header">
        <span class="hero-badge">${(noticia.categoria || 'POLÍTICA').toUpperCase()}</span>
        <h1 class="article-title">${escapeHTML(noticia.titulo)}</h1>
        <div class="article-meta">
          ${authorLine}
          <span>${formatDate(noticia.fecha_creacion)}</span>
          <span>${noticia.numero_comentarios || 0} comentarios</span>
        </div>
      </div>
      
      <div class="article-body">
        ${imageHTML}
        
        ${noticia.bajada ? `<p style="font-size: 1.2rem; font-style: italic; color: var(--color-text-light); margin-bottom: 2rem;"><strong>${escapeHTML(noticia.bajada)}</strong></p>` : ''}
        
        ${formatearContenido(noticia.contenido || noticia.resumen)}
        
        <hr style="margin: 2rem 0;">
        
        <div style="text-align: center; padding: 2rem 0;">
          <a href="/noticias" class="btn">← Ver más noticias</a>
        </div>
      </div>
    `;
    
    // Cargar comentarios si existen
    cargarComentarios(noticiaId);
    
  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = 'Error al cargar noticia: ' + err.message;
    console.error('Error:', err);
  }
}

function formatearContenido(contenido) {
  if (!contenido) return '';
  
  // Convertir saltos de línea dobles en párrafos
  return contenido
    .split('\n\n')
    .filter(p => p.trim())
    .map(parrafo => `<p>${escapeHTML(parrafo.trim())}</p>`)
    .join('');
}

// Cargar y mostrar comentarios del hilo
async function cargarComentarios(noticiaId) {
  try {
    // Buscar si existe un hilo para esta noticia
    // Por ahora, mostrar sección vacía
    const container = document.getElementById('noticia-container');
    
    const commentsHTML = `
      <section class="comments-section">
        <h2 class="comments-title">💬 Comentarios de la comunidad</h2>
        
        <div class="comment-form">
          <h3>Compartir opinión</h3>
          <p style="margin-bottom: 1rem; color: var(--color-text-light);">Únete a la discusión en nuestro foro comunitario</p>
          <a href="/foro" class="btn">Ir al foro →</a>
        </div>
        
        <div id="comments-list" style="margin-top: 2rem;">
          <p class="text-center" style="color: var(--color-text-light);">Los comentarios aparecerán aquí una vez estén disponibles</p>
        </div>
      </section>
    `;
    
    container.insertAdjacentHTML('beforeend', commentsHTML);
    
  } catch (err) {
    console.error('Error al cargar comentarios:', err);
  }
}

function mostrarError(mensaje) {
  const error = document.getElementById('error');
  error.textContent = mensaje;
  error.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  cargarNoticia();
});
