/**
 * EduTrack · Lógica del dashboard y del analizador.
 *
 * Reglas de oro:
 * 1. La probabilidad que se muestra es EXACTAMENTE la que devuelve la API.
 * 2. No se inventan casos esperados, riesgos ni ajustes por zona.
 * 3. El backend calcula EST_POR_DOCENTE y las dummies de departamento.
 */

const CFG = window.EDUTRACK_CONFIG || {};
const API_URL = String(CFG.API_URL || '').replace(/\/+$/, '');
const TABLA_ANALISIS = CFG.TABLA_ANALISIS || 'analisis_sede';

const PRESETS = {
  rural_pequena: {
    matricula: 60,
    docentes: 3,
    orientadores: 0,
    niveles: 2,
    jornadas: 1,
    zona: 'rural',
    bilingue: false,
    etnoeducativa: false,
    departamento: 'Amazonas'
  },
  rural_intermedia: {
    matricula: 300,
    docentes: 20,
    orientadores: 1,
    niveles: 3,
    jornadas: 2,
    zona: 'rural',
    bilingue: false,
    etnoeducativa: false,
    departamento: 'Chocó'
  },
  urbana_grande: {
    matricula: 950,
    docentes: 34,
    orientadores: 2,
    niveles: 4,
    jornadas: 2,
    zona: 'urbana',
    bilingue: false,
    etnoeducativa: false,
    departamento: 'Antioquia'
  }
};

const BANDAS = {
  alta: {
    color: 'high-priority',
    fill: 'red',
    badge: 'PRIORIDAD ALTA',
    icon: 'fa-triangle-exclamation',
    titulo: 'Probabilidad alta de presencia de casos foco',
    acciones: [
      'Priorizar la sede en el plan de tamizaje y en la asignación de orientación escolar.',
      'Verificar el registro de estudiantes con condiciones foco en el módulo de discapacidad del SIMAT.',
      'Capacitar a los docentes de aula en señales tempranas de TEA y dificultades de lectoescritura.'
    ]
  },
  media: {
    color: 'medium-priority',
    fill: 'yellow',
    badge: 'PRIORIDAD MEDIA',
    icon: 'fa-user-clock',
    titulo: 'Probabilidad media de presencia de casos foco',
    acciones: [
      'Programar una revisión interna de casos con el comité de inclusión y convivencia.',
      'Articular apoyo psicosocial con el colegio nodo o el centro de salud más cercano.',
      'Revisar la formulación y el seguimiento de los PIAR vigentes.'
    ]
  },
  baja: {
    color: 'low-priority',
    fill: 'green',
    badge: 'MONITOREO',
    icon: 'fa-check-circle',
    titulo: 'Probabilidad baja de presencia de casos foco',
    acciones: [
      'Mantener el seguimiento periódico en el comité de inclusión y convivencia.',
      'Conservar actualizadas las novedades de estudiantes en el SIMAT.',
      'Fortalecer la articulación entre docentes de aula y orientación escolar.'
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initDashboardCharts();
  initFormulario();
  initSwitches();
  initHistorial();
});

/* ------------------------------------------------------------------ */
/* 1. Gráficos del dashboard                                           */
/* ------------------------------------------------------------------ */

function initDashboardCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js no está disponible. Gráficos en modo fallback.');
    return;
  }

  const ctxZona = document.getElementById('chartBrechaZona');
  if (ctxZona) {
    new Chart(ctxZona, {
      type: 'bar',
      data: {
        labels: ['Sedes Urbanas', 'Sedes Rurales'],
        datasets: [
          {
            label: '% Sedes que reportan casos foco (TEA/Aprendizaje)',
            data: [58.2, 8.1],
            backgroundColor: '#2563eb',
            borderRadius: 6
          },
          {
            label: '% Sedes SIN docente orientador',
            data: [67.9, 95.2],
            backgroundColor: '#f87171',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11, family: 'Inter' } }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.raw}%`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: (val) => val + '%' },
            grid: { color: '#f1f5f9' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const ctxNivel = document.getElementById('chartNivelEducativo');
  if (ctxNivel) {
    new Chart(ctxNivel, {
      type: 'line',
      data: {
        labels: ['Preescolar', 'Primaria', 'Secundaria', 'Media Académica', 'CLEI / Nocturna'],
        datasets: [
          {
            label: 'Trastornos del Aprendizaje / TDAH',
            data: [312, 4280, 3090, 1140, 420],
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.1)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Trastornos del Espectro Autista (TEA)',
            data: [195, 1420, 780, 240, 85],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Condición Psicosocial',
            data: [45, 890, 1530, 680, 210],
            borderColor: '#d97706',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { size: 11, family: 'Inter' } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { callback: (val) => val.toLocaleString() }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

/* ------------------------------------------------------------------ */
/* 2. Formulario, presets y envío                                      */
/* ------------------------------------------------------------------ */

function initFormulario() {
  const form = document.getElementById('eduTrackForm');
  if (!form) return;
  form.addEventListener('submit', handleAnalysisSubmit);
}

function initSwitches() {
  ['bilingue', 'etnoeducativa'].forEach((id) => {
    const checkbox = document.getElementById(id);
    const texto = document.getElementById(id + 'Text');
    if (!checkbox || !texto) return;
    const sincronizar = () => { texto.textContent = checkbox.checked ? 'Sí' : 'No'; };
    checkbox.addEventListener('change', sincronizar);
    sincronizar();
  });
}

function loadPreset(tipo) {
  const preset = PRESETS[tipo];
  if (!preset) return;

  Object.entries(preset).forEach(([campo, valor]) => {
    const el = document.getElementById(campo);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = Boolean(valor);
    else el.value = String(valor);
  });

  document.getElementById('bilingueText').textContent = preset.bilingue ? 'Sí' : 'No';
  document.getElementById('etnoeducativaText').textContent = preset.etnoeducativa ? 'Sí' : 'No';

  const form = document.getElementById('eduTrackForm');
  form.requestSubmit();
}

function leerFormulario() {
  const crudo = (id) => document.getElementById(id).value.trim();

  const numericos = [
    ['matricula', 'Matrícula', 0, 100000],
    ['docentes', 'Docentes', 1, 5000],
    ['orientadores', 'Orientadores', 0, 500],
    ['niveles', 'Niveles', 1, 6],
    ['jornadas', 'Jornadas', 1, 5]
  ];

  const errores = [];
  const payload = {
    zona: document.getElementById('zona').value,
    bilingue: document.getElementById('bilingue').checked,
    etnoeducativa: document.getElementById('etnoeducativa').checked,
    departamento: document.getElementById('departamento').value
  };

  numericos.forEach(([campo, etiqueta, min, max]) => {
    const texto = crudo(campo);
    if (texto === '') {
      errores.push(`${etiqueta} es obligatorio.`);
      return;
    }
    const valor = Number(texto);
    if (!Number.isInteger(valor) || valor < min || valor > max) {
      errores.push(`${etiqueta} debe ser un entero entre ${min} y ${max}.`);
      return;
    }
    payload[campo] = valor;
  });

  return { payload, errores };
}

async function handleAnalysisSubmit(evento) {
  evento.preventDefault();

  const { payload, errores } = leerFormulario();
  if (errores.length) {
    mostrarErrorFormulario(errores.join(' '));
    return;
  }
  ocultarErrorFormulario();

  if (!API_URL) {
    mostrarError('Falta configurar API_URL en config.js.');
    return;
  }

  const placeholder = document.getElementById('resultsPlaceholder');
  const loading = document.getElementById('resultsLoading');
  const content = document.getElementById('resultsContent');
  const errorBox = document.getElementById('resultsError');
  const boton = document.getElementById('btnSubmitAnalysis');

  if (placeholder) placeholder.style.display = 'none';
  if (content) content.style.display = 'none';
  if (errorBox) errorBox.style.display = 'none';
  if (loading) loading.style.display = 'block';

  if (boton) {
    boton.disabled = true;
    boton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando con el modelo...';
  }

  try {
    const respuesta = await fetch(`${API_URL}/predecir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const cuerpo = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      const error = new Error(formatearDetalle(cuerpo && cuerpo.detail));
      error.esValidacion = respuesta.status === 422;
      throw error;
    }

    renderResultados(cuerpo, payload);
    if (loading) loading.style.display = 'none';

    await guardarAnalisis(payload, cuerpo);
  } catch (error) {
    console.error('Error consultando la API:', error);
    mostrarError(
      error.esValidacion
        ? error.message
        : `No se pudo obtener la predicción. ${error.message || ''} ` +
          'Verifica que la API esté disponible y que la URL en config.js sea correcta.'
    );
  } finally {
    if (loading) loading.style.display = 'none';
    if (boton) {
      boton.disabled = false;
      boton.innerHTML = '<i class="fas fa-brain"></i> Analizar Sede Educativa';
    }
  }
}

function mostrarErrorFormulario(mensaje) {
  const caja = document.getElementById('formError');
  if (!caja) return;
  caja.textContent = mensaje;
  caja.hidden = false;
  caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function ocultarErrorFormulario() {
  const caja = document.getElementById('formError');
  if (caja) {
    caja.hidden = true;
    caja.textContent = '';
  }
}

function formatearDetalle(detail) {
  if (!detail) return 'La API rechazó la petición.';
  if (typeof detail === 'string') return detail;
  if (!Array.isArray(detail)) return 'La API rechazó la petición.';

  return detail
    .map((item) => {
      const campo = Array.isArray(item.loc)
        ? item.loc.filter((parte) => parte !== 'body').join('.')
        : '';
      return `${campo ? campo + ': ' : ''}${item.msg || 'valor inválido'}`;
    })
    .join(' · ');
}

function mostrarError(mensaje) {
  const placeholder = document.getElementById('resultsPlaceholder');
  const loading = document.getElementById('resultsLoading');
  const content = document.getElementById('resultsContent');
  const errorBox = document.getElementById('resultsError');

  if (placeholder) placeholder.style.display = 'none';
  if (loading) loading.style.display = 'none';
  if (content) content.style.display = 'none';

  if (errorBox) {
    errorBox.style.display = 'block';
    errorBox.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <div>
        <strong>No se pudo completar el análisis</strong>
        <p></p>
      </div>`;
    errorBox.querySelector('p').textContent = mensaje;
  }
  if (window.innerWidth < 992) {
    const card = document.getElementById('resultsCard');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ------------------------------------------------------------------ */
/* 3. Render de resultados (sin transformar la probabilidad)           */
/* ------------------------------------------------------------------ */

function bandaDe(probabilidad) {
  if (probabilidad >= 0.7) return 'alta';
  if (probabilidad >= 0.4) return 'media';
  return 'baja';
}

function renderResultados(datos, payload) {
  if (!datos || typeof datos.probabilidad !== 'number') {
    mostrarError('La API devolvió una respuesta sin probabilidad.');
    return;
  }

  const prob = datos.probabilidad;
  const clase = Number(datos.clase);
  const banda = bandaDe(prob);
  const config = BANDAS[banda];
  const pct = (prob * 100).toFixed(2);
  const parametros = datos.parametros_usados || {};

  const set = (id, texto) => {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
  };

  const banner = document.getElementById('resAlertBanner');
  if (banner) banner.className = `alert-banner ${config.color}`;

  const icono = document.getElementById('resAlertIcon');
  if (icono) icono.innerHTML = `<i class="fas ${config.icon}"></i>`;

  set('resAlertBadge', config.badge);
  set('resAlertTitle', config.titulo);
  set(
    'resAlertMessage',
    `El modelo estimó una probabilidad de ${pct} % para la clase 1 ` +
    `(${datos.etiqueta_clase || 'presencia de casos foco'}). ` +
    'Es un insumo para priorizar recursos, no un diagnóstico individual.'
  );

  set('resClassChip', `Clase ${clase} · ${clase === 1 ? 'presencia estimada' : 'sin presencia estimada'}`);
  set('resProbScore', `${pct} %`);
  set('resProbRaw', `valor crudo: ${prob}`);

  const barra = document.getElementById('resProbBarFill');
  if (barra) {
    barra.className = `prob-bar-fill ${config.fill}`;
    barra.style.width = '0%';
    window.setTimeout(() => { barra.style.width = `${pct}%`; }, 50);
  }

  set('resParamMatricula', String(parametros.matricula ?? payload.matricula));
  set('resParamZona', parametros.zona === 'rural' ? 'Rural (1)' : 'Urbana (0)');
  set('resParamDocentes', String(parametros.docentes ?? payload.docentes));
  set('resParamOrientadores', String(parametros.orientadores ?? payload.orientadores));
  set('resParamRatio', Number(parametros.est_por_docente ?? 0).toFixed(2));
  set('resParamNiveles', String(parametros.niveles ?? payload.niveles));
  set('resParamJornadas', String(parametros.jornadas ?? payload.jornadas));
  set('resParamDepto', parametros.departamento ?? payload.departamento);
  set('resParamBilingue', parametros.bilingue ? 'Sí' : 'No');
  set('resParamEtno', parametros.etnoeducativa ? 'Sí' : 'No');
  set('resParamClase', `${clase}`);

  set(
    'resParamColumnNote',
    `Vector de 41 columnas · dummy: ${parametros.columna_departamento || '—'} · ` +
    'EST_POR_DOCENTE calculado en el backend.'
  );

  const lista = document.getElementById('resActionsList');
  if (lista) {
    lista.innerHTML = '';
    config.acciones.forEach((accion) => {
      const li = document.createElement('li');
      li.innerHTML = '<i class="fas fa-arrow-right"></i> ';
      li.appendChild(document.createTextNode(accion));
      lista.appendChild(li);
    });
  }

  const contenido = document.getElementById('resultsContent');
  if (contenido) contenido.style.display = 'block';

  if (window.innerWidth < 992) {
    const card = document.getElementById('resultsCard');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ------------------------------------------------------------------ */
/* 4. Persistencia en Supabase e historial                             */
/* ------------------------------------------------------------------ */

async function guardarAnalisis(payload, datos) {
  const sb = window.supabaseApp;
  if (!sb) return;

  try {
    const { data: sesion } = await sb.auth.getSession();
    const session = sesion && sesion.session;
    if (!session) return;

    window.eduTrackSession = session;

    const fila = {
      user_id: session.user.id,
      user_email: session.user.email,
      ...payload,
      est_por_docente: datos.parametros_usados.est_por_docente,
      clase: datos.clase,
      probabilidad: datos.probabilidad
    };

    const { error } = await sb.from(TABLA_ANALISIS).insert(fila);
    if (error) throw error;

    await cargarHistorial();
  } catch (error) {
    console.error('No se pudo guardar el análisis en Supabase:', error);
    setHistoryStatus(
      'El análisis se calculó, pero no se guardó en Supabase: ' + describirError(error) +
      '. Ejecuta supabase/migrations/001_analisis_sede.sql y revisa las políticas RLS.',
      true
    );
  }
}

async function initHistorial() {
  const sb = window.supabaseApp;
  if (!sb) {
    setHistoryStatus('Historial no disponible: Supabase no se inicializó.', true);
    return;
  }

  try {
    const { data } = await sb.auth.getSession();
    if (!data || !data.session) {
      renderChartMisAnalisis([]);
      return;
    }

    window.eduTrackSession = data.session;
    await cargarHistorial();
  } catch (error) {
    console.warn('No se pudo inicializar el historial:', error);
    setHistoryStatus('No se pudo inicializar el historial de Supabase.', true);
  }
}

async function cargarHistorial() {
  const sb = window.supabaseApp;
  if (!sb) return;

  const tabla = document.getElementById('historyTable');
  const cuerpo = document.getElementById('historyBody');
  setHistoryStatus('Cargando historial…');

  try {
    const { data, error, count } = await sb
      .from(TABLA_ANALISIS)
      .select('created_at, matricula, zona, departamento, clase, probabilidad', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    set('kpiAnalisisCount', count === null ? '—' : String(count));
    set('historyCount', `${count ?? 0} análisis`);

    if (!data || data.length === 0) {
      if (tabla) tabla.hidden = true;
      renderChartMisAnalisis([]);
      setHistoryStatus('Aún no hay análisis registrados para esta cuenta.');
      return;
    }

    renderChartMisAnalisis(data);

    if (cuerpo) {
      cuerpo.innerHTML = '';
      data.forEach((fila) => {
        const tr = document.createElement('tr');
        const celdas = [
          formatearFecha(fila.created_at),
          String(fila.matricula),
          fila.zona === 'rural' ? 'Rural' : 'Urbana',
          fila.departamento,
          String(fila.clase),
          `${(Number(fila.probabilidad) * 100).toFixed(2)} %`
        ];
        celdas.forEach((texto) => {
          const td = document.createElement('td');
          td.textContent = texto;
          tr.appendChild(td);
        });
        cuerpo.appendChild(tr);
      });
    }

    if (tabla) tabla.hidden = false;
    setHistoryStatus(`Mostrando los últimos ${data.length} de ${count ?? data.length} análisis.`);
  } catch (error) {
    console.warn('No se pudo leer el historial:', error);
    if (tabla) tabla.hidden = true;
    renderChartMisAnalisis([]);
    setHistoryStatus(
      'No se pudo leer el historial: ' + describirError(error) +
      '. Ejecuta supabase/migrations/001_analisis_sede.sql y revisa las políticas RLS.',
      true
    );
  }
}

let chartMisAnalisis = null;

/**
 * Gráfica con los últimos análisis reales de la cuenta (Supabase).
 * Azul = clase 1, gris = clase 0. No inventa datos: si no hay filas,
 * oculta el lienzo y muestra un mensaje.
 */
function renderChartMisAnalisis(filas) {
  const wrap = document.getElementById('misAnalisisCanvasWrap');
  const canvas = document.getElementById('chartMisAnalisis');
  const estado = document.getElementById('misAnalisisStatus');
  if (!wrap || !canvas) return;

  if (typeof Chart === 'undefined') {
    if (estado) estado.textContent = 'Chart.js no está disponible; no se pudo dibujar la gráfica.';
    return;
  }

  if (!filas || filas.length === 0) {
    wrap.hidden = true;
    if (estado) {
      estado.hidden = false;
      estado.textContent = 'Aún no hay análisis guardados. Cada envío aparecerá aquí.';
    }
    return;
  }

  // La consulta llega en orden descendente; la gráfica se dibuja cronológica.
  const orden = [...filas].reverse();
  const etiquetas = orden.map((fila) => formatearFechaCorta(fila.created_at));
  const valores = orden.map((fila) => Number((Number(fila.probabilidad) * 100).toFixed(2)));
  const colores = orden.map((fila) => (Number(fila.clase) === 1 ? '#2563eb' : '#94a3b8'));

  wrap.hidden = false;
  if (estado) estado.hidden = true;

  if (chartMisAnalisis) {
    chartMisAnalisis.data.labels = etiquetas;
    chartMisAnalisis.data.datasets[0].data = valores;
    chartMisAnalisis.data.datasets[0].backgroundColor = colores;
    chartMisAnalisis.update();
    return;
  }

  chartMisAnalisis = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: 'Probabilidad clase 1 (%)',
          data: valores,
          backgroundColor: colores,
          borderRadius: 6,
          maxBarThickness: 48
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (contexto) => {
              const fila = orden[contexto.dataIndex];
              const zona = fila.zona === 'rural' ? 'rural' : 'urbana';
              return ` ${contexto.raw} % · clase ${fila.clase} · ${zona} · ${fila.departamento}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: (valor) => valor + ' %' },
          grid: { color: '#f1f5f9' }
        },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
      }
    }
  });
}

function formatearFechaCorta(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '—';
  return fecha.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatearFecha(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '—';
  return fecha.toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function describirError(error) {
  if (!error) return 'error desconocido';
  const partes = [error.message, error.details, error.hint].filter(Boolean);
  const codigo = error.code ? `[${error.code}] ` : '';
  return codigo + (partes.length ? partes.join(' · ') : 'error desconocido');
}

function setHistoryStatus(texto, esError) {
  const estado = document.getElementById('historyStatus');
  if (!estado) return;
  estado.textContent = texto;
  estado.classList.toggle('is-error', Boolean(esError));
}

function set(id, texto) {
  const el = document.getElementById(id);
  if (el) el.textContent = texto;
}

/* ------------------------------------------------------------------ */
/* 5. Acciones del reporte                                             */
/* ------------------------------------------------------------------ */

function printReport() {
  window.print();
}

function resetAnalysis() {
  const form = document.getElementById('eduTrackForm');
  if (form) form.reset();

  document.getElementById('bilingueText').textContent = 'No';
  document.getElementById('etnoeducativaText').textContent = 'No';

  const placeholder = document.getElementById('resultsPlaceholder');
  const loading = document.getElementById('resultsLoading');
  const content = document.getElementById('resultsContent');
  const errorBox = document.getElementById('resultsError');

  if (placeholder) placeholder.style.display = 'block';
  if (loading) loading.style.display = 'none';
  if (content) content.style.display = 'none';
  if (errorBox) errorBox.style.display = 'none';

  window.scrollTo({ top: 300, behavior: 'smooth' });
}
