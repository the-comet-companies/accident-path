# Spanish Tool Pages (6 Remaining) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add fully-translated Spanish versions of 6 existing English tools, one at a time, with user review after each before proceeding.

**Architecture:** Each tool requires one new ES JSON file, a slug entry in `SLUG_MAP_ES`, and a slug added to `TOOL_EN_SLUGS` in the Spanish page component. `TOOL_META_ES` entries already exist for all 6. After user approves each tool, update Notion (Spanish Status → Live, Spanish Route populated).

**Tech Stack:** Next.js 14 App Router, TypeScript, JSON CMS (`content/tools/es/`), Notion MCP

---

## File Map

| Action | Path |
|--------|------|
| Create | `content/tools/es/preparacion-llamada-seguro.json` |
| Create | `content/tools/es/calculadora-salario.json` |
| Create | `content/tools/es/solicitud-registros.json` |
| Create | `content/tools/es/preparacion-acuerdo.json` |
| Create | `content/tools/es/proximos-pasos-estado.json` |
| Create | `content/tools/es/cuenta-regresiva-plazo.json` |
| Modify | `i18n/config.ts` — add 5 slugs to `SLUG_MAP_ES` |
| Modify | `app/(es)/es/herramientas/[slug]/page.tsx` — add 6 slugs to `TOOL_EN_SLUGS` |

**Translation rules:**
- `slug`, all text fields → Spanish
- `steps[].options[].value` → keep as-is (internal keys)
- `relatedTools`, `relatedGuides`, `relatedAccidents` → keep as EN slugs
- Register: formal "usted" throughout (matches existing ES tools)

---

## Task 1: insurance-call-prep

**Files:**
- Create: `content/tools/es/preparacion-llamada-seguro.json`
- Modify: `i18n/config.ts` (line 38 area — add slug after `lost-wages-estimator` entry)
- Modify: `app/(es)/es/herramientas/[slug]/page.tsx` (line 17 — `TOOL_EN_SLUGS`)

- [ ] **Step 1: Create the Spanish JSON file**

Create `content/tools/es/preparacion-llamada-seguro.json`:

```json
{
  "slug": "preparacion-llamada-seguro",
  "title": "Herramienta de Preparación para Llamadas con el Seguro",
  "metaTitle": "Herramienta de Preparación para Llamadas con el Seguro — Guía para Víctimas de Accidentes",
  "metaDescription": "Prepárese para su llamada al seguro con un guión personalizado, preguntas clave, información que recopilar y errores comunes que evitar antes de marcar.",
  "description": "Las llamadas con los ajustadores de seguros después de un accidente pueden sentirse de alta importancia — porque lo son. Lo que dice y cómo lo dice importa. Esta herramienta le ayuda a organizar lo que debe tener a mano, qué preguntas hacer y qué evitar decir, para que pueda abordar la llamada con más confianza.",
  "disclaimer": "Esta herramienta proporciona información educativa general sobre prácticas comunes en reclamaciones de seguros. No constituye asesoramiento legal. Las pólizas de seguro y los procesos de reclamaciones varían significativamente. Antes de dar cualquier declaración grabada a cualquier compañía de seguros, considere consultar a un abogado de lesiones personales con licencia.",
  "steps": [
    {
      "id": "caller-type",
      "question": "¿A quién va a llamar?",
      "type": "select",
      "options": [
        { "value": "your-insurer", "label": "Su propia compañía de seguros" },
        { "value": "other-driver-insurer", "label": "La compañía de seguros del otro conductor" },
        { "value": "health-insurer", "label": "Su aseguradora de salud" },
        { "value": "workers-comp", "label": "Aseguradora de compensación laboral" }
      ]
    },
    {
      "id": "call-purpose",
      "question": "¿Cuál es el propósito de su llamada?",
      "type": "select",
      "options": [
        { "value": "report-claim", "label": "Reportar una nueva reclamación" },
        { "value": "follow-up", "label": "Dar seguimiento a una reclamación existente" },
        { "value": "dispute-decision", "label": "Disputar una decisión de cobertura" },
        { "value": "request-info", "label": "Solicitar información o documentos" }
      ]
    },
    {
      "id": "info-available",
      "question": "¿Qué información tiene disponible actualmente? (Seleccione todas las que apliquen)",
      "type": "checklist",
      "options": [
        { "value": "claim-number", "label": "Número de reclamación" },
        { "value": "police-report-number", "label": "Número del informe policial" },
        { "value": "photos-documentation", "label": "Fotos y documentación del accidente" },
        { "value": "medical-records", "label": "Registros o facturas médicas" },
        { "value": "witness-info", "label": "Información de contacto de testigos" },
        { "value": "policy-number", "label": "Número de póliza de seguro" },
        { "value": "none-of-above", "label": "Ninguna de las anteriores aún" }
      ]
    }
  ],
  "supportingContent": [
    {
      "heading": "Su seguro vs. el seguro de la otra parte",
      "content": "Hay dos tipos muy diferentes de llamadas al seguro que puede necesitar hacer después de un accidente. Las llamadas a su propia compañía de seguros están regidas por sus obligaciones contractuales — generalmente debe reportar el accidente de manera oportuna y cooperar con su propio asegurador. Las llamadas a la compañía de seguros de la otra parte son un asunto diferente: usted no tiene ninguna obligación contractual con su ajustador, ellos representan los intereses de la parte contraria y no está obligado a dar una declaración grabada. Entender qué tipo de llamada está haciendo define todo sobre cómo debe abordarla.",
      "tips": [
        "Reporte a su propio asegurador de inmediato — su póliza requiere aviso oportuno",
        "Por lo general, no está obligado a dar una declaración grabada a la aseguradora del otro conductor",
        "Solicite el nombre del ajustador, su número directo y el número de reclamación al inicio de cada llamada"
      ]
    },
    {
      "heading": "Información que debe tener lista antes de llamar",
      "content": "Antes de llamar a cualquier compañía de seguros, reúna: su número de póliza y página de declaraciones, el número oficial del informe policial (si está disponible), el nombre, placa y datos del seguro del otro conductor, los nombres e información de contacto de cualquier testigo, fotos de los daños y la escena, un resumen cronológico de los hechos (escrito con anticipación para mantenerse coherente), los nombres de sus proveedores médicos y cualquier tratamiento recibido, y una lista de los gastos en que ha incurrido. Estar organizado evita proporcionar información incompleta o hacer declaraciones inconsistentes en múltiples llamadas.",
      "tips": [
        "Escriba un breve resumen factual del accidente antes de la llamada y apéguese a él",
        "No adivine detalles que no conoce — 'No lo sé' es una respuesta válida",
        "Tome notas durante cada llamada: fecha, hora, nombre del ajustador, lo que se dijo"
      ]
    },
    {
      "heading": "Lo que no debe decir a un ajustador de seguros",
      "content": "Los ajustadores de seguros están capacitados para recopilar información que puede usarse para minimizar o negar su reclamación. Evite estos errores comunes: no se disculpe ni diga nada que pueda interpretarse como admisión de culpa; no diga que se siente 'bien' o 'okay' — estas declaraciones se usan para disputar la gravedad de las lesiones; no acepte dar una declaración grabada sin consultar primero a un abogado, especialmente para la aseguradora del otro conductor; no acepte una oferta de acuerdo sin comprender el alcance total de sus lesiones y daños; y no especule sobre la causa del accidente ni sobre sus propias lesiones.",
      "tips": [
        "Nunca diga 'me siento bien' — puede usarse para disputar sus lesiones más adelante",
        "Apéguese a los hechos que conoce con certeza; evite especular",
        "Siempre puede decir 'necesito devolverle la llamada' si se siente sin preparación o presionado"
      ]
    },
    {
      "heading": "Cómo manejar ofertas de acuerdo bajas",
      "content": "Las compañías de seguros frecuentemente hacen ofertas de acuerdo tempranas y bajas a personas lesionadas que aún no comprenden completamente sus lesiones, costos médicos u opciones legales. Una vez que acepta un acuerdo y firma una liberación, generalmente no puede buscar compensación adicional — incluso si sus lesiones resultan ser más graves de lo esperado. Antes de aceptar cualquier oferta de acuerdo, asegúrese de que su tratamiento médico esté completo o haya alcanzado la mejoría médica máxima, de que haya documentado todas sus pérdidas económicas, y de haber consultado con un abogado de lesiones personales que pueda evaluar si la oferta refleja el valor real de su reclamación."
    }
  ],
  "faq": [
    {
      "question": "¿Tengo que dar una declaración grabada a la compañía de seguros del otro conductor?",
      "answer": "En la mayoría de los casos, no. Por lo general, no está obligado a dar una declaración grabada a la compañía de seguros de la parte contraria. Ellos representan los intereses del otro conductor, no los suyos. Puede declinar cortésmente e indicar que prefiere que el asunto se maneje por escrito o a través de su abogado. Su propia compañía de seguros puede requerir una declaración según las obligaciones de su póliza."
    },
    {
      "question": "¿Qué debo hacer si el ajustador me presiona para llegar a un acuerdo rápidamente?",
      "answer": "No se sienta presionado a aceptar una oferta temprana. Las ofertas de acuerdo tempranas suelen estar por debajo del valor real de una reclamación, especialmente antes de conocer el alcance total de sus lesiones. Tiene derecho a tomarse el tiempo necesario para consultar a un abogado, completar su tratamiento médico y documentar completamente sus daños antes de tomar cualquier decisión de acuerdo."
    },
    {
      "question": "¿Debo contratar a un abogado antes de hablar con las compañías de seguros?",
      "answer": "Consultar a un abogado de lesiones personales antes de dar cualquier declaración grabada — especialmente a la aseguradora de la otra parte — es generalmente recomendable en casos que involucren lesiones significativas, responsabilidad disputada o circunstancias complejas. La mayoría de los abogados de lesiones personales ofrecen consultas iniciales gratuitas, y su orientación puede proteger su reclamación de errores tempranos."
    }
  ],
  "relatedTools": ["evidence-checklist", "record-request", "accident-case-quiz"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "uber-lyft", "bicycle"]
}
```

- [ ] **Step 2: Add slug to `SLUG_MAP_ES` in `i18n/config.ts`**

In `i18n/config.ts`, after the `'lost-wages-estimator': 'calculadora-salario',` line (currently line 38), add:

```ts
  'insurance-call-prep': 'preparacion-llamada-seguro',
```

- [ ] **Step 3: Add EN slug to `TOOL_EN_SLUGS` in the Spanish page**

In `app/(es)/es/herramientas/[slug]/page.tsx`, update `TOOL_EN_SLUGS`:

```ts
const TOOL_EN_SLUGS = [
  'accident-case-quiz',
  'urgency-checker',
  'evidence-checklist',
  'injury-journal',
  'lawyer-type-matcher',
  'insurance-call-prep',
]
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add content/tools/es/preparacion-llamada-seguro.json i18n/config.ts "app/(es)/es/herramientas/[slug]/page.tsx"
git commit -m "feat(es): add Spanish tool — insurance-call-prep (preparacion-llamada-seguro)"
```

- [ ] **Step 6: Stop — ask user to review before proceeding**

> "Tool 1 of 6 done: `/es/herramientas/preparacion-llamada-seguro`. Ready for your review. Once approved, I'll update Notion and move to tool 2."

- [ ] **Step 7: After user approves — update Notion**

Update Notion page `352917dc-7b83-8105-9075-e6f7b149d9b1`:
- `Spanish Status` → `Live`
- `Spanish Route` → `https://accident-path.vercel.app/es/herramientas/preparacion-llamada-seguro`

---

## Task 2: lost-wages-estimator

**Files:**
- Create: `content/tools/es/calculadora-salario.json`
- Modify: `app/(es)/es/herramientas/[slug]/page.tsx` (`TOOL_EN_SLUGS`)
- Note: `SLUG_MAP_ES` already has `'lost-wages-estimator': 'calculadora-salario'` — no change needed

- [ ] **Step 1: Create the Spanish JSON file**

Create `content/tools/es/calculadora-salario.json`:

```json
{
  "slug": "calculadora-salario",
  "title": "Calculadora de Salario Perdido",
  "metaTitle": "Calculadora de Salario Perdido — Estimador de Pérdida de Ingresos por Accidente",
  "metaDescription": "Estime los ingresos que pudo haber perdido debido a lesiones por accidente. Comprenda qué documentación respalda una reclamación por salarios perdidos antes de consultar con un abogado.",
  "description": "Una lesión que le impide trabajar — o limita su capacidad laboral — puede tener graves consecuencias financieras. Esta herramienta educativa le ayuda a comprender los componentes de una reclamación por salarios perdidos, estimar pérdidas potenciales e identificar la documentación que necesitará para respaldar una reclamación.",
  "disclaimer": "Este estimador proporciona cálculos aproximados con fines educativos únicamente. Las reclamaciones reales por salarios perdidos dependen de registros de empleo, documentación médica, la naturaleza de su empleo y la legislación aplicable. Consulte a un abogado con licencia y a su contador para obtener orientación específica a su situación.",
  "steps": [
    {
      "id": "employment-type",
      "question": "¿Cuál es su situación laboral?",
      "type": "select",
      "options": [
        { "value": "full-time", "label": "Empleado de tiempo completo (asalariado)" },
        { "value": "full-time-hourly", "label": "Empleado de tiempo completo (por hora)" },
        { "value": "part-time", "label": "Empleado de tiempo parcial" },
        { "value": "self-employed", "label": "Trabajador independiente o freelance" },
        { "value": "gig-worker", "label": "Trabajador de plataformas (transporte, entrega, etc.)" },
        { "value": "not-employed", "label": "Sin empleo actualmente" }
      ]
    },
    {
      "id": "income",
      "question": "¿Cuál es su monto de ingresos? (tarifa por hora o salario anual)",
      "type": "number"
    },
    {
      "id": "days-missed",
      "question": "¿Cuántos días de trabajo ha perdido debido a sus lesiones?",
      "type": "number"
    },
    {
      "id": "reduced-hours",
      "question": "¿Ha regresado al trabajo con horas o capacidad reducida?",
      "type": "select",
      "options": [
        { "value": "yes-reduced", "label": "Sí — trabajando con horas reducidas" },
        { "value": "yes-light-duty", "label": "Sí — en trabajo ligero / funciones modificadas" },
        { "value": "no-full-capacity", "label": "No — de vuelta a plena capacidad" },
        { "value": "not-returned", "label": "Todavía no he regresado al trabajo" },
        { "value": "not-applicable", "label": "No aplica" }
      ]
    },
    {
      "id": "ongoing",
      "question": "¿Sigue sin poder regresar a su plena capacidad laboral?",
      "type": "select",
      "options": [
        { "value": "yes-ongoing", "label": "Sí — todavía no puedo trabajar" },
        { "value": "yes-partial", "label": "Sí — puedo trabajar parcialmente" },
        { "value": "no-recovered", "label": "No — me he recuperado completamente" },
        { "value": "uncertain", "label": "Incierto sobre la capacidad futura" }
      ]
    }
  ],
  "supportingContent": [
    {
      "heading": "¿Qué son los salarios perdidos en un caso de lesiones personales?",
      "content": "Los salarios perdidos — también llamados ingresos perdidos o ganancias perdidas — se refieren a los ingresos que ha perdido porque sus lesiones le impidieron trabajar. Esto incluye los salarios que habría ganado en su trabajo habitual, ingresos por trabajo independiente, ingresos por plataformas, bonos que no recibió, días de vacaciones o enfermedad que se vio obligado a usar, e ingresos perdidos por capacidad laboral reducida incluso si regresó al trabajo. En casos graves, la capacidad de ganancias futuras perdida también puede ser recuperable si sus lesiones afectan su capacidad de trabajar a largo plazo.",
      "tips": [
        "Los salarios perdidos cubren todos los tipos de ingresos: sueldos, ingresos por trabajo independiente e ingresos de plataformas",
        "Los días de vacaciones o enfermedad usados debido a la lesión pueden incluirse",
        "La capacidad de ganancias reducida — trabajar menos horas o en un empleo de menor paga — también es compensable"
      ]
    },
    {
      "heading": "Documentación requerida para respaldar una reclamación por salarios perdidos",
      "content": "Para respaldar una reclamación por salarios perdidos, generalmente necesita documentación que muestre sus ingresos previos al accidente, prueba de los días u horas que no trabajó, y evidencia médica que confirme que sus lesiones le impidieron trabajar. Los documentos comunes incluyen talones de pago, formularios W-2 o 1099, declaraciones de impuestos (especialmente para trabajadores independientes), una carta de su empleador confirmando el tiempo perdido y su tarifa de pago habitual, y una nota de su médico tratante indicando que su condición le impidió trabajar. Los trabajadores independientes suelen necesitar documentación adicional como facturas, contratos o correspondencia con clientes que muestren negocios perdidos.",
      "tips": [
        "Reúna al menos tres meses de talones de pago anteriores al accidente como prueba de ingresos base",
        "Pida a su empleador una declaración escrita de su tarifa de pago y los días perdidos",
        "Lleve un registro de todos los ingresos comerciales que perdió si es trabajador independiente o freelance"
      ]
    },
    {
      "heading": "Capacidad de ganancias perdidas vs. salarios perdidos",
      "content": "Los salarios perdidos y la capacidad de ganancias perdidas son conceptos distintos en el derecho de lesiones personales. Los salarios perdidos se refieren a ingresos específicos que ya ha perdido debido al tiempo que no pudo trabajar. La capacidad de ganancias perdidas se refiere a la reducción en su capacidad de generar ingresos en el futuro como resultado de sus lesiones — por ejemplo, si ya no puede desempeñar su trabajo anterior y debe aceptar un puesto de menor paga, o si el dolor crónico o la discapacidad limitarán su poder adquisitivo por años. Las reclamaciones por capacidad futura de ganancias generalmente requieren testimonio de expertos en rehabilitación vocacional y economistas.",
      "tips": [
        "Documente cómo sus lesiones han cambiado su capacidad para realizar las funciones específicas de su trabajo",
        "Anote cualquier ascenso, aumento o oportunidad laboral que perdió debido a su lesión",
        "Las reclamaciones por capacidad futura de ganancias son comunes en casos de lesiones graves o permanentes"
      ]
    },
    {
      "heading": "Consideraciones especiales para trabajadores independientes y de plataformas",
      "content": "Calcular los salarios perdidos para trabajadores independientes, freelancers y trabajadores de plataformas es más complejo que para empleados tradicionales, pero los ingresos perdidos siguen siendo recuperables. La clave es demostrar sus ganancias habituales mediante declaraciones de impuestos, estados de cuenta bancarios, facturas, contratos, comunicaciones con clientes y registros de ganancias de plataformas (como estados de Uber, DoorDash o Upwork). Los ingresos perdidos por plataformas pueden requerir mostrar sus ganancias históricas durante el mismo período en años anteriores como referencia. Un abogado o contador con experiencia en ingresos por trabajo independiente puede ayudarle a estructurar esta documentación de manera efectiva."
    }
  ],
  "faq": [
    {
      "question": "¿Puedo recuperar salarios perdidos si usé licencia por enfermedad o vacaciones mientras estaba lesionado/a?",
      "answer": "En muchos casos de lesiones personales, sí. Si se vio obligado a usar días de enfermedad o vacaciones acumulados debido a sus lesiones, el valor de esa licencia — que de otro modo habría tenido disponible — puede ser recuperable como parte de su reclamación por salarios perdidos. Lleve un registro de cuánta licencia usó y cuándo."
    },
    {
      "question": "¿Qué pasa si soy trabajador independiente y mis ingresos varían mes a mes?",
      "answer": "Los demandantes que trabajan de forma independiente generalmente utilizan declaraciones de impuestos de años anteriores, estados de cuenta bancarios y facturas para establecer su ingreso mensual promedio como referencia. Una comparación con el mismo período en años anteriores puede ayudar a demostrar los ingresos perdidos durante la recuperación. Un abogado puede ayudarle a estructurar esta evidencia para su situación específica."
    },
    {
      "question": "¿Cómo se calculan los salarios perdidos para trabajadores de tiempo parcial?",
      "answer": "Los salarios perdidos para trabajadores de tiempo parcial generalmente se calculan con base en su tarifa horaria real y las horas que habría trabajado durante el período en que no pudo trabajar. Los talones de pago y la documentación del empleador que muestre su horario habitual y tarifa son la evidencia clave. Las horas extra perdidas y las propinas también pueden incluirse si eran parte regular de sus ingresos."
    }
  ],
  "relatedTools": ["injury-journal", "settlement-readiness", "record-request"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "slip-fall", "bicycle"]
}
```

- [ ] **Step 2: Add EN slug to `TOOL_EN_SLUGS`**

In `app/(es)/es/herramientas/[slug]/page.tsx`:

```ts
const TOOL_EN_SLUGS = [
  'accident-case-quiz',
  'urgency-checker',
  'evidence-checklist',
  'injury-journal',
  'lawyer-type-matcher',
  'insurance-call-prep',
  'lost-wages-estimator',
]
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add content/tools/es/calculadora-salario.json "app/(es)/es/herramientas/[slug]/page.tsx"
git commit -m "feat(es): add Spanish tool — lost-wages-estimator (calculadora-salario)"
```

- [ ] **Step 5: Stop — ask user to review before proceeding**

> "Tool 2 of 6 done: `/es/herramientas/calculadora-salario`. Ready for your review. Once approved, I'll update Notion and move to tool 3."

- [ ] **Step 6: After user approves — update Notion**

Update Notion page `352917dc-7b83-8167-80fb-e57aaa0db94b`:
- `Spanish Status` → `Live`
- `Spanish Route` → `https://accident-path.vercel.app/es/herramientas/calculadora-salario`

---

## Task 3: record-request

**Files:**
- Create: `content/tools/es/solicitud-registros.json`
- Modify: `i18n/config.ts` (add `'record-request': 'solicitud-registros'`)
- Modify: `app/(es)/es/herramientas/[slug]/page.tsx` (`TOOL_EN_SLUGS`)

- [ ] **Step 1: Create the Spanish JSON file**

Create `content/tools/es/solicitud-registros.json`:

```json
{
  "slug": "solicitud-registros",
  "title": "Lista de Solicitud de Registros",
  "metaTitle": "Lista de Solicitud de Registros — Después de un Accidente",
  "metaDescription": "Sepa qué registros solicitar después de su accidente, a quién contactar para cada uno, y los plazos y costos típicos involucrados en recopilar su documentación.",
  "description": "Construir un expediente documental completo después de un accidente es una de las cosas más importantes que puede hacer para proteger sus opciones. Esta lista identifica los tipos de registros comúnmente necesarios en casos de lesiones personales, quién los tiene y cómo solicitarlos antes de que venzan los plazos o se destruyan los registros.",
  "disclaimer": "Esta lista proporciona información educativa general sobre los tipos de registros comúnmente relevantes en casos de lesiones personales. No constituye asesoramiento legal. Los registros específicos que importan en su caso dependen de sus circunstancias individuales. Un abogado puede asesorarle sobre qué registros priorizar.",
  "steps": [
    {
      "id": "accident-type",
      "question": "¿En qué tipo de accidente estuvo involucrado/a?",
      "type": "select",
      "options": [
        { "value": "car-accident", "label": "Accidente de auto" },
        { "value": "truck-accident", "label": "Accidente de camión" },
        { "value": "motorcycle-crash", "label": "Accidente de motocicleta" },
        { "value": "bicycle-accident", "label": "Accidente de bicicleta" },
        { "value": "pedestrian-accident", "label": "Accidente de peatón" },
        { "value": "slip-fall", "label": "Resbalón y caída" },
        { "value": "dog-bite", "label": "Mordedura de perro o ataque de animal" },
        { "value": "workplace-injury", "label": "Lesión en el lugar de trabajo" },
        { "value": "other", "label": "Otro" }
      ]
    },
    {
      "id": "records-needed",
      "question": "¿Qué tipos de registros desea obtener? (Seleccione todos los que apliquen)",
      "type": "checklist",
      "options": [
        { "value": "police-report", "label": "Informe policial / del accidente" },
        { "value": "hospital-records", "label": "Registros de hospital o sala de emergencias" },
        { "value": "ongoing-medical", "label": "Registros médicos continuos / del médico" },
        { "value": "imaging-records", "label": "Registros de imágenes (rayos X, resonancia magnética, tomografía)" },
        { "value": "pharmacy-records", "label": "Registros de farmacia" },
        { "value": "employment-wage", "label": "Registros de empleo e ingresos" },
        { "value": "insurance-policy", "label": "Documentos de póliza de seguro" },
        { "value": "property-damage", "label": "Estimados o avalúos de daños a la propiedad" },
        { "value": "surveillance-footage", "label": "Imágenes de cámaras de vigilancia o seguridad" },
        { "value": "rideshare-data", "label": "Datos de viaje de plataformas (Uber / Lyft)" }
      ]
    }
  ],
  "supportingContent": [
    {
      "heading": "Informes policiales y de accidentes",
      "content": "El informe oficial del accidente o incidente elaborado por las autoridades es uno de los documentos más importantes en un caso de lesiones personales. Contiene las observaciones del oficial, la información de contacto y del seguro de las partes, las citaciones emitidas, la información de los testigos y la evaluación preliminar del oficial sobre lo ocurrido. En California, puede solicitar una copia a la agencia que respondió — departamento de policía de la ciudad, sheriff del condado o Patrulla de Carreteras de California — generalmente entre 3 y 10 días después del incidente. En Arizona, los informes están disponibles a través del Departamento de Seguridad Pública de Arizona o la agencia local. Por lo general, hay una tarifa, y puede solicitar el informe en persona, por correo o en línea.",
      "tips": [
        "Solicite el informe a la agencia específica que respondió, no a un portal genérico",
        "Si fue víctima de un choque y fuga, solicite cualquier informe complementario presentado mientras continúa la investigación",
        "Su abogado también puede solicitar copias certificadas directamente a las autoridades"
      ]
    },
    {
      "heading": "Registros médicos y facturas",
      "content": "Los registros médicos completos de cada proveedor que trató sus lesiones relacionadas con el accidente son esenciales. Esto incluye registros de sala de emergencias, registros de hospitalización, informes de imágenes (rayos X, tomografías, resonancias magnéticas), notas del médico tratante, consultas con especialistas, registros de fisioterapia, registros de quiropráctica, registros de tratamiento de salud mental y todos los estados de cuenta de facturación asociados. Solicite facturas detalladas en lugar de resúmenes — las facturas detalladas muestran cada servicio prestado y su costo, lo que es más útil para documentar los daños. La mayoría de los proveedores cobran una tarifa por los registros; presente una solicitud escrita conforme a HIPAA a cada proveedor.",
      "tips": [
        "Solicite registros a cada proveedor, incluso a los que vio solo una vez",
        "Pida tanto las notas clínicas narrativas como los registros de facturación",
        "Guarde copias de todos los registros en un lugar seguro y proporcione copias a su abogado"
      ]
    },
    {
      "heading": "Registros de empleo e ingresos",
      "content": "Para documentar los salarios perdidos, necesita registros que muestren tanto sus ingresos previos al accidente como los ingresos que perdió debido a las ausencias laborales. Los documentos clave incluyen talones de pago recientes (que cubran al menos tres meses antes del accidente), formularios W-2 o 1099 del año anterior uno o dos años, una carta de su empleador confirmando su puesto, tarifa de pago y fechas de ausencia, y documentación de cualquier bono, comisión o beneficio que no recibió. Los trabajadores independientes deben reunir declaraciones de impuestos, estados de cuenta bancarios, facturas de clientes y contratos que muestren las ganancias habituales.",
      "tips": [
        "Solicite una carta formal de su empleador en papel membretado confirmando su ausencia",
        "Reúna documentación de horas extra, propinas y comisiones si eran parte de sus ingresos regulares",
        "Dos años de declaraciones de impuestos proporcionan una base sólida para reclamaciones de ingresos por trabajo independiente"
      ]
    },
    {
      "heading": "Envío de solicitudes de preservación para evidencia sensible al tiempo",
      "content": "Algunos registros se eliminan o sobrescriben en ciclos de retención cortos y deben preservarse formalmente antes de perderse. Las imágenes de cámaras de vigilancia y seguridad en negocios e intersecciones a menudo se sobrescriben en un plazo de 24 a 72 horas. Las imágenes de dashcam de vehículos de transporte o entrega también pueden tener un ciclo de retención corto. Las imágenes de cámaras de semáforo y tránsito generalmente están controladas por agencias de transporte municipales o estatales. Para preservar esta evidencia, envíe una carta de preservación escrita — por correo certificado o a través de un abogado — al negocio o agencia de inmediato después del accidente, describiendo claramente las imágenes que necesita, la fecha y hora, y solicitando que no sean destruidas."
    }
  ],
  "faq": [
    {
      "question": "¿Cuánto tiempo tarda en obtener mis registros médicos?",
      "answer": "Según HIPAA, los proveedores de atención médica tienen 30 días para responder a una solicitud de registros, con opción de una prórroga de 30 días. Algunos proveedores responden más rápido; los grandes sistemas hospitalarios pueden tomarse los 30 días completos. Solicite los registros lo antes posible para dar tiempo a retrasos, especialmente si tiene un plazo en el caso o se acerca el plazo de prescripción."
    },
    {
      "question": "¿Qué es un formulario de autorización HIPAA y necesito uno?",
      "answer": "Un formulario de autorización HIPAA es un documento que otorga permiso a un proveedor de atención médica para divulgar sus registros médicos a un destinatario específico — como usted, su abogado o una compañía de seguros. La mayoría de los proveedores tienen sus propios formularios; usted firma y presenta el formulario junto con su solicitud de registros. Su abogado también le pedirá normalmente que firme una autorización HIPAA general que le permita solicitar registros en su nombre."
    },
    {
      "question": "¿Puedo obtener registros de un negocio que no quiere proporcionarlos?",
      "answer": "Si un negocio se niega a proporcionar voluntariamente registros o imágenes de vigilancia, su abogado puede emitir una citación obligando su presentación si se ha iniciado un litigio. Antes del litigio, una carta formal de preservación de un abogado puede promover el cumplimiento. Las agencias policiales a veces pueden obtener ciertos registros a través de su investigación que de otro modo no están disponibles al público."
    }
  ],
  "relatedTools": ["evidence-checklist", "insurance-call-prep", "settlement-readiness"],
  "relatedGuides": ["after-car-accident", "getting-your-police-report"],
  "relatedAccidents": ["car", "truck", "motorcycle", "slip-fall", "bicycle", "pedestrian"]
}
```

- [ ] **Step 2: Add slug to `SLUG_MAP_ES` in `i18n/config.ts`**

After the `'insurance-call-prep': 'preparacion-llamada-seguro',` line, add:

```ts
  'record-request': 'solicitud-registros',
```

- [ ] **Step 3: Add EN slug to `TOOL_EN_SLUGS`**

```ts
const TOOL_EN_SLUGS = [
  'accident-case-quiz',
  'urgency-checker',
  'evidence-checklist',
  'injury-journal',
  'lawyer-type-matcher',
  'insurance-call-prep',
  'lost-wages-estimator',
  'record-request',
]
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add content/tools/es/solicitud-registros.json i18n/config.ts "app/(es)/es/herramientas/[slug]/page.tsx"
git commit -m "feat(es): add Spanish tool — record-request (solicitud-registros)"
```

- [ ] **Step 6: Stop — ask user to review before proceeding**

> "Tool 3 of 6 done: `/es/herramientas/solicitud-registros`. Ready for your review. Once approved, I'll update Notion and move to tool 4."

- [ ] **Step 7: After user approves — update Notion**

Update Notion page `352917dc-7b83-8134-b5fc-ea979d0a9f54`:
- `Spanish Status` → `Live`
- `Spanish Route` → `https://accident-path.vercel.app/es/herramientas/solicitud-registros`

---

## Task 4: settlement-readiness

**Files:**
- Create: `content/tools/es/preparacion-acuerdo.json`
- Modify: `i18n/config.ts` (add `'settlement-readiness': 'preparacion-acuerdo'`)
- Modify: `app/(es)/es/herramientas/[slug]/page.tsx` (`TOOL_EN_SLUGS`)

- [ ] **Step 1: Create the Spanish JSON file**

Create `content/tools/es/preparacion-acuerdo.json`:

```json
{
  "slug": "preparacion-acuerdo",
  "title": "Lista de Preparación para Acuerdo",
  "metaTitle": "Lista de Preparación para Acuerdo — ¿Está Listo/a?",
  "metaDescription": "Evalúe si puede estar listo/a para hablar de un acuerdo. Identifique qué documentación debe tener en orden antes de iniciar cualquier conversación de acuerdo.",
  "description": "Llegar a un acuerdo en una reclamación de lesiones personales antes de estar listo/a puede resultar en una compensación que no refleja sus pérdidas reales. Esta lista educativa le ayuda a identificar si los elementos más importantes suelen estar en orden antes de que comiencen las negociaciones — y qué puede faltar aún.",
  "disclaimer": "Esta lista proporciona información educativa general sobre la preparación para acuerdos y no constituye asesoramiento legal. El momento adecuado para llegar a un acuerdo depende de su situación médica individual, los hechos del caso y las circunstancias legales. Consulte a un abogado de lesiones personales con licencia antes de aceptar cualquier oferta de acuerdo.",
  "steps": [
    {
      "id": "medical-status",
      "question": "¿Cuál es el estado actual de su tratamiento médico?",
      "type": "select",
      "options": [
        { "value": "yes-complete", "label": "Sí — el tratamiento está completo" },
        { "value": "yes-mmi", "label": "Sí — alcancé la mejoría médica máxima (MMI)" },
        { "value": "no-still-treating", "label": "No — todavía recibo tratamiento" },
        { "value": "uncertain", "label": "Incierto" }
      ]
    },
    {
      "id": "records-gathered",
      "question": "¿Cuál de los siguientes registros tiene actualmente? (Seleccione todos los que apliquen)",
      "type": "checklist",
      "options": [
        { "value": "medical-records", "label": "Registros y facturas médicas" },
        { "value": "police-report", "label": "Informe policial o del accidente" },
        { "value": "wage-loss-docs", "label": "Documentación de pérdida de salario" },
        { "value": "property-damage", "label": "Estimados o avalúos de daños a la propiedad" },
        { "value": "photos-evidence", "label": "Fotos y evidencia de la escena del accidente" },
        { "value": "witness-statements", "label": "Declaraciones de testigos o información de contacto" },
        { "value": "insurance-correspondence", "label": "Correspondencia de seguros y registros de reclamaciones" },
        { "value": "none-yet", "label": "Ninguno recopilado aún" }
      ]
    },
    {
      "id": "wages-documented",
      "question": "¿Ha documentado sus salarios perdidos y otras pérdidas económicas?",
      "type": "select",
      "options": [
        { "value": "yes", "label": "Sí — completamente documentado" },
        { "value": "partially", "label": "Parcialmente documentado" },
        { "value": "no", "label": "No — aún no documentado" },
        { "value": "not-applicable", "label": "No aplica — sin pérdida de ingresos" }
      ]
    },
    {
      "id": "attorney-consulted",
      "question": "¿Ha consultado con un abogado de lesiones personales?",
      "type": "select",
      "options": [
        { "value": "yes-retained", "label": "Sí — contraté a un abogado" },
        { "value": "yes-consulted", "label": "Sí — tuve una consulta pero no lo contraté" },
        { "value": "not-yet", "label": "Todavía no" },
        { "value": "no-plan-to-self-represent", "label": "No — planeo manejarlo yo mismo/a" }
      ]
    }
  ],
  "supportingContent": [
    {
      "heading": "Por qué llegar a un acuerdo demasiado pronto puede perjudicar su reclamación",
      "content": "Las compañías de seguros frecuentemente presentan ofertas de acuerdo tempranas que parecen razonables pero no tienen en cuenta el alcance total de sus lesiones, necesidades médicas a largo plazo o ingresos futuros perdidos. Una vez que firma una liberación de acuerdo, generalmente renuncia a su derecho a buscar compensación adicional — incluso si sus lesiones resultan ser más graves de lo que inicialmente parecía. Llegar a un acuerdo antes de haber alcanzado la mejoría médica máxima y documentado todas sus pérdidas significa que puede estar renunciando a derechos que no puede recuperar. La mayoría de los abogados de lesiones personales aconsejan a sus clientes no llegar a un acuerdo hasta que el tratamiento médico esté completo o el pronóstico esté claramente establecido.",
      "tips": [
        "No acepte una oferta hasta que su tratamiento médico esté completo o haya alcanzado la mejoría máxima",
        "Firmar una liberación es permanente — no puede reabrir una reclamación después de llegar a un acuerdo",
        "Una oferta de acuerdo rápida a menudo indica que la aseguradora cree que su reclamación vale más"
      ]
    },
    {
      "heading": "¿Qué significa 'mejoría médica máxima'?",
      "content": "La mejoría médica máxima (MMI, por sus siglas en inglés) es el punto en que sus médicos tratantes determinan que su condición se ha estabilizado y es poco probable que mejore significativamente, incluso con tratamiento continuo. Alcanzar la MMI no significa que se haya recuperado completamente — significa que su condición ha llegado a una meseta. Llegar a un acuerdo antes de la MMI conlleva un riesgo significativo porque el costo total de sus necesidades médicas futuras, las limitaciones continuas y el impacto a largo plazo en su vida pueden no ser conocidos aún. Un abogado puede asesorarle sobre cómo aplica la MMI a sus lesiones y pronóstico específicos.",
      "tips": [
        "Pregúntele directamente a su médico tratante si ha alcanzado la mejoría médica máxima",
        "Obtenga por escrito cualquier recomendación de atención a largo plazo de su médico",
        "Las calificaciones de discapacidad o deterioro permanente pueden ser parte de su evaluación de MMI"
      ]
    },
    {
      "heading": "El panorama completo: daños económicos y no económicos",
      "content": "Un acuerdo completo debe tener en cuenta todas las categorías de daños recuperables: facturas médicas (pasadas y futuras), salarios perdidos (capacidad de ganancias pasada y futura), daños a la propiedad, gastos de bolsillo, dolor y sufrimiento, pérdida de disfrute de la vida, angustia emocional y — en casos de conducta indebida grave — potencialmente daños punitivos. Muchas víctimas de accidentes se enfocan solo en sus facturas médicas y omiten otros componentes significativos. Un abogado de lesiones personales puede ayudarle a identificar y documentar todos los daños aplicables antes de que entre en negociaciones de acuerdo.",
      "tips": [
        "Los daños no económicos como el dolor y sufrimiento pueden superar las facturas médicas en casos graves",
        "Los costos médicos futuros requieren la estimación de un experto médico, no su propia proyección",
        "Documente cada gasto de bolsillo: transporte, equipos, modificaciones del hogar"
      ]
    },
    {
      "heading": "¿Debe contratar a un abogado antes de llegar a un acuerdo?",
      "content": "Los estudios y la experiencia de la industria muestran consistentemente que los demandantes de lesiones personales representados por abogados generalmente recuperan más — incluso después de los honorarios legales — que quienes negocian por su cuenta. Un abogado puede identificar daños que pudo haber pasado por alto, negociar desde una posición de conocimiento legal, prevenir errores comunes en el proceso de acuerdo y asesorarle sobre las implicaciones fiscales de los diferentes componentes de un acuerdo. La mayoría de los abogados de lesiones personales trabajan en base a honorarios contingentes, lo que significa que no hay tarifas anticipadas — se les paga solo si recuperan dinero para usted."
    }
  ],
  "faq": [
    {
      "question": "¿Cómo sé si una oferta de acuerdo es justa?",
      "answer": "Evaluar una oferta de acuerdo requiere conocer el valor total de su reclamación — que incluye todos los costos médicos pasados y futuros, ingresos perdidos, dolor y sufrimiento y otros daños. Los ajustadores de seguros calculan los acuerdos basándose en sus propias fórmulas; un abogado de lesiones personales experimentado puede evaluar independientemente la oferta frente al valor real de su reclamación y asesorarle sobre si aceptar, contraofertar o continuar negociando."
    },
    {
      "question": "¿Qué ocurre después de que firmo un acuerdo?",
      "answer": "Después de firmar una liberación de acuerdo, recibe el pago acordado y su reclamación se cierra. Renuncia permanentemente a su derecho a buscar compensación adicional de las partes que liquidaron por ese incidente — incluso si sus lesiones empeoran, descubre daños adicionales o incurre en gastos médicos futuros relacionados con el mismo accidente. Por eso es tan importante estar seguro de que sus daños están completamente documentados antes de firmar."
    },
    {
      "question": "¿Puedo negociar un monto de acuerdo más alto?",
      "answer": "Sí. Las ofertas iniciales de las compañías de seguros generalmente son negociables. Usted o su abogado pueden contraofertar con una carta de demanda que documente sus daños y explique por qué se justifica un monto mayor. Son comunes múltiples rondas de negociación. Contar con documentación sólida — registros médicos, evidencia de pérdida de salario y un relato detallado de cómo la lesión ha afectado su vida — fortalece significativamente su posición negociadora."
    }
  ],
  "relatedTools": ["lost-wages-estimator", "injury-journal", "record-request"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "slip-fall", "bicycle"]
}
```

- [ ] **Step 2: Add slug to `SLUG_MAP_ES` in `i18n/config.ts`**

After the `'record-request': 'solicitud-registros',` line, add:

```ts
  'settlement-readiness': 'preparacion-acuerdo',
```

- [ ] **Step 3: Add EN slug to `TOOL_EN_SLUGS`**

```ts
const TOOL_EN_SLUGS = [
  'accident-case-quiz',
  'urgency-checker',
  'evidence-checklist',
  'injury-journal',
  'lawyer-type-matcher',
  'insurance-call-prep',
  'lost-wages-estimator',
  'record-request',
  'settlement-readiness',
]
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add content/tools/es/preparacion-acuerdo.json i18n/config.ts "app/(es)/es/herramientas/[slug]/page.tsx"
git commit -m "feat(es): add Spanish tool — settlement-readiness (preparacion-acuerdo)"
```

- [ ] **Step 6: Stop — ask user to review before proceeding**

> "Tool 4 of 6 done: `/es/herramientas/preparacion-acuerdo`. Ready for your review. Once approved, I'll update Notion and move to tool 5."

- [ ] **Step 7: After user approves — update Notion**

Update Notion page `352917dc-7b83-81ca-a854-f3f7b5883292`:
- `Spanish Status` → `Live`
- `Spanish Route` → `https://accident-path.vercel.app/es/herramientas/preparacion-acuerdo`

---

## Task 5: state-next-steps

**Files:**
- Create: `content/tools/es/proximos-pasos-estado.json`
- Modify: `i18n/config.ts` (add `'state-next-steps': 'proximos-pasos-estado'`)
- Modify: `app/(es)/es/herramientas/[slug]/page.tsx` (`TOOL_EN_SLUGS`)

- [ ] **Step 1: Create the Spanish JSON file**

Create `content/tools/es/proximos-pasos-estado.json`:

```json
{
  "slug": "proximos-pasos-estado",
  "title": "Próximos Pasos por Estado",
  "metaTitle": "Próximos Pasos por Estado — Guía de Accidentes en CA y AZ",
  "metaDescription": "Obtenga orientación específica por estado sobre plazos, próximos pasos y reglas importantes para víctimas de accidentes en California y Arizona. Solo información educativa.",
  "description": "Las reglas y plazos de lesiones personales difieren entre California y Arizona. Esta herramienta le ayuda a comprender las diferencias clave — plazos de presentación, reglas de seguro, estándares de culpa comparativa y requisitos de reclamaciones gubernamentales — para que sepa qué factores específicos del estado pueden ser relevantes para su situación.",
  "disclaimer": "Esta herramienta proporciona información educativa general sobre las reglas de lesiones personales en California y Arizona. No constituye asesoramiento legal. Las leyes cambian y su aplicación depende de sus hechos y circunstancias específicas. Consulte a un abogado de lesiones personales con licencia en el estado correspondiente para obtener orientación sobre su situación individual.",
  "steps": [
    {
      "id": "state",
      "question": "¿En qué estado ocurrió el accidente?",
      "type": "select",
      "options": [
        { "value": "CA", "label": "California" },
        { "value": "AZ", "label": "Arizona" }
      ]
    },
    {
      "id": "accident-type",
      "question": "¿En qué tipo de accidente estuvo involucrado/a?",
      "type": "select",
      "options": [
        { "value": "car-accident", "label": "Accidente de auto" },
        { "value": "truck-accident", "label": "Accidente de camión" },
        { "value": "motorcycle-crash", "label": "Accidente de motocicleta" },
        { "value": "bicycle-accident", "label": "Accidente de bicicleta" },
        { "value": "pedestrian-accident", "label": "Accidente de peatón" },
        { "value": "slip-fall", "label": "Resbalón y caída" },
        { "value": "dog-bite", "label": "Mordedura de perro o ataque de animal" },
        { "value": "workplace-injury", "label": "Lesión en el lugar de trabajo" },
        { "value": "other", "label": "Otro" }
      ]
    },
    {
      "id": "accident-date",
      "question": "¿Cuándo ocurrió el accidente?",
      "type": "date"
    }
  ],
  "supportingContent": [
    {
      "heading": "California: Reglas clave para víctimas de accidentes",
      "content": "California es un estado de seguro basado en la culpa (de tipo tort), lo que significa que el seguro de la parte responsable es responsable de los daños. California sigue la regla de culpa comparativa pura — puede recuperar compensación incluso si usted tuvo parte de la culpa, pero su recuperación se reduce por su porcentaje de culpa. El plazo de prescripción para reclamaciones por lesiones personales es generalmente de dos años a partir de la fecha de la lesión. Las reclamaciones contra entidades gubernamentales requieren una reclamación formal de daños gubernamentales dentro de seis meses. California exige que todos los conductores tengan un seguro de responsabilidad mínimo de $15,000 por persona y $30,000 por incidente.",
      "tips": [
        "La culpa comparativa pura significa que incluso las partes con 99% de culpa pueden buscar alguna recuperación",
        "Las reclamaciones gubernamentales tienen un plazo estricto de 6 meses — no confunda con el plazo de 2 años para demandas",
        "La cobertura de motorista no asegurado (UM) de California le protege de conductores sin seguro"
      ]
    },
    {
      "heading": "Arizona: Reglas clave para víctimas de accidentes",
      "content": "Arizona también es un estado de seguro basado en la culpa. Al igual que California, Arizona sigue la culpa comparativa pura — la culpa parcial de su parte reduce su recuperación proporcionalmente pero no le impide demandar. El plazo general de prescripción por lesiones personales en Arizona también es de dos años a partir de la fecha de la lesión. Las reclamaciones contra ciudades y condados generalmente requieren aviso dentro de 60 días; las reclamaciones contra agencias estatales requieren aviso dentro de 180 días. La cobertura mínima de responsabilidad de auto requerida en Arizona es de $25,000 por persona y $50,000 por incidente.",
      "tips": [
        "Los plazos de reclamaciones gubernamentales en Arizona son más estrictos que en California — 60 días para ciudades y condados",
        "Arizona no requiere protección por lesiones personales (PIP), a diferencia de algunos estados sin culpa",
        "La cobertura de motorista no asegurado es importante en Arizona dado el alto índice de conductores sin seguro"
      ]
    },
    {
      "heading": "Reclamaciones contra entidades gubernamentales: plazos críticos",
      "content": "Cuando su accidente involucra un vehículo gubernamental, un empleado del gobierno o un peligro en propiedad gubernamental (un bache, un semáforo roto, una acera peligrosa), se aplican procedimientos especiales de reclamación antes de poder demandar. En California, debe presentar una reclamación de daños gubernamentales ante la agencia correspondiente dentro de seis meses de la fecha de la lesión. En Arizona, el plazo es de 180 días para agencias estatales y 60 días para ciudades y condados. Perder estos plazos administrativos puede impedir completamente su demanda — son independientes y más cortos que el plazo general de prescripción de dos años.",
      "tips": [
        "Presente de inmediato si hay un vehículo o propiedad gubernamental involucrado — no espere",
        "La respuesta de la entidad gubernamental (o la falta de respuesta) activa plazos adicionales",
        "Se recomienda encarecidamente un abogado con experiencia en reclamaciones gubernamentales para estos casos"
      ]
    },
    {
      "heading": "Cómo la culpa comparativa afecta su reclamación",
      "content": "Tanto California como Arizona siguen la regla de 'culpa comparativa pura', lo que significa que su compensación se reduce por su parte de culpa en el accidente — pero no se le impide completamente recuperar algo, incluso si tuvo una culpa significativa. Por ejemplo, si se determina que usted tiene un 30% de culpa y sus daños son $100,000, recuperaría $70,000. Los ajustadores de seguros pueden intentar asignarle un porcentaje más alto de culpa para reducir lo que deben. Contar con evidencia sólida — incluido un informe policial, testimonios de testigos y fotos — es importante para contrarrestar los intentos de asignarle injustamente la culpa."
    }
  ],
  "faq": [
    {
      "question": "¿Importa en qué estado ocurrió el accidente si vivo en un estado diferente?",
      "answer": "Sí. Las reclamaciones por lesiones personales generalmente se rigen por la ley del estado donde ocurrió el accidente, no donde usted vive. Esto incluye qué plazo de prescripción aplica, las reglas de culpa y los requisitos de reclamaciones gubernamentales. Si fue lesionado en California o Arizona pero vive en otro lugar, los plazos y procedimientos aplicables son los del estado donde ocurrió el accidente."
    },
    {
      "question": "¿Cuál es la diferencia entre un estado de culpa y un estado sin culpa para el seguro?",
      "answer": "En estados de culpa como California y Arizona, el seguro del conductor responsable es responsable de compensar a las víctimas. En estados sin culpa, el seguro propio de cada conductor cubre sus lesiones independientemente de la culpa. California y Arizona son ambos estados de culpa — lo que significa que puede presentar una reclamación contra la parte responsable y su aseguradora, en lugar de estar limitado a su propia cobertura."
    },
    {
      "question": "¿Qué es la culpa comparativa y cómo afecta cuánto puedo recuperar?",
      "answer": "La culpa comparativa significa que si usted comparte alguna responsabilidad por el accidente, su recuperación se reduce por su porcentaje de culpa. Bajo el sistema de culpa comparativa pura de California y Arizona, puede recuperar compensación incluso si tuvo más del 50% de la culpa — su indemnización simplemente se reduce proporcionalmente. Por ejemplo, un 25% de culpa de su parte reduce una recuperación de $100,000 a $75,000."
    }
  ],
  "relatedTools": ["statute-countdown", "accident-case-quiz", "lawyer-type-matcher"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "bicycle", "pedestrian", "slip-fall"]
}
```

- [ ] **Step 2: Add slug to `SLUG_MAP_ES` in `i18n/config.ts`**

After the `'settlement-readiness': 'preparacion-acuerdo',` line, add:

```ts
  'state-next-steps': 'proximos-pasos-estado',
```

- [ ] **Step 3: Add EN slug to `TOOL_EN_SLUGS`**

```ts
const TOOL_EN_SLUGS = [
  'accident-case-quiz',
  'urgency-checker',
  'evidence-checklist',
  'injury-journal',
  'lawyer-type-matcher',
  'insurance-call-prep',
  'lost-wages-estimator',
  'record-request',
  'settlement-readiness',
  'state-next-steps',
]
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add content/tools/es/proximos-pasos-estado.json i18n/config.ts "app/(es)/es/herramientas/[slug]/page.tsx"
git commit -m "feat(es): add Spanish tool — state-next-steps (proximos-pasos-estado)"
```

- [ ] **Step 6: Stop — ask user to review before proceeding**

> "Tool 5 of 6 done: `/es/herramientas/proximos-pasos-estado`. Ready for your review. Once approved, I'll update Notion and move to the final tool."

- [ ] **Step 7: After user approves — update Notion**

Update Notion page `352917dc-7b83-815d-9747-c86cb25ad53e`:
- `Spanish Status` → `Live`
- `Spanish Route` → `https://accident-path.vercel.app/es/herramientas/proximos-pasos-estado`

---

## Task 6: statute-countdown

**Files:**
- Create: `content/tools/es/cuenta-regresiva-plazo.json`
- Modify: `i18n/config.ts` (add `'statute-countdown': 'cuenta-regresiva-plazo'`)
- Modify: `app/(es)/es/herramientas/[slug]/page.tsx` (`TOOL_EN_SLUGS`)

- [ ] **Step 1: Create the Spanish JSON file**

Create `content/tools/es/cuenta-regresiva-plazo.json`:

```json
{
  "slug": "cuenta-regresiva-plazo",
  "title": "Cuenta Regresiva del Plazo de Prescripción",
  "metaTitle": "Cuenta Regresiva del Plazo de Prescripción — CA y AZ",
  "metaDescription": "Averigüe cuánto tiempo puede quedarle para presentar una reclamación por lesiones personales en California o Arizona. Ingrese la fecha de su accidente y obtenga su fecha límite estimada.",
  "description": "El plazo de prescripción establece una fecha límite legal estricta sobre su derecho a buscar compensación después de un accidente. Esta herramienta le ayuda a entender cuánto tiempo puede quedar y qué pasos debería considerar antes de que se acerque su fecha límite.",
  "disclaimer": "Esta herramienta proporciona información de fechas límite estimadas únicamente con fines educativos. No constituye asesoramiento legal. Los plazos varían según sus circunstancias específicas, incluyendo quién fue responsable y si hay entidades gubernamentales involucradas. Consulte a un abogado para entender su fecha límite real de presentación.",
  "steps": [
    {
      "id": "accident-date",
      "question": "¿Cuándo ocurrió su accidente?",
      "type": "date"
    },
    {
      "id": "accident-type",
      "question": "¿Qué tipo de accidente fue?",
      "type": "select",
      "options": [
        { "value": "car-accident", "label": "Accidente de auto" },
        { "value": "truck-accident", "label": "Accidente de camión" },
        { "value": "motorcycle-crash", "label": "Accidente de motocicleta" },
        { "value": "bicycle-accident", "label": "Accidente de bicicleta" },
        { "value": "pedestrian-accident", "label": "Accidente de peatón" },
        { "value": "slip-fall", "label": "Resbalón y caída" },
        { "value": "dog-bite", "label": "Mordedura de perro o ataque de animal" },
        { "value": "workplace-injury", "label": "Lesión en el lugar de trabajo" },
        { "value": "other", "label": "Otro" }
      ]
    },
    {
      "id": "state",
      "question": "¿En qué estado ocurrió el accidente?",
      "type": "select",
      "options": [
        { "value": "CA", "label": "California" },
        { "value": "AZ", "label": "Arizona" }
      ]
    }
  ],
  "supportingContent": [
    {
      "heading": "¿Qué es el plazo de prescripción?",
      "content": "El plazo de prescripción es una fecha límite legal que limita cuánto tiempo tiene para presentar una demanda después de una lesión. Una vez que vence este plazo, los tribunales generalmente se negarán a escuchar su caso, independientemente de lo sólida que sea su evidencia o la gravedad de sus lesiones. Esta regla existe para garantizar que los casos se resuelvan mientras la evidencia y la memoria de los testigos aún son recientes y confiables.",
      "tips": [
        "El reloj generalmente comienza en la fecha del accidente — no cuando nota los síntomas por primera vez",
        "Perder el plazo generalmente significa perder permanentemente su derecho a compensación",
        "Ciertas circunstancias pueden pausar o extender el plazo — consulte a un abogado para estar seguro"
      ]
    },
    {
      "heading": "Plazo de prescripción en California para reclamaciones por lesiones",
      "content": "En California, la mayoría de las reclamaciones por lesiones personales — incluidos accidentes de auto, resbalones y caídas, y mordeduras de perro — tienen un plazo de prescripción de dos años a partir de la fecha de la lesión. Sin embargo, las reclamaciones contra entidades gubernamentales en California tienen una ventana mucho más corta: debe presentar una reclamación de daños gubernamentales dentro de seis meses del incidente antes de poder demandar. Los menores de edad y las víctimas que no fueron conscientes de inmediato de sus lesiones pueden tener plazos diferentes bajo la regla del descubrimiento.",
      "tips": [
        "Lesiones personales estándar: 2 años a partir de la fecha de la lesión",
        "Reclamaciones contra entidades gubernamentales: plazo administrativo de 6 meses",
        "Descubrimiento tardío: el reloj puede comenzar cuando se descubrió la lesión o debería haberse descubierto"
      ]
    },
    {
      "heading": "Plazo de prescripción en Arizona para reclamaciones por lesiones",
      "content": "Arizona también establece un plazo de prescripción de dos años para la mayoría de las reclamaciones por lesiones personales derivadas de accidentes. Al igual que California, las reclamaciones que involucran entidades gubernamentales requieren aviso oportuno — generalmente dentro de 180 días para agencias estatales y 60 días para entidades de ciudades o condados. Si la parte lesionada era menor de edad en el momento del accidente, el reloj puede no comenzar a correr hasta que alcance la mayoría de edad.",
      "tips": [
        "Lesiones personales estándar: 2 años a partir de la fecha de la lesión",
        "Reclamaciones contra ciudades y condados: puede requerirse aviso dentro de 60 días",
        "Menores de edad: el período de prescripción puede comenzar a los 18 años"
      ]
    },
    {
      "heading": "¿Qué ocurre si se vence el plazo de presentación?",
      "content": "Si intenta presentar una demanda después de que haya vencido el plazo de prescripción, el demandado casi con certeza presentará una moción de desestimación, y el tribunal la concederá. Esto significa que pierde su derecho a buscar compensación a través de los tribunales permanentemente — incluso si la otra parte claramente tuvo la culpa y sus lesiones fueron graves. Las compañías de seguros rastrean estos plazos cuidadosamente, y perder el plazo elimina gran parte de su poder de negociación incluso en las discusiones de acuerdo.",
      "tips": [
        "Perder el plazo generalmente impide su caso en el tribunal sin excepciones",
        "Incluso las negociaciones de seguros previas al litigio se ven afectadas por un plazo vencido",
        "No espere hasta cerca del plazo para consultar a un abogado"
      ]
    },
    {
      "heading": "Excepciones que pueden extender su plazo",
      "content": "Ciertas circunstancias pueden suspender — o pausar — el plazo de prescripción en California y Arizona. Los ejemplos comunes incluyen casos en que la parte lesionada era menor de edad en el momento del accidente, en que el demandado abandonó el estado y no estaba disponible para ser notificado, o en que la lesión no se descubrió hasta más tarde (la 'regla del descubrimiento'). El fraude del demandado también puede suspender el reloj. Estas excepciones son limitadas y requieren un análisis legal específico a su situación — no asuma que aplica una extensión sin consultar a un abogado."
    }
  ],
  "faq": [
    {
      "question": "¿Cuánto tiempo tengo para presentar una reclamación por lesiones personales en California?",
      "answer": "En California, el plazo de prescripción general para reclamaciones por lesiones personales es de dos años a partir de la fecha de la lesión. Las reclamaciones contra entidades gubernamentales tienen un plazo mucho más corto — generalmente seis meses para presentar una reclamación administrativa de daños."
    },
    {
      "question": "¿Cuánto tiempo tengo para presentar una reclamación por lesiones personales en Arizona?",
      "answer": "El plazo de prescripción general de lesiones personales en Arizona es de dos años a partir de la fecha del accidente o lesión. Para reclamaciones contra entidades gubernamentales, los requisitos de aviso suelen ser de 60 a 180 días dependiendo de la entidad involucrada."
    },
    {
      "question": "¿Qué es la regla del descubrimiento y cómo afecta mi plazo?",
      "answer": "La regla del descubrimiento establece que el plazo de prescripción comienza cuando usted descubrió — o razonablemente debería haber descubierto — su lesión, en lugar de en la fecha del accidente. Esto puede aplicar cuando lesiones como daños internos o lesiones cerebrales traumáticas no son inmediatamente aparentes."
    },
    {
      "question": "¿Se pausa el plazo de prescripción si fui lesionado/a siendo menor de edad?",
      "answer": "Tanto en California como en Arizona, el plazo de prescripción para reclamaciones por lesiones personales generalmente se suspende — o pausa — cuando la persona lesionada era menor de edad en el momento del accidente, y puede no comenzar a correr hasta que alcance la mayoría de edad."
    }
  ],
  "relatedTools": ["accident-case-quiz", "evidence-checklist", "lawyer-type-matcher"],
  "relatedGuides": ["after-car-accident", "insurance-claims"],
  "relatedAccidents": ["car", "truck", "motorcycle", "bicycle", "pedestrian"]
}
```

- [ ] **Step 2: Add slug to `SLUG_MAP_ES` in `i18n/config.ts`**

After the `'state-next-steps': 'proximos-pasos-estado',` line, add:

```ts
  'statute-countdown': 'cuenta-regresiva-plazo',
```

- [ ] **Step 3: Add EN slug to `TOOL_EN_SLUGS`**

```ts
const TOOL_EN_SLUGS = [
  'accident-case-quiz',
  'urgency-checker',
  'evidence-checklist',
  'injury-journal',
  'lawyer-type-matcher',
  'insurance-call-prep',
  'lost-wages-estimator',
  'record-request',
  'settlement-readiness',
  'state-next-steps',
  'statute-countdown',
]
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add content/tools/es/cuenta-regresiva-plazo.json i18n/config.ts "app/(es)/es/herramientas/[slug]/page.tsx"
git commit -m "feat(es): add Spanish tool — statute-countdown (cuenta-regresiva-plazo)"
```

- [ ] **Step 6: Stop — ask user to review before proceeding**

> "Tool 6 of 6 done: `/es/herramientas/cuenta-regresiva-plazo`. All 6 Spanish tools complete — ready for your review. Once approved, I'll update Notion and update PENDING.md."

- [ ] **Step 7: After user approves — update Notion**

Update Notion page `352917dc-7b83-81cc-9a8f-f9af1fee38e9`:
- `Spanish Status` → `Live`
- `Spanish Route` → `https://accident-path.vercel.app/es/herramientas/cuenta-regresiva-plazo`

- [ ] **Step 8: Remove tools section from PENDING.md**

After all 6 tools are approved and Notion is updated, delete the "Spanish — Coming Soon (6 tools)" section from `PENDING.md` and commit:

```bash
git add PENDING.md
git commit -m "docs: remove completed Spanish tools from PENDING.md"
```
