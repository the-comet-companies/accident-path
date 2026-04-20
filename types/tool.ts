import { z } from 'zod'

export const ToolConfigSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  description: z.string(),
  disclaimer: z.string(),
  steps: z.array(z.object({
    id: z.string(),
    question: z.string(),
    type: z.enum(['select', 'multiselect', 'checklist', 'number', 'text', 'date']),
    options: z.array(z.object({ value: z.string(), label: z.string(), description: z.string().optional() })).optional(),
  })),
})

export type ToolConfig = z.infer<typeof ToolConfigSchema>

export interface ToolOutput {
  summary: string
  items: { label: string; value: string; priority?: 'critical' | 'important' | 'helpful' }[]
  cta: { text: string; href: string }
  disclaimer: string
  exportable: boolean
}
