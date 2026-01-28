// JavaScript para página de noticias

let currentCategoria = '';

async function cargarNoticias() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const grid = document.getElementById('news-grid');
  
  try {
    loading.style.display = 'block';
    error.style.display = 'none';
    
    let url = '/noticias?limit=50';
    if (currentCategoria) {
      url += `&categoria=${encodeURIComponent(currentCategoria)}`;
    }
    
    const data = await fetchAPI(url);
    
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
      grid.innerHTML = '<p class="text-center">No hay noticias en esta categoría</p>';
    }
  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = 'Error al cargar noticias: ' + err.message;
  }
}

async function cargarCategorias() {
  try {
    const data = await fetchAPI('/noticias/categorias');
    const select = document.getElementById('categoria-filter');
    
    if (data && data.length > 0) {
      data.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.categoria;
        option.textContent = `${cat.categoria} (${cat.count})`;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarNoticias();
  cargarCategorias();
  
  document.getElementById('categoria-filter').addEventListener('change', (e) => {
    currentCategoria = e.target.value;
    cargarNoticias();
  });
});
