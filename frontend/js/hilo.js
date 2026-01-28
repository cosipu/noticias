// JavaScript para vista de hilo individual

let hiloId = null;

// Obtener ID del hilo desde la URL
function getHiloId() {
  const path = window.location.pathname;
  const match = path.match(/\/hilo\/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Cargar hilo y respuestas
async function cargarHilo() {
  hiloId = getHiloId();
  
  if (!hiloId) {
    mostrarError('ID de hilo inválido');
    return;
  }
  
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const hiloContainer = document.getElementById('hilo-container');
  const respuestasContainer = document.getElementById('respuestas-container');
  
  try {
    loading.style.display = 'block';
    error.style.display = 'none';
    
    const data = await fetchAPI(`/foro/hilos/${hiloId}`);
    
    loading.style.display = 'none';
    
    const hilo = data.hilo;
    const respuestas = data.respuestas || [];
    
    // Mostrar hilo principal
    hiloContainer.innerHTML = `
      <div class="hilo-detail">
        <h2>${escapeHTML(hilo.titulo)}</h2>
        <div class="hilo-meta" style="margin-top: 1rem;">
          <span class="anon-id">${escapeHTML(hilo.autor_id)}</span>
          <span>📅 ${formatDate(hilo.fecha_creacion)}</span>
          ${hilo.archivado ? '<span style="color: #e74c3c;">📁 Archivado</span>' : ''}
        </div>
        <div class="hilo-content">${escapeHTML(hilo.contenido)}</div>
        <div class="hilo-stats">
          <span>💬 ${respuestas.length} respuestas</span>
        </div>
      </div>
    `;
    
    // Ocultar formulario si está archivado
    if (hilo.archivado) {
      document.getElementById('respuesta-form').style.display = 'none';
    }
    
    // Mostrar respuestas
    if (respuestas.length > 0) {
      respuestasContainer.innerHTML = `
        <h3 class="mb-2">Respuestas (${respuestas.length})</h3>
        ${respuestas.map((respuesta, index) => `
          <div class="respuesta">
            <div class="respuesta-header">
              <div>
                <span class="respuesta-numero">#${index + 1}</span>
                <span class="anon-id">${escapeHTML(respuesta.autor_id)}</span>
              </div>
              <span>${formatDate(respuesta.fecha_creacion)}</span>
            </div>
            <div class="respuesta-content">${escapeHTML(respuesta.contenido)}</div>
          </div>
        `).join('')}
      `;
    } else {
      respuestasContainer.innerHTML = '<p class="text-center">No hay respuestas todavía. ¡Sé el primero en responder!</p>';
    }
    
  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
    error.textContent = 'Error al cargar hilo: ' + err.message;
  }
}

// Crear respuesta
async function crearRespuesta(event) {
  event.preventDefault();
  
  const contenido = document.getElementById('respuesta-contenido').value;
  const captcha = document.getElementById('captcha').checked;
  
  if (!captcha) {
    mostrarError('Por favor, marca la casilla de verificación');
    return;
  }
  
  try {
    const sessionId = getSessionId();
    
    const response = await fetch(`/api/foro/hilos/${hiloId}/respuestas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': sessionId
      },
      body: JSON.stringify({ contenido })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear respuesta');
    }
    
    mostrarExito('Respuesta publicada exitosamente');
    
    // Limpiar formulario
    document.getElementById('respuesta-contenido').value = '';
    document.getElementById('captcha').checked = false;
    document.getElementById('char-count').textContent = '0';
    
    // Recargar respuestas
    setTimeout(() => {
      cargarHilo();
    }, 500);
    
  } catch (err) {
    mostrarError('Error al crear respuesta: ' + err.message);
  }
}

// Mostrar mensajes
function mostrarError(mensaje) {
  const error = document.getElementById('error');
  error.textContent = mensaje;
  error.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => error.style.display = 'none', 5000);
}

function mostrarExito(mensaje) {
  const success = document.getElementById('success');
  success.textContent = mensaje;
  success.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => success.style.display = 'none', 3000);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('respuesta-contenido');
  const charCount = document.getElementById('char-count');
  
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      charCount.textContent = textarea.value.length;
    });
  }
  
  // Event listener para formulario de respuesta
  const formCrearRespuesta = document.getElementById('form-crear-respuesta');
  if (formCrearRespuesta) {
    formCrearRespuesta.addEventListener('submit', crearRespuesta);
  }
  
  cargarHilo();
});
