import { z } from 'zod'

export const GuideSchema = z.object({
  slug: z.string(),
  title: z.string(),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  description: z.string().min(100),
  sections: z.array(z.object({
    heading: z.string(),
    content: z.string().min(50),
    tips: z.array(z.string()).optional(),
  })).min(3),
  relatedAccidents: z.array(z.string()),
  relatedTools: z.array(z.string()),
  relatedGuides: z.array(z.string()),
})

export type Guide = z.infer<typeof GuideSchema>
