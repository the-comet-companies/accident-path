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
export const TOOL_LEAD_CONFIGS: Partial<Record<string, LeadCaptureConfig>> = {}

// s() is used by per-tool config entries added below
export { s }
