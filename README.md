# 🎓 EduTrack · Frontend

Panel web para estimar la probabilidad de presencia de casos foco (TEA,
trastornos del aprendizaje y condiciones psicosociales) en sedes educativas de
Colombia, usando el modelo servido por el backend Flask.

## Arquitectura

```
login.html (Supabase Auth)
      │  sesión
      ▼
index.html (dashboard + formulario + resultados)
      │  fetch JSON
      ▼
API Flask en Render  →  DecisionTreeClassifier (41 features)
      │
      └── cada envío se guarda en Supabase (tabla analisis_sede)
```

## Archivos

| Archivo | Rol |
|---|---|
| `config.js` | URL de Supabase, clave publicable, URL de la API y tabla |
| `config.example.js` | Plantilla de `config.js` |
| `login.html` | Inicio de sesión y registro con Supabase |
| `index.html` | Dashboard, analizador, resultados e historial |
| `script.js` | Gráficos, presets, validación, fetch, render e historial |
| `style.css` | Diseño institucional, responsive e impresión |
| `favicon.svg` | Icono |
| `supabase/migrations/001_analisis_sede.sql` | Tabla y políticas RLS |

Este repositorio se despliega como sitio estático. La API vive en el
repositorio **`edutrack-backend`** (Render).

## Configuración

Edita `config.js`:

```js
window.EDUTRACK_CONFIG = {
  SUPABASE_URL: 'https://TU-PROYECTO.supabase.co',
  SUPABASE_ANON_KEY: 'TU_CLAVE_PUBLICABLE',
  API_URL: 'https://TU-SERVICIO.onrender.com',
  TABLA_ANALISIS: 'analisis_sede'
};
```

## Base de datos (Supabase)

1. Abre el SQL Editor del proyecto.
2. Ejecuta `supabase/migrations/001_analisis_sede.sql`.
3. Verifica que la tabla tenga RLS activo. Las políticas permiten a cada
   usuario autenticado insertar y leer **solo sus** análisis.
4. En Authentication → Providers, mantén Email habilitado. Si exiges
   confirmación por correo, el registro mostrará el aviso correspondiente y no
   entrará en bucle.

## Ejecución local

No abras los HTML con `file://`: Supabase Auth y el fetch necesitan un origen
HTTP.

```bash
python -m http.server 8080
# http://localhost:8080/login.html
```

El backend debe estar corriendo (por defecto en `http://localhost:5000`) y
`API_URL` debe apuntar a él.

## Formulario

| Campo | Variable del modelo | Notas |
|---|---|---|
| Matrícula | `MATRICULA` | Entrada dominante (72,0 % de importancia) |
| Docentes | `N_DOCENTES` | Debe ser ≥ 1 |
| Orientadores | `N_ORIENTADORES` | |
| Niveles | `N_NIVELES` | 1 – 6 |
| Jornadas | `N_JORNADAS` | Importancia 0,0014 |
| Zona | `ZONA_RURAL` | Rural = 1, Urbana = 0 |
| Departamento | `DEP_*` | 33 valores; Amazonas = categoría base |
| Bilingüe | `BILINGUE_SI` | Importancia 0,0001 |
| Etnoeducativa | `ETNOEDUC_SI` | |

`EST_POR_DOCENTE` no se pide: lo calcula el backend.

## Casos de demostración

Los botones llenan el formulario y ejecutan la API real. Valores esperados con
los artefactos actuales (tolerancia `1e-9`):

| Caso | Entrada | Probabilidad | Clase |
|---|---|---|---|
| Rural pequeña | 60 / 3 / 0 · Amazonas | 7.59 % | 0 |
| Rural intermedia | 300 / 20 / 1 · Chocó | 62.69 % | 1 |
| Urbana grande | 950 / 34 / 2 · Antioquia | 96.72 % | 1 |

## Resultados

- Se muestra **la probabilidad cruda** que devuelve la API, sin ajustes por
  zona ni redondeos del valor (solo formato de presentación).
- El banner de prioridad es una **banda operativa** (≥ 70 % alta, ≥ 40 % media,
  < 40 % monitoreo), no una salida del modelo.
- Se listan los parámetros exactos y la dummy de departamento usada.
- Las recomendaciones son sugerencias institucionales, no un diagnóstico.

## Historial y dashboard

Cada envío se inserta en `analisis_sede`; el KPI “Análisis registrados” y la
sección Historial leen las últimas 10 filas de la cuenta autenticada. Si la
tabla o las políticas no existen, la app sigue funcionando y muestra un aviso.

## Subir a GitHub

El repositorio ya está inicializado y con los cambios preparados:

```powershell
cd "C:\Users\Admin\Documents\Inteligencia Artificial\edutrack-frontend"
git add -A
git commit -m "feat: formulario de 9 campos, resultados reales del modelo e historial Supabase"
git push origin main
```

## Despliegue

1. Despliega primero el backend actualizado (`edutrack-backend`) en Render.
2. Publica este repositorio en un hosting estático (Vercel, Netlify o GitHub
   Pages). En Vercel: *Root Directory* vacío, *Framework* `Other`, sin build.
3. Actualiza `API_URL` y las credenciales en `config.js` y haz commit: el
   hosting redepliega solo.
4. Añade el dominio del frontend a `ALLOWED_ORIGINS` del backend si restringes
   CORS.
5. Ejecuta `supabase/migrations/001_analisis_sede.sql` en el SQL Editor.

> La clave de Supabase es una `publishable key`: puede estar en el navegador.
> La seguridad real depende de RLS. Nunca subas la clave `service_role`.
