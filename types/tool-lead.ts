import { z } from 'zod'

export const ToolLeadSchema = z.object({
  toolSlug: z.string(),
  pattern: z.enum(['A', 'C']),
  email: z.string().email().optional(),
  phone: z.string().min(7).optional(),
  city: z.string().optional(),
  consent: z.boolean(),
  toolContext: z.record(z.string(), z.string()).default({}),
})

export type ToolLead = z.infer<typeof ToolLeadSchema>
