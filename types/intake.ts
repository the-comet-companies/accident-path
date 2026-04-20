import { z } from 'zod'

export const IntakeFormSchema = z.object({
  accidentType: z.string(),
  accidentDate: z.string(),
  city: z.string(),
  state: z.enum(['CA', 'AZ']),
  injuries: z.array(z.string()),
  medicalTreatment: z.enum(['none', 'er', 'doctor', 'ongoing', 'surgery']),
  policeReport: z.boolean(),
  insuranceStatus: z.enum(['has_insurance', 'no_insurance', 'unsure']),
  workImpact: z.enum(['none', 'missed_days', 'cant_work', 'reduced_capacity']),
  urgencyFactors: z.array(z.string()),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  consent: z.boolean(),
})

export type IntakeForm = z.infer<typeof IntakeFormSchema>
