import type { ToolAnswers } from '@/types/tool'

function s(v: ToolAnswers[string] | undefined): string {
  return typeof v === 'string' ? v : ''
}

// Converts a slug to a readable label without breaking numeric ranges.
// "1-7-days" → "1-7 days", "dog-bite" → "dog bite", "6-12-months" → "6-12 months"
function label(v: ToolAnswers[string] | undefined): string {
  return s(v).replace(/(?<!\d)-(?!\d)/g, ' ')
}

function labelArray(v: ToolAnswers[string] | undefined): string {
  return Array.isArray(v)
    ? (v as string[]).map(i => label(i)).join(', ')
    : label(v)
}

export interface LeadCaptureConfig {
  hook: string
  buttonLabel: string
  successMessage: string
  fields: Array<'email' | 'phone' | 'city'>
  requiresTcpa: boolean
  getContext: (answers: ToolAnswers) => Record<string, string>
}

// Tool configs are added one per task (Tasks 8–18).
// ToolEngine renders ToolLeadCapture only when a slug has an entry here.
export const TOOL_LEAD_CONFIGS: Partial<Record<string, LeadCaptureConfig>> = {
  'injury-journal': {
    hook: "Email me today's entry to keep a record.",
    buttonLabel: 'Email Me This Entry',
    successMessage: "Today's journal entry has been emailed to you.",
    fields: ['email'],
    requiresTcpa: false,
    getContext: (answers) => ({
      painLevel: String(answers['pain-level'] ?? ''),
      injuries: labelArray(answers['injury-type']),
    }),
  },
  'insurance-call-prep': {
    hook: 'Send me this script so I have it during the call.',
    buttonLabel: 'Send Me the Script',
    successMessage: 'Script sent — check your inbox before the call.',
    fields: ['email', 'phone'],
    requiresTcpa: true,
    getContext: (answers) => ({
      callerType: label(answers['caller-type']),
      callPurpose: label(answers['call-purpose']),
    }),
  },
  'accident-case-quiz': {
    hook: "Get personalized next steps — enter your email or phone and we'll follow up.",
    buttonLabel: 'Get My Personalized Steps',
    successMessage: "Got it — we'll be in touch with next steps tailored to your situation.",
    fields: ['email', 'phone'],
    requiresTcpa: true,
    getContext: (answers) => ({
      accidentType: label(answers['accident-type']),
      timeline: label(answers['timeline']),
      injuries: labelArray(answers['injuries']),
    }),
  },
  'record-request': {
    hook: 'Email me this checklist so I have it when I start making calls.',
    buttonLabel: 'Email Me the Checklist',
    successMessage: 'Check your inbox — your record request checklist is on the way.',
    fields: ['email'],
    requiresTcpa: false,
    getContext: (answers) => ({
      accidentType: label(answers['accident-type']),
      recordsNeeded: labelArray(answers['records-needed']),
    }),
  },
  'lost-wages-estimator': {
    hook: 'Email me this estimate and the documentation checklist.',
    buttonLabel: 'Email Me My Estimate',
    successMessage: 'Check your inbox — your wage loss estimate and documentation checklist are on the way.',
    fields: ['email'],
    requiresTcpa: false,
    getContext: (answers) => ({
      employmentType: label(answers['employment-type']),
      daysMissed: String(answers['days-missed'] ?? ''),
      ongoingLoss: label(answers['ongoing']),
    }),
  },
  'state-next-steps': {
    hook: 'Email me these deadlines so I have them for reference.',
    buttonLabel: 'Email Me My Deadlines',
    successMessage: 'Check your inbox — your state-specific deadlines are on the way.',
    fields: ['email'],
    requiresTcpa: false,
    getContext: (answers) => ({
      state: s(answers['state']),
      accidentType: label(answers['accident-type']),
      accidentDate: s(answers['accident-date']),
    }),
  },
  'evidence-checklist': {
    hook: "Email me this checklist so I don't lose it.",
    buttonLabel: 'Email Me the Checklist',
    successMessage: 'Check your inbox — your evidence checklist is on the way.',
    fields: ['email'],
    requiresTcpa: false,
    getContext: (answers) => ({
      accidentType: label(answers['accident-type']),
      locationType: label(answers['location-type']),
    }),
  },
  'statute-countdown': {
    hook: 'Email me a reminder before my deadline expires.',
    buttonLabel: 'Email Me a Reminder',
    successMessage: "Got it — we'll email you 30 days before your filing deadline.",
    fields: ['email'],
    requiresTcpa: false,
    getContext: (answers) => ({
      state: s(answers['state']),
      accidentType: label(answers['accident-type']),
      accidentDate: s(answers['accident-date']),
    }),
  },
}

export { s }
