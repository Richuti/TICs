import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TRIPO_PART_INFO } from './glb-tripo-parts.js';

/**
 * URLs resueltas por Vite: los modelos no se empaquetan como JS, se sirven como archivos estáticos.
 * Esto mantiene el proyecto alineado con la estructura `/models/motherboard.obj` y `.mtl`.
 */
import motherboardObjUrl from './models/motherboard.obj?url';
import motherboardMtlUrl from './models/motherboard.mtl?url';

/**
 * El GLB puede ser muy pesado; no se importa como módulo para evitar que Vite lo meta al bundle.
 * Colócalo en `public/models/motherboard.glb` (se sirve en `/models/motherboard.glb`).
 */
const motherboardGlbUrl = `${import.meta.env.BASE_URL}models/motherboard.glb`;

/**
 * Textos educativos mostrados en el panel lateral.
 * Claves lógicas (no dependen del nombre exacto de cada sub-malla del OBJ).
 */
/**
 * Diccionario educativo con los 4 campos requeridos:
 * - nombre
 * - qué es
 * - qué hace
 * - por qué es importante
 */
const COMPONENT_INFO = {
  cpu: {
    name: 'CPU (procesador)',
    what: 'Es el chip principal de cómputo del sistema.',
    does: 'Ejecuta instrucciones, procesa datos y coordina tareas con memoria y periféricos.',
    why: 'Determina gran parte del rendimiento general; sin CPU no hay ejecución de software.',
  },
  cpu_socket: {
    name: 'Zócalo de CPU (socket)',
    what: 'Es el conector mecánico/eléctrico donde se instala la CPU.',
    does: 'Alinea y conecta los contactos de la CPU con las pistas de la placa base.',
    why: 'Define compatibilidad (familia/generación) y asegura una conexión estable y segura.',
  },
  ram: {
    name: 'Ranuras de memoria RAM (DIMM)',
    what: 'Son conectores donde se insertan módulos de memoria.',
    does: 'Permiten que la CPU acceda a datos rápidos para programas en ejecución.',
    why: 'Sin RAM el sistema no puede cargar ni mantener procesos; afecta multitarea y velocidad.',
  },
  pci: {
    name: 'Ranuras PCIe',
    what: 'Son ranuras de expansión de alta velocidad.',
    does: 'Conectan tarjetas como GPU, capturadoras, adaptadores NVMe, red, etc.',
    why: 'Amplían capacidades del equipo y aportan ancho de banda para dispositivos exigentes.',
  },
  chipset: {
    name: 'Chipset (PCH)',
    what: 'Es el controlador que gestiona muchas E/S de la placa.',
    does: 'Coordina USB, SATA, audio, líneas PCIe de chipset y otras interfaces.',
    why: 'Aporta conectividad y características; influye en puertos disponibles y compatibilidad.',
  },
  capacitors: {
    name: 'Capacitores (condensadores)',
    what: 'Son componentes pasivos de filtrado y estabilización eléctrica.',
    does: 'Suavizan picos/ruido y ayudan a mantener voltajes estables en distintas líneas.',
    why: 'Mejoran estabilidad del sistema y protegen frente a variaciones que causan fallos.',
  },
  heatsink: {
    name: 'Disipador',
    what: 'Es una pieza (metal) que aumenta el área de transferencia de calor.',
    does: 'Disipa calor de chips como VRM/chipset/M.2 para mantener temperaturas seguras.',
    why: 'Evita throttling y fallos por sobretemperatura; mejora fiabilidad y vida útil.',
  },
  bios_battery: {
    name: 'Batería BIOS/CMOS (CR2032)',
    what: 'Es una batería que alimenta el RTC y mantiene ajustes de firmware.',
    does: 'Conserva hora/fecha y configuración cuando el equipo está apagado/desconectado.',
    why: 'Sin ella pueden perderse ajustes y la hora; ayuda a un arranque consistente.',
  },
  io: {
    name: 'Puertos traseros (Rear I/O)',
    what: 'Es el panel de conectores accesible desde la parte trasera del gabinete.',
    does: 'Provee conexiones USB, red, audio y (según CPU/placa) vídeo integrado.',
    why: 'Es la interfaz principal para periféricos; define conectividad diaria del equipo.',
  },
  vrm: {
    name: 'VRM (regulación de voltaje)',
    what: 'Es el conjunto de fases que convierte y regula energía para la CPU (y a veces RAM).',
    does: 'Entrega voltajes precisos y estables bajo cambios rápidos de carga.',
    why: 'Crítico para estabilidad/temperatura; un VRM débil limita rendimiento y longevidad.',
  },
  power: {
    name: 'Conectores de alimentación',
    what: 'Son conectores desde la fuente (ATX/EPS) hacia la placa.',
    does: 'Suministran energía a la placa y a la CPU con líneas dedicadas.',
    why: 'Sin alimentación correcta el sistema es inestable o no enciende; es un punto crítico.',
  },
};

/** Textos del panel: componentes lógicos (OBJ/hotspots) o piezas nombradas del GLB (`tripo_part_*`). */
function getComponentInfo(componentId) {
  return COMPONENT_INFO[componentId] ?? TRIPO_PART_INFO[componentId] ?? null;
}

/**
 * El OBJ exporta varias sub-mallas con nombres distintos; las agrupamos en “componentes lógicos”
 * para resaltar varias piezas a la vez (por ejemplo, zócalo + área de pines).
 */
const MESH_TO_COMPONENT = {
  CPU: 'cpu',
  CPU_pins: 'cpu',
  RAM_SLOTS: 'ram',
  RAM_SLOTS_b: 'ram',
  PCI_SLOTS: 'pci',
  CHIPSET: 'chipset',
  POWER_CONNECTORS: 'power',
  IO_PORTS: 'io',
};

/**
 * Hotspots normalizados (0..1 en XZ aprox.) para modo `?glb=1` cuando el modelo GLB no trae nombres útiles.
 * Se multiplican por el tamaño del bounding box tras centrar la escena.
 */
/**
 * Hotspots por defecto (aprox.) basados en el diagrama: CPU a la derecha, RAM abajo, PCI a la izquierda, etc.
 *
 * IMPORTANTE:
 * Un GLB puede venir rotado (ejes distintos). Para que siempre coincida, añadimos un modo de calibración:
 * abre `?calibrate=1` y podrás recolocar cada hotspot con un clic; se guarda en `localStorage`.
 */
const DEFAULT_GLB_HOTSPOTS = [
  { id: 'cpu', u: 0.78, v: 0.48, y: 0.18 },
  { id: 'cpu_socket', u: 0.76, v: 0.56, y: 0.12 },
  { id: 'ram', u: 0.62, v: 0.82, y: 0.12 },
  { id: 'pci', u: 0.28, v: 0.56, y: 0.12 },
  { id: 'chipset', u: 0.18, v: 0.74, y: 0.12 },
  { id: 'power', u: 0.88, v: 0.22, y: 0.14 },
  { id: 'io', u: 0.06, v: 0.22, y: 0.28 },
  { id: 'heatsink', u: 0.52, v: 0.30, y: 0.22 },
  { id: 'vrm', u: 0.78, v: 0.30, y: 0.18 },
  { id: 'bios_battery', u: 0.12, v: 0.66, y: 0.12 },
  { id: 'capacitors', u: 0.14, v: 0.26, y: 0.12 },
];

const HOTSPOT_STORAGE_KEY = 'motherboardHotspots.v1';

function loadSavedHotspots() {
  try {
    const raw = localStorage.getItem(HOTSPOT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    // Validación básica: ids presentes y valores en rango.
    const ok = parsed.every(
      (h) =>
        typeof h?.id === 'string' &&
        Number.isFinite(h?.u) &&
        Number.isFinite(h?.v) &&
        Number.isFinite(h?.y) &&
        h.u >= 0 &&
        h.u <= 1 &&
        h.v >= 0 &&
        h.v <= 1,
    );
    return ok ? parsed : null;
  } catch {
    return null;
  }
}

function saveHotspots(hotspots) {
  localStorage.setItem(HOTSPOT_STORAGE_KEY, JSON.stringify(hotspots));
}

const canvas = document.querySelector('#webgl');
const infoPanel = document.querySelector('#info-panel');
const infoTitle = document.querySelector('#info-title');
const infoBody = document.querySelector('#info-body');
const closePanelBtn = document.querySelector('#close-panel');

/**
 * Selección de fuente de modelo:
 * - `?glb=1`: fuerza GLB (tu archivo dado)
 * - `?obj=1`: fuerza OBJ+MTL (requisito del proyecto)
 * - sin query: usa GLB si existe, si no cae a OBJ.
 */
const params = new URLSearchParams(window.location.search);
const forceGlb = params.get('glb') === '1';
const forceObj = params.get('obj') === '1';
const calibrate = params.get('calibrate') === '1';
let runtimeMode = 'obj'; // 'obj' | 'glb' (se decide al arrancar)

/** Raycaster: convierte coordenadas de pantalla en intersecciones 3D. */
const raycaster = new THREE.Raycaster();
/** Vector auxiliar para el unproject del ratón (NDC -1..1). */
const pointer = new THREE.Vector2();

/** Grupo raíz del modelo cargado (OBJ o GLB). */
const modelRoot = new THREE.Group();
/** Hotspots (esferas) solo usados en modo GLB para clicks fiables. */
const hotspotRoot = new THREE.Group();

/** Referencias a mallas resaltables en modo OBJ. */
const highlightTargets = new Map(); // componentId -> Mesh[]
/** Materiales originales guardados para restaurar el resaltado. */
const materialBackup = new WeakMap();

let selectedComponentId = null;

/**
 * “Explode view”: para cada malla guardamos su posición original y un offset local de separación.
 * En el loop animamos `explodeT` hacia `explodeTarget` (0..1) para un movimiento suave.
 */
const explodableMeshes = new Set();
const tmpV3A = new THREE.Vector3();
const tmpV3B = new THREE.Vector3();
const tmpBox = new THREE.Box3();
const modelCenterWorld = new THREE.Vector3();
const EXPLODE_DISTANCE = 1.35; // distancia base (se re-escala automáticamente por tamaño)
const EXPLODE_SMOOTH = 10; // mayor = anima más rápido

/**
 * Escena principal: contiene luces, sombras, el modelo y helpers.
 */
const scene = new THREE.Scene();
// Fondo azul/gris muy claro para que el modelo destaque más.
scene.background = new THREE.Color(0xe3f0ff);
scene.fog = new THREE.Fog(0xe3f0ff, 35, 120);

/**
 * Cámara en perspectiva: campo visual moderado para evitar deformación excesiva en bordes.
 */
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
camera.position.set(18, 14, 22);

/**
 * Renderer WebGL con sombras y límites de pixel ratio para rendimiento en pantallas 4K/retina.
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// Un poco más de exposición global para aclarar el modelo y hacer los colores más vivos.
renderer.toneMappingExposure = 1.5;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/** Reloj de animación: nos da `deltaTime` estable para interpolaciones. */
const clock = new THREE.Clock();

/**
 * Controles orbitales: rotación (izq), pan (der / Mayús+izq), zoom (rueda).
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 8;
controls.maxDistance = 60;
controls.target.set(0, 0, 0);
controls.update();

/**
 * Luz ambiental suave para no dejar zonas completamente negras.
 */
// Luz ambiente afinada a un cielo azul/gris claro para dar más vida y luminosidad general.
const hemi = new THREE.HemisphereLight(0xe3f0ff, 0x3a2830, 1.1);
scene.add(hemi);

/**
 * Luz direccional principal: produce sombras nítidas y define volumen del modelo.
 */
const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(10, 18, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 2;
sun.shadow.camera.far = 60;
sun.shadow.camera.left = -22;
sun.shadow.camera.right = 22;
sun.shadow.camera.top = 22;
sun.shadow.camera.bottom = -22;
sun.shadow.bias = -0.00025;
scene.add(sun);

/** Relleno opuesto cálido para contrapeso de sombras y dar más color a los materiales. */
const fill = new THREE.DirectionalLight(0xffc38a, 0.75);
fill.position.set(-12, 10, -10);
scene.add(fill);

/**
 * Suelo discreto que solo muestra sombras (ShadowMaterial) para un entorno neutro y “realista”.
 */
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  // Sombras suaves para que el suelo claro no se ensucie demasiado.
  new THREE.ShadowMaterial({ opacity: 0.18 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
scene.add(ground);

scene.add(modelRoot);
scene.add(hotspotRoot);

/**
 * Guarda el estado PBR “base” de un material para poder restaurarlo al cambiar de selección.
 */
/** Materiales de una malla (GLB a veces usa varios primitivos = array). */
function meshMaterials(mesh) {
  const raw = mesh.material;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function backupMaterial(mesh) {
  for (const m of meshMaterials(mesh)) {
    if (!m || materialBackup.has(m)) continue;
    materialBackup.set(m, {
      emissive: m.emissive ? m.emissive.clone() : new THREE.Color(0x000000),
      emissiveIntensity: m.emissiveIntensity ?? 0,
      color: m.color ? m.color.clone() : null,
    });
  }
}

/**
 * Aplica un resaltado coherente (emisivo) sin romper el tono general del material.
 */
function applyHighlight(mesh) {
  backupMaterial(mesh);
  for (const m of meshMaterials(mesh)) {
    if (m.emissive) {
      // Resaltado ámbar suave, menos “neón” que el verde anterior.
      m.emissive.set(0xffb347);
      m.emissiveIntensity = Math.max(m.emissiveIntensity ?? 0, 0.9);
    } else if (m.color) {
      m.color.setHex(0xffc480);
    }
  }
}

/** Restaura el material tras quitar selección. */
function clearHighlight(mesh) {
  for (const m of meshMaterials(mesh)) {
    const b = materialBackup.get(m);
    if (!b) continue;
    if (m.emissive) {
      m.emissive.copy(b.emissive);
      m.emissiveIntensity = b.emissiveIntensity;
    }
    if (m.color && b.color) {
      m.color.copy(b.color);
    }
  }
}

/** Quita resaltado de todas las mallas del componente seleccionado previamente. */
function clearSelectionVisuals() {
  if (!selectedComponentId) return;
  const meshes = highlightTargets.get(selectedComponentId);
  if (!meshes) return;
  for (const mesh of meshes) clearHighlight(mesh);
  selectedComponentId = null;
}

/** Resalta todas las mallas asociadas a un componente lógico. */
function highlightComponent(componentId) {
  clearSelectionVisuals();
  selectedComponentId = componentId;
  const meshes = highlightTargets.get(componentId);
  if (!meshes) return;
  for (const mesh of meshes) applyHighlight(mesh);
}

/**
 * Registra una malla como “separable” y calcula su offset de separación en coordenadas locales.
 * Esto permite separar piezas tanto en OBJ (mallas con nombre) como en GLB (mallas agrupadas por proximidad).
 */
function registerExplodeMesh(mesh, worldDir, strength) {
  if (!mesh?.isMesh) return;
  if (mesh.name?.startsWith('HOTSPOT_')) return; // no “explota” el indicador de clic
  if (!mesh.userData.explodeBasePos) mesh.userData.explodeBasePos = mesh.position.clone();
  if (mesh.userData.explodeT == null) mesh.userData.explodeT = 0;
  if (mesh.userData.explodeTarget == null) mesh.userData.explodeTarget = 0;

  // Convertimos una dirección en mundo a un offset local respecto al parent de la malla.
  const parent = mesh.parent ?? mesh;
  mesh.getWorldPosition(tmpV3A);
  tmpV3B.copy(tmpV3A).add(worldDir);
  parent.worldToLocal(tmpV3A);
  parent.worldToLocal(tmpV3B);
  const localDir = tmpV3B.sub(tmpV3A).normalize();

  mesh.userData.explodeOffset = localDir.multiplyScalar(strength);
  explodableMeshes.add(mesh);
}

/** Apunta todas las mallas separables hacia objetivo 0/1 según el componente seleccionado. */
function setExplodeTargets(componentIdOrNull) {
  for (const mesh of explodableMeshes) {
    mesh.userData.explodeTarget = 0;
  }
  if (!componentIdOrNull) return;
  const meshes = highlightTargets.get(componentIdOrNull) ?? [];
  for (const mesh of meshes) {
    if (!mesh?.isMesh) continue;
    if (mesh.name?.startsWith('HOTSPOT_')) continue;
    mesh.userData.explodeTarget = 1;
  }
}

/** Muestra el panel HTML con copy educativa. */
function showInfo(componentId) {
  const data = getComponentInfo(componentId);
  if (!data) return;
  infoTitle.textContent = data.name;
  // Panel con estructura fija para que el contenido sea comparable y educativo.
  infoBody.innerHTML = [
    `<div class="kv"><strong>¿Qué es?</strong><div>${data.what}</div></div>`,
    `<div class="kv"><strong>¿Qué hace?</strong><div>${data.does}</div></div>`,
    `<div class="kv"><strong>¿Por qué es importante?</strong><div>${data.why}</div></div>`,
  ].join('');
  infoPanel.hidden = false;
}

function hideInfo() {
  infoPanel.hidden = true;
}

function fitCameraToObject(root) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Centramos el modelo en el origen para que OrbitControls orbite de forma predecible.
  root.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z, 1e-6);
  const target = 22;
  const s = target / maxDim;
  root.scale.setScalar(s);

  controls.target.set(0, 0, 0);
  camera.near = 0.05;
  camera.far = 200;
  camera.updateProjectionMatrix();
  controls.update();
}

/** Calcula un centro en mundo de una malla (bounding box). */
function meshWorldCenter(mesh, target) {
  tmpBox.setFromObject(mesh);
  return tmpBox.getCenter(target);
}

/**
 * Configura los datos de separación (explode) para un conjunto de mallas ya asociadas a componentes.
 * Se apoya en el centro global del modelo y en el centro de cada componente para sacar una dirección.
 */
function setupExplodeForCurrentTargets() {
  modelRoot.updateMatrixWorld(true);
  tmpBox.setFromObject(modelRoot);
  tmpBox.getCenter(modelCenterWorld);

  const modelSize = tmpBox.getSize(tmpV3A);
  const strength = Math.max(EXPLODE_DISTANCE, modelSize.length() * 0.06);

  for (const [componentId, meshes] of highlightTargets.entries()) {
    // Para el modo GLB, `highlightTargets` también incluye la esfera hotspot; la ignoramos al calcular centros.
    const centers = [];
    for (const m of meshes) {
      if (!m?.isMesh) continue;
      if (m.name?.startsWith('HOTSPOT_')) continue;
      centers.push(meshWorldCenter(m, new THREE.Vector3()).clone());
    }
    if (centers.length === 0) continue;

    const compCenter = centers.reduce((acc, v) => acc.add(v), new THREE.Vector3()).multiplyScalar(1 / centers.length);
    const dir = compCenter.sub(modelCenterWorld).normalize().add(new THREE.Vector3(0, 0.35, 0)).normalize();

    for (const m of meshes) registerExplodeMesh(m, dir, strength);
  }
}

/**
 * Carga OBJ+MTL (requisito principal): MTLLoader resuelve materiales, OBJLoader aplica esos materiales a la geometría.
 */
async function loadObjMotherboard() {
  const mtlLoader = new MTLLoader();
  /**
   * `setPath` define la carpeta donde MTLLoader busca texturas referenciadas por el .mtl.
   * Usamos el directorio del propio `.mtl` resuelto por Vite (URL absoluta en dev).
   */
  const mtlFolder = motherboardMtlUrl.replace(/[^/]+$/, '');
  mtlLoader.setPath(mtlFolder);

  const materials = await mtlLoader.loadAsync(motherboardMtlUrl);
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);

  const obj = await objLoader.loadAsync(motherboardObjUrl);
  obj.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;

    const comp = MESH_TO_COMPONENT[child.name];
    if (!comp) return;
    if (!highlightTargets.has(comp)) highlightTargets.set(comp, []);
    highlightTargets.get(comp).push(child);
  });

  modelRoot.add(obj);
}

/**
 * Carga GLB opcional (`?glb=1`) para usar el modelo escaneado del usuario sin convertir a OBJ.
 * Los hotspots se colocan con coordenadas normalizadas sobre el bounding box.
 */
async function loadGlbMotherboard() {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(motherboardGlbUrl);
  const root = gltf.scene;
  root.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
  });
  modelRoot.add(root);

  // Esperamos un frame para que las matrices del GLB queden coherentes antes de medir el modelo.
  await new Promise((resolve) => requestAnimationFrame(resolve));

  fitCameraToObject(modelRoot);

  const box = new THREE.Box3().setFromObject(modelRoot);
  const size = box.getSize(new THREE.Vector3());
  const min = box.min.clone();

  const hotspotMat = new THREE.MeshStandardMaterial({
    // Coincidimos el color del hotspot con el resaltado ámbar del objeto seleccionado.
    color: 0xffb347,
    emissive: 0x402513,
    emissiveIntensity: 0.45,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });

  const saved = loadSavedHotspots();
  const hotspots = saved ?? DEFAULT_GLB_HOTSPOTS;

  for (const h of hotspots) {
    const geo = new THREE.SphereGeometry(0.55, 18, 18);
    const mesh = new THREE.Mesh(geo, hotspotMat.clone());
    mesh.name = `HOTSPOT_${h.id}`;
    mesh.userData.componentId = h.id;

    mesh.position.set(min.x + size.x * h.u, min.y + size.y * h.y, min.z + size.z * h.v);
    hotspotRoot.add(mesh);

    if (!highlightTargets.has(h.id)) highlightTargets.set(h.id, []);
    highlightTargets.get(h.id).push(mesh);
  }

  /**
   * Asignación de “partes” para GLB:
   * Si el GLB no trae nombres por componente, agrupamos mallas cercanas a cada hotspot.
   * Esto habilita resaltar/separar piezas reales del modelo.
   */
  modelRoot.updateMatrixWorld(true);
  tmpBox.setFromObject(modelRoot);
  tmpBox.getCenter(modelCenterWorld);
  const modelSize = tmpBox.getSize(tmpV3A);

  const glbMeshes = [];
  modelRoot.traverse((child) => {
    if (!child?.isMesh) return;
    glbMeshes.push(child);
  });

  /** GLB “Tripo”: el nombre útil suele estar en el nodo padre (`tripo_part_N`). */
  const glbTripoPartId = (mesh) => {
    if (/^tripo_part_\d+$/.test(mesh.name)) return mesh.name;
    let p = mesh.parent;
    while (p && p !== modelRoot) {
      if (/^tripo_part_\d+$/.test(p.name)) return p.name;
      p = p.parent;
    }
    return null;
  };

  const hasTripoParts = glbMeshes.some((m) => glbTripoPartId(m));

  const hotspotWorld = new THREE.Vector3();
  const hotspotCenters = [];
  for (const hs of hotspotRoot.children) {
    const componentId = hs.userData.componentId;
    if (!componentId) continue;
    hs.getWorldPosition(hotspotWorld);
    hotspotCenters.push({ id: componentId, pos: hotspotWorld.clone() });
  }

  if (hasTripoParts) {
    const byPart = new Map();
    for (const m of glbMeshes) {
      const id = glbTripoPartId(m);
      if (!id) continue;
      m.userData.componentId = id;
      if (!byPart.has(id)) byPart.set(id, []);
      byPart.get(id).push(m);
    }
    for (const [id, meshes] of byPart) {
      highlightTargets.set(id, meshes);
    }
  } else {
    /**
     * Etiquetado por proximidad (mesh -> componentId):
     * Cada malla va al hotspot más cercano a su centro (sin límite de radio).
     * Con una sola malla grande (GLB fusionado), un radio pequeño dejaba `componentId` vacío y el clic no hacía nada.
     */
    const scratch = new THREE.Vector3();
    for (const m of glbMeshes) {
      const c = meshWorldCenter(m, scratch);
      let best = null;
      for (const h of hotspotCenters) {
        const d = c.distanceTo(h.pos);
        if (!best || d < best.d) best = { id: h.id, d };
      }
      if (best && hotspotCenters.length) {
        m.userData.componentId = best.id;
        if (!highlightTargets.has(best.id)) highlightTargets.set(best.id, []);
        highlightTargets.get(best.id).push(m);
      }
    }
  }

  // Con targets ya armados, calculamos offsets de separación para el explode view.
  setupExplodeForCurrentTargets();
}

/**
 * Comprueba si un recurso existe sin descargarlo entero (HEAD).
 * Algunos servidores no soportan HEAD; si falla, intentamos un GET corto.
 */
async function urlExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    try {
      const res = await fetch(url, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Render loop: `controls.update()` es necesario cuando `enableDamping` está activo.
 */
function tick() {
  requestAnimationFrame(tick);
  controls.update();

  // Animación del “explode view”: movemos mallas hacia/desde su offset.
  const dt = Math.min(clock.getDelta(), 1 / 20);
  const k = 1 - Math.exp(-EXPLODE_SMOOTH * dt);
  for (const mesh of explodableMeshes) {
    const base = mesh.userData.explodeBasePos;
    const off = mesh.userData.explodeOffset;
    if (!base || !off) continue;
    const target = mesh.userData.explodeTarget ?? 0;
    mesh.userData.explodeT = THREE.MathUtils.lerp(mesh.userData.explodeT ?? 0, target, k);
    mesh.position.copy(base).addScaledVector(off, mesh.userData.explodeT);
  }

  renderer.render(scene, camera);
}

/**
 * Resize responsivo: ajusta cámara y tamaño del canvas al contenedor.
 */
function onResize() {
  const parent = canvas.parentElement;
  const w = parent.clientWidth;
  const h = parent.clientHeight;
  camera.aspect = w / Math.max(h, 1);
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onResize);

/**
 * Click “limpio”: si el puntero se movió poco entre down/up, tratamos el gesto como selección (no como orbit).
 */
let down = { x: 0, y: 0 };
canvas.addEventListener('pointerdown', (e) => {
  down.x = e.clientX;
  down.y = e.clientY;
});

canvas.addEventListener('pointerup', (e) => {
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  if (moved > 5) return;

  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

  raycaster.setFromCamera(pointer, camera);

  const list = [];
  hotspotRoot.updateMatrixWorld(true);
  modelRoot.updateMatrixWorld(true);

  if (runtimeMode === 'glb') {
    // Siempre permitimos seleccionar por malla real (si está etiquetada), y dejamos hotspots como fallback.
    list.push(...raycaster.intersectObjects([modelRoot], true));
    list.push(...raycaster.intersectObjects(hotspotRoot.children, false));
  } else {
    // `true` recorre recursivamente el Group devuelto por OBJLoader (mallas anidadas).
    list.push(...raycaster.intersectObjects([modelRoot], true));
  }

  const hit = list[0];
  if (!hit) {
    clearSelectionVisuals();
    setExplodeTargets(null);
    hideInfo();
    return;
  }

  let componentId = null;
  if (runtimeMode === 'glb') {
    // Si el usuario clicó un hotspot, seleccionamos componente.
    if (hit.object?.name?.startsWith('HOTSPOT_')) {
      componentId = hit.object.userData.componentId ?? null;
    } else if (calibrate) {
      // Si clicó en la malla del GLB en modo calibración, movemos el hotspot activo.
      const activeId = localStorage.getItem('motherboardHotspots.activeId') ?? 'cpu';
      const hs = hotspotRoot.children.find((h) => h.userData.componentId === activeId);
      if (hs) {
        hs.position.copy(hit.point);
        // Guardamos como coordenadas normalizadas dentro del bounding box actual.
        const box = new THREE.Box3().setFromObject(modelRoot);
        const size = box.getSize(new THREE.Vector3());
        const min = box.min.clone();
        const u = size.x > 1e-6 ? (hs.position.x - min.x) / size.x : 0.5;
        const v = size.z > 1e-6 ? (hs.position.z - min.z) / size.z : 0.5;
        const y = size.y > 1e-6 ? (hs.position.y - min.y) / size.y : 0.1;

        const current = loadSavedHotspots() ?? DEFAULT_GLB_HOTSPOTS.map((h) => ({ ...h }));
        const idx = current.findIndex((h) => h.id === activeId);
        const next = { id: activeId, u: THREE.MathUtils.clamp(u, 0, 1), v: THREE.MathUtils.clamp(v, 0, 1), y };
        if (idx >= 0) current[idx] = next;
        else current.push(next);
        saveHotspots(current);

        infoPanel.hidden = false;
        infoTitle.textContent = 'Calibración';
        infoBody.textContent = `Hotspot “${activeId}” guardado. Cambia el hotspot activo con teclas 1–0 y sigue clicando sobre el modelo.`;
      }
      return;
    } else {
      // Clic sobre una malla del GLB: usamos etiqueta por proximidad (si existe).
      componentId = hit.object.userData.componentId ?? null;
    }
  } else {
    const name = hit.object.name;
    componentId = MESH_TO_COMPONENT[name] ?? null;
    if (name === 'PCB' || !componentId) {
      clearSelectionVisuals();
      hideInfo();
      return;
    }
  }

  if (!componentId || !getComponentInfo(componentId)) {
    clearSelectionVisuals();
    hideInfo();
    return;
  }

  highlightComponent(componentId);
  showInfo(componentId);
});

closePanelBtn.addEventListener('click', () => {
  hideInfo();
});

/**
 * Atajos de calibración (solo en `?calibrate=1`):
 * - Teclas 1..0 cambian el hotspot activo (cpu, ram, pci, chipset, power, io, heatsink, vrm, bios, capacitors).
 * - Tecla Backspace borra calibración guardada.
 */
window.addEventListener('keydown', (e) => {
  if (!calibrate || runtimeMode !== 'glb') return;
  const order = [
    'cpu',
    'cpu_socket',
    'ram',
    'pci',
    'chipset',
    'power',
    'io',
    'heatsink',
    'vrm',
    'bios_battery',
    'capacitors',
  ];
  const map = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5, Digit7: 6, Digit8: 7, Digit9: 8, Digit0: 9 };
  if (e.code in map) {
    const id = order[map[e.code]];
    localStorage.setItem('motherboardHotspots.activeId', id);
    infoPanel.hidden = false;
    infoTitle.textContent = 'Calibración';
    infoBody.textContent = `Hotspot activo: “${id}”. Ahora haz clic sobre ese componente en el modelo.`;
  }
  if (e.code === 'Backspace') {
    localStorage.removeItem(HOTSPOT_STORAGE_KEY);
    infoPanel.hidden = false;
    infoTitle.textContent = 'Calibración';
    infoBody.textContent = 'Calibración borrada. Recarga la página para volver a los valores por defecto.';
  }
});

/** Arranque: elegimos loader según querystring y ajustamos escena. */
(async () => {
  onResize();
  try {
    // Decisión de modo en orden de prioridad: fuerza > auto-detección.
    if (forceObj) {
      runtimeMode = 'obj';
      await loadObjMotherboard();
      fitCameraToObject(modelRoot);
      setupExplodeForCurrentTargets();
    } else if (forceGlb) {
      runtimeMode = 'glb';
      await loadGlbMotherboard();
    } else {
      const hasGlb = await urlExists(motherboardGlbUrl);
      if (hasGlb) {
        runtimeMode = 'glb';
        await loadGlbMotherboard();
      } else {
        runtimeMode = 'obj';
        await loadObjMotherboard();
        fitCameraToObject(modelRoot);
        setupExplodeForCurrentTargets();
      }
    }
  } catch (err) {
    // Mensaje visible si falta el archivo o hay error de red en dev server
    // eslint-disable-next-line no-console
    console.error(err);
    hideInfo();
    infoPanel.hidden = false;
    infoTitle.textContent = 'No se pudo cargar el modelo';
    infoBody.textContent =
      'Verifica que existan `models/motherboard.obj` y `models/motherboard.mtl`. ' +
      'Para usar tu GLB, coloca `public/models/motherboard.glb` y abre con `?glb=1` (o sin query si existe).';
  }

  tick();
})();
