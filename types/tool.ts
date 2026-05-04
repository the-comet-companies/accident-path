import { z } from 'zod'

const ToolOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
})

export const ToolStepSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(['select', 'multiselect', 'checklist', 'number', 'text', 'date']),
  options: z.array(ToolOptionSchema).optional(),
  dynamicQuestion: z.object({
    basedOn: z.string(),
    map: z.record(z.string(), z.string()),
  }).optional(),
})

export const ToolConfigSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  description: z.string().min(100),
  disclaimer: z.string(),
  steps: z.array(ToolStepSchema).min(2),
  supportingContent: z.array(z.object({
    heading: z.string(),
    content: z.string().min(150),
    tips: z.array(z.string()).optional(),
  })).min(4),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string().min(50),
  })).min(3),
  relatedTools: z.array(z.string()),
  relatedGuides: z.array(z.string()),
  relatedAccidents: z.array(z.string()),
})

export type ToolOption = z.infer<typeof ToolOptionSchema>
export type ToolConfig = z.infer<typeof ToolConfigSchema>
export type ToolStep = z.infer<typeof ToolStepSchema>

export type ToolAnswers = Record<string, string | string[] | number>

export interface OutputItem {
  label: string
  value?: string
  priority: 'critical' | 'important' | 'helpful'
  category?: string
}

export interface CTAConfig {
  label: string
  href: string
}

export interface ToolOutput {
  summary: string
  items: OutputItem[]
  cta: CTAConfig
  disclaimer: string
  exportable: boolean
  emergency?: boolean
}
