/**
 * Plantilla de configuración de EduTrack.
 *
 * Copia este archivo como `config.js` y reemplaza los valores.
 * `config.js` se versiona porque solo contiene la clave PUBLICABLE de
 * Supabase (segura en el navegador). La protección real de los datos está
 * en las políticas RLS de Supabase.
 *
 * NUNCA pongas aquí la clave `service_role` ni contraseñas de base de datos.
 */
window.EDUTRACK_CONFIG = {
  SUPABASE_URL: 'https://TU-PROYECTO.supabase.co',
  SUPABASE_ANON_KEY: 'TU_CLAVE_PUBLICABLE',
  API_URL: 'https://TU-SERVICIO.onrender.com',
  TABLA_ANALISIS: 'analisis_sede'
};
