# 🎓 EduTrack - Prototipo Web para Detección de Subregistro NEE (IA)

EduTrack es una solución de Inteligencia Artificial orientada a la gestión educativa inclusiva en Colombia. Su objetivo es detectar el **posible subregistro** de estudiantes con necesidades educativas especiales (**TEA**, **trastornos de aprendizaje/comportamiento** o **psicosociales**) en sedes educativas públicas, apoyando a directivos y docentes en la toma de decisiones oportunas.

---

## 🚀 Acceso Inmediato en XAMPP

Los archivos ya están instalados y sincronizados tanto en la carpeta del proyecto como en el servidor Apache de XAMPP:

* **URL de Acceso en Navegador:**  
  👉 **`http://localhost/edutrack`**  
  *(o `http://localhost/edutrack/login.php`)*

> **Nota:** Apache y MySQL en XAMPP ya se encuentran en ejecución. Solo abra la URL en su navegador (Google Chrome, Edge, Firefox, etc.).

---

## 🔑 Credenciales de Acceso Demo (Login con 1 Clic)

La pantalla de inicio de sesión (`login.php`) incluye botones de **acceso rápido con 1 solo clic** para los siguientes roles de demostración:

| Rol | Correo Institucional | Contraseña | Perfil en el Sistema |
|---|---|---|---|
| **Rector / Directivo** | `rector@edutrack.edu.co` | `rector123` | Lic. Alberto Castro Padilla |
| **Docente Orientadora** | `orientador@edutrack.edu.co` | `orientador123` | Dra. María Jimena Yepes |
| **Analista de Calidad / IA** | `analista@edutrack.edu.co` | `analista123` | Ing. Juan Fernando Jiménez |

*(También se puede ingresar con cualquier usuario y contraseña para pruebas libres).*

---

## 📊 Características de la Interfaz

### 1. Dashboard Nacional Previo (DANE Educación Formal 2024)
Antes del formulario se despliegan indicadores de contexto nacional:
- **43.120 Sedes Oficiales Analizadas** a nivel nacional.
- **89.4% Sedes sin Docente Orientador** (brecha crítica de personal especializado).
- **Gráfico 1 (Chart.js):** Brecha de reporte y dotación docente entre Sedes Urbanas vs. Sedes Rurales.
- **Gráfico 2 (Chart.js):** Detección tardía por ciclo educativo (Preescolar vs. Primaria vs. Secundaria vs. Media).

### 2. Formulario de Entrada (Variables del Modelo de IA)
Permite ingresar las 9 variables estructurales entrenadas en el modelo:
1. **Matrícula Total** (Número de estudiantes).
2. **Cantidad de Docentes de Aula** (Número).
3. **Cantidad de Docentes Orientadores** (Número).
4. **Número de Niveles Educativos** (1 a 5).
5. **Número de Jornadas Operativas** (1 a 4).
6. **Zona Geográfica** (Desplegable: Urbana / Rural).
7. **Sede Bilingüe** (Desplegable: Sí / No).
8. **Sede Etnoeducativa** (Desplegable: Sí / No).
9. **Casos Actuales Reportados en la Sede** (Número).

### 3. Casos de Prueba Rápida (Botones de Presets para Sustentación)
Sobre el formulario encontrará 3 botones para cargar escenarios listos para sustentar al profesor:
- 🔴 **Caso 1: Prioridad Alta (Subregistro Crítico)**  
  *Sede Rural sin orientador, 210 alumnos y 0 casos reportados.*  
  👉 **Alerta:** *"Alerta de Posible Subregistro y Falta de Apoyo"*, Riesgo de subregistro estimado ~78% (crítico), recomendación de intervención prioritaria.
- 🟡 **Caso 2: Prioridad Media (Casos sin Apoyo)**  
  *Sede Urbana con 650 alumnos, 5 casos reportados pero 0 orientadores.*  
  👉 **Alerta:** *"Casos sin Apoyo Profesional"*, Riesgo de subregistro moderado ~43%, sobrecarga pedagógica docente.
- 🟢 **Caso 3: Sin Alerta Crítica (Monitoreo Normal)**  
  *Sede con 540 alumnos, 2 orientadores y 7 casos reportados.*  
  👉 **Alerta:** *"Sede en Monitoreo / Sin Alerta Crítica"*, Riesgo de subregistro mínimo ~8%, relación coherente de casos y orientación.

### 4. Panel de Resultados de la Simulación
- **Medidor de Riesgo de Subregistro Estimado** con barra de porcentaje dinámica codificada por color (Rojo, Amarillo, Verde).
- **Probabilidad Poblacional de Presencia (Modelo Supervisado DANE 2024)**: Muestra la probabilidad estadística de que existan condiciones foco en la sede por sus factores estructurales.
- **Banners de Alerta Visual** codificados por nivel de prioridad según las reglas del notebook.
- **Estimación de Casos Foco Esperados** mediante la regresión lineal simple del DANE (~1.25 casos por cada 100 matriculados).
- **Ratio de Alumnos por Docente de Aula** (indicador de saturación observacional).
- **Recomendaciones Pedagógicas y Administrativas** según la normativa colombiana (Decreto 1421 de 2017).
- **Botón de Impresión de Ficha:** Permite generar un reporte limpio en PDF para archivo institucional.

---

## 📁 Estructura del Código

```text
├── index.php         # Panel principal: Dashboard, Formulario y Panel de Resultados
├── login.php         # Pantalla de acceso con selector de credenciales rápidas
├── logout.php        # Destrucción de sesión segura de PHP
├── style.css         # Diseño visual institucional, paleta académica, responsive y print
├── script.js         # Lógica interactiva: Chart.js, presets y simulación del modelo de IA
├── README.md         # Documentación de uso y sustentación
└── RECURSOS/         # Notebook de modelado (EduTrack_Proyecto 1.2.ipynb) y entrega PDF
```

---

## 👥 Integrantes del Proyecto
- **Juan Fernando Jiménez Benjumea**
- **Andrés David López Muñoz**
- **Jhonatan Yepes Luna**
- **Alberto José Castro Padilla**
- **David Armando Olmos Moreno**

*Asignatura: Inteligencia Artificial (8vo Semestre)*

