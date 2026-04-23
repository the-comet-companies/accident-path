import type { ToolAnswers, ToolOutput, OutputItem } from '@/types/tool'

type OutputGenerator = (answers: ToolAnswers) => ToolOutput

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ACCIDENT_LABELS: Record<string, string> = {
  'car-accident': 'car accident',
  'truck-accident': 'truck accident',
  'motorcycle-crash': 'motorcycle crash',
  'bicycle-accident': 'bicycle accident',
  'pedestrian-accident': 'pedestrian accident',
  'slip-fall': 'slip and fall',
  'dog-bite': 'dog bite or animal attack',
  'workplace-injury': 'workplace injury',
  'other': 'accident',
}

function accidentLabel(v: string | undefined): string {
  return ACCIDENT_LABELS[v ?? ''] ?? 'accident'
}

function str(v: ToolAnswers[string] | undefined): string {
  return typeof v === 'string' ? v : ''
}

function computeSolDeadline(
  accidentDate: string,
  solYears: number
): { deadline: Date; daysRemaining: number; deadlineStr: string } {
  const [y, m, d] = accidentDate.split('-').map(Number)
  const deadline = new Date(y + solYears, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysRemaining = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const deadlineStr = deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  return { deadline, daysRemaining, deadlineStr }
}

function timelineUrgent(when: string | undefined): boolean {
  return when === 'today' || when === '1-7-days' || when === '1-4-weeks'
}

// ─── Tool 1: accident-case-quiz ───────────────────────────────────────────────

const accidentCaseQuiz: OutputGenerator = (answers) => {
  const accType = str(answers['accident-type'])
  const injuries = (answers['injuries'] as string[]) ?? []
  const when = str(answers['timeline'])
  const witnesses = str(answers['witnesses'])
  const whatHappened = (answers['what-happened'] as string[]) ?? []
  const isHitRun = whatHappened.includes('hit-run')

  const hasVisibleInjuries = !injuries.includes('no-visible-injuries') && injuries.length > 0
  const urgent = timelineUrgent(when)
  const hasWitnesses = witnesses === 'yes-multiple' || witnesses === 'yes-one'

  // Case type classification
  const CASE_TYPE_MAP: Record<string, string> = {
    'car-accident': 'motor vehicle accident case',
    'truck-accident': 'motor vehicle accident case',
    'motorcycle-crash': 'motor vehicle accident case',
    'bicycle-accident': 'motor vehicle accident case',
    'pedestrian-accident': 'motor vehicle accident case',
    'slip-fall': 'premises liability case',
    'dog-bite': 'dog bite case',
    'workplace-injury': 'workplace injury or workers\' compensation case',
  }
  const HUB_LINK_MAP: Record<string, string> = {
    'car-accident': '/accidents/car',
    'truck-accident': '/accidents/truck',
    'motorcycle-crash': '/accidents/motorcycle',
    'bicycle-accident': '/accidents/bicycle',
    'pedestrian-accident': '/accidents/pedestrian',
    'slip-fall': '/accidents/slip-and-fall',
    'dog-bite': '/accidents/dog-bite',
    'workplace-injury': '/accidents/workplace',
  }

  const caseType = CASE_TYPE_MAP[accType] ?? 'personal injury case'
  const hubLink = HUB_LINK_MAP[accType] ?? '/accidents'

  const items: OutputItem[] = []

  // Hub link item (always first)
  items.push({
    label: `Learn more: ${caseType.replace(/\b\w/g, c => c.toUpperCase())}`,
    value: `Review our detailed guide on ${caseType} cases — what to expect, key timelines, and what evidence matters most.`,
    priority: 'helpful',
  })

  // Urgency-based attorney item
  if (urgent) {
    items.push({
      label: 'Consult a personal injury attorney soon',
      value: `With a recent ${accidentLabel(accType)}, documenting your claim early is important. Evidence and witness memories fade quickly.`,
      priority: 'critical',
    })
  } else {
    items.push({
      label: 'Consult a personal injury attorney',
      value: 'Your situation may benefit from legal guidance. Most personal injury attorneys offer free initial consultations.',
      priority: 'important',
    })
  }

  if (isHitRun) {
    items.push({
      label: 'Hit and run — file a police report immediately',
      value: 'If you have not already done so, file a police report for the hit-and-run. This is critical for uninsured motorist (UM) insurance claims, which often require a police report as a condition of coverage.',
      priority: 'critical',
    })
  }

  // Medical documentation
  if (hasVisibleInjuries) {
    items.push({
      label: 'Continue documenting medical treatment',
      value: 'Keep records of all doctor visits, diagnoses, prescriptions, and bills. Consistent documentation supports any future claim.',
      priority: 'critical',
    })
  }

  // Witnesses item
  if (hasWitnesses) {
    items.push({
      label: 'Secure witness contact information',
      value: 'You indicated there were witnesses. Collecting their names and contact details now — while their memories are fresh — can significantly strengthen your claim.',
      priority: 'important',
    })
  } else if (witnesses === 'no') {
    items.push({
      label: 'No witnesses — focus on other evidence',
      value: 'Without witnesses, physical evidence becomes especially important: photos of the scene, the police report, medical records, and any available camera footage.',
      priority: 'important',
    })
  }

  // General evidence
  items.push({
    label: 'Avoid giving recorded statements to insurance companies',
    value: 'Insurance adjusters may use recorded statements to minimize a claim. Consider consulting an attorney before providing a formal statement.',
    priority: 'important',
  })

  items.push({
    label: 'Review the Evidence Checklist Tool',
    value: 'Use our free evidence checklist to help ensure you have everything documented.',
    priority: 'helpful',
  })

  const caseTypeCapitalized = caseType.charAt(0).toUpperCase() + caseType.slice(1)

  return {
    summary: `Based on what you described, cases like this are typically classified as a ${caseType}. ${caseTypeCapitalized} claims involve specific rules, timelines, and considerations. This is general educational information only — your specific situation may differ, and this is not legal advice.`,
    items,
    cta: { label: `Learn About ${caseTypeCapitalized} Cases`, href: hubLink },
    disclaimer: 'This quiz provides general educational information only. It is not legal advice and does not evaluate the merits of any potential claim.',
    exportable: true,
  }
}

// ─── Tool 2: urgency-checker ──────────────────────────────────────────────────

const urgencyChecker: OutputGenerator = (answers) => {
  const symptoms = (answers['symptoms'] as string[]) ?? []
  const seenDoctor = str(answers['seen-doctor'])
  const when = str(answers['when'])

  // Red flag symptoms per spec
  const redFlags = [
    'loss-of-consciousness',
    'severe-bleeding',
    'chest-pain',           // label: "Chest pain or difficulty breathing"
    'numbness-tingling',    // spec: numbness is red
    'neck-back-pain',       // spec: severe head/neck pain is red
    'confusion',
  ]
  // Yellow flag symptoms
  const yellowFlags = ['severe-headache', 'abdominal-pain', 'blurred-vision', 'nausea']

  const hasRed = redFlags.some(f => symptoms.includes(f))
  const hasYellow = !hasRed && yellowFlags.some(f => symptoms.includes(f))
  const noSymptoms = symptoms.includes('no-symptoms') || symptoms.length === 0
  const hasSeenDoctor = seenDoctor === 'yes-same-day' || seenDoctor === 'yes-within-days'

  const items: OutputItem[] = []
  let summary = ''

  if (hasRed) {
    // RED tier
    summary = 'Based on your answers, you reported symptoms that can indicate a serious or life-threatening condition. Seek medical attention immediately. This is general educational information only — it is not medical advice.'
    items.push({
      label: 'Seek medical attention immediately',
      value: 'The symptoms you selected — which may include loss of consciousness, severe bleeding, chest pain, difficulty breathing, numbness, or severe head/neck pain — can indicate serious injury. Go to an emergency room or call 911 now.',
      priority: 'critical',
    })
    if (!hasSeenDoctor) {
      items.push({
        label: 'You have not yet seen a doctor',
        value: 'Delaying medical care can worsen your condition and may be used by insurance companies to dispute injury severity. Seek care now.',
        priority: 'critical',
      })
    }
  } else if (hasYellow) {
    // YELLOW tier
    summary = 'Based on your answers, you have symptoms worth evaluating with a healthcare provider within the next 24–48 hours. Delayed symptoms after accidents are common. This is general educational information only — it is not medical advice.'
    items.push({
      label: 'See a doctor within the next 24–48 hours',
      value: 'Symptoms like headache, dizziness, abdominal pain, or nausea can develop or worsen gradually after an accident. Early evaluation creates a medical record and helps identify conditions before they become serious.',
      priority: 'important',
    })
    if (!hasSeenDoctor) {
      items.push({
        label: 'Document your symptoms before your appointment',
        value: 'Write down every symptom — including when it started and how it has changed — so you can give your doctor a complete picture.',
        priority: 'helpful',
      })
    }
  } else if (noSymptoms && !hasSeenDoctor) {
    // GREEN tier — no symptoms, no doctor yet
    summary = 'You report no symptoms at this time. Many accident injuries — including whiplash and concussion — can take hours or days to appear. Monitoring your condition and seeing a doctor within the week is generally advisable. This is general educational information only.'
    items.push({
      label: 'Monitor your symptoms and see a doctor within the week',
      value: 'Even without immediate symptoms, a medical evaluation within 24–72 hours is commonly recommended after accidents. It creates a record in case symptoms appear later.',
      priority: 'important',
    })
  } else {
    // GREEN tier — already seen doctor or no red/yellow and seen doctor
    summary = 'Based on your answers, you have received medical care and appear to be monitoring your situation. Continuing to follow your provider\'s guidance is the key next step. This is general educational information only.'
    items.push({
      label: 'Continue following your healthcare provider\'s guidance',
      value: 'Keep all follow-up appointments and report any new or worsening symptoms promptly to your provider.',
      priority: 'important',
    })
  }

  if (timelineUrgent(when)) {
    items.push({
      label: 'Document everything now',
      value: 'Photos, notes about symptoms, and contact information for anyone at the scene are most valuable when gathered promptly.',
      priority: 'important',
    })
  }

  items.push({
    label: 'Start an injury journal',
    value: 'Daily documentation of symptoms, pain levels, and treatments creates a powerful record for any future claim.',
    priority: 'helpful',
  })

  return {
    summary,
    items,
    cta: { label: 'Get Free Guidance', href: '/find-help' },
    disclaimer: 'This tool is for educational purposes only. It is not medical advice. If you are experiencing a medical emergency, call 911 immediately.',
    exportable: true,
  }
}

// ─── Tool 3: evidence-checklist ───────────────────────────────────────────────

const evidenceChecklist: OutputGenerator = (answers) => {
  const accType = str(answers['accident-type'])
  const location = str(answers['location-type'])
  const witnesses = str(answers['witnesses'])
  const policeReport = str(answers['police-report'])
  const photos = str(answers['photos'])

  const items: OutputItem[] = []

  if (policeReport === 'no-not-filed' || policeReport === 'not-sure') {
    items.push({
      label: 'Obtain or file a police / accident report',
      value: 'If no report was filed, contact the responding agency. A police report is often required by insurers and provides an official account of the incident.',
      priority: 'critical',
    })
  } else {
    items.push({
      label: 'Obtain a copy of the police / accident report',
      value: 'Request a copy from the responding law enforcement agency. This is a foundational document for any claim.',
      priority: 'critical',
    })
  }

  items.push({
    label: 'All medical records and bills',
    value: 'Emergency room, hospital, primary care, specialist, physical therapy, and pharmacy records. Start collecting these as they accumulate.',
    priority: 'critical',
  })

  if (photos === 'no-photos' || photos === 'conditions-prevented') {
    items.push({
      label: 'Return to photograph the scene if possible',
      value: 'Scene conditions change quickly. If you can safely return, photograph the area, any relevant hazards, and the general location.',
      priority: 'important',
    })
  } else {
    items.push({
      label: 'Continue photographing injuries as they develop',
      value: 'Bruising and swelling often intensify in the days after an accident. Continue documenting visible injuries with dated photos.',
      priority: 'important',
    })
  }

  if (witnesses === 'yes-no-info') {
    items.push({
      label: 'Attempt to locate witness contact information',
      value: 'Check any police report, ask nearby businesses for surveillance footage, or post on local community forums.',
      priority: 'important',
    })
  } else if (witnesses === 'yes-with-info') {
    items.push({
      label: 'Preserve witness contact information',
      value: 'Secure witness names, phone numbers, and addresses. Consider asking them to write a brief statement while the incident is fresh.',
      priority: 'important',
    })
  }

  if (location === 'business-premises' || location === 'private-property') {
    items.push({
      label: 'Request surveillance or security footage',
      value: 'Businesses and properties often have cameras. Submit a written preservation request promptly — footage is typically overwritten within 30–60 days.',
      priority: 'important',
    })
  }

  if (location === 'workplace') {
    items.push({
      label: 'File an incident report with your employer',
      value: 'A written incident report creates an official workplace record. This is often required to initiate a workers\' compensation claim.',
      priority: 'critical',
    })
  }

  items.push({
    label: 'Insurance documentation for all parties',
    value: 'Insurance cards, policy numbers, and contact information for all insurers involved — your own and any other parties\'.',
    priority: 'important',
  })

  items.push({
    label: 'Employment records to document lost wages',
    value: 'Pay stubs, employer letters, and tax returns help document income losses if you missed work due to your injuries.',
    priority: 'helpful',
  })

  return {
    summary: `Here is a prioritized evidence checklist for your ${accidentLabel(accType)} case. Gathering this documentation promptly protects your ability to pursue a claim. This is general educational information only, not legal advice.`,
    items,
    cta: { label: 'Get Free Guidance', href: '/find-help' },
    disclaimer: 'This checklist is for general educational purposes only. Consult a licensed attorney to understand what evidence matters most in your specific situation.',
    exportable: true,
  }
}

// ─── Tool 4: injury-journal ───────────────────────────────────────────────────

const injuryJournal: OutputGenerator = (answers) => {
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
      label: `Pain level ${painLevel}/10 — document with your provider`,
      value: 'A high pain level should be communicated to your treating physician at your next appointment. Make sure your medical records reflect your current pain.',
      priority: 'critical',
    })
  }

  if (!noTreatments) {
    items.push({
      label: 'Treatments documented today',
      value: treatments
        .filter(t => t !== 'no-treatments-today')
        .map(t => t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
        .join(', '),
      priority: 'important',
    })
  }

  if (!noSymptoms) {
    items.push({
      label: 'Symptoms logged today',
      value: symptoms
        .filter(s => s !== 'no-symptoms-today')
        .map(s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
        .join(', '),
      priority: 'important',
    })
  }

  if (noTreatments && painLevel !== null && painLevel > 0) {
    items.push({
      label: 'No treatments today — consider documenting why',
      value: 'If you were in pain but did not receive treatment, note the reason (transportation, cost, appointment availability). This context is helpful if your journal is reviewed.',
      priority: 'helpful',
    })
  }

  items.push({
    label: 'Add a journal entry again tomorrow',
    value: 'Daily entries — even short ones — create the most useful record. Consistency matters more than length.',
    priority: 'helpful',
  })

  return {
    summary: `Today's entry recorded. Pain level: ${painLevel !== null ? `${painLevel}/10` : 'not recorded'}. ${injuries.length > 0 ? `Tracking: ${injuries.map(i => i.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ')}.` : ''} Your journal is for personal documentation only — keep it in a secure location and share with your attorney if you have one.`,
    items,
    cta: { label: 'Print This Entry', href: '#' },
    disclaimer: 'This journal is an educational tool to help you organize personal documentation. It is not a medical record and is not a substitute for professional medical care.',
    exportable: true,
  }
}

// ─── Tool 5: lost-wages-estimator ─────────────────────────────────────────────

const lostWagesEstimator: OutputGenerator = (answers) => {
  const empType = str(answers['employment-type'])
  const income = typeof answers['income'] === 'number' ? answers['income'] : 0
  const daysMissed = typeof answers['days-missed'] === 'number' ? answers['days-missed'] : 0
  const reducedHours = str(answers['reduced-hours'])
  const ongoing = str(answers['ongoing'])

  const isNotEmployed = empType === 'not-employed'
  const isSalaried = empType === 'full-time'
  const isSelfEmployed = empType === 'self-employed'

  let dailyRate = 0
  let estimatedLoss = 0
  let incomeNote = ''

  if (income > 0 && daysMissed > 0) {
    if (isSalaried || isSelfEmployed) {
      dailyRate = income / 260
      estimatedLoss = dailyRate * daysMissed
      incomeNote = `Based on ${isSalaried ? 'annual salary' : 'annual income'} of $${income.toLocaleString()}`
    } else {
      dailyRate = income * 8
      estimatedLoss = dailyRate * daysMissed
      incomeNote = `Based on hourly rate of $${income}/hr × 8 hours/day`
    }
  }

  const items: OutputItem[] = []

  if (!isNotEmployed && income > 0 && daysMissed > 0) {
    items.push({
      label: `Estimated lost wages to date: ~$${Math.round(estimatedLoss).toLocaleString()}`,
      value: `${incomeNote}, ${daysMissed} day(s) missed. This is a rough educational estimate only. Actual recoverable amounts depend on documentation, employment type, and applicable law.`,
      priority: 'important',
    })
  }

  if (ongoing === 'yes-ongoing' || ongoing === 'yes-partial') {
    items.push({
      label: 'Ongoing income loss — future damages may apply',
      value: 'If you cannot return to full work capacity, you may have a claim for future lost earning capacity. This typically requires documentation and expert testimony.',
      priority: 'critical',
    })
  }

  items.push({
    label: 'Gather income documentation',
    value: 'Pay stubs (3+ months before accident), W-2s or tax returns, employer letter confirming your rate and missed days, and a physician note stating you could not work.',
    priority: 'critical',
  })

  if (isSelfEmployed) {
    items.push({
      label: 'Self-employed: additional documentation needed',
      value: 'Tax returns, bank statements, invoices, contracts, and client correspondence showing income lost during your recovery period.',
      priority: 'important',
    })
  }

  if (reducedHours === 'yes-reduced' || reducedHours === 'yes-light-duty') {
    items.push({
      label: 'Document your reduced capacity period',
      value: 'Records of your reduced schedule, any lower-paying duties, and how your earning capacity changed. This period of partial loss may also be compensable.',
      priority: 'important',
    })
  }

  items.push({
    label: 'Consult an attorney for a complete damages assessment',
    value: 'A personal injury attorney can identify the full scope of your economic damages — including lost wages, future earning capacity, and out-of-pocket expenses.',
    priority: 'helpful',
  })

  return {
    summary: isNotEmployed
      ? 'You indicated you were not employed at the time of the accident. Lost wages may not apply, but other economic damages may be relevant depending on your situation. This is general educational information only.'
      : `Based on the information you provided, this tool estimates your lost wages to date at approximately $${Math.round(estimatedLoss).toLocaleString()}. This is a rough educational estimate only — actual recoverable damages depend on your documentation, employment type, and applicable law.`,
    items,
    cta: { label: 'Get Free Guidance', href: '/find-help' },
    disclaimer: 'This estimator provides rough calculations for educational purposes only. Actual lost wage claims depend on employment records, medical documentation, and applicable law.',
    exportable: true,
  }
}

// ─── Tool 6: insurance-call-prep ──────────────────────────────────────────────

const insuranceCallPrep: OutputGenerator = (answers) => {
  const callerType = str(answers['caller-type'])
  const callPurpose = str(answers['call-purpose'])
  const infoAvailable = (answers['info-available'] as string[]) ?? []

  const callerLabels: Record<string, string> = {
    'your-insurer': 'your insurance company',
    'other-driver-insurer': "the other driver's insurance company",
    'health-insurer': 'your health insurer',
    'workers-comp': "workers' compensation insurer",
  }
  const callerLabel = callerLabels[callerType] ?? 'the insurance company'

  const items: OutputItem[] = []

  items.push({
    label: 'Do not give a recorded statement without attorney guidance',
    value: `Insurers may ask for a recorded statement. You generally are not required to give one to ${callerType === 'other-driver-insurer' ? "the other driver's insurer" : 'all insurers'}. Consult an attorney before agreeing.`,
    priority: 'critical',
  })

  items.push({
    label: 'Have your claim or policy number ready',
    value: infoAvailable.includes('claim-number') || infoAvailable.includes('policy-number')
      ? 'Good — you have these. Also write down the representative\'s name, ID number, and the date and time of the call.'
      : 'Locate your insurance card or policy documents before calling. Having your number ready reduces hold times.',
    priority: 'important',
  })

  items.push({
    label: 'Take detailed notes during the call',
    value: 'Write down the name and employee ID of every person you speak with, what was said, and any commitments made. Follow up with a written email confirming any agreements.',
    priority: 'important',
  })

  if (callPurpose === 'dispute-decision') {
    items.push({
      label: 'Request the denial or decision in writing',
      value: 'Before disputing, obtain the written decision with the specific reason for denial or reduction. This is the foundation for any appeal or legal challenge.',
      priority: 'critical',
    })
  }

  if (callerType === 'other-driver-insurer') {
    items.push({
      label: "Limit what you say to the other driver's insurer",
      value: 'You are not required to give a statement to the adverse party\'s insurer. Stick to basic facts (date, location) and do not discuss fault, injuries, or dollar amounts.',
      priority: 'critical',
    })
  }

  items.push({
    label: 'Things not to say',
    value: '"I\'m fine" / "It was partly my fault" / "I don\'t have a lawyer" / "I\'ll take whatever you offer." These statements can be used to limit your claim.',
    priority: 'important',
  })

  items.push({
    label: 'Recording consent reminder',
    value: 'California requires all-party consent to record calls. Arizona is a one-party state. Know the rules before recording — or simply take thorough written notes.',
    priority: 'helpful',
  })

  return {
    summary: `You are preparing to call ${callerLabel}${callPurpose ? ` to ${callPurpose.replace(/-/g, ' ')}` : ''}. The most important principle: limit what you share, document everything, and consider consulting an attorney before giving any statement. This is general educational information only.`,
    items,
    cta: { label: 'Get Free Guidance', href: '/find-help' },
    disclaimer: 'This tool is for educational purposes only. It does not constitute legal advice. Consult a licensed attorney before making decisions about your insurance claim.',
    exportable: true,
  }
}

// ─── Tool 7: record-request ───────────────────────────────────────────────────

const recordRequest: OutputGenerator = (answers) => {
  const accType = str(answers['accident-type'])
  const recordsNeeded = (answers['records-needed'] as string[]) ?? []

  const recordDetails: Record<string, { who: string; timeline: string }> = {
    'police-report': { who: 'Responding law enforcement agency (police, highway patrol, sheriff)', timeline: 'Typically available within 5–10 business days of the accident' },
    'hospital-records': { who: 'Hospital medical records department (in-person or written request)', timeline: '30–60 days; submit a signed HIPAA-compliant authorization form' },
    'ongoing-medical': { who: 'Each treating provider\'s records department', timeline: '30 days; may require a medical authorization form per provider' },
    'imaging-records': { who: 'Radiology department of the hospital or imaging center', timeline: '1–2 weeks; ask for both the images (CD/digital) and the radiologist\'s report' },
    'pharmacy-records': { who: 'Your pharmacy or pharmacy chain\'s records department', timeline: '5–10 business days' },
    'employment-wage': { who: 'Your employer\'s HR or payroll department', timeline: 'Request pay stubs, a wage verification letter, and documentation of missed time' },
    'insurance-policy': { who: 'Your insurance company\'s customer service or claims department', timeline: 'Your declarations page and policy should be available online or within 5–10 days by request' },
    'property-damage': { who: 'Auto body shop, insurance adjuster, or independent appraiser', timeline: 'Appraisals typically take 3–7 business days after inspection' },
    'surveillance-footage': { who: 'Property owner, business manager, or local government (FOIA request for public cameras)', timeline: 'URGENT — footage is often overwritten within 30–60 days. Send a preservation notice immediately.' },
    'rideshare-data': { who: 'Uber / Lyft in-app support or legal team (subpoena may be required)', timeline: '2–4 weeks; submit a formal written request referencing the trip date and time' },
  }

  const items: OutputItem[] = recordsNeeded.map(record => {
    const detail = recordDetails[record]
    if (!detail) return { label: record, priority: 'helpful' as const }
    const isSurveillance = record === 'surveillance-footage'
    const isPolice = record === 'police-report'
    const isMedical = record === 'hospital-records' || record === 'ongoing-medical'
    return {
      label: record.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: `Who: ${detail.who} — Timeline: ${detail.timeline}`,
      priority: (isSurveillance || isPolice ? 'critical' : isMedical ? 'important' : 'helpful') as 'critical' | 'important' | 'helpful',
    }
  })

  if (items.length === 0) {
    items.push({
      label: 'No records selected',
      value: 'Go back and select the records most relevant to your situation.',
      priority: 'helpful',
    })
  }

  return {
    summary: `Here are the records to request for your ${accidentLabel(accType)} case, along with who to contact and expected timelines. Prioritize time-sensitive items — especially surveillance footage, which is often deleted within 30–60 days. This is general educational information only.`,
    items,
    cta: { label: 'Get Free Guidance', href: '/find-help' },
    disclaimer: 'This checklist is for general educational purposes only. Consult a licensed attorney about what records to prioritize for your specific situation.',
    exportable: true,
  }
}

// ─── Tool 8: settlement-readiness ────────────────────────────────────────────

const settlementReadiness: OutputGenerator = (answers) => {
  const medicalStatus = str(answers['medical-status'])
  const recordsGathered = (answers['records-gathered'] as string[]) ?? []
  const wagesDocumented = str(answers['wages-documented'])
  const attorneyConsulted = str(answers['attorney-consulted'])

  const medicalReady = medicalStatus === 'yes-complete' || medicalStatus === 'yes-mmi'
  const hasNoneYet = recordsGathered.includes('none-yet')
  const recordsCount = hasNoneYet ? 0 : recordsGathered.filter(r => r !== 'none-yet').length
  const wagesReady = wagesDocumented === 'yes' || wagesDocumented === 'not-applicable'
  const hasAttorney = attorneyConsulted === 'yes-retained'

  const completedCount = [medicalReady, recordsCount >= 3, wagesReady, hasAttorney].filter(Boolean).length

  const items: OutputItem[] = []

  if (!medicalReady) {
    items.push({
      label: 'Medical treatment not yet complete',
      value: 'Settling before reaching maximum medical improvement (MMI) risks undervaluing your claim — future treatment costs and long-term effects may not yet be known.',
      priority: 'critical',
    })
  } else {
    items.push({
      label: 'Medical status: ready',
      value: 'Treatment is complete or maximum medical improvement has been reached. This is an important prerequisite for settlement discussions.',
      priority: 'helpful',
    })
  }

  if (hasNoneYet || recordsCount < 3) {
    items.push({
      label: 'Records not sufficiently gathered',
      value: 'Incomplete records make it difficult to calculate the full value of your claim. Ensure medical, employment, and accident documentation is collected before discussing settlement.',
      priority: hasNoneYet ? 'critical' : 'important',
    })
  } else {
    items.push({
      label: `${recordsCount} record type(s) gathered`,
      value: 'Continue collecting any outstanding records to ensure your documentation is complete.',
      priority: 'helpful',
    })
  }

  if (!wagesReady) {
    items.push({
      label: 'Lost wages not yet documented',
      value: 'If you missed work or had reduced capacity, document this with pay stubs, employer letters, and physician notes before settling.',
      priority: 'important',
    })
  }

  if (!hasAttorney) {
    items.push({
      label: 'Consider consulting a personal injury attorney before settling',
      value: 'Once you sign a release, you typically cannot pursue additional compensation. An attorney can evaluate whether any offer reflects the full value of your claim.',
      priority: 'critical',
    })
  }

  if (completedCount >= 3) {
    items.push({
      label: 'You may be in a stronger position to discuss settlement',
      value: 'With most readiness factors addressed, it may be an appropriate time to consult an attorney about your options.',
      priority: 'helpful',
    })
  }

  return {
    summary: `Your settlement readiness: ${completedCount} of 4 key factors addressed. ${completedCount < 2 ? 'Several important factors are outstanding — settling now may undervalue your claim.' : completedCount < 4 ? 'You are making progress, but some gaps remain before discussing settlement.' : 'Most factors are in place — consider consulting an attorney to evaluate your options.'} This is general educational information only, not legal advice.`,
    items,
    cta: { label: 'Connect with an Attorney', href: '/contact' },
    disclaimer: 'This checklist is for general educational purposes only. Settlement decisions involve many factors specific to your situation. Always consult a licensed attorney before accepting any settlement offer.',
    exportable: true,
  }
}

// ─── Tool 9: lawyer-type-matcher ─────────────────────────────────────────────

const lawyerTypeMatcher: OutputGenerator = (answers) => {
  const accType = str(answers['accident-type'])
  const injuries = (answers['injuries'] as string[]) ?? []
  const employmentStatus = str(answers['employment-status'])
  const atFault = str(answers['at-fault'])

  const isWorkplace = accType === 'workplace-injury' || employmentStatus === 'yes-on-job'
  const hasSerious = injuries.includes('head-injury') || injuries.includes('internal-injuries') || injuries.includes('broken-bones')
  const isDisputed = atFault === 'disputed' || atFault === 'unclear'

  let lawyerType = 'Personal Injury Attorney'
  let typeDescription = 'Personal injury attorneys handle claims arising from accidents caused by another party\'s negligence. Most handle a range of accident types including motor vehicle crashes, slip and falls, and other incidents.'

  if (isWorkplace) {
    lawyerType = 'Workers\' Compensation and Personal Injury Attorney'
    typeDescription = 'Workplace accidents may involve both workers\' compensation claims and third-party personal injury claims. An attorney experienced in both areas can evaluate your full range of recovery options.'
  } else if (accType === 'slip-fall') {
    lawyerType = 'Premises Liability Attorney'
    typeDescription = 'Slip and fall and premises liability cases involve property owner duties of care, notice requirements, and specific evidence — such as incident reports, surveillance footage, and maintenance records. Attorneys who focus on premises liability are experienced with these issues.'
  } else if (accType === 'dog-bite') {
    lawyerType = 'Personal Injury / Dog Bite Attorney'
    typeDescription = 'California and Arizona both follow strict liability for dog bites in most circumstances. Personal injury attorneys who handle animal attack cases understand the applicable standards and damage types.'
  } else if (['car-accident', 'truck-accident', 'motorcycle-crash', 'bicycle-accident', 'pedestrian-accident'].includes(accType)) {
    lawyerType = accType === 'truck-accident' ? 'Commercial Vehicle / Trucking Accident Attorney' : 'Motor Vehicle Accident Attorney'
    typeDescription = accType === 'truck-accident'
      ? 'Truck accident cases involve federal FMCSA regulations, multiple potentially liable parties (driver, carrier, shipper), and insurers with significant resources. Attorneys with commercial trucking experience navigate these complexities.'
      : 'Motor vehicle accident attorneys handle claims against at-fault drivers, insurance companies, and other liable parties. They are experienced in accident reconstruction, insurance policy interpretation, and personal injury litigation.'
  }

  const items: OutputItem[] = []

  items.push({
    label: `Suggested attorney type: ${lawyerType}`,
    value: typeDescription,
    priority: 'important',
  })

  if (hasSerious) {
    items.push({
      label: 'Serious injuries — consider consulting an attorney promptly',
      value: 'Cases involving significant injuries often involve larger insurance limits, multiple liable parties, and expert witnesses. Early legal representation helps preserve evidence and protect your interests.',
      priority: 'critical',
    })
  }

  if (isDisputed) {
    items.push({
      label: 'Disputed or unclear liability',
      value: 'When fault is contested, legal representation is particularly valuable. An attorney can gather evidence, consult experts, and counter attempts to assign you an unfair share of fault.',
      priority: 'important',
    })
  }

  items.push({
    label: 'What to look for in a consultation',
    value: 'Experience with your specific accident type, a contingency fee structure (no upfront cost), clear communication about the process, and state bar membership in good standing.',
    priority: 'helpful',
  })

  items.push({
    label: 'Questions to ask during a free consultation',
    value: '"How many cases like mine have you handled?" / "What is your fee arrangement?" / "Who will handle my case day-to-day?" / "What is a realistic timeline?"',
    priority: 'helpful',
  })

  return {
    summary: `Based on your answers, a ${lawyerType} may be well-suited to handle situations like yours. This is general educational information only — every case is unique, and attorney selection should be based on your specific circumstances and comfort level.`,
    items,
    cta: { label: 'Connect with an Attorney', href: '/contact' },
    disclaimer: 'This tool provides general educational information only. It does not constitute a legal referral or recommendation of any specific attorney. Consult with a licensed attorney to evaluate your specific situation.',
    exportable: false,
  }
}

// ─── Tool 10: state-next-steps ────────────────────────────────────────────────

const stateNextSteps: OutputGenerator = (answers) => {
  const state = str(answers['state'])
  const accType = str(answers['accident-type'])
  const accidentDate = str(answers['accident-date'])

  const isCA = state === 'CA'
  const stateName = isCA ? 'California' : 'Arizona'
  const solYears = 2

  const items: OutputItem[] = []

  if (accidentDate) {
    const { daysRemaining, deadlineStr } = computeSolDeadline(accidentDate, solYears)

    items.push({
      label: `${stateName} statute of limitations deadline: ${deadlineStr}`,
      value: daysRemaining < 0
        ? 'The general deadline for this claim type may have passed. Some exceptions may apply — consult an attorney immediately.'
        : daysRemaining < 90
        ? `URGENT: Only ${daysRemaining} day(s) remaining. Consult an attorney as soon as possible.`
        : `${daysRemaining} days remaining. Earlier action is generally better — evidence and witnesses are more available sooner.`,
      priority: daysRemaining < 90 ? 'critical' : daysRemaining < 180 ? 'important' : 'helpful',
    })
  } else {
    items.push({
      label: `${stateName} statute of limitations: ${solYears} years from accident date`,
      value: `For most personal injury claims in ${stateName}, you have ${solYears} years from the accident date to file a lawsuit.`,
      priority: 'important',
    })
  }

  if (accType === 'workplace-injury') {
    items.push({
      label: isCA ? "Workers' Compensation: report within 30 days" : "Workers' Compensation: file within 1 year",
      value: isCA
        ? 'Report the injury to your employer within 30 days and file a formal DWC-1 claim within 1 year.'
        : 'Report to your employer as soon as possible and file a workers\' compensation claim within 1 year.',
      priority: 'critical',
    })
  }

  if (['car-accident', 'truck-accident', 'motorcycle-crash', 'bicycle-accident', 'pedestrian-accident'].includes(accType) && isCA) {
    items.push({
      label: 'CA DMV SR-1 Report: within 10 days',
      value: 'Required when injury, death, or property damage over $1,000 occurred. File with the California DMV within 10 days of the accident.',
      priority: 'important',
    })
  }

  items.push({
    label: 'Government claim notice: 180 days',
    value: `If a government entity was involved, you must file a formal claim notice within 180 days in ${stateName} (60 days for some AZ city/county entities). Missing this deadline bars your claim.`,
    priority: 'important',
  })

  items.push({
    label: `${stateName} fault rule: Pure comparative negligence`,
    value: `${stateName} uses pure comparative negligence — you may recover damages even if partially at fault, with your award reduced proportionally.`,
    priority: 'helpful',
  })

  items.push({
    label: `${stateName} minimum insurance requirements`,
    value: isCA
      ? 'California minimum: $30,000 per person / $60,000 per accident / $15,000 property damage (effective Jan 1, 2025, SB 1107).'
      : 'Arizona minimum: $25,000 per person / $50,000 per accident / $15,000 property damage.',
    priority: 'helpful',
  })

  return {
    summary: `Here are key deadlines and next steps for a ${accidentLabel(accType)} in ${stateName}. Deadlines in personal injury cases are strict — missing them can permanently bar your right to compensation. This is general educational information only, not legal advice.`,
    items,
    cta: { label: 'Connect with an Attorney', href: '/contact' },
    disclaimer: `This information is for general educational purposes only. ${stateName} laws change — verify all deadlines with a licensed attorney in ${stateName} before relying on them.`,
    exportable: true,
  }
}

// ─── Tool 11: statute-countdown ───────────────────────────────────────────────

const statuteCountdown: OutputGenerator = (answers) => {
  const accidentDate = str(answers['accident-date'])
  const accType = str(answers['accident-type'])
  const state = str(answers['state'])

  const isCA = state === 'CA'
  const stateName = isCA ? 'California' : 'Arizona'
  const solYears = 2
  const citation = isCA ? 'California CCP § 335.1' : 'A.R.S. § 12-542'

  const items: OutputItem[] = []

  if (accidentDate) {
    const { daysRemaining, deadlineStr } = computeSolDeadline(accidentDate, solYears)

    let deadlinePriority: 'critical' | 'important' | 'helpful' = 'helpful'
    let deadlineNote = ''

    if (daysRemaining < 0) {
      deadlinePriority = 'critical'
      deadlineNote = 'The general deadline for this claim type may have passed. Some exceptions may apply. Consult an attorney immediately.'
    } else if (daysRemaining < 90) {
      deadlinePriority = 'critical'
      deadlineNote = `URGENT: Only ${daysRemaining} day(s) remaining. Consider speaking with an attorney as soon as possible.`
    } else if (daysRemaining < 180) {
      deadlinePriority = 'important'
      deadlineNote = `${daysRemaining} days remaining. Your deadline is approaching — consult an attorney to confirm your specific deadline.`
    } else {
      deadlinePriority = 'helpful'
      deadlineNote = `${daysRemaining} days remaining. You have time, but earlier action generally leads to better outcomes.`
    }

    items.push({
      label: `General filing deadline: ${deadlineStr}`,
      value: deadlineNote,
      priority: deadlinePriority,
    })

    // Government claim deadline
    const [accY, accM, accD] = accidentDate.split('-').map(Number)
    const govDeadline = new Date(new Date(accY, accM - 1, accD).getTime() + 180 * 24 * 60 * 60 * 1000)
    const govDeadlineStr = govDeadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    items.push({
      label: `Government claim notice: 180 days (${isCA ? '6 months' : 'state'} / 60 days AZ city/county)`,
      value: `If a government entity was involved, this is a SEPARATE and SHORTER deadline than the ${solYears}-year statute. Missing it bars your claim. Deadline from your accident date: ${govDeadlineStr}.`,
      priority: 'important',
    })
  } else {
    items.push({
      label: `${stateName} general deadline: ${solYears} years from accident date`,
      value: `Enter your accident date to see the calculated deadline. (${citation})`,
      priority: 'important',
    })
  }

  items.push({
    label: 'Minor tolling may extend your deadline',
    value: 'If you were under 18 at the time of the accident, the limitations period may not begin until you reach 18. This is fact-specific — consult an attorney.',
    priority: 'helpful',
  })

  items.push({
    label: 'Discovery rule exceptions',
    value: 'For delayed-onset injuries, the limitations period may begin from the date of discovery rather than the accident. Consult an attorney to understand how this applies to you.',
    priority: 'helpful',
  })

  const accLabel = accidentLabel(accType)

  return {
    summary: `${accLabel.charAt(0).toUpperCase() + accLabel.slice(1)} in ${stateName} — General deadline: ${solYears} years from the accident date (${citation}). Statutes of limitations have many exceptions — your specific deadline may differ. Consult a licensed attorney to confirm your exact deadline before taking action.`,
    items,
    cta: { label: 'Connect with an Attorney', href: '/contact' },
    disclaimer: 'This tool shows GENERAL statutory deadlines for educational purposes only. Your specific deadline depends on facts unique to your case. Always consult a licensed attorney to confirm your deadline — do not rely on this tool alone.',
    exportable: false,
  }
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const outputGenerators: Record<string, OutputGenerator> = {
  'accident-case-quiz': accidentCaseQuiz,
  'urgency-checker': urgencyChecker,
  'evidence-checklist': evidenceChecklist,
  'injury-journal': injuryJournal,
  'lost-wages-estimator': lostWagesEstimator,
  'insurance-call-prep': insuranceCallPrep,
  'record-request': recordRequest,
  'settlement-readiness': settlementReadiness,
  'lawyer-type-matcher': lawyerTypeMatcher,
  'state-next-steps': stateNextSteps,
  'statute-countdown': statuteCountdown,
}
