import { z } from 'zod'

export const StateDataSchema = z.object({
  slug: z.string(),
  name: z.string(),
  abbreviation: z.enum(['CA', 'AZ']),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  statuteOfLimitations: z.object({ personalInjury: z.string(), propertyDamage: z.string(), wrongfulDeath: z.string() }),
  faultRule: z.object({ type: z.enum(['pure_comparative', 'modified_comparative', 'contributory', 'no_fault']), description: z.string() }),
  reportingDeadlines: z.array(z.object({ type: z.string(), deadline: z.string(), details: z.string() })),
  insuranceMinimums: z.object({ bodilyInjuryPerPerson: z.string(), bodilyInjuryPerAccident: z.string(), propertyDamage: z.string(), uninsuredMotorist: z.string().optional() }),
  keyLaws: z.array(z.object({ name: z.string(), description: z.string() })),
  reviewedBy: z.string().min(1),
  reviewDate: z.string().min(1),
})

export type StateData = z.infer<typeof StateDataSchema>

export const CityDataSchema = z.object({
  slug: z.string(),
  name: z.string(),
  stateSlug: z.string(),
  stateAbbreviation: z.enum(['CA', 'AZ']),
  metaTitle: z.string().max(70),
  metaDescription: z.string().min(120).max(160),
  population: z.string(),
  description: z.string().min(200),
  hospitals: z.array(z.object({ name: z.string(), address: z.string(), phone: z.string().optional(), erAvailable: z.boolean() })).min(2),
  courts: z.array(z.object({ name: z.string(), address: z.string(), phone: z.string().optional(), type: z.string() })).min(1),
  commonAccidentTypes: z.array(z.string()).min(3),
  notableCorridors: z.array(z.string()).optional(),
  localNotes: z.string().min(50),
  reviewedBy: z.string().min(1),
  reviewDate: z.string().min(1),
})

export type CityData = z.infer<typeof CityDataSchema>
