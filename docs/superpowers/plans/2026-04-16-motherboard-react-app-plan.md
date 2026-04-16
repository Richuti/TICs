# Motherboard React App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una SPA en React (sobre el proyecto existente en `project/`) con tres pantallas (`/`, `/motherboard`, `/quiz`) para aprender sobre motherboards con visor 3D y quizzes por niveles, reutilizando el CSS actual.

**Architecture:** Partiremos del bundle Vite ya existente (`vite.config.js`, `index.html`, `main.js`) y migraremos gradualmente a una estructura React modular con React Router y componentes separados para landing, página de motherboard y página de quizzes. Mantendremos los modelos 3D y archivos de estilo (`style.css`, `viewer.css`) reutilizando las clases existentes donde sea posible.

**Tech Stack:** React, ReactDOM, React Router DOM, Vite, @react-three/fiber, @react-three/drei, JavaScript (sin TypeScript en esta primera versión).

---

### Task 1: Preparar estructura React básica y entrypoint

**Files:**
- Create: `project/src/main.jsx`
- Create: `project/src/App.jsx`
- Modify: `project/index.html`

- [ ] **Step 1: Instalar dependencias React y Router (si hace falta)**

```bash
cd project
npm install react react-dom react-router-dom
```

- [ ] **Step 2: Crear `src/main.jsx` como punto de entrada de React**

```jsx
// project/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "../style.css";
import "../viewer.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 3: Crear `src/App.jsx` con un layout mínimo**

```jsx
// project/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MotherboardPage from "./pages/MotherboardPage";
import QuizPage from "./pages/QuizPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <a href="#main" className="skip">
        Saltar al contenido principal
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/motherboard" element={<MotherboardPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
```

- [ ] **Step 4: Actualizar `index.html` para que use React en vez de script plano**

```html
<!-- project/index.html -->
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>TICs · Motherboard Lab</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
  </html>
```

- [ ] **Step 5: Ejecutar dev server y verificar que carga React sin errores**

```bash
cd project
npm run dev
```

Esperado: Página en blanco o con error leve de componentes no encontrados, pero bundling React funcionando sin errores de Vite.

---

### Task 2: Crear componentes de layout (`Header`, `Footer`) y estructura base de páginas

**Files:**
- Create: `project/src/components/Header.jsx`
- Create: `project/src/components/Footer.jsx`
- Create: `project/src/pages/LandingPage.jsx`
- Create: `project/src/pages/MotherboardPage.jsx`
- Create: `project/src/pages/QuizPage.jsx`

- [ ] **Step 1: Crear `Header.jsx` reutilizando clases de cabecera existentes**

```jsx
// project/src/components/Header.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="shell">
      <div className="shell__inner">
        <Link to="/" className="mark">
          <span className="mark__orb" />
          <span>TICs · Motherboard Lab</span>
        </Link>
        <nav className="nav" aria-label="Navegación principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/motherboard">Motherboard</NavLink>
          <NavLink to="/quiz">Quizzes</NavLink>
        </nav>
        <Link to="/motherboard" className="btn btn--solid btn--lg">
          Empezar ahora
        </Link>
      </div>
    </header>
  );
}

export default Header;
```

- [ ] **Step 2: Crear `Footer.jsx` reutilizando estilos de pie**

```jsx
// project/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__inner">
        <p className="foot__copy">
          © {new Date().getFullYear()} TICs · Motherboard Lab. Todos los derechos reservados.
        </p>
        <nav className="foot__nav" aria-label="Navegación de pie de página">
          <Link to="/">Inicio</Link>
          <Link to="/motherboard">Motherboard</Link>
          <Link to="/quiz">Quizzes</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
```

- [ ] **Step 3: Crear `LandingPage.jsx` con secciones básicas (placeholders)**

```jsx
// project/src/pages/LandingPage.jsx
import React from "react";

function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="hero__bg" />
        <div className="wrap hero__grid">
          <div>
            <p className="kicker">Arquitectura de Computadoras</p>
            <h1 className="hero__title">
              Aprende la <span className="hero__accent">motherboard</span> de forma interactiva.
            </h1>
            <p className="hero__lead">
              Explora un modelo 3D realista, entiende cada componente clave y pon a prueba tus
              conocimientos con quizzes diseñados para estudiantes universitarios y técnicos.
            </p>
            <div className="hero__cta">
              <a href="/motherboard" className="btn btn--solid btn--lg">
                Explorar motherboard
              </a>
              <a href="/quiz" className="btn btn--line btn--lg">
                Ir a los quizzes
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--light">
        <div className="wrap">
          <h2 className="section__title">Qué aprenderás</h2>
          <p className="section__lede">
            Identificación de componentes, flujo de datos, buses, puertos de expansión y diagnóstico
            básico de fallas en placas base modernas.
          </p>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
```

- [ ] **Step 4: Crear `MotherboardPage.jsx` y `QuizPage.jsx` como placeholders iniciales**

```jsx
// project/src/pages/MotherboardPage.jsx
import React from "react";

function MotherboardPage() {
  return (
    <section className="section section--dark">
      <div className="wrap">
        <p className="kicker">Exploración guiada</p>
        <h1 className="section__title">Todo sobre la Motherboard</h1>
        <p className="section__lede">
          Aquí integraremos el visor 3D de la placa y paneles de información detallada sobre cada componente.
        </p>
      </div>
    </section>
  );
}

export default MotherboardPage;
```

```jsx
// project/src/pages/QuizPage.jsx
import React from "react";

function QuizPage() {
  return (
    <section className="section section--quiz">
      <div className="wrap">
        <p className="kicker kicker--dark">Evalúa tus conocimientos</p>
        <h1 className="section__title">Quizzes sobre Motherboard</h1>
        <p className="section__lede">
          Aquí añadiremos quizzes por niveles (básico, intermedio, avanzado) con feedback inmediato y estadísticas.
        </p>
      </div>
    </section>
  );
}

export default QuizPage;
```

- [ ] **Step 5: Verificar en el navegador que las tres rutas existen y navegan sin romper estilos**

Esperado: Header y footer visibles; contenido de cada ruta mostrado con estilos de `style.css`.

---

### Task 3: Definir datos de motherboard y quizzes

**Files:**
- Create: `project/src/data/motherboardParts.js`
- Create: `project/src/data/quizzes.js`

- [ ] **Step 1: Crear `motherboardParts.js` con datos de componentes**

```js
// project/src/data/motherboardParts.js
export const motherboardParts = [
  {
    id: "cpu-socket",
    name: "Socket de CPU",
    summary: "Punto de conexión física entre el procesador y la placa base.",
    description:
      "El socket determina la compatibilidad entre la CPU y la motherboard. Define el número de pines/contactos, el tipo de CPU soportada y, en muchos casos, el tipo de chipset disponible.",
  },
  {
    id: "chipset",
    name: "Chipset",
    summary: "Controla la comunicación entre CPU, memoria, almacenamiento y periféricos.",
    description:
      "El chipset actúa como 'coordinador' del tráfico de datos dentro de la motherboard. Define cuántas líneas PCIe están disponibles, tipos de almacenamiento soportados y características como overclocking o soporte multi-GPU.",
  },
  {
    id: "ram-slots",
    name: "Slots de RAM",
    summary: "Conectores para módulos de memoria principal del sistema.",
    description:
      "Los slots de RAM se organizan en canales (single, dual, quad). Su configuración influye en el ancho de banda disponible para la CPU. Es importante respetar compatibilidad de tipo (DDR3/DDR4/DDR5) y frecuencias soportadas.",
  },
  {
    id: "pcie-slots",
    name: "Slots PCI Express",
    summary: "Puertos de expansión de alta velocidad para GPU y tarjetas adicionales.",
    description:
      "Los slots PCIe se diferencian por longitud (x1, x4, x8, x16) y por versión (2.0, 3.0, 4.0, 5.0). Cada combinación determina el ancho de banda disponible para dispositivos como GPUs, tarjetas de red, NVMe adicionales, etc.",
  },
  {
    id: "sata-ports",
    name: "Puertos SATA",
    summary: "Conectores para unidades de almacenamiento como HDD y SSD SATA.",
    description:
      "Aunque los NVMe han ganado protagonismo, los puertos SATA siguen siendo clave para almacenamiento masivo y económico. Suelen estar gestionados por el chipset y, en algunos casos, comparten líneas con puertos M.2.",
  },
  {
    id: "vrm",
    name: "VRM (Módulo Regulador de Voltaje)",
    summary: "Regula y estabiliza el voltaje entregado a la CPU y otros componentes.",
    description:
      "Un VRM de buena calidad es fundamental para la estabilidad del sistema, especialmente bajo carga alta u overclocking. Se compone de fases de alimentación, MOSFETs, chokes y condensadores.",
  },
];
```

- [ ] **Step 2: Crear `quizzes.js` con bancos de preguntas por nivel**

```js
// project/src/data/quizzes.js
export const quizLevels = {
  basic: {
    id: "basic",
    label: "Básico",
    description: "Identificación de componentes y funciones fundamentales.",
    questions: [
      {
        id: "b1",
        question: "¿Cuál es la función principal de la motherboard?",
        type: "single",
        options: [
          "Proveer energía a la fuente de poder.",
          "Conectar y permitir la comunicación entre todos los componentes principales del sistema.",
          "Almacenar permanentemente el sistema operativo.",
          "Aumentar la velocidad del procesador.",
        ],
        correctIndex: 1,
        explanation:
          "La motherboard actúa como plataforma de interconexión entre CPU, RAM, almacenamiento, GPU y periféricos.",
      },
      {
        id: "b2",
        question: "¿Qué componente se inserta en el socket de CPU?",
        type: "single",
        options: ["Memoria RAM", "Procesador", "Disco duro", "Tarjeta gráfica"],
        correctIndex: 1,
        explanation: "El procesador (CPU) se instala en el socket específico de la motherboard.",
      },
    ],
  },
  intermediate: {
    id: "intermediate",
    label: "Intermedio",
    description: "Relaciones entre componentes, buses y compatibilidad.",
    questions: [
      {
        id: "i1",
        question:
          "Instalas una CPU compatible con el socket pero la motherboard no arranca. ¿Cuál de las siguientes causas relacionadas con el chipset es más razonable?",
        type: "single",
        options: [
          "El chipset no soporta la generación específica de esa CPU.",
          "Los puertos SATA están dañados.",
          "La caja no es del tamaño adecuado.",
          "Los ventiladores del gabinete son muy pequeños.",
        ],
        correctIndex: 0,
        explanation:
          "Además del socket, el chipset debe soportar la generación de CPU. En muchos casos se requiere actualización de BIOS.",
      },
    ],
  },
  advanced: {
    id: "advanced",
    label: "Avanzado",
    description: "Escenarios de diagnóstico, cuellos de botella y rendimiento.",
    questions: [
      {
        id: "a1",
        question:
          "Un equipo con una GPU PCIe 4.0 x16 se instala en una motherboard con slot físico x16 pero eléctrico x8. ¿Qué impacto principal tendrá?",
        type: "single",
        options: [
          "La GPU no encenderá en absoluto.",
          "La GPU funcionará, pero con menor ancho de banda disponible.",
          "La GPU quedará limitada a PCIe 2.0.",
          "No habrá ningún impacto, ya que la longitud física es lo único que importa.",
        ],
        correctIndex: 1,
        explanation:
          "El número de líneas eléctricas activas (x8 vs x16) determina el ancho de banda efectivo. En muchas GPUs el impacto real es moderado, pero existe.",
      },
    ],
  },
};
```

- [ ] **Step 3: Verificar que los módulos se importan sin errores en una prueba rápida (por ejemplo, importarlos en `QuizPage` sin usarlos aún)**

Esperado: Compilación exitosa, sin errores de módulo.

---

### Task 4: Implementar visor 3D de motherboard en React

**Files:**
- Create: `project/src/components/Motherboard3DViewer.jsx`
- Modify: `project/src/pages/MotherboardPage.jsx`
- Ensure: `motherboard.glb` sigue en `project/public/models/motherboard.glb`

- [ ] **Step 1: Instalar dependencias de React Three Fiber y Drei**

```bash
cd project
npm install @react-three/fiber @react-three/drei three
```

- [ ] **Step 2: Crear `Motherboard3DViewer.jsx` que carga el modelo GLB**

```jsx
// project/src/components/Motherboard3DViewer.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

function MotherboardModel(props) {
  const { scene } = useGLTF("/models/motherboard.glb");
  return <primitive object={scene} {...props} />;
}

function Motherboard3DViewer() {
  return (
    <div className="viewer-root" aria-label="Visor 3D de motherboard">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.1} />
        <Suspense fallback={null}>
          <MotherboardModel />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}

export default Motherboard3DViewer;
```

- [ ] **Step 3: Integrar el visor en `MotherboardPage.jsx` con layout de dos columnas**

```jsx
// project/src/pages/MotherboardPage.jsx
import React from "react";
import Motherboard3DViewer from "../components/Motherboard3DViewer";
import { motherboardParts } from "../data/motherboardParts";

function MotherboardPage() {
  return (
    <section className="section section--dark">
      <div className="wrap">
        <div className="section__head section__head--on-dark">
          <p className="kicker">Exploración guiada</p>
          <h1 className="section__title">Todo sobre la Motherboard</h1>
          <p className="section__lede">
            Explora el modelo 3D y repasa la función de cada componente clave de la placa base.
          </p>
        </div>
        <div className="quiz-layout">
          <div>
            <Motherboard3DViewer />
          </div>
          <aside>
            <h2>Componentes principales</h2>
            <ul>
              {motherboardParts.map((part) => (
                <li key={part.id}>
                  <strong>{part.name}</strong>
                  <p>{part.summary}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default MotherboardPage;
```

- [ ] **Step 4: Ajustar estilos si es necesario usando clases existentes (`quiz-layout`, `viewer-root`, etc.)**

Si `viewer.css` ya define una clase raíz para el visor, reutilizarla en el `div` del Canvas.

- [ ] **Step 5: Abrir `/motherboard` en el navegador y confirmar que el modelo se carga, se puede rotar y hacer zoom**

Esperado: Modelo visible, controles de cámara funcionando, sin errores graves en consola.

---

### Task 5: Implementar motor de quizzes y UI en `QuizPage`

**Files:**
- Create: `project/src/components/QuizEngine.jsx`
- Modify: `project/src/pages/QuizPage.jsx`

- [ ] **Step 1: Crear `QuizEngine.jsx` que reciba nivel y preguntas**

```jsx
// project/src/components/QuizEngine.jsx
import React, { useState } from "react";

function QuizEngine({ level }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const questions = level.questions;
  const current = questions[currentIndex];

  const handleOptionChange = (optionIndex) => {
    setAnswers({
      ...answers,
      [current.id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!questions || questions.length === 0) {
    return <p>No hay preguntas definidas para este nivel.</p>;
  }

  if (showResult) {
    const total = questions.length;
    const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const percent = Math.round((correct / total) * 100);

    return (
      <div className="quiz-card">
        <h2>Resultados</h2>
        <p>
          Has acertado {correct} de {total} preguntas ({percent}%).
        </p>
        <p>
          Te recomendamos repasar la sección de motherboard para reforzar los puntos donde
          fallaste, especialmente conceptos de compatibilidad y flujo de datos.
        </p>
      </div>
    );
  }

  return (
    <article className="quiz-card">
      <p>
        Pregunta {currentIndex + 1} de {questions.length}
      </p>
      <fieldset className="q">
        <legend>{current.question}</legend>
        {current.options.map((opt, index) => (
          <label key={index}>
            <input
              type="radio"
              name={current.id}
              checked={answers[current.id] === index}
              onChange={() => handleOptionChange(index)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </fieldset>
      <div className="quiz-card__foot">
        <button
          type="button"
          className="btn btn--solid"
          onClick={handleNext}
          disabled={typeof answers[current.id] === "undefined"}
        >
          {currentIndex + 1 === questions.length ? "Ver resultados" : "Siguiente"}
        </button>
      </div>
    </article>
  );
}

export default QuizEngine;
```

- [ ] **Step 2: Usar `QuizEngine` en `QuizPage.jsx` con selector de nivel**

```jsx
// project/src/pages/QuizPage.jsx
import React, { useState } from "react";
import { quizLevels } from "../data/quizzes";
import QuizEngine from "../components/QuizEngine";

function QuizPage() {
  const [selectedLevelId, setSelectedLevelId] = useState("basic");
  const level = quizLevels[selectedLevelId];

  return (
    <section className="section section--quiz">
      <div className="wrap">
        <div className="section__head">
          <p className="kicker kicker--dark">Evalúa tus conocimientos</p>
          <h1 className="section__title">Quizzes sobre Motherboard</h1>
          <p className="section__lede">
            Escoge un nivel y responde a las preguntas para medir tu comprensión de la arquitectura
            y los componentes de la placa base.
          </p>
        </div>
        <div className="quiz-layout">
          <aside>
            <h2>Niveles</h2>
            <div className="quiz-levels">
              {Object.values(quizLevels).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  className={
                    "btn btn--line" + (lvl.id === selectedLevelId ? " btn--solid" : "")
                  }
                  onClick={() => setSelectedLevelId(lvl.id)}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
            <p className="section__lede">{level.description}</p>
          </aside>
          <div>
            <QuizEngine level={level} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuizPage;
```

- [ ] **Step 3: Probar los tres niveles y confirmar que el flujo de preguntas y resultados funciona**

Esperado: Selección de nivel cambia las preguntas; se puede avanzar y ver resumen de resultados sin errores.

---

### Task 6: Pulido visual, responsivo y limpieza

**Files:**
- Modify: `project/style.css` (solo si es necesario añadir clases menores)
- Modify: `project/viewer.css` (asegurar que el contenedor del Canvas se ve bien)

- [ ] **Step 1: Revisar en móviles y tablet (herramientas dev)**

Verificar:
- Header y footer se ven correctos.
- Layout de `/motherboard` y `/quiz` colapsa a una columna sin desbordes.

- [ ] **Step 2: Ajustar cualquier clase necesaria en `style.css`/`viewer.css`**

Si hace falta, añadir:
- Clase `.viewer-root` con altura mínima razonable.
- Ajustes menores de márgenes/gaps.

- [ ] **Step 3: Ejecutar `npm run build` para asegurar que el bundle compila sin errores**

```bash
cd project
npm run build
```

Esperado: Build exitoso sin errores.

---

### Plan Self-Review vs Spec

- Landing con hero, secciones de “qué aprenderás” y presentación: cubierta en Tasks 1–2.
- Pantalla `/motherboard` con visor 3D y lista de componentes: cubierta en Task 4.
- Pantalla `/quiz` con niveles y resultados: cubierta en Task 5.
- Responsivo y pulido visual: Task 6.

