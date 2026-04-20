import { z } from 'zod'

export const InjuryTypeSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  description: z.string().min(100),
  symptoms: z.array(z.string()),
  longTermEffects: z.array(z.string()),
  treatmentOptions: z.array(z.string()),
  commonCauses: z.array(z.string()),
  relatedAccidents: z.array(z.string()),
  relatedTools: z.array(z.string()),
})

export type InjuryType = z.infer<typeof InjuryTypeSchema>
