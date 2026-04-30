export const LOCALES = ['en', 'es'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

// English slug → Spanish path segment
export const SLUG_MAP_ES: Record<string, string> = {
  'car': 'auto',
  'truck': 'camion',
  'motorcycle': 'motocicleta',
  'slip-and-fall': 'caida',
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
  'broken-bones': 'huesos-rotos',
  'whiplash': 'latigazo',
  'traumatic-brain': 'traumatismo-craneal',
  'spinal': 'columna',
  'soft-tissue': 'tejido-blando',
  'burns': 'quemaduras',
  'internal': 'lesiones-internas',
}

// Spanish path segment → English slug (reverse of SLUG_MAP_ES)
export const SLUG_MAP_EN: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_MAP_ES).map(([en, es]) => [es, en])
)

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
    { label: 'Acerca de', href: '/about' },
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
