import { z } from 'zod'

export const ToolStepSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(['select', 'multiselect', 'checklist', 'number', 'text', 'date']),
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

export type ToolConfig = z.infer<typeof ToolConfigSchema>
export type ToolStep = z.infer<typeof ToolStepSchema>
