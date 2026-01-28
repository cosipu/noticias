// JavaScript para página de noticias

let currentCategoria = '';
let currentPage = 0;
const NOTICIAS_PER_PAGE = 12;

async function cargarNoticias() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const grid = document.getElementById('news-grid');
  const loadMoreBtn = document.getElementById('load-more');
  
  try {
    loading.style.display = 'block';
    error.style.display = 'none';
    
    let url = `/noticias?limit=${NOTICIAS_PER_PAGE * (currentPage + 1)}`;
    if (currentCategoria) {
      url += `&categoria=${encodeURIComponent(currentCategoria)}`;
    }
    
    const data = await fetchAPI(url);
    
    loading.style.display = 'none';
    
    if (data.noticias && data.noticias.length > 0) {
      const html = data.noticias.map(noticia => `
        <article class="news-card">
          ${noticia.imagen_url ? `<img src="${noticia.imagen_url}" alt="${escapeHTML(noticia.titulo)}" class="news-card-image">` : ''}
          <div class="news-card-content">
            <span class="news-card-category">${(noticia.categoria || 'POLÍTICA').toUpperCase()}</span>
            <h3 class="news-card-title">
              <a href="#" onclick="alert('Demo estática. Páginas individuales requieren backend.'); return false;">${escapeHTML(noticia.titulo)}</a>
            </h3>
            <p class="news-card-excerpt">${escapeHTML(noticia.resumen || noticia.bajada || '')}</p>
            <div class="news-card-meta">
              <span>${formatDate(noticia.fecha_creacion)}</span>
              <span>${noticia.numero_comentarios || 0} 💬</span>
            </div>
          </div>
        </article>
      `).join('');
      
      if (currentPage === 0) {
        grid.innerHTML = html;
      } else {
        grid.innerHTML += html;
      }
      
      // Mostrar botón de "cargar más" si hay más de lo mostrado
      if (data.noticias.length >= NOTICIAS_PER_PAGE * (currentPage + 1)) {
        loadMoreBtn.style.display = 'inline-block';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    } else if (currentPage === 0) {
      grid.innerHTML = '<p class="text-center" style="padding: 2rem; color: var(--color-text-light);">No hay noticias en esta categoría</p>';
      loadMoreBtn.style.display = 'none';
    }
  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = 'Error al cargar noticias: ' + err.message;
    console.error('Error:', err);
  }
}

async function cargarTrendingSidebar() {
  try {
    const data = await fetchAPI('/noticias?limit=5');
    const trendingList = document.getElementById('trending-sidebar');
    
    if (data.noticias && data.noticias.length > 0) {
      trendingList.innerHTML = data.noticias.map(noticia => `
        <li><a href="#" onclick="alert('Demo estática. Páginas individuales requieren backend.'); return false;">${escapeHTML(noticia.titulo)}</a></li>
      `).join('');
    }
  } catch (error) {
    console.error('Error al cargar trending:', error);
  }
}

async function actualizarEstadisticas() {
  try {
    const data = await fetchAPI('/noticias?limit=1000');
    
    if (data.noticias) {
      const totalNoticias = document.getElementById('total-noticias');
      const totalComentarios = document.getElementById('total-comentarios');
      
      if (totalNoticias) totalNoticias.textContent = data.noticias.length;
      
      let totalComments = 0;
      data.noticias.forEach(n => {
        totalComments += (n.numero_comentarios || 0);
      });
      
      if (totalComentarios) totalComentarios.textContent = totalComments;
    }
  } catch (err) {
    console.error('Error al actualizar estadísticas:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Detectar categoría de query params
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  
  if (catParam) {
    currentCategoria = catParam;
    const filterSelect = document.getElementById('categoria-filter');
    if (filterSelect) filterSelect.value = catParam;
  }
  
  cargarNoticias();
  cargarTrendingSidebar();
  actualizarEstadisticas();
  
  // Evento para filtrar por categoría
  const filterSelect = document.getElementById('categoria-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      currentCategoria = e.target.value;
      currentPage = 0;
      cargarNoticias();
    });
  }
  
  // Evento para cargar más
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      cargarNoticias();
    });
  }
});
