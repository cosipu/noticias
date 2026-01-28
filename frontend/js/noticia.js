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
    
    container.innerHTML = `
      <div class="card">
        ${noticia.imagen_url ? `<img src="${noticia.imagen_url}" alt="${noticia.titulo}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 4px; margin-bottom: 2rem;">` : ''}
        
        <div class="card-meta mb-2">
          <span style="background: var(--color-primary); color: white; padding: 0.25rem 0.75rem; border-radius: 3px;">${noticia.categoria}</span>
          <span style="margin-left: 1rem;">${formatDate(noticia.fecha_creacion)}</span>
        </div>
        
        <h1 style="margin-bottom: 1rem; line-height: 1.3;">${escapeHTML(noticia.titulo)}</h1>
        
        <p style="font-size: 1.2rem; color: var(--color-text-light); margin-bottom: 2rem; line-height: 1.6;">
          <strong>${escapeHTML(noticia.resumen)}</strong>
        </p>
        
        <div style="line-height: 1.8; font-size: 1.05rem;">
          ${formatearContenido(noticia.contenido)}
        </div>
        
        <hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--color-border);">
        
        <div style="text-align: center;">
          <a href="/noticias" class="btn">Ver más noticias</a>
          <a href="/foro" class="btn btn-secondary" style="margin-left: 1rem;">Discutir en el foro</a>
        </div>
      </div>
    `;
    
    // Actualizar título de la página
    document.title = `${noticia.titulo} - Noticias`;
    
  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = 'Error al cargar noticia: ' + err.message;
  }
}

function formatearContenido(contenido) {
  // Convertir saltos de línea en párrafos
  return contenido
    .split('\n\n')
    .map(parrafo => `<p>${escapeHTML(parrafo.trim())}</p>`)
    .join('');
}

function mostrarError(mensaje) {
  const error = document.getElementById('error');
  error.textContent = mensaje;
  error.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  cargarNoticia();
});
