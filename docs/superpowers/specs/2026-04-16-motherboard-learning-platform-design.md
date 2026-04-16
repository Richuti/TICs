## TICS – Plataforma Interactiva de Motherboard (Diseño)

### 1. Objetivo general

Crear una aplicación web profesional, responsiva y moderna, enfocada en estudiantes universitarios/técnicos, para:
- Entender la **estructura y función** de la motherboard.
- Explorar un **modelo 3D interactivo** de una motherboard.
- Practicar y evaluar sus conocimientos mediante **quizzes de varios niveles**.

Tecn stack principal:
- SPA con **React + Vite**.
- **React Router** para manejo de rutas.
- CSS global reutilizando el archivo existente `style.css`, ajustándolo cuando sea necesario.

Rutas principales:
- `/` → Landing.
- `/motherboard` → Explicación completa de la motherboard + visor 3D.
- `/quiz` → Pantalla de quizzes con varios niveles.

---

### 2. Público objetivo y tono

- Público: **Estudiantes universitarios / técnicos** con base en informática y arquitectura de computadoras.
- Tono de contenido:
  - Técnico pero **didáctico**.
  - Explicaciones con ejemplos de laboratorio y uso real.
  - Lenguaje en **español**, evitando sobrecarga de jerga innecesaria.

---

### 3. Arquitectura de la app

#### 3.1 Estructura de carpetas (propuesta)

- `project/`
  - `index.html`
  - `src/`
    - `main.jsx` → Punto de entrada de React + React Router.
    - `App.jsx` → Layout general, header, footer, enrutamiento.
    - `styles/`
      - `style.css` → CSS global actual (adaptado si hace falta).
    - `components/`
      - `Header.jsx` → Cabecera fija, navegación principal.
      - `Footer.jsx` → Pie de página.
      - `Layout.jsx` → Envoltorio de página (wrap, secciones, etc.).
      - `HeroLanding.jsx` → Hero de la landing.
      - `FeatureGrid.jsx` → Bloque “qué aprenderás”.
      - `StudyFlow.jsx` → Bloque “flujo de estudio”.
      - `AudienceStrip.jsx` → Breve sección “para quién es”.
      - `QuizSummaryPanel.jsx` → Resumen de progreso en quizzes.
      - `Motherboard3DViewer.jsx` → Visor 3D de motherboard.
      - `MotherboardInfoPanels.jsx` → Pestañas/acordeón de teoría.
      - `QuizEngine.jsx` → Motor de quiz reutilizable (lógica).
    - `pages/`
      - `LandingPage.jsx`
      - `MotherboardPage.jsx`
      - `QuizPage.jsx`
    - `data/`
      - `motherboardParts.js` → Datos de partes/componentes de la motherboard.
      - `quizzes.js` → Banco de preguntas organizado por nivel.
  - `public/`
    - `models/motherboard.glb` → Modelo 3D.

#### 3.2 Dependencias clave

- `react`, `react-dom`.
- `react-router-dom`.
- `@react-three/fiber`, `@react-three/drei` para el visor 3D de la motherboard.
- Herramientas de desarrollo de Vite (vite, @vitejs/plugin-react).

---

### 4. Landing (`/`)

#### 4.1 Objetivo de la página

- Presentar el proyecto y su propuesta de valor:
  - Aprendizaje interactivo de arquitectura de computadoras.
  - Énfasis en motherboards.
  - Recurso pensado para asignaturas de **Arquitectura de Computadoras / Hardware**.
- Guiar rápido al usuario a:
  - Explorar la motherboard.
  - Realizar quizzes.

#### 4.2 Secciones

1. **Header fijo**
   - Incluye logo / nombre del proyecto (ej. “TICs · Motherboard Lab”).
   - Navegación:
     - `Inicio` (scroll al hero).
     - `Motherboard` (link a `/motherboard`).
     - `Quizzes` (link a `/quiz`).
     - `Recursos` (scroll a sección de recursos).
   - Botón CTA en header: “Empezar ahora” → navega a `/motherboard` o `/quiz`.

2. **Hero principal**
   - Fondo tipo gradiente/luces ya alineado con `style.css`.
   - Contenido:
     - Título: enfoque en **“Arquitectura de Computadoras Interactiva”**.
     - Subtítulo: describe que el usuario explorará una motherboard realista, entenderá sus componentes y se autoevaluará.
     - Botones:
       - “Explorar motherboard” → `/motherboard`.
       - “Ir a los quizzes” → `/quiz`.
     - Pequeñas estadísticas/resaltados (ejemplo):
       - “+20 conceptos clave”.
       - “Quizzes por niveles”.
       - “Orientado a estudiantes de Ingeniería / TICs”.

3. **Sección “Qué aprenderás”**
   - Grid tipo tarjetas (Bento-grid usando clases ya definidas en `style.css` si aplican).
   - Tarjetas ejemplo:
     - “Mapa de la motherboard”.
     - “Componentes críticos (CPU socket, chipset, VRM, RAM, etc.)”.
     - “Buses y puertos de expansión”.
     - “Diagnóstico de fallas frecuentes”.

4. **Sección “Flujo de estudio”**
   - Tres pasos con diseño de “timeline” o lista:
     1. “Explora el modelo 3D”.
     2. “Lee la teoría guiada”.
     3. “Responde quizzes por nivel”.
   - Cada paso con icono simple y descripción corta.

5. **Sección “Para quién es / Uso en clase”**
   - Explicación orientada a:
     - Estudiantes universitarios de Ingeniería/TI.
     - Docentes que quieran usarlo como apoyo visual.
   - Pequeño bloque sobre cómo se podría integrar en prácticas de laboratorio.

6. **Sección de recursos / créditos**
   - Enlaces a documentación adicional, PDFs o recursos externos (placeholder).
   - Créditos del proyecto (autor, institución, curso).

7. **Footer**
   - Texto legal básico.
   - Links a inicio, motherboard, quizzes.

---

### 5. Pantalla Motherboard (`/motherboard`)

#### 5.1 Objetivo de la página

- Dar una **visión completa y didáctica** de la motherboard:
  - Estructura física.
  - Partes principales y su función.
  - Cómo se comunican los componentes.
  - Ejemplos de fallas y diagnóstico básico.

#### 5.2 Layout

- Diseño en dos columnas en escritorio (stack en móvil):
  - **Columna izquierda**:
    - Título y breve intro.
    - Visor 3D (`Motherboard3DViewer`):
      - Visor con `Canvas` (react-three-fiber).
      - Controles de órbita (rotar, hacer zoom, mover un poco).
      - Iluminación básica.
      - Carga del modelo `motherboard.glb` desde `public/models`.
  - **Columna derecha**:
    - Lista de componentes (interactiva o básica al inicio):
      - CPU socket, chipset, slots RAM, puertos SATA, PCIe, VRM, conectores de alimentación, headers front panel, etc.
    - Panel de información (`MotherboardInfoPanels`):
      - UI tipo pestañas o acordeón:
        - “Visión general”.
        - “Componentes y funciones”.
        - “Interconexiones y buses”.
        - “Fallas típicas / diagnóstico”.
      - Cada panel con texto bien estructurado (subtítulos y bullets).

> Nota: primera versión puede no resaltar físicamente las partes en el modelo, sino usar la lista + texto. En futuras iteraciones se podría mapear cada parte 3D.

#### 5.3 Contenido principal

- Explicar:
  - Rol de la motherboard como “plataforma” donde se integran CPU, RAM, almacenamiento, GPU, etc.
  - Diferencia entre sockets, chipsets, formatos (ATX, mATX, ITX) a un nivel suficiente para estudiantes.
  - Buses principales: FSB/QPI, PCIe, memoria, periféricos.
  - Casos prácticos:
    - Ejemplo de incompatibilidad de CPU.
    - Fallos típicos (condensadores, pistas dañadas, etc.).
    - Señales que ayudan en el diagnóstico (beeps, códigos de error, LEDs).

---

### 6. Pantalla de Quizzes (`/quiz`)

#### 6.1 Objetivo de la página

- Permitir al estudiante:
  - Comprobar su **nivel de comprensión** sobre la motherboard.
  - Recibir **feedback inmediato** y sugerencias de estudio.
  - Tener diferentes **niveles de dificultad**.

#### 6.2 Estructura general

- Cabecera de página:
  - Título (“Quizzes sobre Motherboard”).
  - Breve descripción de los niveles.
- Selector de nivel:
  - Botones o tabs:
    - Nivel **Básico**.
    - Nivel **Intermedio**.
    - Nivel **Avanzado**.
- Zona de quiz:
  - Componente `QuizEngine` que recibe:
    - Lista de preguntas (por nivel) desde `data/quizzes.js`.
  - Muestra:
    - Pregunta actual.
    - Opciones (radio para una sola respuesta, checkboxes para múltiples).
  - Botón “Responder / Siguiente”.
  - Mensaje de feedback inmediato (correcto/incorrecto y explicación corta).
- Resumen:
  - Al finalizar un bloque de preguntas:
    - Porcentaje de aciertos.
    - Resumen por nivel.
    - Mensaje con recomendaciones (ej: “Revisa la sección de buses en `/motherboard`”).

#### 6.3 Banco de preguntas

- Al menos:
  - **Nivel Básico**: 10–15 preguntas.
    - Identificación de componentes.
    - Funciones básicas.
  - **Nivel Intermedio**: 10–15 preguntas.
    - Relaciones entre componentes.
    - Toma de decisiones simples (compatibilidades).
  - **Nivel Avanzado**: 10–15 preguntas.
    - Escenarios de diagnóstico.
    - Preguntas de rendimiento, cuellos de botella, configuraciones recomendadas.

> Primera versión: las preguntas se almacenan en un objeto/array en `data/quizzes.js`.

---

### 7. Comportamiento responsivo y UI/UX

- Usar el sistema de diseño ya definido en `style.css`:
  - Tipografías, colores, botones, tarjetas.
  - Clases de layout (`.wrap`, `.section`, `.hero`, etc.).
- Asegurar:
  - Layout fluido para móviles, tablets y desktop (uso de grid/flex + media queries).
  - Navegación siempre accesible (header sticky).
  - Tamaños de fuente legibles.
  - Espaciados suficientes.
- Animaciones:
  - Hover en tarjetas y botones (ya se ve en `style.css`).
  - Pequeñas transiciones al entrar secciones (opcionalmente con CSS o pequeñas libs si se desea).

---

### 8. Accesibilidad y usabilidad

- Teclas de navegación:
  - Links bien etiquetados (`aria-label` cuando sea necesario).
- Para quizzes:
  - Inputs accesibles (`label` correctamente asociado).
  - Mensajes de error o feedback que no dependan solo del color.
- Textos alternativos para imágenes si se añaden.

---

### 9. Integración con el proyecto actual

- Mantener el archivo `style.css` como base, moviéndolo a `src/styles/style.css` y referenciándolo en `main.jsx`.
- Asegurar que las rutas de los modelos 3D (`motherboard.glb`) se mantengan bajo `public/models`.
- El HTML base de Vite (`index.html`) apuntará al bundle de React.

---

### 10. Criterios de éxito

- La app se ve bien en **móvil, tablet y escritorio**.
- Existen las 3 rutas `/`, `/motherboard`, `/quiz` funcionando.
- El modelo 3D de la motherboard se puede:
  - Cargar.
  - Rotar.
  - Hacer zoom.
- Hay **al menos 30–40 preguntas** totales, distribuidas en 3 niveles.
- El usuario puede completar un nivel de quiz y ver un resumen claro de resultados.
- El estilo visual es consistente con el diseño moderno de `style.css`.

