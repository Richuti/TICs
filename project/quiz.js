/**
 * Quiz progresivo: banco de preguntas, selección aleatoria de 10
 * y flujo de una pregunta a la vez con nota final.
 */
const TOTAL_QUESTIONS = 10;

/**
 * Banco de preguntas.
 * Cada entrada: { text, options: [{value, label}], correct, explanation }
 */
const QUESTION_BANK = [
  {
    text: '¿Qué bloque regula el voltaje hacia la CPU con precisión?',
    options: [
      { value: 'cpu', label: 'La CPU' },
      { value: 'vrm', label: 'El VRM' },
      { value: 'ram', label: 'La RAM' },
    ],
    correct: 'vrm',
    explanation:
      'El VRM (Voltage Regulator Module) adapta y estabiliza el voltaje que llega desde la fuente para que la CPU reciba exactamente lo que necesita.',
  },
  {
    text: '¿Dónde suele ir una GPU dedicada de tamaño estándar?',
    options: [
      { value: 'pci16', label: 'Ranura PCIe larga (×16)' },
      { value: 'sata', label: 'Puerto SATA' },
      { value: 'm2', label: 'Ranura M.2' },
    ],
    correct: 'pci16',
    explanation:
      'Las tarjetas gráficas dedicadas de tamaño estándar se instalan en la ranura PCI Express ×16, la más larga.',
  },
  {
    text: '¿Qué mantiene muchas veces la batería CMOS?',
    options: [
      { value: 'hora', label: 'Hora y ajustes básicos de BIOS' },
      { value: 'gpu', label: 'Energía extra para la GPU' },
      { value: 'audio', label: 'Calidad de audio integrado' },
    ],
    correct: 'hora',
    explanation:
      'La pila CMOS mantiene la configuración básica de la BIOS/UEFI, como la hora y algunos parámetros de arranque.',
  },
  {
    text: '¿Qué ranura se usa típicamente para tarjetas de sonido o red dedicadas?',
    options: [
      { value: 'pcix1', label: 'Ranura PCIe corta (×1)' },
      { value: 'pcix16', label: 'Ranura PCIe larga (×16)' },
      { value: 'sata', label: 'Puerto SATA' },
    ],
    correct: 'pcix1',
    explanation:
      'Las tarjetas de sonido o red suelen usar ranuras PCIe cortas (×1), suficientes para su ancho de banda.',
  },
  {
    text: '¿Qué conector de la placa se usa para unidades HDD/SSD de 2,5" o 3,5"?',
    options: [
      { value: 'sata', label: 'Conector SATA' },
      { value: 'molex', label: 'Conector Molex' },
      { value: 'usb', label: 'Puerto USB' },
    ],
    correct: 'sata',
    explanation:
      'Los discos duros y SSD de 2,5"/3,5" se conectan a la placa mediante puertos SATA de datos.',
  },
  {
    text: '¿Qué tipo de ranura M.2 se usa habitualmente para SSD NVMe?',
    options: [
      { value: 'm2nvme', label: 'M.2 con soporte NVMe (PCIe)' },
      { value: 'm2sata', label: 'M.2 solo SATA' },
      { value: 'm2wifi', label: 'M.2 solo WiFi' },
    ],
    correct: 'm2nvme',
    explanation:
      'Los SSD NVMe usan ranuras M.2 conectadas por líneas PCIe, lo que les da mucha más velocidad que SATA.',
  },
  {
    text: '¿Qué componente se instala directamente en el zócalo (socket) de la placa base?',
    options: [
      { value: 'cpu', label: 'La CPU' },
      { value: 'ram', label: 'Los módulos de RAM' },
      { value: 'gpu', label: 'La GPU dedicada' },
    ],
    correct: 'cpu',
    explanation:
      'La CPU se inserta directamente en el zócalo de la placa base, donde hace contacto con los pines o pads.',
  },
  {
    text: '¿Qué tipo de conector alimenta al propio procesador desde la fuente?',
    options: [
      { value: 'eps', label: 'Conector EPS/CPU de 8 pines' },
      { value: 'pcie', label: 'Conector PCIe de 8 pines' },
      { value: 'sata', label: 'Conector de alimentación SATA' },
    ],
    correct: 'eps',
    explanation:
      'El conector EPS/CPU de 8 pines lleva la energía específica que la CPU necesita para funcionar de forma estable.',
  },
  {
    text: '¿Qué ranuras se usan para instalar módulos de memoria RAM?',
    options: [
      { value: 'dimms', label: 'Ranuras DIMM' },
      { value: 'pcie', label: 'Ranuras PCIe' },
      { value: 'sata', label: 'Puertos SATA' },
    ],
    correct: 'dimms',
    explanation:
      'Los módulos de RAM se colocan en las ranuras DIMM (Dual In‑line Memory Module) de la placa.',
  },
  {
    text: '¿Qué puerto de la placa suele usarse para conectar el cable de red?',
    options: [
      { value: 'rj45', label: 'Puerto RJ‑45 (Ethernet)' },
      { value: 'hdmi', label: 'Puerto HDMI' },
      { value: 'usb', label: 'Puerto USB‑A' },
    ],
    correct: 'rj45',
    explanation:
      'El cable de red Ethernet termina en un conector RJ‑45 que se enchufa en el puerto de red de la placa.',
  },
  {
    text: '¿Qué hace el chipset en una placa base?',
    options: [
      { value: 'coordina', label: 'Coordina la comunicación entre CPU y periféricos' },
      { value: 'refrigera', label: 'Solo refrigera la CPU' },
      { value: 'audio', label: 'Genera exclusivamente el audio' },
    ],
    correct: 'coordina',
    explanation:
      'El chipset actúa como “centro de comunicaciones” entre la CPU, la RAM, el almacenamiento y otros buses.',
  },
  {
    text: '¿Qué estándar de puerto se usa hoy en día para la mayoría de periféricos externos?',
    options: [
      { value: 'usb', label: 'USB' },
      { value: 'ps2', label: 'PS/2' },
      { value: 'paralelo', label: 'Puerto paralelo' },
    ],
    correct: 'usb',
    explanation:
      'USB se ha convertido en el estándar para conectar la mayoría de periféricos externos al PC.',
  },
  {
    text: '¿Qué significa que una placa base tenga formato ATX?',
    options: [
      { value: 'tamaño', label: 'Especifica tamaño y disposición de la placa' },
      { value: 'cpu', label: 'Indica el tipo de CPU exacta' },
      { value: 'color', label: 'Solo define el color del PCB' },
    ],
    correct: 'tamaño',
    explanation:
      'ATX define el tamaño físico de la placa y la posición de orificios y conectores para que encaje en cajas compatibles.',
  },
  {
    text: '¿Qué componente se inserta en los bancos DIMM?',
    options: [
      { value: 'ram', label: 'Memoria RAM' },
      { value: 'cpu', label: 'Procesador' },
      { value: 'ssd', label: 'SSD de 2,5"' },
    ],
    correct: 'ram',
    explanation:
      'Las ranuras DIMM están diseñadas para alojar módulos de memoria RAM y solo ese tipo de componente.',
  },
  {
    text: '¿Qué indica la serigrafía M.2_1, M.2_2 en la placa?',
    options: [
      { value: 'ranurasm2', label: 'Ranuras para unidades M.2' },
      { value: 'ventilador', label: 'Conectores de ventilador' },
      { value: 'audio', label: 'Canales de audio' },
    ],
    correct: 'ranurasm2',
    explanation:
      'La serigrafía M.2_1, M.2_2... marca los distintos zócalos M.2 donde puedes instalar SSD u otros módulos M.2.',
  },
  {
    text: '¿Qué sucede si conectas mal los pines del panel frontal (power, reset, LED)?',
    options: [
      { value: 'noenciende', label: 'El botón puede no encender o no reiniciar el equipo' },
      { value: 'rompecpu', label: 'La CPU se rompe inmediatamente' },
      { value: 'rompedisco', label: 'El disco duro se borra solo' },
    ],
    correct: 'noenciende',
    explanation:
      'Si los pines del panel frontal están mal conectados, los botones y LEDs pueden no funcionar aunque el resto del PC esté bien.',
  },
  {
    text: '¿Qué puerto se usa normalmente para monitores modernos en la parte trasera de la placa?',
    options: [
      { value: 'hdmi', label: 'HDMI o DisplayPort' },
      { value: 'ps2', label: 'PS/2' },
      { value: 'rj11', label: 'RJ‑11' },
    ],
    correct: 'hdmi',
    explanation:
      'Los monitores modernos se conectan sobre todo por HDMI o DisplayPort, presentes en la salida de vídeo de la placa o la GPU.',
  },
  {
    text: '¿Qué significa que una placa tenga zócalo LGA?',
    options: [
      { value: 'pinesplaca', label: 'Los pines están en la placa, no en la CPU' },
      { value: 'pinescpu', label: 'Los pines están en la CPU' },
      { value: 'soldada', label: 'La CPU va siempre soldada' },
    ],
    correct: 'pinesplaca',
    explanation:
      'En un zócalo LGA los pines están en la placa; la CPU solo tiene pads planos que apoyan sobre ellos.',
  },
  {
    text: '¿Qué suele indicar la serigrafía CPU_FAN en la placa?',
    options: [
      { value: 'ventiladorcpu', label: 'Conector para el ventilador del disipador de CPU' },
      { value: 'ventiladorcaja', label: 'Conector para ventilador de la caja' },
      { value: 'buzzer', label: 'Conector del altavoz interno' },
    ],
    correct: 'ventiladorcpu',
    explanation:
      'CPU_FAN identifica el conector específico para el ventilador del disipador de la CPU, que la BIOS controla de forma especial.',
  },
  {
    text: '¿Qué tipo de memoria se instala normalmente en placas base actuales?',
    options: [
      { value: 'ddr4', label: 'DDR4 o DDR5 según la placa' },
      { value: 'sdram', label: 'SDRAM clásica' },
      { value: 'rom', label: 'ROM extraíble' },
    ],
    correct: 'ddr4',
    explanation:
      'Las placas modernas usan memorias DDR4 o DDR5 según el modelo; otras tecnologías más antiguas han quedado obsoletas.',
  },
  {
    text: '¿Qué componente almacena la BIOS/UEFI en la placa base?',
    options: [
      { value: 'flash', label: 'Un chip de memoria flash' },
      { value: 'hdd', label: 'El disco duro' },
      { value: 'ram', label: 'La RAM' },
    ],
    correct: 'flash',
    explanation:
      'El firmware de la BIOS/UEFI se almacena en un chip de memoria flash que puede actualizarse (flashearse).',
  },
  {
    text: '¿Qué puerto se usa para conectar un teclado viejo de tipo redondo?',
    options: [
      { value: 'ps2', label: 'Puerto PS/2' },
      { value: 'usb', label: 'Puerto USB' },
      { value: 'sata', label: 'Puerto SATA' },
    ],
    correct: 'ps2',
    explanation:
      'Los teclados y ratones antiguos usan un conector redondo PS/2, distinto del USB actual.',
  },
  {
    text: '¿Qué hace el botón de reset conectado a la placa?',
    options: [
      { value: 'reinicia', label: 'Reinicia el sistema sin cortarle la corriente' },
      { value: 'apaga', label: 'Apaga la fuente por completo' },
      { value: 'bios', label: 'Entra directamente en la BIOS' },
    ],
    correct: 'reinicia',
    explanation:
      'El botón de reset reinicia el sistema sin cortar por completo la alimentación de la fuente.',
  },
  {
    text: '¿Qué indica normalmente la serigrafía SATA1, SATA2... en la placa?',
    options: [
      { value: 'puertossata', label: 'Puertos para cables SATA de datos' },
      { value: 'usbfront', label: 'Puertos USB frontales' },
      { value: 'pcieranuras', label: 'Ranuras PCIe' },
    ],
    correct: 'puertossata',
    explanation:
      'SATA1, SATA2… numeran los distintos puertos SATA de datos para discos y unidades ópticas.',
  },
  {
    text: '¿Qué ocurre si no conectas el conector EPS/CPU de 8 pines?',
    options: [
      { value: 'noboot', label: 'El equipo puede no arrancar o ser inestable' },
      { value: 'sinusb', label: 'Solo fallan los puertos USB' },
      { value: 'sololed', label: 'Solo se apaga el LED frontal' },
    ],
    correct: 'noboot',
    explanation:
      'Sin el conector EPS/CPU, la CPU no recibe la corriente adecuada y el equipo puede ni siquiera arrancar.',
  },
  {
    text: '¿Qué es un VRM en la placa base?',
    options: [
      { value: 'regulador', label: 'Módulo regulador de voltaje para CPU y otros componentes' },
      { value: 'audio', label: 'Chip de audio integrado' },
      { value: 'wifi', label: 'Módulo WiFi' },
    ],
    correct: 'regulador',
    explanation:
      'El VRM transforma y estabiliza el voltaje que llega a la CPU y otros componentes sensibles.',
  },
  {
    text: '¿Qué conector de la fuente se conecta a la placa para alimentarla en general?',
    options: [
      { value: 'atx24', label: 'Conector ATX de 24 pines' },
      { value: 'sata', label: 'Conector de alimentación SATA' },
      { value: 'pcie', label: 'Conector PCIe de 6 u 8 pines' },
    ],
    correct: 'atx24',
    explanation:
      'El conector ATX de 24 pines es la línea principal de alimentación desde la fuente hacia la placa base.',
  },
  {
    text: '¿Qué elemento ayuda a disipar el calor del chipset o del VRM?',
    options: [
      { value: 'disipador', label: 'Disipadores con aletas o bloques metálicos' },
      { value: 'buzzer', label: 'Altavoz interno (buzzer)' },
      { value: 'led', label: 'Tiras de LED' },
    ],
    correct: 'disipador',
    explanation:
      'Los disipadores metálicos aumentan la superficie de contacto con el aire y ayudan a evacuar el calor del chipset o VRM.',
  },
  {
    text: '¿Para qué sirven los conectores CHA_FAN en la placa?',
    options: [
      { value: 'ventcaja', label: 'Para ventiladores de la caja' },
      { value: 'ventcpu', label: 'Para el ventilador principal de CPU' },
      { value: 'rgb', label: 'Para tiras RGB' },
    ],
    correct: 'ventcaja',
    explanation:
      'CHA_FAN suele referirse a conectores para ventiladores de la caja (chassis fans).',
  },
  {
    text: '¿Qué interface suelen usar las tarjetas de red o sonido dedicadas?',
    options: [
      { value: 'pcie', label: 'PCI Express' },
      { value: 'ide', label: 'IDE' },
      { value: 'agp', label: 'AGP' },
    ],
    correct: 'pcie',
    explanation:
      'Las tarjetas de expansión modernas (red, sonido, captura…) usan ranuras PCI Express.',
  },
  {
    text: '¿Qué se conecta a los pines USB_F en la placa base?',
    options: [
      { value: 'usbfront', label: 'Cables de puertos USB frontales del chasis' },
      { value: 'monitor', label: 'El cable del monitor' },
      { value: 'fuente', label: 'La fuente de alimentación' },
    ],
    correct: 'usbfront',
    explanation:
      'Los cables de los puertos USB del frontal de la torre se conectan a los headers USB de la placa.',
  },
  {
    text: '¿Qué indica normalmente la serigrafía AUDIO_F o AAFP?',
    options: [
      { value: 'audiofront', label: 'Conector de audio del panel frontal' },
      { value: 'red', label: 'Conexión de red' },
      { value: 'vent', label: 'Conector de ventilador' },
    ],
    correct: 'audiofront',
    explanation:
      'AAFP o AUDIO_F marca el conector para el audio del panel frontal (auriculares y micrófono).',
  },
  {
    text: '¿Qué ocurre si mezclas módulos de RAM con frecuencias muy distintas?',
    options: [
      { value: 'bajavelocidad', label: 'Funcionan a la velocidad del módulo más lento' },
      { value: 'explotan', label: 'Se dañan físicamente al instante' },
      { value: 'sinvideo', label: 'Siempre se pierde la señal de vídeo' },
    ],
    correct: 'bajavelocidad',
    explanation:
      'Si mezclas RAM de distintas frecuencias, todo el conjunto suele funcionar a la velocidad del módulo más lento.',
  },
  {
    text: '¿Qué es el POST en el arranque de un PC?',
    options: [
      { value: 'autotest', label: 'Autotest de hardware que hace la BIOS/UEFI' },
      { value: 'sistema', label: 'Carga completa del sistema operativo' },
      { value: 'apagar', label: 'Proceso de apagado controlado' },
    ],
    correct: 'autotest',
    explanation:
      'El POST es el test inicial de hardware que hace la BIOS/UEFI antes de arrancar el sistema operativo.',
  },
  {
    text: '¿Qué indican normalmente los pitidos (beeps) al encender un PC antiguo?',
    options: [
      { value: 'codigos', label: 'Códigos de error de la BIOS sobre el hardware' },
      { value: 'musica', label: 'Un test de audio opcional' },
      { value: 'red', label: 'Estado de la red' },
    ],
    correct: 'codigos',
    explanation:
      'Los pitidos del altavoz interno siguen patrones que indican errores concretos de hardware según la BIOS.',
  },
  {
    text: '¿Qué es la UEFI en placas modernas?',
    options: [
      { value: 'firmware', label: 'Firmware moderno que sustituye a la BIOS clásica' },
      { value: 'sistema', label: 'Un sistema operativo completo' },
      { value: 'driver', label: 'Un controlador de red' },
    ],
    correct: 'firmware',
    explanation:
      'UEFI es el firmware moderno que reemplaza a la BIOS clásica y ofrece más opciones y mejor interfaz.',
  },
  {
    text: '¿Qué se consigue activando XMP/DOCP en la BIOS/UEFI?',
    options: [
      { value: 'ramrapida', label: 'Usar el perfil de alta velocidad de la RAM' },
      { value: 'masusb', label: 'Añadir más puertos USB' },
      { value: 'masred', label: 'Aumentar la velocidad de red' },
    ],
    correct: 'ramrapida',
    explanation:
      'XMP/DOCP carga un perfil guardado en la RAM para usar frecuencias y tiempos más altos de forma automática.',
  },
  {
    text: '¿Qué ocurre si instalas la CPU con los pines doblados en un zócalo PGA?',
    options: [
      { value: 'nopc', label: 'El PC puede no arrancar o ser inestable y dañarse' },
      { value: 'menosusb', label: 'Solo dejan de funcionar algunos USB' },
      { value: 'masrapido', label: 'Funciona más rápido' },
    ],
    correct: 'nopc',
    explanation:
      'Pines doblados en una CPU PGA pueden impedir el contacto correcto y llegar a dañar el procesador o la placa.',
  },
  {
    text: '¿Qué función tiene el conector ATX12V/EPS cerca del zócalo de CPU?',
    options: [
      { value: 'alimentacpu', label: 'Aportar corriente adicional a la CPU' },
      { value: 'audioextra', label: 'Mejorar el audio integrado' },
      { value: 'wifi', label: 'Alimentar el WiFi' },
    ],
    correct: 'alimentacpu',
    explanation:
      'El conector ATX12V/EPS cerca del socket da la energía extra que la CPU requiere, sobre todo en procesadores potentes.',
  },
  {
    text: '¿Qué ranura se usaba antiguamente para tarjetas gráficas antes de PCIe?',
    options: [
      { value: 'agp', label: 'AGP' },
      { value: 'ide', label: 'IDE' },
      { value: 'ps2', label: 'PS/2' },
    ],
    correct: 'agp',
    explanation:
      'Antes de PCI Express, la ranura AGP se usaba como bus específico para tarjetas gráficas.',
  },
  {
    text: '¿Qué indica que una placa tiene WiFi integrado?',
    options: [
      { value: 'antenas', label: 'Suele traer conectores de antena en el panel trasero' },
      { value: 'ventextra', label: 'Trae más ventiladores' },
      { value: 'masram', label: 'Permite más RAM' },
    ],
    correct: 'antenas',
    explanation:
      'Las placas con WiFi integrado suelen tener conectores de antena en el panel trasero o un módulo M.2 WiFi.',
  },
  {
    text: '¿Qué es un puerto PCI de color blanco en placas muy antiguas?',
    options: [
      { value: 'pciclasico', label: 'Un bus de expansión más viejo que PCIe' },
      { value: 'ram', label: 'Ranura de RAM' },
      { value: 'sata', label: 'Puerto SATA' },
    ],
    correct: 'pciclasico',
    explanation:
      'El viejo bus PCI (normalmente en color blanco) precede a PCI Express y era común para tarjetas de expansión.',
  },
  {
    text: '¿Qué debes hacer antes de manipular componentes sobre la placa base?',
    options: [
      { value: 'descarga', label: 'Descargarte de electricidad estática' },
      { value: 'golpear', label: 'Golpear ligeramente la placa' },
      { value: 'calentar', label: 'Calentar los chips con un secador' },
    ],
    correct: 'descarga',
    explanation:
      'Descargarte de electricidad estática reduce el riesgo de dañar componentes sensibles al ESD.',
  },
  {
    text: '¿Qué es un header RGB en algunas placas base?',
    options: [
      { value: 'luces', label: 'Conector para tiras de iluminación RGB' },
      { value: 'audio', label: 'Conector de audio' },
      { value: 'red', label: 'Puerto de red' },
    ],
    correct: 'luces',
    explanation:
      'Un header RGB permite conectar tiras o dispositivos de iluminación para controlarlos desde la placa.',
  },
  {
    text: '¿Qué pasa si arrancas un equipo sin RAM instalada?',
    options: [
      { value: 'sinpost', label: 'No completa el POST y suele dar pitidos de error' },
      { value: 'arrancalento', label: 'Arranca pero muy lento' },
      { value: 'normal', label: 'Arranca normalmente' },
    ],
    correct: 'sinpost',
    explanation:
      'Sin RAM el sistema no puede ejecutar código; la BIOS suele detenerse con pitidos de error y sin imagen.',
  },
  {
    text: '¿Qué son los MOSFET que ves alrededor del zócalo de CPU?',
    options: [
      { value: 'transistores', label: 'Transistores de potencia del VRM' },
      { value: 'diodos', label: 'Diodos de los LEDs' },
      { value: 'sensores', label: 'Sensores de temperatura' },
    ],
    correct: 'transistores',
    explanation:
      'Los MOSFET del VRM son transistores de potencia que conmutan la corriente para regular el voltaje.',
  },
  {
    text: '¿Qué indica normalmente la serigrafía CLR_CMOS o CMOS_RESET?',
    options: [
      { value: 'limpiarcmos', label: 'Pines para borrar la configuración de la BIOS/UEFI' },
      { value: 'masusb', label: 'Añadir más puertos USB' },
      { value: 'overclock', label: 'Activar overclock automático' },
    ],
    correct: 'limpiarcmos',
    explanation:
      'CLR_CMOS o CMOS_RESET indica pines que, al puentearlos o usar un botón, borran la configuración almacenada de la BIOS/UEFI.',
  },
];

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function initProgressiveQuiz() {
  const container = document.getElementById('quiz-progressive');
  if (!container) return;

  const questionText = document.getElementById('quiz-question-text');
  const optionsContainer = document.getElementById('quiz-options');
  const currentEl = document.getElementById('quiz-step-current');
  const totalEl = document.getElementById('quiz-step-total');
  const feedbackEl = document.getElementById('quiz-feedback');
  const form = document.getElementById('quiz-step-form');
  const summarySection = document.getElementById('quiz-summary');
  const summaryText = document.getElementById('quiz-summary-text');
  const restartBtn = document.getElementById('quiz-restart-btn');

  if (
    !questionText ||
    !optionsContainer ||
    !currentEl ||
    !totalEl ||
    !feedbackEl ||
    !form ||
    !summarySection ||
    !summaryText ||
    !restartBtn
  ) {
    return;
  }

  let selectedQuestions = [];
  let index = 0;
  let score = 0;

  function pickQuestions() {
    selectedQuestions = shuffleArray(QUESTION_BANK).slice(0, TOTAL_QUESTIONS);
    index = 0;
    score = 0;
    totalEl.textContent = String(TOTAL_QUESTIONS);
  }

  function renderQuestion() {
    const q = selectedQuestions[index];
    if (!q) return;

    currentEl.textContent = String(index + 1);
    questionText.textContent = q.text;
    feedbackEl.textContent = '';

    optionsContainer.innerHTML = '';
    q.options.forEach((opt, i) => {
      const id = `q_opt_${index}_${i}`;
      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.style.display = 'flex';
      label.style.gap = '10px';
      label.style.alignItems = 'flex-start';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = opt.value;
      input.id = id;

      const span = document.createElement('span');
      span.textContent = opt.label;

      label.appendChild(input);
      label.appendChild(span);
      optionsContainer.appendChild(label);
    });

    summarySection.hidden = true;
    form.hidden = false;
  }

  function showSummary() {
    form.hidden = true;
    summarySection.hidden = false;

    const percent = Math.round((score / TOTAL_QUESTIONS) * 100);
    let msg = `Has acertado ${score} de ${TOTAL_QUESTIONS} preguntas (${percent}%).`;
    if (percent === 100) {
      msg += ' ¡Perfecto, dominio total de la placa!';
    } else if (percent >= 80) {
      msg += ' Muy buen resultado, solo faltan pequeños detalles.';
    } else if (percent >= 50) {
      msg += ' Resultado correcto, pero puedes reforzar algunos conceptos.';
    } else {
      msg += ' Te conviene repasar con el visor 3D y volver a intentarlo.';
    }

    summaryText.textContent = msg;
  }

  let hasAnsweredCurrent = false;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const answer = fd.get('answer');

    // Primera pulsación: corregir y mostrar explicación
    if (!hasAnsweredCurrent) {
      if (!answer) {
        feedbackEl.textContent = 'Elige una opción antes de continuar.';
        return;
      }

      const q = selectedQuestions[index];
      if (answer === q.correct) {
        score += 1;
        feedbackEl.textContent = 'Correcto.';
      } else {
        const correctOpt = q.options.find((opt) => opt.value === q.correct);
        const correctLabel = correctOpt ? correctOpt.label : '';
        const explanation = q.explanation || '';
        feedbackEl.textContent = `Incorrecto. La respuesta correcta es: "${correctLabel}". ${explanation}`;
      }

      // Marcar que ya se corrigió esta pregunta; el siguiente click avanza
      hasAnsweredCurrent = true;
      const nextBtn = document.getElementById('quiz-next-btn');
      if (nextBtn) {
        nextBtn.textContent = 'Continuar';
      }
      return;
    }

    // Segunda pulsación: pasar a la siguiente pregunta o al resumen
    hasAnsweredCurrent = false;
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.textContent = 'Responder y continuar';
    }

    index += 1;
    if (index >= selectedQuestions.length) {
      showSummary();
    } else {
      renderQuestion();
    }
  });

  restartBtn.addEventListener('click', () => {
    pickQuestions();
    renderQuestion();
  });

  pickQuestions();
  renderQuestion();
}

initProgressiveQuiz();

