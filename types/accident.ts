import { z } from 'zod'

export const AccidentTypeSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortTitle: z.string(),
  description: z.string().min(100),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  icon: z.string(),
  commonCauses: z.array(z.object({ title: z.string(), description: z.string() })).min(3),
  likelyInjuries: z.array(z.object({ slug: z.string(), title: z.string(), severity: z.enum(['mild', 'moderate', 'severe', 'catastrophic']) })),
  immediateSteps: z.array(z.object({ step: z.number(), title: z.string(), description: z.string(), urgency: z.enum(['critical', 'important', 'helpful']) })),
  evidenceChecklist: z.array(z.object({ category: z.string(), items: z.array(z.string()), priority: z.enum(['critical', 'important', 'helpful']) })),
  timelineRisks: z.array(z.object({ period: z.string(), risk: z.string(), action: z.string() })),
  insuranceIssues: z.array(z.object({ issue: z.string(), explanation: z.string() })),
  whenToGetLawyer: z.array(z.string()),
  relatedAccidents: z.array(z.string()),
  relatedInjuries: z.array(z.string()),
  relatedGuides: z.array(z.string()),
  relatedTools: z.array(z.string()),
})

export type AccidentType = z.infer<typeof AccidentTypeSchema>
