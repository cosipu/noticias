// JavaScript para el foro anónimo

let currentForoOrden = 'recientes';

// Cargar hilos
async function cargarHilos() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const hilosList = document.getElementById('hilos-list');
  
  try {
    loading.style.display = 'block';
    error.style.display = 'none';
    
    const data = await fetchAPI(`/foro/hilos?ordenar=${currentForoOrden}&limit=50`);
    
    loading.style.display = 'none';
    
    if (data.hilos && data.hilos.length > 0) {
      hilosList.innerHTML = data.hilos.map(hilo => `
        <div class="comment-item hilo-item" data-hilo-id="${hilo.id}" style="cursor: pointer; margin-bottom: 1.5rem;">
          <div class="comment-header">
            <span class="comment-author">
              ${hilo.sticky ? '📌 ' : ''}${escapeHTML(hilo.autor_id)}
            </span>
            <span class="comment-time">${formatDate(hilo.fecha_creacion)}</span>
          </div>
          <h3 style="font-size: 1.1rem; margin: 0.5rem 0; color: var(--color-primary);">
            ${escapeHTML(hilo.titulo)}
          </h3>
          <div class="comment-text">
            ${truncateText(escapeHTML(hilo.contenido), 200)}
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.75rem; font-size: 0.9rem; color: var(--color-text-light);">
            <span>💬 ${hilo.respuestas_count || 0} respuestas</span>
            <span>⏰ ${formatTimeAgo(hilo.ultima_actividad || hilo.fecha_creacion)}</span>
            ${hilo.archivado ? '<span style="color: var(--color-secondary);">🔒 Archivado</span>' : ''}
          </div>
        </div>
      `).join('');
      
      // Agregar event listeners a cada hilo
      document.querySelectorAll('.hilo-item').forEach(item => {
        item.addEventListener('click', () => {
          const hiloId = item.getAttribute('data-hilo-id');
          if (hiloId) irAHilo(hiloId);
        });
      });
    } else {
      hilosList.innerHTML = '<p class="text-center" style="padding: 2rem; color: var(--color-text-light);">No hay temas disponibles. ¡Sé el primero en crear uno!</p>';
    }
  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = 'Error al cargar hilos: ' + err.message;
  }
}

// Crear nuevo hilo
async function crearHilo(event) {
  event.preventDefault();
  
  const titulo = document.getElementById('hilo-titulo').value;
  const contenido = document.getElementById('hilo-contenido').value;
  const captcha = document.getElementById('captcha').checked;
  
  if (!captcha) {
    mostrarError('Por favor, marca la casilla de verificación');
    return;
  }
  
  try {
    const sessionId = getSessionId();
    
    const response = await fetch('/api/foro/hilos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': sessionId
      },
      body: JSON.stringify({ titulo, contenido })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear hilo');
    }
    
    const hilo = await response.json();
    
    mostrarExito('Hilo creado exitosamente');
    ocultarFormularioNuevoHilo();
    
    // Redirigir al hilo
    setTimeout(() => {
      window.location.href = `/hilo/${hilo.id}`;
    }, 1000);
    
  } catch (err) {
    mostrarError('Error al crear hilo: ' + err.message);
  }
}

// Mostrar/ocultar formulario
function mostrarFormularioNuevoHilo() {
  document.getElementById('nuevo-hilo-form').style.display = 'block';
  document.getElementById('hilo-titulo').focus();
}

function ocultarFormularioNuevoHilo() {
  document.getElementById('nuevo-hilo-form').style.display = 'none';
  document.getElementById('hilo-titulo').value = '';
  document.getElementById('hilo-contenido').value = '';
  document.getElementById('captcha').checked = false;
}

// Ir a hilo
function irAHilo(id) {
  window.location.href = `/hilo/${id}`;
}

// Truncar texto
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Formato de tiempo relativo
function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  
  return formatDate(dateString);
}

// Mostrar mensajes
function mostrarError(mensaje) {
  const error = document.getElementById('error');
  error.textContent = mensaje;
  error.style.display = 'block';
  setTimeout(() => error.style.display = 'none', 5000);
}

function mostrarExito(mensaje) {
  const success = document.getElementById('success');
  success.textContent = mensaje;
  success.style.display = 'block';
  setTimeout(() => success.style.display = 'none', 3000);
}

// Contador de caracteres
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('hilo-contenido');
  const charCount = document.getElementById('char-count');
  
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      charCount.textContent = textarea.value.length;
    });
  }
  
  // Selector de orden
  const ordenar = document.getElementById('ordenar');
  if (ordenar) {
    ordenar.addEventListener('change', (e) => {
      currentForoOrden = e.target.value;
      cargarHilos();
    });
  }
  
  // Event listeners para botones
  const btnNuevoHilo = document.querySelector('button[id="btn-nuevo-hilo"]');
  if (btnNuevoHilo) {
    btnNuevoHilo.addEventListener('click', () => mostrarFormularioNuevoHilo());
  }
  
  const btnCancelar = document.querySelector('button[id="btn-cancelar-hilo"]');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', () => ocultarFormularioNuevoHilo());
  }
  
  // Event listener para formulario de crear hilo
  const formCrearHilo = document.getElementById('form-crear-hilo');
  if (formCrearHilo) {
    formCrearHilo.addEventListener('submit', crearHilo);
  }
  
  // Cargar hilos
  if (document.getElementById('hilos-list')) {
    cargarHilos();
    cargarEstadisticas();
  }
});

// Cargar estadísticas del foro
async function cargarEstadisticas() {
  try {
    const data = await fetchAPI('/foro/hilos?limit=1000');
    
    if (data.hilos) {
      const totalThreads = document.getElementById('total-threads');
      const totalReplies = document.getElementById('total-replies');
      
      if (totalThreads) totalThreads.textContent = data.hilos.length;
      
      let totalComments = 0;
      data.hilos.forEach(h => {
        totalComments += (h.respuestas_count || 0);
      });
      
      if (totalReplies) totalReplies.textContent = totalComments;
    }
  } catch (err) {
    console.error('Error al cargar estadísticas del foro:', err);
  }
}
