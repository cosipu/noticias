// Datos de ejemplo para GitHub Pages (sin backend)

const MOCK_NOTICIAS = [
  {
    id: 1,
    titulo: "Nuevo gobierno presenta plan de acción para los primeros 100 días",
    slug: "nuevo-gobierno-plan-100-dias",
    resumen: "El equipo entrante reveló las prioridades que abordarán durante sus primeros meses en el poder, con énfasis en economía y seguridad.",
    bajada: "Documento incluye reformas en salud, educación y seguridad pública",
    contenido: "El nuevo gobierno ha presentado oficialmente su plan de trabajo para los primeros 100 días...",
    categoria: "política",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date().toISOString(),
    publicada: true,
    autor: "Redacción",
    comentarios_count: 42
  },
  {
    id: 2,
    titulo: "Economía: Proyecciones para 2026 anticipan crecimiento moderado",
    slug: "economia-proyecciones-2026",
    resumen: "Expertos analizan el panorama económico para el año que inicia con el cambio de administración.",
    bajada: "Inflación esperada del 3.5% y crecimiento del PIB del 2.8%",
    contenido: "Los principales indicadores económicos sugieren un año de estabilidad...",
    categoria: "economía",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date(Date.now() - 86400000).toISOString(),
    publicada: true,
    autor: "Juan Pérez",
    comentarios_count: 28
  },
  {
    id: 3,
    titulo: "Reforma educativa: Principales cambios para el nuevo periodo",
    slug: "reforma-educativa-cambios",
    resumen: "La nueva administración planea modificaciones importantes en el sistema educativo nacional.",
    bajada: "Énfasis en tecnología y educación digital",
    contenido: "Entre las propuestas destacan la incorporación de nuevas tecnologías...",
    categoria: "sociedad",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date(Date.now() - 172800000).toISOString(),
    publicada: true,
    autor: "María González",
    comentarios_count: 35
  },
  {
    id: 4,
    titulo: "Seguridad pública: Nuevo protocolo policial entra en vigor",
    slug: "seguridad-nuevo-protocolo",
    resumen: "Autoridades implementan cambios en los procedimientos de seguridad ciudadana.",
    bajada: "Incluye capacitación en derechos humanos y uso de tecnología",
    contenido: "El protocolo busca mejorar la relación entre ciudadanía y fuerzas del orden...",
    categoria: "seguridad",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date(Date.now() - 259200000).toISOString(),
    publicada: true,
    autor: "Carlos Ruiz",
    comentarios_count: 19
  },
  {
    id: 5,
    titulo: "Festival Cultural Nacional: Programación completa revelada",
    slug: "festival-cultural-programacion",
    resumen: "El evento anual más importante del país presenta su agenda de actividades para este año.",
    bajada: "Más de 200 artistas participarán en 15 días de celebración",
    contenido: "El festival incluirá música, teatro, danza y exposiciones de arte...",
    categoria: "cultura",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date(Date.now() - 345600000).toISOString(),
    publicada: true,
    autor: "Ana Martínez",
    comentarios_count: 15
  },
  {
    id: 6,
    titulo: "Inversión extranjera: Nuevos proyectos generarán 5000 empleos",
    slug: "inversion-extranjera-empleos",
    resumen: "Empresas internacionales confirman instalación de operaciones en el país.",
    bajada: "Sectores tecnológico y manufacturero lideran las inversiones",
    contenido: "Las nuevas inversiones representan más de 500 millones de dólares...",
    categoria: "economía",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date(Date.now() - 432000000).toISOString(),
    publicada: true,
    autor: "Luis Torres",
    comentarios_count: 22
  },
  {
    id: 7,
    titulo: "Salud: Campaña de vacunación alcanza meta de cobertura",
    slug: "salud-campana-vacunacion",
    resumen: "El programa de inmunización logró superar las expectativas iniciales.",
    bajada: "85% de la población objetivo fue inmunizada",
    contenido: "Las autoridades sanitarias celebran el éxito de la campaña...",
    categoria: "sociedad",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date(Date.now() - 518400000).toISOString(),
    publicada: true,
    autor: "Sofía Ramírez",
    comentarios_count: 31
  },
  {
    id: 8,
    titulo: "Infraestructura: Anuncian nuevo proyecto de transporte público",
    slug: "infraestructura-transporte-publico",
    resumen: "Plan incluye expansión de metro y modernización de autobuses.",
    bajada: "Inversión estimada de 2000 millones de dólares",
    contenido: "El proyecto busca reducir tiempos de traslado en un 30%...",
    categoria: "política",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date(Date.now() - 604800000).toISOString(),
    publicada: true,
    autor: "Roberto Díaz",
    comentarios_count: 18
  },
  {
    id: 9,
    titulo: "Medioambiente: Iniciativa de reforestación planta 1 millón de árboles",
    slug: "medioambiente-reforestacion",
    resumen: "Programa ambiental cumple primera meta del año con participación ciudadana.",
    bajada: "Voluntarios de todo el país se sumaron a la causa",
    contenido: "La iniciativa busca recuperar zonas afectadas por incendios...",
    categoria: "sociedad",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date(Date.now() - 691200000).toISOString(),
    publicada: true,
    autor: "Elena Castro",
    comentarios_count: 27
  },
  {
    id: 10,
    titulo: "Tecnología: País anuncia alianza para desarrollo de inteligencia artificial",
    slug: "tecnologia-ia-desarrollo",
    resumen: "Convenio con universidades y empresas tech impulsará investigación en IA.",
    bajada: "Centro de investigación abrirá en segundo semestre de 2026",
    contenido: "La alianza posicionará al país como referente regional en tecnología...",
    categoria: "economía",
    imagen_url: "frontend/images/placeholder.svg",
    fecha_creacion: new Date(Date.now() - 777600000).toISOString(),
    publicada: true,
    autor: "Miguel Flores",
    comentarios_count: 33
  }
];

// Función para obtener noticias con filtros simulados
function getMockNoticias(options = {}) {
  const { limit = 10, skip = 0, categoria = null, sort = 'fecha' } = options;
  
  let noticias = [...MOCK_NOTICIAS];
  
  // Filtrar por categoría si se especifica
  if (categoria) {
    noticias = noticias.filter(n => n.categoria === categoria);
  }
  
  // Ordenar
  if (sort === 'comentarios') {
    noticias.sort((a, b) => b.comentarios_count - a.comentarios_count);
  } else {
    noticias.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
  }
  
  // Aplicar skip y limit
  noticias = noticias.slice(skip, skip + limit);
  
  return {
    noticias,
    total: MOCK_NOTICIAS.length
  };
}

// Función para obtener una noticia por ID
function getMockNoticiaById(id) {
  return MOCK_NOTICIAS.find(n => n.id === parseInt(id));
}

// Función para obtener estadísticas
function getMockStats() {
  return {
    noticias: MOCK_NOTICIAS.length,
    comentarios: MOCK_NOTICIAS.reduce((sum, n) => sum + n.comentarios_count, 0),
    usuarios: 1
  };
}

// Datos de ejemplo para hilos del foro
const MOCK_HILOS = [
  {
    id: 1,
    titulo: "¿Qué esperar del nuevo gobierno?",
    contenido: "Cuáles creen que serán los cambios más importantes en estos primeros 100 días...",
    autor_id: "usuario_123",
    fecha_creacion: new Date().toISOString(),
    respuestas_count: 12,
    archivado: false
  },
  {
    id: 2,
    titulo: "Impacto económico esperado",
    contenido: "Análisis sobre cómo las nuevas políticas afectarán a la economía personal...",
    autor_id: "usuario_456",
    fecha_creacion: new Date(Date.now() - 86400000).toISOString(),
    respuestas_count: 8,
    archivado: false
  },
  {
    id: 3,
    titulo: "Reforma educativa - opiniones",
    contenido: "¿Crees que los cambios en educación serán positivos?...",
    autor_id: "usuario_789",
    fecha_creacion: new Date(Date.now() - 172800000).toISOString(),
    respuestas_count: 15,
    archivado: false
  },
  {
    id: 4,
    titulo: "Seguridad ciudadana: ¿mejorará?",
    contenido: "Perspectivas sobre las nuevas medidas de seguridad...",
    autor_id: "usuario_101",
    fecha_creacion: new Date(Date.now() - 259200000).toISOString(),
    respuestas_count: 5,
    archivado: false
  }
];

// Función para obtener hilos del foro
function getMockHilos(options = {}) {
  const { limit = 50, skip = 0 } = options;
  
  let hilos = [...MOCK_HILOS];
  hilos.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
  hilos = hilos.slice(skip, skip + limit);
  
  return {
    hilos,
    total: MOCK_HILOS.length
  };
}
