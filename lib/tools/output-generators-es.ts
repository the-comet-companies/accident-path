import type { ToolAnswers, ToolOutput, OutputItem } from '@/types/tool'

type OutputGenerator = (answers: ToolAnswers) => ToolOutput

// ─── Helpers (mirrors output-generators.ts) ───────────────────────────────────

const ACCIDENT_LABELS_ES: Record<string, string> = {
  'car-accident': 'accidente de auto',
  'truck-accident': 'accidente de camión',
  'motorcycle-crash': 'accidente de motocicleta',
  'bicycle-accident': 'accidente de bicicleta',
  'pedestrian-accident': 'accidente de peatón',
  'slip-fall': 'resbalón y caída',
  'dog-bite': 'mordedura de perro o ataque de animal',
  'workplace-injury': 'lesión laboral',
  'other': 'accidente',
}

function accidentLabelEs(v: string | undefined): string {
  return ACCIDENT_LABELS_ES[v ?? ''] ?? 'accidente'
}

function str(v: ToolAnswers[string] | undefined): string {
  return typeof v === 'string' ? v : ''
}

function timelineUrgent(when: string | undefined): boolean {
  return when === 'today' || when === '1-7-days' || when === '1-4-weeks'
}

// ─── Tool 1: accident-case-quiz (ES) ─────────────────────────────────────────

const accidentCaseQuizEs: OutputGenerator = (answers) => {
  const accType = str(answers['accident-type'])
  const injuries = (answers['injuries'] as string[]) ?? []
  const when = str(answers['timeline'])
  const witnesses = str(answers['witnesses'])
  const whatHappened = (answers['what-happened'] as string[]) ?? []
  const isHitRun = whatHappened.includes('hit-run')

  const hasVisibleInjuries = !injuries.includes('no-visible-injuries') && injuries.length > 0
  const urgent = timelineUrgent(when)
  const hasWitnesses = witnesses === 'yes-multiple' || witnesses === 'yes-one'

  const CASE_TYPE_MAP: Record<string, string> = {
    'car-accident': 'caso de accidente de vehículo de motor',
    'truck-accident': 'caso de accidente de vehículo de motor',
    'motorcycle-crash': 'caso de accidente de vehículo de motor',
    'bicycle-accident': 'caso de accidente de vehículo de motor',
    'pedestrian-accident': 'caso de accidente de vehículo de motor',
    'slip-fall': 'caso de responsabilidad por instalaciones',
    'dog-bite': 'caso de mordedura de perro',
    'workplace-injury': 'caso de lesión laboral o compensación de trabajadores',
  }

  const HUB_LINK_MAP: Record<string, string> = {
    'car-accident': '/es/accidentes/auto',
    'truck-accident': '/es/accidentes/camion',
    'motorcycle-crash': '/es/accidentes/motocicleta',
    'bicycle-accident': '/es/accidentes/bicicleta',
    'pedestrian-accident': '/es/accidentes/peaton',
    'slip-fall': '/es/accidentes/caida',
    'dog-bite': '/es/accidentes/mordida-perro',
    'workplace-injury': '/es/accidentes/trabajo',
  }

  const caseType = CASE_TYPE_MAP[accType] ?? 'caso de lesiones personales'
  const hubLink = HUB_LINK_MAP[accType] ?? '/es/accidentes'
  const accLabelEs = accidentLabelEs(accType)

  const items: OutputItem[] = []

  items.push({
    label: `Más información: ${caseType.charAt(0).toUpperCase() + caseType.slice(1)}`,
    value: `Revise nuestra guía detallada sobre casos de ${caseType} — qué esperar, plazos clave y qué evidencia es más importante.`,
    priority: 'helpful',
  })

  if (urgent) {
    items.push({
      label: 'Consulte a un abogado de lesiones personales pronto',
      value: `Con un ${accLabelEs} reciente, documentar su reclamo de manera temprana es importante. La evidencia y los recuerdos de los testigos se desvanecen rápidamente.`,
      priority: 'critical',
    })
  } else {
    items.push({
      label: 'Consulte a un abogado de lesiones personales',
      value: 'Su situación puede beneficiarse de orientación legal. La mayoría de los abogados de lesiones personales ofrecen consultas iniciales gratuitas.',
      priority: 'important',
    })
  }

  if (isHitRun) {
    items.push({
      label: 'Choque y fuga — presente un informe policial de inmediato',
      value: 'Si aún no lo ha hecho, presente un informe policial por el choque y fuga. Esto es fundamental para los reclamos de seguro de motorista no asegurado (UM), que a menudo requieren un informe policial como condición de cobertura.',
      priority: 'critical',
    })
  }

  if (hasVisibleInjuries) {
    items.push({
      label: 'Continúe documentando el tratamiento médico',
      value: 'Guarde registros de todas las visitas médicas, diagnósticos, recetas y facturas. La documentación consistente respalda cualquier reclamo futuro.',
      priority: 'critical',
    })
  }

  if (hasWitnesses) {
    items.push({
      label: 'Obtenga la información de contacto de los testigos',
      value: 'Usted indicó que hubo testigos. Recopilar sus nombres y datos de contacto ahora — mientras sus recuerdos están frescos — puede fortalecer significativamente su reclamo.',
      priority: 'important',
    })
  } else if (witnesses === 'no') {
    items.push({
      label: 'Sin testigos — enfóquese en otra evidencia',
      value: 'Sin testigos, la evidencia física se vuelve especialmente importante: fotos de la escena, el informe policial, registros médicos y cualquier grabación de cámara disponible.',
      priority: 'important',
    })
  }

  items.push({
    label: 'Evite dar declaraciones grabadas a las compañías de seguros',
    value: 'Los ajustadores de seguros pueden usar declaraciones grabadas para minimizar un reclamo. Considere consultar a un abogado antes de proporcionar una declaración formal.',
    priority: 'important',
  })

  items.push({
    label: 'Revise la Herramienta de Lista de Evidencia',
    value: 'Use nuestra lista de evidencia gratuita para asegurarse de tener todo documentado.',
    priority: 'helpful',
  })

  return {
    summary: `Según lo que describió, los casos como este generalmente se clasifican como un ${caseType}. Los reclamos de este tipo implican reglas, plazos y consideraciones específicas. Esta es información educativa general únicamente — su situación específica puede diferir y esto no es asesoramiento legal.`,
    items,
    cta: { label: `Aprender Sobre Casos de ${caseType.charAt(0).toUpperCase() + caseType.slice(1)}`, href: hubLink },
    disclaimer: 'Esta evaluación proporciona información educativa general únicamente. No es asesoramiento legal y no evalúa los méritos de ninguna posible reclamación.',
    exportable: true,
  }
}

// ─── Tool 2: urgency-checker (ES) ─────────────────────────────────────────────

const urgencyCheckerEs: OutputGenerator = (answers) => {
  const symptoms = (answers['symptoms'] as string[]) ?? []
  const seenDoctor = str(answers['seen-doctor'])
  const when = str(answers['when'])

  const redFlags = ['loss-of-consciousness', 'severe-bleeding', 'chest-pain', 'numbness-tingling', 'neck-back-pain', 'confusion']
  const yellowFlags = ['severe-headache', 'abdominal-pain', 'blurred-vision', 'nausea']

  const hasRed = redFlags.some(f => symptoms.includes(f))
  const hasYellow = !hasRed && yellowFlags.some(f => symptoms.includes(f))
  const noSymptoms = symptoms.includes('no-symptoms') || symptoms.length === 0
  const hasSeenDoctor = seenDoctor === 'yes-same-day' || seenDoctor === 'yes-within-days'

  const items: OutputItem[] = []
  let summary = ''

  if (hasRed) {
    summary = 'Según sus respuestas, reportó síntomas que pueden indicar una condición grave o potencialmente mortal. Busque atención médica de inmediato. Esta es información educativa general únicamente — no es consejo médico.'
    items.push({
      label: 'Busque atención médica de inmediato',
      value: 'Los síntomas que seleccionó — que pueden incluir pérdida de conciencia, sangrado severo, dolor en el pecho, dificultad para respirar, entumecimiento o dolor severo en la cabeza/cuello — pueden indicar una lesión grave. Vaya a una sala de emergencias o llame al 911 ahora.',
      priority: 'critical',
    })
    if (!hasSeenDoctor) {
      items.push({
        label: 'Aún no ha visto a un médico',
        value: 'Retrasar la atención médica puede empeorar su condición y las compañías de seguros pueden usarlo para disputar la gravedad de las lesiones. Busque atención ahora.',
        priority: 'critical',
      })
    }
  } else if (hasYellow) {
    summary = 'Según sus respuestas, tiene síntomas que vale la pena evaluar con un proveedor de salud en las próximas 24 a 48 horas. Los síntomas tardíos después de un accidente son comunes. Esta es información educativa general únicamente — no es consejo médico.'
    items.push({
      label: 'Vea a un médico en las próximas 24 a 48 horas',
      value: 'Síntomas como dolor de cabeza, mareos, dolor abdominal o náuseas pueden desarrollarse o empeorar gradualmente después de un accidente. Una evaluación temprana crea un registro médico y ayuda a identificar condiciones antes de que se vuelvan graves.',
      priority: 'important',
    })
    if (!hasSeenDoctor) {
      items.push({
        label: 'Documente sus síntomas antes de su cita',
        value: 'Escriba cada síntoma — incluyendo cuándo comenzó y cómo ha cambiado — para poder darle a su médico una imagen completa.',
        priority: 'helpful',
      })
    }
  } else if (noSymptoms && !hasSeenDoctor) {
    summary = 'No reporta síntomas en este momento. Muchas lesiones por accidente — incluyendo latigazo cervical y conmoción cerebral — pueden tardar horas o días en aparecer. Monitorear su condición y ver a un médico dentro de la semana es generalmente recomendable. Esta es información educativa general.'
    items.push({
      label: 'Monitoree sus síntomas y vea a un médico durante la semana',
      value: 'Incluso sin síntomas inmediatos, una evaluación médica dentro de las 24 a 72 horas es comúnmente recomendada después de accidentes. Crea un registro en caso de que aparezcan síntomas más tarde.',
      priority: 'important',
    })
  } else {
    summary = 'Según sus respuestas, ha recibido atención médica y parece estar monitoreando su situación. Continuar siguiendo la guía de su proveedor es el siguiente paso clave. Esta es información educativa general únicamente.'
    items.push({
      label: 'Continúe siguiendo las indicaciones de su proveedor de salud',
      value: 'Mantenga todas las citas de seguimiento e informe inmediatamente a su proveedor sobre cualquier síntoma nuevo o que empeore.',
      priority: 'important',
    })
  }

  if (timelineUrgent(when)) {
    items.push({
      label: 'Documente todo ahora',
      value: 'Fotos, notas sobre síntomas e información de contacto de cualquier persona en la escena son más valiosas cuando se recopilan con prontitud.',
      priority: 'important',
    })
  }

  items.push({
    label: 'Comience un diario de lesiones',
    value: 'La documentación diaria de síntomas, niveles de dolor y tratamientos crea un registro poderoso para cualquier reclamo futuro.',
    priority: 'helpful',
  })

  return {
    summary,
    items,
    cta: { label: 'Obtenga Orientación Gratuita', href: '/es/buscar-ayuda' },
    disclaimer: 'Esta herramienta es únicamente para fines educativos. No es consejo médico. Si está experimentando una emergencia médica, llame al 911 de inmediato.',
    exportable: true,
    emergency: hasRed,
  }
}

// ─── Tool 3: evidence-checklist (ES) ─────────────────────────────────────────

const evidenceChecklistEs: OutputGenerator = (answers) => {
  const accType = str(answers['accident-type'])
  const location = str(answers['location-type'])
  const witnesses = str(answers['witnesses'])
  const policeReport = str(answers['police-report'])
  const photos = str(answers['photos'])

  const items: OutputItem[] = []

  // Documents
  if (policeReport === 'no-not-filed' || policeReport === 'not-sure') {
    items.push({
      label: 'Obtenga o presente un informe policial o de accidente',
      value: 'Si no se presentó ningún informe, comuníquese con la agencia de aplicación de la ley que respondió. Las aseguradoras a menudo requieren un informe policial y proporciona un relato oficial del incidente.',
      priority: 'critical',
      category: 'Documentos',
    })
  } else {
    items.push({
      label: 'Obtenga una copia del informe policial o de accidente',
      value: 'Solicítelo a la agencia de aplicación de la ley que respondió. Disponible de 3 a 10 días después del incidente, generalmente por una pequeña tarifa.',
      priority: 'critical',
      category: 'Documentos',
    })
  }

  items.push({
    label: 'Documentación de seguro de todas las partes',
    value: 'Tarjetas de seguro, números de póliza e información de contacto del ajustador para su aseguradora y cualquier otra parte involucrada.',
    priority: 'critical',
    category: 'Documentos',
  })

  if (location === 'workplace' || accType === 'workplace-injury') {
    items.push({
      label: 'Presente un informe de incidente con su empleador',
      value: 'Un informe escrito del incidente crea un registro oficial del lugar de trabajo requerido para iniciar un reclamo de compensación laboral.',
      priority: 'critical',
      category: 'Documentos',
    })
  }

  if (location === 'business-premises' || location === 'private-property') {
    items.push({
      label: 'Solicite el informe de incidente o accidente de la propiedad',
      value: 'Las empresas y propietarios a menudo están obligados a mantener registros de accidentes en sus instalaciones. Solicite una copia por escrito.',
      priority: 'important',
      category: 'Documentos',
    })
  }

  // Scene
  if (photos === 'no-photos' || photos === 'conditions-prevented') {
    items.push({
      label: 'Regrese a fotografiar la escena lo antes posible',
      value: 'Las condiciones de la escena cambian rápidamente — las marcas de frenos se desvanecen, los peligros se corrigen. Fotografíe el área, las posiciones de los vehículos y cualquier peligro relevante.',
      priority: 'critical',
      category: 'Escena',
    })
  } else {
    items.push({
      label: 'Continúe fotografiando las lesiones a medida que se desarrollan',
      value: 'Los hematomas y la hinchazón a menudo se intensifican en los días posteriores al accidente. Documente las lesiones visibles con fotos con fecha diariamente durante al menos una semana.',
      priority: 'important',
      category: 'Escena',
    })
  }

  items.push({
    label: 'Fotografíe todos los daños a vehículos o propiedad',
    value: 'Múltiples ángulos incluyendo la ubicación de los daños, placas y posiciones de los vehículos. No autorice reparaciones hasta que los daños estén completamente documentados.',
    priority: photos === 'no-photos' || photos === 'conditions-prevented' ? 'critical' : 'important',
    category: 'Escena',
  })

  if (accType === 'slip-fall' || location === 'business-premises') {
    items.push({
      label: 'Documente el peligro exacto que causó el accidente',
      value: 'Fotografíe la condición específica — piso mojado, pavimento agrietado, barandal faltante, superficie irregular — desde múltiples ángulos antes de que sea corregida.',
      priority: 'critical',
      category: 'Escena',
    })
  }

  // Witnesses
  if (witnesses === 'yes-no-info') {
    items.push({
      label: 'Intente localizar información de contacto de testigos',
      value: 'Revise el informe policial, comuníquese con negocios cercanos con cámaras de seguridad, o publique en grupos comunitarios locales.',
      priority: 'critical',
      category: 'Testigos',
    })
  } else if (witnesses === 'yes-with-info') {
    items.push({
      label: 'Preserve y verifique la información de contacto de los testigos',
      value: 'Confirme nombres, números de teléfono y direcciones. Pida a cada testigo que escriba una breve declaración mientras el incidente está fresco.',
      priority: 'important',
      category: 'Testigos',
    })
  } else if (witnesses === 'unknown') {
    items.push({
      label: 'Explore el área en busca de posibles testigos',
      value: 'Comuníquese con negocios y residentes cercanos. Verifique si alguien publicó sobre el accidente en redes sociales o foros locales.',
      priority: 'important',
      category: 'Testigos',
    })
  }

  // Digital
  if (location === 'business-premises' || location === 'public-road' || location === 'parking-lot') {
    items.push({
      label: 'Envíe una solicitud escrita de preservación de grabaciones de seguridad',
      value: 'Las empresas y municipios sobrescriben las grabaciones en 24 a 72 horas. Envíe una solicitud escrita de inmediato identificando la fecha, hora y ubicación de la cámara.',
      priority: 'critical',
      category: 'Digital',
    })
  }

  if (accType === 'car-accident' || accType === 'truck-accident' || accType === 'motorcycle-crash') {
    items.push({
      label: 'Busque grabaciones de cámara de su vehículo u otros',
      value: 'Su propia cámara de tablero, grabaciones de vehículos cercanos, o datos de viaje de Uber/Lyft pueden proporcionar documentación objetiva del incidente.',
      priority: 'important',
      category: 'Digital',
    })
  }

  items.push({
    label: 'Preserve las redes sociales y cualquier comunicación digital',
    value: 'No elimine publicaciones, mensajes o fotos relacionadas con el accidente. Capture y preserve cualquier comunicación relevante con otras partes o aseguradoras.',
    priority: 'helpful',
    category: 'Digital',
  })

  // Medical
  items.push({
    label: 'Recopile todos los registros médicos y facturas detalladas',
    value: 'Registros de sala de emergencias, hospital, especialistas, fisioterapia y farmacia. Solicite facturas detalladas — no solo resúmenes — a medida que se acumulan.',
    priority: 'critical',
    category: 'Médico',
  })

  items.push({
    label: 'Documente cada síntoma en cada visita al proveedor',
    value: 'Dígale a cada proveedor cada síntoma — incluso los menores. Dígales la fecha exacta y las circunstancias del accidente. Los registros incompletos pueden limitar sus opciones más adelante.',
    priority: 'important',
    category: 'Médico',
  })

  // Financial
  items.push({
    label: 'Reúna registros de empleo para documentar salarios perdidos',
    value: 'Talones de pago, cartas del empleador documentando turnos perdidos y declaraciones de impuestos ayudan a establecer pérdidas de ingresos si no pudo trabajar debido a sus lesiones.',
    priority: 'important',
    category: 'Financiero',
  })

  items.push({
    label: 'Registre todos los gastos de bolsillo',
    value: 'Transporte a citas médicas, costos de medicamentos, cuidado en el hogar y cualquier otro costo causado por el accidente. Guarde los recibos.',
    priority: 'helpful',
    category: 'Financiero',
  })

  return {
    summary: `Aquí está su lista de evidencia personalizada para su caso de ${accidentLabelEs(accType)}, organizada por categoría. Reúna estos elementos con prontitud — alguna evidencia desaparece en 24 a 72 horas. Esta es información educativa general únicamente, no asesoramiento legal.`,
    items,
    cta: { label: 'Obtenga Orientación Gratuita', href: '/es/buscar-ayuda' },
    disclaimer: 'Esta lista es solo para fines educativos generales. La evidencia específica que importa en su caso depende de sus circunstancias individuales. Consulte a un abogado con licencia para orientación adaptada a su situación.',
    exportable: true,
  }
}

// ─── Tool 4: injury-journal (ES) ─────────────────────────────────────────────

const TREATMENT_LABELS_ES: Record<string, string> = {
  'doctor-visit': 'Visita al médico',
  'physical-therapy': 'Fisioterapia',
  'chiropractic': 'Quiropráctica',
  'imaging': 'Estudios de imagen',
  'prescription': 'Medicamento recetado',
  'er-visit': 'Visita a urgencias',
  'specialist': 'Visita a especialista',
  'telehealth': 'Telesalud',
}

const SYMPTOM_LABELS_ES: Record<string, string> = {
  'neck-pain': 'Dolor de cuello',
  'back-pain': 'Dolor de espalda',
  'headache': 'Dolor de cabeza',
  'dizziness': 'Mareos',
  'numbness': 'Entumecimiento',
  'fatigue': 'Fatiga',
  'anxiety': 'Ansiedad',
  'sleep-issues': 'Problemas para dormir',
  'nausea': 'Náuseas',
}

const INJURY_LABELS_ES: Record<string, string> = {
  'neck-injury': 'Lesión de cuello',
  'back-injury': 'Lesión de espalda',
  'head-injury': 'Lesión en la cabeza',
  'shoulder-injury': 'Lesión de hombro',
  'knee-injury': 'Lesión de rodilla',
  'broken-bone': 'Hueso roto',
  'soft-tissue': 'Lesión de tejidos blandos',
  'burns': 'Quemaduras',
  'psychological': 'Trauma psicológico',
}

const injuryJournalEs: OutputGenerator = (answers) => {
  const injuries = (answers['injury-type'] as string[]) ?? []
  const painLevel = typeof answers['pain-level'] === 'number' ? answers['pain-level'] : null
  const symptoms = (answers['symptoms'] as string[]) ?? []
  const treatments = (answers['treatments'] as string[]) ?? []

  const noTreatments = treatments.includes('no-treatments-today') || treatments.length === 0
  const noSymptoms = symptoms.includes('no-symptoms-today') || symptoms.length === 0
  const highPain = painLevel !== null && painLevel >= 7

  const items: OutputItem[] = []

  if (highPain) {
    items.push({
      label: `Nivel de dolor ${painLevel}/10 — documente con su proveedor`,
      value: 'Un nivel de dolor alto debe comunicarse a su médico tratante en su próxima cita. Asegúrese de que sus registros médicos reflejen su dolor actual.',
      priority: 'critical',
    })
  }

  if (!noTreatments) {
    items.push({
      label: 'Tratamientos documentados hoy',
      value: treatments
        .filter(t => t !== 'no-treatments-today')
        .map(t => TREATMENT_LABELS_ES[t] ?? t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
        .join(', '),
      priority: 'important',
    })
  }

  if (!noSymptoms) {
    items.push({
      label: 'Síntomas registrados hoy',
      value: symptoms
        .filter(s => s !== 'no-symptoms-today')
        .map(s => SYMPTOM_LABELS_ES[s] ?? s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
        .join(', '),
      priority: 'important',
    })
  }

  if (noTreatments && painLevel !== null && painLevel > 0) {
    items.push({
      label: 'Sin tratamientos hoy — considere documentar el motivo',
      value: 'Si tuvo dolor pero no recibió tratamiento, anote el motivo (transporte, costo, disponibilidad de citas). Este contexto es útil si su diario es revisado.',
      priority: 'helpful',
    })
  }

  items.push({
    label: 'Agregue otra entrada al diario mañana',
    value: 'Las entradas diarias — incluso las breves — crean el registro más útil. La consistencia importa más que la extensión.',
    priority: 'helpful',
  })

  const injuryLabelsFormatted = injuries.length > 0
    ? injuries.map(i => INJURY_LABELS_ES[i] ?? i.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ')
    : ''

  return {
    summary: `Entrada de hoy registrada. Nivel de dolor: ${painLevel !== null ? `${painLevel}/10` : 'no registrado'}. ${injuryLabelsFormatted ? `Seguimiento: ${injuryLabelsFormatted}.` : ''} Su diario es solo para documentación personal — guárdelo en un lugar seguro y compártalo con su abogado si tiene uno.`,
    items,
    cta: { label: 'Imprimir Esta Entrada', href: '#' },
    disclaimer: 'Este diario es una herramienta educativa para ayudarle a organizar documentación personal. No es un registro médico y no sustituye la atención médica profesional.',
    exportable: true,
  }
}

// ─── Tool 5: lawyer-type-matcher (ES) ────────────────────────────────────────

const lawyerTypeMatcherEs: OutputGenerator = (answers) => {
  const accType = str(answers['accident-type'])
  const injuries = (answers['injuries'] as string[]) ?? []
  const specialCircs = (answers['special-circumstances'] as string[]) ?? []
  const state = str(answers['state'])

  const isWorkplace = accType === 'workplace-injury' || specialCircs.includes('workplace')
  const isProductDefect = specialCircs.includes('product-defect')
  const isCommercial = specialCircs.includes('commercial-vehicle') || accType === 'truck-accident'
  const isGovernment = specialCircs.includes('government-property')
  const isRideshare = specialCircs.includes('rideshare')
  const hasSerious = injuries.includes('head-injury') || injuries.includes('internal-injuries') || injuries.includes('broken-bones')

  const isCA = state === 'CA'
  const stateName = isCA ? 'California' : state === 'AZ' ? 'Arizona' : 'su estado'

  let lawyerType = 'Abogado de Lesiones Personales'
  let typeDescription = 'Los abogados de lesiones personales manejan reclamos derivados de accidentes causados por negligencia de otra parte. La mayoría maneja una variedad de tipos de accidentes incluyendo colisiones de vehículos, resbalones y caídas, y otros incidentes.'

  if (isWorkplace) {
    lawyerType = 'Abogado de Compensación Laboral y Lesiones Personales'
    typeDescription = 'Los accidentes laborales pueden involucrar tanto reclamos de compensación laboral como reclamos civiles de lesiones personales contra terceros. Un abogado con experiencia en ambas áreas puede evaluar todas sus opciones de recuperación.'
  } else if (isProductDefect) {
    lawyerType = 'Abogado de Responsabilidad por Productos'
    typeDescription = 'Los casos de responsabilidad por productos involucran productos defectuosos o inseguros que causaron lesiones. Estos casos son técnicamente complejos y a menudo requieren expertos en ingeniería y litigios contra fabricantes. Los abogados que se especializan en responsabilidad por productos tienen experiencia con retiros del mercado, defectos de diseño y defectos de fabricación.'
  } else if (isCommercial) {
    lawyerType = 'Abogado de Accidentes de Vehículos Comerciales y Camiones'
    typeDescription = 'Los casos de vehículos comerciales involucran regulaciones federales de la FMCSA, múltiples partes potencialmente responsables (conductor, transportista, cargador, propietario) y aseguradoras con recursos significativos. Los abogados con experiencia en camiones comerciales entienden cómo preservar los datos del dispositivo de registro electrónico (ELD) y otros registros del transportista.'
  } else if (accType === 'slip-fall') {
    lawyerType = 'Abogado de Responsabilidad por Instalaciones'
    typeDescription = 'Los casos de resbalón y caída y de responsabilidad por instalaciones involucran deberes de cuidado del propietario de la propiedad, requisitos de notificación y evidencia específica — como informes de incidentes, grabaciones de seguridad y registros de mantenimiento. Los abogados que se especializan en responsabilidad por instalaciones tienen experiencia con estos elementos.'
  } else if (accType === 'dog-bite') {
    lawyerType = 'Abogado de Lesiones Personales y Mordeduras de Perro'
    typeDescription = 'California y Arizona aplican responsabilidad estricta por mordeduras de perro en la mayoría de las circunstancias. Los abogados de lesiones personales que manejan casos de ataques de animales entienden los estándares aplicables y los tipos de daños.'
  } else if (['car-accident', 'motorcycle-crash', 'bicycle-accident', 'pedestrian-accident'].includes(accType)) {
    lawyerType = isRideshare ? 'Abogado de Accidentes de Vehículos de Motor y Transporte por Aplicación' : 'Abogado de Accidentes de Vehículos de Motor'
    typeDescription = isRideshare
      ? 'Los accidentes de transporte por aplicación (Uber, Lyft) involucran capas únicas de seguro — la póliza comercial de la empresa, la póliza personal del conductor y la cobertura de la plataforma que varía según el estado del viaje. Los abogados con experiencia en estos casos entienden estas capas de cobertura.'
      : 'Los abogados de accidentes de vehículos de motor manejan reclamos contra conductores responsables, compañías de seguros y otras partes. Tienen experiencia en reconstrucción de accidentes, interpretación de pólizas de seguro y litigios de lesiones personales.'
  }

  const items: OutputItem[] = []

  items.push({
    label: `Tipo de abogado que típicamente maneja casos como este: ${lawyerType}`,
    value: typeDescription,
    priority: 'important',
  })

  if (isGovernment) {
    items.push({
      label: 'Entidad gubernamental involucrada — aplica un plazo más corto',
      value: `Los reclamos contra entidades gubernamentales en ${stateName} requieren una notificación formal de reclamo antes de presentar una demanda — típicamente dentro de 180 días del incidente en California; los plazos de Arizona varían según el tipo de entidad y pueden ser más cortos. Perder este plazo impide completamente el reclamo. Un abogado familiarizado con reclamos contra el gobierno es esencial.`,
      priority: 'critical',
    })
  }

  if (hasSerious) {
    items.push({
      label: 'Lesiones graves — considere consultar a un abogado con prontitud',
      value: 'Los casos con lesiones significativas a menudo involucran límites de seguro más altos, múltiples partes responsables y testigos expertos. La representación legal temprana ayuda a preservar evidencia y proteger sus intereses.',
      priority: 'critical',
    })
  }

  items.push({
    label: 'Qué buscar en una consulta',
    value: 'Experiencia con su tipo específico de accidente, una estructura de honorarios por contingencia (sin costo inicial), comunicación clara sobre el proceso y membresía vigente en el colegio de abogados del estado.',
    priority: 'helpful',
  })

  items.push({
    label: 'Preguntas para hacer durante una consulta gratuita',
    value: '"¿Cuántos casos como el mío ha manejado?" / "¿Cuál es su acuerdo de honorarios?" / "¿Quién manejará mi caso día a día?" / "¿Cuál es un plazo realista para la resolución?"',
    priority: 'helpful',
  })

  return {
    summary: `Según sus respuestas, los casos como este son típicamente manejados por un ${lawyerType}. Esta es información general — cada situación es única, y la selección del abogado debe basarse en sus circunstancias específicas y nivel de confianza.`,
    items,
    cta: { label: 'Conectar con un Abogado', href: '/es/buscar-ayuda' },
    disclaimer: 'Esta herramienta proporciona información educativa general únicamente. No constituye una referencia legal ni recomendación de ningún abogado específico. Consulte con un abogado con licencia para evaluar su situación específica.',
    exportable: false,
  }
}

// ─── Tool 10: state-next-steps (ES) ──────────────────────────────────────────

function computeSolDeadlineEs(
  accidentDate: string,
  solYears: number
): { daysRemaining: number; deadlineStr: string } {
  const [y, m, d] = accidentDate.split('-').map(Number)
  const deadline = new Date(y + solYears, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysRemaining = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const deadlineStr = deadline.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
  return { daysRemaining, deadlineStr }
}

const stateNextStepsEs: OutputGenerator = (answers) => {
  const state = str(answers['state'])
  const accType = str(answers['accident-type'])
  const accidentDate = str(answers['accident-date'])

  const isCA = state === 'CA'
  const stateName = isCA ? 'California' : 'Arizona'
  const solYears = 2

  const items: OutputItem[] = []

  if (accidentDate) {
    const { daysRemaining, deadlineStr } = computeSolDeadlineEs(accidentDate, solYears)
    items.push({
      label: `Plazo de prescripción en ${stateName}: ${deadlineStr}`,
      value: daysRemaining < 0
        ? 'El plazo general para este tipo de reclamación puede haber vencido. Pueden aplicar algunas excepciones — consulte a un abogado de inmediato.'
        : daysRemaining < 90
        ? `URGENTE: Solo quedan ${daysRemaining} día(s). Consulte a un abogado lo antes posible.`
        : `Quedan ${daysRemaining} días. Actuar antes generalmente produce mejores resultados — la evidencia y los testigos están más disponibles cuanto antes.`,
      priority: daysRemaining < 90 ? 'critical' : daysRemaining < 180 ? 'important' : 'helpful',
    })
  } else {
    items.push({
      label: `Plazo de prescripción en ${stateName}: ${solYears} años desde la fecha del accidente`,
      value: `Para la mayoría de las reclamaciones por lesiones personales en ${stateName}, tiene ${solYears} años desde la fecha del accidente para presentar una demanda.`,
      priority: 'important',
    })
  }

  if (accType === 'workplace-injury') {
    items.push({
      label: isCA ? 'Compensación laboral: reporte dentro de 30 días' : 'Compensación laboral: presente dentro de 1 año',
      value: isCA
        ? 'Reporte la lesión a su empleador dentro de 30 días y presente una reclamación formal DWC-1 dentro de 1 año.'
        : 'Reporte a su empleador lo antes posible y presente una reclamación de compensación laboral dentro de 1 año.',
      priority: 'critical',
    })
  }

  if (['car-accident', 'truck-accident', 'motorcycle-crash', 'bicycle-accident', 'pedestrian-accident'].includes(accType) && isCA) {
    items.push({
      label: 'Reporte SR-1 del DMV de CA: dentro de 10 días',
      value: 'Requerido cuando ocurrieron lesiones, muerte o daños a la propiedad mayores a $1,000. Presente ante el DMV de California dentro de 10 días del accidente.',
      priority: 'important',
    })
  }

  items.push({
    label: 'Aviso de reclamación gubernamental: 180 días',
    value: `Si hubo una entidad gubernamental involucrada, debe presentar un aviso formal de reclamación dentro de 180 días en ${stateName} (60 días para algunas entidades municipales/del condado en AZ). No cumplir este plazo cancela su reclamación.`,
    priority: 'important',
  })

  items.push({
    label: `Regla de culpa en ${stateName}: culpa comparativa pura`,
    value: `${stateName} aplica la culpa comparativa pura — puede recuperar compensación incluso si tuvo parte de la culpa, con su indemnización reducida proporcionalmente.`,
    priority: 'helpful',
  })

  items.push({
    label: `Requisitos mínimos de seguro en ${stateName}`,
    value: isCA
      ? 'Mínimo en California: $30,000 por persona / $60,000 por accidente / $15,000 daños a la propiedad (vigente desde el 1 de enero de 2025, SB 1107).'
      : 'Mínimo en Arizona: $25,000 por persona / $50,000 por accidente / $15,000 daños a la propiedad.',
    priority: 'helpful',
  })

  return {
    summary: `Aquí están los plazos clave y los próximos pasos para un ${accidentLabelEs(accType)} en ${stateName}. Los plazos en casos de lesiones personales son estrictos — no cumplirlos puede cancelar permanentemente su derecho a compensación. Esta es información educativa general únicamente, no asesoramiento legal.`,
    items,
    cta: { label: 'Conectar con un Abogado', href: '/es/buscar-ayuda' },
    disclaimer: `Esta información es solo para fines educativos generales. Las leyes de ${stateName} cambian — verifique todos los plazos con un abogado con licencia en ${stateName} antes de actuar.`,
    exportable: true,
  }
}

// ─── Tool 11: statute-countdown (ES) ─────────────────────────────────────────

const statuteCountdownEs: OutputGenerator = (answers) => {
  const accidentDate = str(answers['accident-date'])
  const accType = str(answers['accident-type'])
  const state = str(answers['state'])

  const isCA = state === 'CA'
  const stateName = isCA ? 'California' : 'Arizona'
  const solYears = 2
  const citation = isCA ? 'California CCP § 335.1' : 'A.R.S. § 12-542'

  const items: OutputItem[] = []

  if (accidentDate) {
    const { daysRemaining, deadlineStr } = computeSolDeadlineEs(accidentDate, solYears)

    let deadlinePriority: 'critical' | 'important' | 'helpful' = 'helpful'
    let deadlineNote = ''

    if (daysRemaining < 0) {
      deadlinePriority = 'critical'
      deadlineNote = 'El plazo general para este tipo de reclamación puede haber vencido. Pueden aplicar algunas excepciones. Consulte a un abogado de inmediato.'
    } else if (daysRemaining < 90) {
      deadlinePriority = 'critical'
      deadlineNote = `URGENTE: Solo quedan ${daysRemaining} día(s). Considere hablar con un abogado lo antes posible.`
    } else if (daysRemaining < 180) {
      deadlinePriority = 'important'
      deadlineNote = `Quedan ${daysRemaining} días. Su plazo se acerca — consulte a un abogado para confirmar su fecha límite específica.`
    } else {
      deadlinePriority = 'helpful'
      deadlineNote = `Quedan ${daysRemaining} días. Tiene tiempo, pero actuar antes generalmente produce mejores resultados.`
    }

    items.push({
      label: `Fecha límite general de presentación: ${deadlineStr}`,
      value: deadlineNote,
      priority: deadlinePriority,
    })

    const [accY, accM, accD] = accidentDate.split('-').map(Number)
    const govDeadline = new Date(new Date(accY, accM - 1, accD).getTime() + 180 * 24 * 60 * 60 * 1000)
    const govDeadlineStr = govDeadline.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
    items.push({
      label: `Aviso de reclamación gubernamental: 180 días (${isCA ? '6 meses' : 'estado'} / 60 días entidades municipales/condado en AZ)`,
      value: `Si hubo una entidad gubernamental involucrada, este es un plazo SEPARADO y MÁS CORTO que el plazo de ${solYears} años. No cumplirlo cancela su reclamación. Fecha límite desde la fecha de su accidente: ${govDeadlineStr}.`,
      priority: 'important',
    })
  } else {
    items.push({
      label: `Plazo general en ${stateName}: ${solYears} años desde la fecha del accidente`,
      value: `Ingrese la fecha de su accidente para ver la fecha límite calculada. (${citation})`,
      priority: 'important',
    })
  }

  items.push({
    label: 'La minoría de edad puede extender su plazo',
    value: 'Si tenía menos de 18 años al momento del accidente, el período de prescripción puede no comenzar hasta que alcance la mayoría de edad. Esto depende de los hechos — consulte a un abogado.',
    priority: 'helpful',
  })

  items.push({
    label: 'Excepciones de la regla del descubrimiento',
    value: 'Para lesiones de aparición tardía, el período de prescripción puede comenzar desde la fecha del descubrimiento en lugar del accidente. Consulte a un abogado para entender cómo aplica esto a su caso.',
    priority: 'helpful',
  })

  const accLabel = accidentLabelEs(accType)

  return {
    summary: `${accLabel.charAt(0).toUpperCase() + accLabel.slice(1)} en ${stateName} — Plazo general: ${solYears} años desde la fecha del accidente (${citation}). Los plazos de prescripción tienen muchas excepciones — su fecha límite específica puede diferir. Consulte a un abogado con licencia para confirmar su plazo exacto antes de actuar.`,
    items,
    cta: { label: 'Conectar con un Abogado', href: '/es/buscar-ayuda' },
    disclaimer: 'Esta herramienta muestra plazos legales GENERALES solo con fines educativos. Su fecha límite específica depende de los hechos únicos de su caso. Siempre consulte a un abogado con licencia para confirmar su plazo — no confíe únicamente en esta herramienta.',
    exportable: false,
  }
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const outputGeneratorsEs: Record<string, OutputGenerator> = {
  'accident-case-quiz': accidentCaseQuizEs,
  'urgency-checker': urgencyCheckerEs,
  'evidence-checklist': evidenceChecklistEs,
  'injury-journal': injuryJournalEs,
  'lawyer-type-matcher': lawyerTypeMatcherEs,
  'state-next-steps': stateNextStepsEs,
  'statute-countdown': statuteCountdownEs,
}
