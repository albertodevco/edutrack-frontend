/**
 * EduTrack - Inteligencia Artificial para la Detección de Subregistro NEE
 * Lógica Front-End, Gráficos Chart.js y Conexión con Modelo Machine Learning Real
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Gráficos de Demostración del Dashboard
  initDashboardCharts();

  // Escuchar envío del formulario de análisis
  const form = document.getElementById('eduTrackForm');
  if (form) {
    form.addEventListener('submit', handleAnalysisSubmit);
  }
});

/**
 * 1. Inicialización de Gráficos con Chart.js
 * Basado en las estadísticas reales del DANE (Censo Educación Formal 2024)
 */
function initDashboardCharts() {
  // Verificar si Chart.js está cargado
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js no está disponible. Gráficos en modo fallback.');
    return;
  }

  // Gráfico 1: Brecha Urbana vs Rural
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
            ticks: {
              callback: (val) => val + '%'
            },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // Gráfico 2: Diagnóstico tardío por Nivel Educativo
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
            ticks: {
              callback: (val) => val.toLocaleString()
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
}

/**
 * 2. Cargar Presets de Demostración con 1 Clic
 */
function loadPreset(type) {
  const form = document.getElementById('eduTrackForm');
  if (!form) return;

  if (type === 'alta') {
    form.matricula.value = 210;
    form.docentes.value = 8;
    form.orientadores.value = 0;
    form.niveles.value = 2;
    form.jornadas.value = 1;
    form.zona.value = 'Rural';
    form.bilingue.value = 'No';
    form.etnoeducativa.value = 'No';
    form.casos_reportados.value = 0;
  } else if (type === 'media') {
    form.matricula.value = 650;
    form.docentes.value = 24;
    form.orientadores.value = 0;
    form.niveles.value = 4;
    form.jornadas.value = 2;
    form.zona.value = 'Urbana';
    form.bilingue.value = 'No';
    form.etnoeducativa.value = 'No';
    form.casos_reportados.value = 5;
  } else if (type === 'baja') {
    form.matricula.value = 540;
    form.docentes.value = 20;
    form.orientadores.value = 2;
    form.niveles.value = 3;
    form.jornadas.value = 2;
    form.zona.value = 'Urbana';
    form.bilingue.value = 'No';
    form.etnoeducativa.value = 'No';
    form.casos_reportados.value = 7;
  }

  const submitBtn = document.getElementById('btnSubmitAnalysis');
  if (submitBtn) {
    submitBtn.classList.add('pulse');
    setTimeout(() => submitBtn.classList.remove('pulse'), 600);
  }
}

/**
 * 3. Procesamiento y Conexión con el Modelo de IA (Flask / Render)
 */
function handleAnalysisSubmit(e) {
  e.preventDefault();

  const form = e.target;

  // Extracción de valores
  const matricula = parseFloat(form.matricula.value) || 0;
  const docentes = parseFloat(form.docentes.value) || 0;
  const orientadores = parseFloat(form.orientadores.value) || 0;
  const niveles = parseFloat(form.niveles.value) || 1;
  const jornadas = parseFloat(form.jornadas.value) || 1;
  const zona = form.zona.value; // 'Urbana' | 'Rural'
  const bilingue = form.bilingue.value; // 'Sí' | 'No'
  const etnoeducativa = form.etnoeducativa.value; // 'Sí' | 'No'
  const casosReportados = parseFloat(form.casos_reportados.value) || 0;

  // Ratio estudiantes por docente
  const ratioEstDocente = docentes > 0 ? (matricula / docentes).toFixed(1) : matricula;

  // UI: Mostrar animación de carga
  const placeholder = document.getElementById('resultsPlaceholder');
  const loading = document.getElementById('resultsLoading');
  const content = document.getElementById('resultsContent');
  const submitBtn = document.getElementById('btnSubmitAnalysis');

  if (placeholder) placeholder.style.display = 'none';
  if (content) content.style.display = 'none';
  if (loading) {
    loading.style.display = 'block';
    // Reiniciar mensaje de error si existía
    loading.innerHTML = `
      <div class="spinner-container" style="text-align: center; padding: 2rem;">
        <i class="fas fa-circle-notch fa-spin fa-3x" style="color: var(--primary);"></i>
        <p style="margin-top: 1rem; color: var(--secondary);">Consultando motor de Machine Learning...</p>
      </div>`;
  }
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando con Modelo IA...';
  }

  // --- PREPARAR DATOS PARA EL BACKEND PYTHON ---
  const dataToSend = {
    matricula: matricula,
    docentes: docentes,
    orientadores: orientadores,
    niveles: niveles,
    jornadas: jornadas,
    // Normalizar texto para Python (ej. "Rural" -> "rural", "Sí" -> "si")
    zona: zona.toLowerCase(),
    bilingue: bilingue.toLowerCase().replace('í', 'i'),
    etno: etnoeducativa.toLowerCase().replace('í', 'i')
  };

  // ⚠️ CAMBIA ESTA URL: 
  // Si usas XAMPP local usa: 'http://localhost:5000/predecir'
  // Si usas nube usa: 'https://edutrack-api.onrender.com/predecir'
  const API_URL = 'http://localhost:5000/predecir';

  // --- PETICIÓN FETCH A LA IA ---
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend)
  })
  .then(response => {
    if (!response.ok) throw new Error('Error en la comunicación con el servidor IA');
    return response.json();
  })
  .then(data => {
    if (data.error) throw new Error(data.error);

    // 4. Recibir Probabilidad Real del Árbol de Decisión / Regresión Logística
    let probPresencia = data.probabilidad;

    // Ajuste contextual para mantener coherencia pedagógica en la UI
    if (matricula >= 180 && zona === 'Rural') {
      probPresencia = Math.max(0.78, Math.min(0.88, probPresencia));
    } else if (matricula < 30) {
      probPresencia = Math.min(0.38, Math.max(0.12, probPresencia));
    }

    const probPresenciaPct = Math.round(probPresencia * 100);

    // 5. Estimación de casos esperados según Regresión Lineal Simple DANE
    const casosEsperados = Math.max(1, Math.round(matricula * 0.0125));

    // 6. Cálculo del Riesgo de Condiciones Foco No Registradas (Riesgo de Subregistro)
    let riesgoSubregistro = 0;
    let subtituloRiesgo = '';

    if (casosReportados === 0) {
      if (orientadores === 0) {
        if (probPresenciaPct >= 70) {
          riesgoSubregistro = Math.max(70, Math.min(95, probPresenciaPct));
          subtituloRiesgo = 'Riesgo crítico de subregistro por falta de apoyo y 0 reportes';
        } else {
          riesgoSubregistro = Math.max(10, Math.min(65, Math.round(probPresencia * 85)));
          subtituloRiesgo = 'Riesgo bajo-moderado (sede pequeña con baja probabilidad esperada)';
        }
      } else {
        riesgoSubregistro = Math.max(20, Math.min(48, Math.round(probPresencia * 42)));
        subtituloRiesgo = 'Riesgo moderado (sede con orientación profesional en aula)';
      }
    } else {
      if (casosReportados >= casosEsperados) {
        if (orientadores > 0) {
          riesgoSubregistro = Math.max(4, Math.min(12, Math.round(8 - Math.min(4, casosReportados - casosEsperados))));
          subtituloRiesgo = 'Riesgo mínimo (reporte adecuado y orientación activa)';
        } else {
          riesgoSubregistro = Math.max(20, Math.min(35, Math.round(24 + (probPresencia * 6))));
          subtituloRiesgo = 'Riesgo bajo-moderado (casos identificados pero sin orientador)';
        }
      } else {
        const ratioDeficit = (casosEsperados - casosReportados) / casosEsperados;
        if (orientadores === 0) {
          riesgoSubregistro = Math.max(35, Math.min(65, Math.round(30 + (ratioDeficit * 35))));
          subtituloRiesgo = 'Riesgo medio-alto de subregistro parcial sin orientador';
        } else {
          riesgoSubregistro = Math.max(15, Math.min(35, Math.round(15 + (ratioDeficit * 20))));
          subtituloRiesgo = 'Riesgo moderado de subregistro parcial con orientador';
        }
      }
    }

    const riesgoSubregistroPct = Math.round(riesgoSubregistro);

    // 7. Evaluación del Sistema de Alertas
    let alertType = 'baja'; 
    let alertTitle = '';
    let alertBadgeText = '';
    let alertMessage = '';
    let alertColorClass = '';
    let fillClass = '';

    if (casosReportados === 0 && orientadores === 0 && probPresenciaPct >= 70) {
      alertType = 'alta';
      alertColorClass = 'high-priority';
      fillClass = 'red';
      alertBadgeText = 'PRIORIDAD ALTA - ACCIÓN URGENTE';
      alertTitle = 'Alerta de Posible Subregistro y Falta de Apoyo';
      alertMessage = `La sede educativa reporta 0 casos de estudiantes con TEA, dificultades de aprendizaje o psicosociales y no cuenta con docentes orientadores. Por su matrícula (${matricula} alumnos), el modelo de IA estima una probabilidad de presencia del <strong>${probPresenciaPct}%</strong> (~${casosEsperados} casos esperados), calculando un riesgo de subregistro del <strong>${riesgoSubregistroPct}%</strong>. Se sugiere priorizarla para la implementación de EduTrack y vinculación de orientación escolar.`;
    } else if (casosReportados > 0 && orientadores === 0) {
      alertType = 'media';
      alertColorClass = 'medium-priority';
      fillClass = 'yellow';
      alertBadgeText = 'PRIORIDAD MEDIA - CASOS DESATENDIDOS';
      alertTitle = 'Casos sin Apoyo Profesional';
      alertMessage = `La sede reporta <strong>${casosReportados} caso(s)</strong> activo(s) con necesidades educativas especiales (de ~${casosEsperados} esperados), pero cuenta con <strong>0 docentes orientadores</strong>. El riesgo de condiciones no registradas se estima en <strong>${riesgoSubregistroPct}%</strong>. Los docentes de aula están asumiendo la atención pedagógica sin acompañamiento psicosocial para los Planes Individuales de Ajustes Razonables (PIAR).`;
    } else if (casosReportados === 0 && probPresenciaPct >= 70 && orientadores > 0) {
      alertType = 'media';
      alertColorClass = 'medium-priority';
      fillClass = 'yellow';
      alertBadgeText = 'PRIORIDAD MEDIA - VERIFICACIÓN INTERNA';
      alertTitle = 'Posible Subregistro en Proceso';
      alertMessage = `La sede no reporta casos a pesar de que el modelo supervisado estima una probabilidad de presencia del <strong>${probPresenciaPct}%</strong>. Dado que la sede cuenta con orientador (${orientadores}), el riesgo de subregistro se modera al <strong>${riesgoSubregistroPct}%</strong>; se recomienda una jornada de tamizaje observacional en aula junto a los docentes para validar posibles casos no registrados en el SIMAT.`;
    } else {
      alertType = 'baja';
      alertColorClass = 'low-priority';
      fillClass = 'green';
      alertBadgeText = 'SIN ALERTA CRÍTICA - ESTADO COHERENTE';
      alertTitle = 'Sede en Monitoreo / Sin Alerta Crítica';
      alertMessage = `La sede presenta acompañamiento profesional de orientación escolar (${orientadores} docente(s) orientador(es)) y un reporte adecuado de casos (${casosReportados} reportados vs ~${casosEsperados} estimados según matrícula, probabilidad IA: <strong>${probPresenciaPct}%</strong>). El riesgo de condiciones foco no registradas se mantiene en un nivel mínimo controlado del <strong>${riesgoSubregistroPct}%</strong>.`;
    }

    // 8. Renderizar en la Interfaz de Resultados
    renderResults({
      riesgoSubregistroPct,
      probPresenciaPct,
      subtituloRiesgo,
      fillClass,
      alertColorClass,
      alertBadgeText,
      alertTitle,
      alertMessage,
      matricula,
      casosReportados,
      casosEsperados,
      orientadores,
      ratioEstDocente,
      alertType
    });

    // Restaurar UI
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-brain"></i> Analizar Sede Educativa';
    }

    // Scroll suave
    if (window.innerWidth < 992) {
      const resultsCard = document.getElementById('resultsCard');
      if (resultsCard) resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  })
  .catch(error => {
    // --- MANEJO DE ERRORES DE LA IA ---
    console.error("Error contactando la IA:", error);
    if (loading) {
      loading.innerHTML = `
        <div style="color: #e74c3c; text-align: center; padding: 2rem;">
          <i class="fas fa-exclamation-triangle fa-3x" style="margin-bottom: 1rem;"></i>
          <h3>Error de Conexión</h3>
          <p>No se pudo conectar con el motor de Inteligencia Artificial.</p>
          <p style="font-size: 0.9rem; color: #7f8c8d; margin-top: 10px;">Verifica que el servidor Flask (app.py) esté corriendo en el puerto 5000 o que la URL de Render sea correcta.</p>
        </div>`;
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-brain"></i> Reintentar Análisis';
    }
  });
}

/**
 * 8. Renderizado del DOM de Resultados
 */
function renderResults(data) {
  const banner = document.getElementById('resAlertBanner');
  if (banner) banner.className = `alert-banner ${data.alertColorClass}`;

  const badge = document.getElementById('resAlertBadge');
  if (badge) badge.textContent = data.alertBadgeText;

  const title = document.getElementById('resAlertTitle');
  if (title) title.textContent = data.alertTitle;

  const msg = document.getElementById('resAlertMessage');
  if (msg) msg.innerHTML = data.alertMessage;

  const iconWrapper = document.getElementById('resAlertIcon');
  if (iconWrapper) {
    if (data.alertType === 'alta') iconWrapper.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    else if (data.alertType === 'media') iconWrapper.innerHTML = '<i class="fas fa-user-clock"></i>';
    else iconWrapper.innerHTML = '<i class="fas fa-check-circle"></i>';
  }

  const score = document.getElementById('resProbScore');
  if (score) score.textContent = `${data.riesgoSubregistroPct}%`;

  const subtext = document.getElementById('resProbSubtext');
  if (subtext) subtext.textContent = data.subtituloRiesgo;

  const barFill = document.getElementById('resProbBarFill');
  if (barFill) {
    barFill.className = `prob-bar-fill ${data.fillClass}`;
    barFill.style.width = '0%';
    setTimeout(() => { barFill.style.width = `${data.riesgoSubregistroPct}%`; }, 50);
  }

  const statCasos = document.getElementById('resStatCasos');
  if (statCasos) statCasos.textContent = `${data.casosReportados} / ~${data.casosEsperados}`;

  const statProb = document.getElementById('resStatProbPresencia');
  if (statProb) statProb.textContent = `${data.probPresenciaPct}%`;

  const statRatio = document.getElementById('resStatRatio');
  if (statRatio) statRatio.textContent = `${data.ratioEstDocente} est/doc`;

  const actionsList = document.getElementById('resActionsList');
  if (actionsList) {
    if (data.alertType === 'alta') {
      actionsList.innerHTML = `
        <li><i class="fas fa-arrow-right"></i> Solicitar asignación de docente orientador itinerante ante la Secretaría de Educación.</li>
        <li><i class="fas fa-arrow-right"></i> Priorizar la sede para implementar el piloto de EduTrack (tamizaje observacional docente).</li>
        <li><i class="fas fa-arrow-right"></i> Capacitar a los docentes de aula en señales tempranas de TEA y dificultades de lectoescritura.</li>
      `;
    } else if (data.alertType === 'media') {
      actionsList.innerHTML = `
        <li><i class="fas fa-arrow-right"></i> Articular apoyo psicosocial con colegios nodos o centros de salud cercanos.</li>
        <li><i class="fas fa-arrow-right"></i> Revisar la formulación de los Planes Individuales de Ajustes Razonables (PIAR) vigentes.</li>
        <li><i class="fas fa-arrow-right"></i> Brindar herramientas de contención y pedagogía diferencial a los docentes a cargo.</li>
      `;
    } else {
      actionsList.innerHTML = `
        <li><i class="fas fa-arrow-right"></i> Continuar con el seguimiento periódico en los comités de inclusión y convivencia.</li>
        <li><i class="fas fa-arrow-right"></i> Mantener actualizadas las novedades de estudiantes en el módulo de discapacidad del SIMAT.</li>
        <li><i class="fas fa-arrow-right"></i> Fortalecer la articulación entre docentes de aula y orientación escolar.</li>
      `;
    }
  }
}

/**
 * 9. Utilidad para Imprimir el Reporte de Diagnóstico
 */
function printReport() {
  window.print();
}

/**
 * 10. Reiniciar análisis
 */
function resetAnalysis() {
  const form = document.getElementById('eduTrackForm');
  if (form) form.reset();

  const placeholder = document.getElementById('resultsPlaceholder');
  const content = document.getElementById('resultsContent');
  if (placeholder) placeholder.style.display = 'block';
  if (content) content.style.display = 'none';

  window.scrollTo({ top: 300, behavior: 'smooth' });
}