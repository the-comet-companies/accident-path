export const LOCALES = ['en', 'es'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

// English slug → Spanish path segment
export const SLUG_MAP_ES: Record<string, string> = {
  'car': 'auto',
  'truck': 'camion',
  'motorcycle': 'motocicleta',
  'slip-and-fall': 'caida',
  'slip-fall': 'caida',
  'workplace': 'trabajo',
  'bicycle': 'bicicleta',
  'pedestrian': 'peaton',
  'dog-bite': 'mordida-perro',
  'construction': 'construccion',
  'premises': 'propiedad',
  'product': 'producto',
  'wrongful-death': 'muerte-injusta',
  'uber-lyft': 'uber-lyft',
  'after-car-accident': 'despues-accidente-auto',
  'after-truck-accident': 'despues-accidente-camion',
  'after-motorcycle-crash': 'despues-accidente-motocicleta',
  'am-i-at-fault': 'soy-culpable',
  'common-mistakes': 'errores-comunes',
  'dealing-with-insurance-adjusters': 'ajustadores-seguros',
  'evidence-checklist': 'lista-evidencia',
  'getting-your-police-report': 'reporte-policial',
  'hiring-a-lawyer': 'contratar-abogado',
  'insurance-claims': 'reclamos-seguro',
  'protecting-your-claim': 'proteger-reclamo',
  'settlement-vs-lawsuit': 'acuerdo-vs-demanda',
  'should-i-talk-to-a-lawyer': 'hablar-con-abogado',
  'understanding-medical-bills': 'facturas-medicas',
  'accident-case-quiz': 'evaluacion-caso',
  'urgency-checker': 'verificador-urgencia',
  'injury-journal': 'diario-lesiones',
  'lawyer-type-matcher': 'tipo-abogado',
  'lost-wages-estimator': 'calculadora-salario',
  'insurance-call-prep': 'preparacion-llamada-seguro',
  'record-request': 'solicitud-registros',
  'settlement-readiness': 'preparacion-acuerdo',
  'state-next-steps': 'proximos-pasos-estado',
  'statute-countdown': 'cuenta-regresiva-plazo',
  'broken-bones': 'huesos-rotos',
  'whiplash': 'latigazo',
  'traumatic-brain': 'traumatismo-craneal',
  'spinal': 'columna',
  'soft-tissue': 'tejido-blando',
  'burns': 'quemaduras',
  'internal': 'lesiones-internas',
}

// Spanish display labels for accident type slugs (used in related-accidents sidebar)
export const ACCIDENT_LABEL_ES: Record<string, string> = {
  'car': 'Auto',
  'truck': 'Camión',
  'motorcycle': 'Motocicleta',
  'bicycle': 'Bicicleta',
  'pedestrian': 'Peatón',
  'slip-fall': 'Resbalón y Caída',
  'slip-and-fall': 'Resbalón y Caída',
  'dog-bite': 'Mordedura de Perro',
  'construction': 'Construcción',
  'premises': 'Responsabilidad de Propiedad',
  'product': 'Responsabilidad de Producto',
  'wrongful-death': 'Muerte Injusta',
  'uber-lyft': 'Uber / Lyft',
  'workplace': 'Lesiones en el Trabajo',
}

// Spanish display labels for guide slugs (used in related-guides sidebar)
export const GUIDE_LABEL_ES: Record<string, string> = {
  'after-car-accident': 'Después de un Accidente de Auto',
  'after-truck-accident': 'Después de un Accidente de Camión',
  'after-motorcycle-crash': 'Después de un Accidente de Motocicleta',
  'insurance-claims': 'Reclamaciones al Seguro',
  'getting-your-police-report': 'Cómo Obtener su Informe Policial',
  'am-i-at-fault': '¿Soy Culpable?',
  'common-mistakes': 'Errores Comunes',
  'hiring-a-lawyer': 'Cómo Contratar a un Abogado',
  'protecting-your-claim': 'Cómo Proteger su Reclamación',
  'settlement-vs-lawsuit': 'Acuerdo vs. Demanda',
  'should-i-talk-to-a-lawyer': '¿Debo Hablar con un Abogado?',
  'understanding-medical-bills': 'Cómo Entender sus Facturas Médicas',
  'dealing-with-insurance-adjusters': 'Cómo Tratar con Ajustadores de Seguros',
}

// Spanish path segment → English slug (reverse of SLUG_MAP_ES)
export const SLUG_MAP_EN: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_MAP_ES).map(([en, es]) => [es, en])
)

// Spanish title + description for tool cards and detail page heroes.
// Step questions stay in English (tool content not yet translated).
export const TOOL_META_ES: Record<string, { title: string; description: string }> = {
  'accident-case-quiz': {
    title: '¿Qué Tipo de Caso de Accidente Tengo?',
    description: 'Diferentes accidentes dan lugar a distintos tipos de reclamos de lesiones personales, cada uno con sus propias reglas y plazos. Esta evaluación le ayuda a entender su tipo de caso.',
  },
  'urgency-checker': {
    title: '¿Necesito Atención Médica Ahora?',
    description: 'Después de un accidente, la adrenalina y el shock pueden ocultar lesiones serias. Esta herramienta educativa le ayuda a evaluar sus síntomas y decidir si necesita atención inmediata.',
  },
  'evidence-checklist': {
    title: 'Lista de Recopilación de Evidencia',
    description: 'La evidencia que recopila — o deja de recopilar — en las horas y días después de un accidente puede ser crucial para su caso. Esta lista le guía paso a paso.',
  },
  'injury-journal': {
    title: 'Diario de Lesiones y Tratamiento',
    description: 'Documentar sus lesiones consistentemente desde el día del accidente hasta su recuperación crea un registro que puede fortalecer su reclamo.',
  },
  'lawyer-type-matcher': {
    title: 'Identificador de Tipo de Abogado',
    description: 'No todos los abogados de lesiones personales manejan todos los tipos de casos. Algunos se especializan en vehículos de motor, otros en responsabilidad de locales. Encuentre el tipo correcto.',
  },
  'insurance-call-prep': {
    title: 'Preparación para Llamadas con el Seguro',
    description: 'Las llamadas con los ajustadores de seguros después de un accidente son importantes. Lo que dice y cómo lo dice importa. Esta herramienta le ayuda a organizar lo que necesita tener a mano.',
  },
  'lost-wages-estimator': {
    title: 'Calculadora de Salario Perdido',
    description: 'Una lesión que le impide trabajar — o limita su capacidad laboral — puede tener graves consecuencias financieras. Esta herramienta educativa le ayuda a comprender los componentes de un reclamo por salarios perdidos.',
  },
  'record-request': {
    title: 'Lista de Solicitud de Registros',
    description: 'Construir un expediente documental completo después de un accidente es una de las cosas más importantes que puede hacer para proteger sus opciones legales.',
  },
  'settlement-readiness': {
    title: 'Lista de Preparación para Acuerdo',
    description: 'Aceptar un acuerdo antes de estar listo puede resultar en una compensación que no refleja sus pérdidas reales. Esta lista le ayuda a identificar si los elementos más importantes están en orden.',
  },
  'state-next-steps': {
    title: 'Próximos Pasos por Estado',
    description: 'Las reglas y plazos de lesiones personales difieren entre California y Arizona. Esta herramienta le ayuda a entender las diferencias clave: plazos, reglas de seguro y estándares de culpa.',
  },
  'statute-countdown': {
    title: 'Cuenta Regresiva del Plazo Legal',
    description: 'El plazo de prescripción establece una fecha límite estricta para reclamar compensación después de un accidente. Esta herramienta le ayuda a entender cuánto tiempo puede quedar y qué pasos debe considerar.',
  },
}

export const NAV_ACCIDENT_TYPES = {
  en: [
    { label: 'Car Accidents', href: '/accidents/car' },
    { label: 'Truck Accidents', href: '/accidents/truck' },
    { label: 'Motorcycle Accidents', href: '/accidents/motorcycle' },
    { label: 'Uber / Lyft Accidents', href: '/accidents/uber-lyft' },
    { label: 'Pedestrian Accidents', href: '/accidents/pedestrian' },
    { label: 'Bicycle Accidents', href: '/accidents/bicycle' },
    { label: 'Slip & Fall', href: '/accidents/slip-and-fall' },
    { label: 'Dog Bites', href: '/accidents/dog-bite' },
    { label: 'Construction Injuries', href: '/accidents/construction' },
    { label: 'Workplace Injuries', href: '/accidents/workplace' },
    { label: 'Wrongful Death', href: '/accidents/wrongful-death' },
    { label: 'Premises Liability', href: '/accidents/premises' },
    { label: 'Product Liability', href: '/accidents/product' },
  ],
  es: [
    { label: 'Accidentes de Auto', href: '/es/accidentes/auto' },
    { label: 'Accidentes de Camión', href: '/es/accidentes/camion' },
    { label: 'Accidentes de Motocicleta', href: '/es/accidentes/motocicleta' },
    { label: 'Accidentes de Uber / Lyft', href: '/es/accidentes/uber-lyft' },
    { label: 'Accidentes de Peatón', href: '/es/accidentes/peaton' },
    { label: 'Accidentes de Bicicleta', href: '/es/accidentes/bicicleta' },
    { label: 'Caídas', href: '/es/accidentes/caida' },
    { label: 'Mordidas de Perro', href: '/es/accidentes/mordida-perro' },
    { label: 'Lesiones de Construcción', href: '/es/accidentes/construccion' },
    { label: 'Lesiones en el Trabajo', href: '/es/accidentes/trabajo' },
    { label: 'Muerte Injusta', href: '/es/accidentes/muerte-injusta' },
    { label: 'Responsabilidad de Propiedad', href: '/es/accidentes/propiedad' },
    { label: 'Responsabilidad del Producto', href: '/es/accidentes/producto' },
  ],
}

export const NAV_SIMPLE_LINKS = {
  en: [
    { label: 'Injuries', href: '/injuries' },
    { label: 'What To Do Next', href: '/guides' },
    { label: 'Tools', href: '/tools' },
    { label: 'About', href: '/about' },
  ],
  es: [
    { label: 'Lesiones', href: '/es/lesiones' },
    { label: 'Qué Hacer Después', href: '/es/guias' },
    { label: 'Herramientas', href: '/es/herramientas' },
  ],
}

export const NAV_FIND_HELP = {
  en: { label: 'Find Help', href: '/find-help' },
  es: { label: 'Buscar Ayuda', href: '/es/buscar-ayuda' },
}

export const FOOTER_ACCIDENT_LINKS = {
  en: [
    { label: 'Car Accidents', href: '/accidents/car' },
    { label: 'Truck Accidents', href: '/accidents/truck' },
    { label: 'Motorcycle Accidents', href: '/accidents/motorcycle' },
    { label: 'Pedestrian Accidents', href: '/accidents/pedestrian' },
    { label: 'Slip & Fall', href: '/accidents/slip-and-fall' },
    { label: 'Workplace Injuries', href: '/accidents/workplace' },
    { label: 'View All Accident Types', href: '/accidents' },
  ],
  es: [
    { label: 'Accidentes de Auto', href: '/es/accidentes/auto' },
    { label: 'Accidentes de Camión', href: '/es/accidentes/camion' },
    { label: 'Accidentes de Motocicleta', href: '/es/accidentes/motocicleta' },
    { label: 'Accidentes de Peatón', href: '/es/accidentes/peaton' },
    { label: 'Caídas', href: '/es/accidentes/caida' },
    { label: 'Lesiones en el Trabajo', href: '/es/accidentes/trabajo' },
    { label: 'Ver Todos los Tipos', href: '/es/accidentes' },
  ],
}

// Locale-aware labels for UI text used in Header/MobileNav that aren't in the dict
export const NAV_LABELS = {
  en: {
    accidentTypes: 'Accident Types',
    viewAllAccidents: 'View all accident types →',
    stateGuides: 'State Guides',
    viewAllStates: 'View all states →',
    getHelpNow: 'Get Help Now',
    getHelpNowFull: 'Get Help Now — Free, No Obligation',
  },
  es: {
    accidentTypes: 'Tipos de Accidentes',
    viewAllAccidents: 'Ver todos los tipos →',
    stateGuides: 'Guías por Estado',
    viewAllStates: 'Ver todos los estados →',
    getHelpNow: 'Obtenga Ayuda Ahora',
    getHelpNowFull: 'Obtenga Ayuda Ahora — Gratis, Sin Compromiso',
  },
}

export const FOOTER_RESOURCE_LINKS = {
  en: [
    { label: 'Accident Guides', href: '/guides' },
    { label: 'Injury Types', href: '/injuries' },
    { label: 'Free Tools', href: '/tools' },
    { label: 'California Guide', href: '/states/california' },
    { label: 'Arizona Guide', href: '/states/arizona' },
    { label: 'Find an Attorney', href: '/find-help' },
  ],
  es: [
    { label: 'Guías de Accidentes', href: '/es/guias' },
    { label: 'Tipos de Lesiones', href: '/es/lesiones' },
    { label: 'Herramientas Gratuitas', href: '/es/herramientas' },
    { label: 'Guía de California', href: '/states/california' },
    { label: 'Guía de Arizona', href: '/states/arizona' },
    { label: 'Buscar un Abogado', href: '/es/buscar-ayuda' },
  ],
}
