/**
 * Textos educativos para GLB exportados por herramientas tipo Tripo (nodos `tripo_part_N`).
 * Mismo formato que `COMPONENT_INFO` en main.js.
 */
export const TRIPO_PART_INFO = {
  tripo_part_0: {
    name: 'Conjunto de conectores / zona de interfaz',
    what: 'Pieza del modelo que agrupa conectores o una zona de interfaz mecánica en el borde de la placa.',
    does: 'Permite conectar cables internos o periféricos (según el diseño exacto del modelo 3D).',
    why: 'Es un punto de entrada/salida de señales o alimentación auxiliar; identificarlo ayuda a entender el cableado interno.',
  },
  tripo_part_1: {
    name: 'Bloque de conectores secundarios',
    what: 'Conjunto compacto de conectores o soporte asociado a una zona específica de la placa.',
    does: 'Distribuye señales o energía hacia subsistemas cercanos (USB interno, audio frontal, etc., según el modelo).',
    why: 'Evita confusiones al montar el PC: cada conector tiene polaridad/orientación y función distinta.',
  },
  tripo_part_2: {
    name: 'Conector o carcasa de borde',
    what: 'Elemento estructural o conector ubicado en el perímetro de la PCB en el modelo.',
    does: 'Fija mecánicamente un conector o guía el enrutado de cables hacia el chasis.',
    why: 'Un mal acoplamiento puede generar tensiones en el cable o contactos intermitentes.',
  },
  tripo_part_3: {
    name: 'Ensamblaje grande (conectores / blindaje / zona principal)',
    what: 'Bloque voluminoso que suele corresponder a varios conectores, blindajes o piezas unidas en el escaneo 3D.',
    does: 'Concentra interfaces de alta densidad o piezas que en la realidad están próximas entre sí.',
    why: 'En placas reales, esas zonas definen buena parte de la conectividad “visible” del equipo.',
  },
  tripo_part_4: {
    name: 'Zona de conexión o soporte intermedio',
    what: 'Pieza intermedia entre la PCB y otros elementos (conectores, disipadores o carcasas).',
    does: 'Aporta fijación mecánica y continuidad eléctrica/térmica según el componente real representado.',
    why: 'Comprender su función simplifica el mantenimiento y la sustitución de piezas.',
  },
  tripo_part_5: {
    name: 'Cabecera interna (header) — zona baja',
    what: 'Conector de pines típico para cables del gabinete o módulos internos.',
    does: 'Lleva señales de baja tensión (panel frontal, USB 2.0/3.x interno, TPM, etc.).',
    why: 'Un pin mal orientado puede dañar el conector o la placa; conviene revisar el manual.',
  },
  tripo_part_6: {
    name: 'Cabecera interna (header) — ventilación / control',
    what: 'Zona de conectores pequeños usados para ventiladores, sensores o iluminación.',
    does: 'Entrega alimentación y control PWM/DC o señales de datos (según estándar del fabricante).',
    why: 'Un buen cableado de ventilación mejora temperaturas y reduce ruido por curvas PWM correctas.',
  },
  tripo_part_7: {
    name: 'Ranura PCIe larga (típ. ×16)',
    what: 'Ranura de expansión de alta velocidad orientada a tarjetas anchas (habitualmente GPU).',
    does: 'Conecta la tarjeta al CPU/chipset con líneas PCIe para datos y, en GPU, también salidas de vídeo.',
    why: 'Es el principal camino de ancho de banda para gráficos y muchas tarjetas de alto rendimiento.',
  },
  tripo_part_8: {
    name: 'Ranura PCIe corta o zona de expansión auxiliar',
    what: 'Interfaz de expansión más corta (p. ej. ×1/×4) o pieza asociada a una ranura secundaria.',
    does: 'Permite tarjetas de red, sonido, captura o NVMe AIC sin ocupar el hueco principal de la GPU.',
    why: 'Amplía funciones sin reemplazar componentes principales; la compatibilidad depende del chipset/CPU.',
  },
  tripo_part_9: {
    name: 'Puertos SATA / bloque de almacenamiento',
    what: 'Conectores L‑shaped típicos de SATA para discos SSD/HDD.',
    does: 'Transporta datos entre la placa y unidades SATA; la alimentación va por cable desde la fuente.',
    why: 'En equipos con muchos discos, organizar SATA evita obstruir flujo de aire y facilita cambios.',
  },
  tripo_part_10: {
    name: 'PCB — cuerpo principal de la placa base',
    what: 'El sustrato laminado con pistas de cobre donde se sueldan chips, conectores y pasivos.',
    does: 'Interconecta eléctricamente CPU, memoria, chipset, E/S y ranuras de expansión.',
    why: 'Es el “esqueleto” del hardware: calidad de capas y trazado influyen en señal y estabilidad.',
  },
  tripo_part_11: {
    name: 'Bloque de E/S integrada (USB / red / audio)',
    what: 'Conjunto de puertos que suelen salir al panel trasero del gabinete.',
    does: 'Expone USB, Ethernet, audio analógico y a veces salidas de vídeo integradas (según CPU/placa).',
    why: 'Define la conectividad diaria del PC; es lo que más se usa para periféricos externos.',
  },
  tripo_part_12: {
    name: 'Headers del panel frontal y USB interno',
    what: 'Zona de conectores para interruptores/LEDs del chasis y puertos USB del frontal.',
    does: 'Lleva señales del botón de encendido, HDD LED, reset y USB del case a la lógica de la placa.',
    why: 'Montar bien estos cables evita cortos y comportamientos extraños al arrancar.',
  },
  tripo_part_13: {
    name: 'Cabecera pequeña (sensor / altavoz / auxiliar)',
    what: 'Conector de pines de baja tensión para funciones auxiliares.',
    does: 'Puede servir para buzzer del altavoz interno, TPM, RGB de tiras u otros según fabricante.',
    why: 'Son funciones opcionales pero útiles para diagnóstico (pitidos) o extras de iluminación.',
  },
  tripo_part_14: {
    name: 'Cabecera de ventilador adicional',
    what: 'Conector para ventiladores de caja o disipadores secundarios.',
    does: 'Suministra 12 V (o variantes) y a veces tacómetro/sensor para controlar velocidad.',
    why: 'Repartir ventiladores entre headers evita sobrecargar un único circuito y mejora el flujo de aire.',
  },
  tripo_part_15: {
    name: 'Zona de jumpers / servicio / conector bajo',
    what: 'Área con jumpers cortos o conectores de servicio (p. ej. clear CMOS en algunos diseños).',
    does: 'Permite acciones de mantenimiento o selección de modos de hardware.',
    why: 'Conocer estos puntos acelera recuperación tras fallos de firmware o pruebas de laboratorio.',
  },
  tripo_part_16: {
    name: 'Panel trasero (rear I/O) — ensamblaje amplio',
    what: 'Conjunto de puertos mecánicamente alineados con el escudo I/O del chasis.',
    does: 'Centraliza salidas USB, red, audio y otras interfaces hacia el exterior.',
    why: 'Compatibilidad y número de puertos impactan directamente en productividad y periféricos.',
  },
  tripo_part_17: {
    name: 'Disipador / cover térmico (chipset o zona caliente)',
    what: 'Pieza metálica o compuesta que aumenta el área de disipación sobre un chip.',
    does: 'Transfiere calor del die al aire del chasis (a veces con ventilador cercano).',
    why: 'Reduce throttling y mejora la vida útil de componentes sensibles a temperatura.',
  },
  tripo_part_18: {
    name: 'Conector de alimentación de CPU (EPS 4/8 pines)',
    what: 'Conector desde la fuente dedicado a la etapa de alimentación de la CPU.',
    does: 'Aporta corriente estable para VRM bajo carga (turbo, benchmarks, renders).',
    why: 'Sin EPS completo pueden aparecer reinicios o inestabilidad bajo estrés térmico/eléctrico.',
  },
  tripo_part_19: {
    name: 'Ranuras de memoria RAM (DIMM)',
    what: 'Conectores para módulos DDR (según generación de la plataforma).',
    does: 'Permite a la CPU leer/escribir datos de trabajo a alta velocidad frente al almacenamiento.',
    why: 'Capacidad y velocidad de RAM influyen fuerte en multitarea, juegos y compilación.',
  },
  tripo_part_20: {
    name: 'Disipador del VRM (etapas de potencia)',
    what: 'Disipador sobre MOSFETs/inductores que convierten voltaje para la CPU.',
    does: 'Enfría la regulación para mantener voltajes precisos cuando la CPU pide picos de corriente.',
    why: 'Un VRM sobrecalentado limita rendimiento sostenido y puede acortar la vida de la placa.',
  },
  tripo_part_21: {
    name: 'Subsistema auxiliar (audio / controlador / IC de apoyo)',
    what: 'Zona con chips y componentes pasivos de una función específica (p. ej. audio o control).',
    does: 'Implementa una función periférica: codec de audio, controlador LAN/USB extra, etc.',
    why: 'Entender estos bloques ayuda a diagnosticar ruido, drivers o fallos de red/USB puntuales.',
  },
  tripo_part_22: {
    name: 'Esquina de almacenamiento / conectores del borde inferior',
    what: 'Agrupación de conectores o soporte en la esquina inferior del layout del modelo.',
    does: 'Suele alojar SATA adicionales, USB interno o alimentación periférica según el diseño.',
    why: 'Buen orden de cables SATA mejora ventilación y reduce vibraciones/ruido de discos.',
  },
  tripo_part_23: {
    name: 'Batería CMOS / circuito RTC (zona típica)',
    what: 'En muchas placas, una batería CR2032 mantiene reloj y ajustes de firmware.',
    does: 'Alimenta el reloj en tiempo real y memoria no volátil de configuración básica.',
    why: 'Si falla, pueden perderse hora y BIOS/UEFI; es un mantenimiento sencillo y barato.',
  },
  tripo_part_24: {
    name: 'M.2 / disipador de SSD NVMe (zona alargada)',
    what: 'Soporte y/o disipador para unidades M.2 NVMe/SATA.',
    does: 'Fija el SSD y, si hay disipador, reduce temperaturas para evitar throttling del NAND/controlador.',
    why: 'Los SSD NVMe modernos ganan mucha estabilidad con refrigeración adecuada en escrituras largas.',
  },
};
