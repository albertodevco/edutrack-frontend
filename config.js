/**
 * Configuración única de EduTrack.
 * Este archivo se carga antes que cualquier script de la app.
 *
 * - SUPABASE_*: claves publicables (seguras en el navegador). La protección real
 *   de datos vive en las políticas RLS de Supabase.
 * - API_URL: base del backend en Render (sin /predecir).
 * - TABLA_ANALISIS: tabla donde se registra cada análisis.
 */
window.EDUTRACK_CONFIG = {
  SUPABASE_URL: 'https://qkttfwezktegpbpyowah.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_3YclUAIPb9w9jnnyymWvHA_EWpjdQOp',
  API_URL: 'https://ia-edutrack.onrender.com',
  TABLA_ANALISIS: 'analisis_sede'
};
