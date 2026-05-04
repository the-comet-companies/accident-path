import type { ToolAnswers } from '@/types/tool'

function s(v: ToolAnswers[string] | undefined): string {
  return typeof v === 'string' ? v : ''
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
  'evidence-checklist': {
    hook: "Email me this checklist so I don't lose it.",
    buttonLabel: 'Email Me the Checklist',
    successMessage: 'Check your inbox — your evidence checklist is on the way.',
    fields: ['email'],
    requiresTcpa: false,
    getContext: (answers) => ({
      accidentType: s(answers['accident-type']).replace(/-/g, ' '),
      locationType: s(answers['location-type']).replace(/-/g, ' '),
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
      accidentType: s(answers['accident-type']).replace(/-/g, ' '),
      accidentDate: s(answers['accident-date']),
    }),
  },
}

// s() is used by per-tool config entries added below
export { s }
