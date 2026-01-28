// JavaScript del panel de administración

let currentTab = 'noticias';
let editingNoticiaId = null;

// Verificar autenticación al cargar
document.addEventListener('DOMContentLoaded', () => {
  verificarAuth();
});

// Verificar si el usuario está autenticado
async function verificarAuth() {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    mostrarLogin();
    return;
  }
  
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      mostrarPanel();
      cargarNoticias();
    } else {
      localStorage.removeItem('authToken');
      mostrarLogin();
    }
  } catch (error) {
    console.error('Error al verificar auth:', error);
    mostrarLogin();
  }
}

// Mostrar pantalla de login
function mostrarLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-panel').style.display = 'none';
}

// Mostrar panel de admin
function mostrarPanel() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
}

// Login
async function login(event) {
  event.preventDefault();
  
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }
    
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    
    mostrarPanel();
    cargarNoticias();
    
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.style.display = 'block';
  }
}

// Logout
function logout() {
  localStorage.removeItem('authToken');
  mostrarLogin();
}

// Cambiar tab
function cambiarTab(tab) {
  currentTab = tab;
  
  // Actualizar botones
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Actualizar contenido
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`tab-${tab}`).classList.add('active');
  
  // Cargar datos según tab
  if (tab === 'noticias') {
    cargarNoticias();
  } else if (tab === 'moderacion') {
    cargarHilosModeracion();
  }
}

// ===== GESTIÓN DE NOTICIAS =====

// Cargar todas las noticias
async function cargarNoticias() {
  try {
    const data = await fetchAPI('/noticias?limit=100');
    const lista = document.getElementById('lista-noticias');
    
    if (data.noticias && data.noticias.length > 0) {
      lista.innerHTML = data.noticias.map(noticia => `
        <div class="admin-item">
          <div class="admin-item-content">
            <h4>${escapeHTML(noticia.titulo)}</h4>
            <div class="admin-item-meta">
              <span class="status-badge ${noticia.publicada ? 'status-publicada' : 'status-borrador'}">
                ${noticia.publicada ? '✓ Publicada' : '○ Borrador'}
              </span>
              <span>${noticia.categoria}</span> • 
              <span>${formatDate(noticia.fecha_creacion)}</span>
            </div>
            <p>${escapeHTML(noticia.resumen).substring(0, 150)}...</p>
          </div>
          <div class="admin-item-actions">
            <button class="btn btn-small" onclick="editarNoticia(${noticia.id})">Editar</button>
            <button class="btn btn-small btn-danger" onclick="eliminarNoticia(${noticia.id})">Eliminar</button>
          </div>
        </div>
      `).join('');
    } else {
      lista.innerHTML = '<p class="text-center">No hay noticias. Crea la primera.</p>';
    }
  } catch (error) {
    mostrarError('Error al cargar noticias: ' + error.message);
  }
}

// Mostrar formulario de nueva noticia
function mostrarFormularioNoticia() {
  editingNoticiaId = null;
  document.getElementById('form-titulo').textContent = 'Nueva Noticia';
  document.getElementById('form-noticia').style.display = 'block';
  limpiarFormularioNoticia();
}

// Cancelar formulario
function cancelarFormulario() {
  document.getElementById('form-noticia').style.display = 'none';
  limpiarFormularioNoticia();
}

// Limpiar formulario
function limpiarFormularioNoticia() {
  document.getElementById('noticia-id').value = '';
  document.getElementById('noticia-titulo').value = '';
  document.getElementById('noticia-resumen').value = '';
  document.getElementById('noticia-contenido').value = '';
  document.getElementById('noticia-categoria').value = '';
  document.getElementById('noticia-imagen').value = '';
  document.getElementById('noticia-publicada').checked = false;
}

// Editar noticia
async function editarNoticia(id) {
  try {
    const noticia = await fetchAPI(`/noticias/${id}`);
    
    editingNoticiaId = id;
    document.getElementById('form-titulo').textContent = 'Editar Noticia';
    document.getElementById('noticia-id').value = noticia.id;
    document.getElementById('noticia-titulo').value = noticia.titulo;
    document.getElementById('noticia-resumen').value = noticia.resumen;
    document.getElementById('noticia-contenido').value = noticia.contenido;
    document.getElementById('noticia-categoria').value = noticia.categoria;
    document.getElementById('noticia-imagen').value = noticia.imagen_url || '';
    document.getElementById('noticia-publicada').checked = noticia.publicada;
    
    document.getElementById('form-noticia').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error) {
    mostrarError('Error al cargar noticia: ' + error.message);
  }
}

// Guardar noticia (crear o actualizar)
async function guardarNoticia(event) {
  event.preventDefault();
  
  const noticiaData = {
    titulo: document.getElementById('noticia-titulo').value,
    resumen: document.getElementById('noticia-resumen').value,
    contenido: document.getElementById('noticia-contenido').value,
    categoria: document.getElementById('noticia-categoria').value,
    imagen_url: document.getElementById('noticia-imagen').value,
    publicada: document.getElementById('noticia-publicada').checked
  };
  
  try {
    const token = localStorage.getItem('authToken');
    const isEdit = editingNoticiaId !== null;
    const url = isEdit ? `/api/noticias/${editingNoticiaId}` : '/api/noticias';
    const method = isEdit ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(noticiaData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al guardar noticia');
    }
    
    mostrarExito(isEdit ? 'Noticia actualizada' : 'Noticia creada exitosamente');
    cancelarFormulario();
    cargarNoticias();
    
  } catch (error) {
    mostrarError('Error al guardar: ' + error.message);
  }
}

// Eliminar noticia
async function eliminarNoticia(id) {
  if (!confirm('¿Estás seguro de eliminar esta noticia?')) {
    return;
  }
  
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`/api/noticias/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar noticia');
    }
    
    mostrarExito('Noticia eliminada');
    cargarNoticias();
    
  } catch (error) {
    mostrarError('Error al eliminar: ' + error.message);
  }
}

// ===== MODERACIÓN DEL FORO =====

async function cargarHilosModeracion() {
  try {
    const data = await fetchAPI('/foro/hilos?limit=50');
    const lista = document.getElementById('lista-hilos-mod');
    
    if (data.hilos && data.hilos.length > 0) {
      lista.innerHTML = data.hilos.map(hilo => `
        <div class="admin-item">
          <div class="admin-item-content">
            <h4>${escapeHTML(hilo.titulo)}</h4>
            <div class="admin-item-meta">
              <span>${hilo.autor_id}</span> • 
              <span>${formatDate(hilo.fecha_creacion)}</span> • 
              <span>${hilo.respuestas_count} respuestas</span>
              ${hilo.archivado ? '<span style="color: #e74c3c;">• Archivado</span>' : ''}
            </div>
            <p>${escapeHTML(hilo.contenido).substring(0, 200)}...</p>
          </div>
          <div class="admin-item-actions">
            <a href="/hilo/${hilo.id}" class="btn btn-small" target="_blank">Ver</a>
            ${!hilo.archivado ? `<button class="btn btn-small" onclick="archivarHilo(${hilo.id})">Archivar</button>` : ''}
            <button class="btn btn-small btn-danger" onclick="eliminarHilo(${hilo.id})">Eliminar</button>
          </div>
        </div>
      `).join('');
    } else {
      lista.innerHTML = '<p class="text-center">No hay hilos en el foro</p>';
    }
  } catch (error) {
    mostrarError('Error al cargar hilos: ' + error.message);
  }
}

async function archivarHilo(id) {
  if (!confirm('¿Archivar este hilo?')) return;
  
  try {
    const token = localStorage.getItem('authToken');
    
    await fetch(`/api/foro/hilos/${id}/archivar`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    mostrarExito('Hilo archivado');
    cargarHilosModeracion();
  } catch (error) {
    mostrarError('Error al archivar: ' + error.message);
  }
}

async function eliminarHilo(id) {
  if (!confirm('¿ELIMINAR PERMANENTEMENTE este hilo y todas sus respuestas?')) return;
  
  try {
    const token = localStorage.getItem('authToken');
    
    await fetch(`/api/foro/posts/${id}?tipo=hilo`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    mostrarExito('Hilo eliminado');
    cargarHilosModeracion();
  } catch (error) {
    mostrarError('Error al eliminar: ' + error.message);
  }
}

// Mensajes
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
