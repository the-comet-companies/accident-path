import type { IntakeForm } from '@/types/intake'
import type { Dictionary } from '@/i18n/dictionaries'

export const INTAKE_STORAGE_KEY = 'accident-path-intake-v1'

export interface StepProps {
  data: Partial<IntakeForm>
  onChange: (updates: Partial<IntakeForm>) => void
  onNext: () => void
  onBack: () => void
  strings?: Dictionary['intake']
}

export function monthsAgo(dateStr: string): number {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 0
  const now = new Date()
  return (
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth())
  )
}

export function computeUrgency(data: Partial<IntakeForm>): 'low' | 'medium' | 'high' {
  let score = 0
  if (data.medicalTreatment === 'surgery' || data.medicalTreatment === 'er') score += 3
  else if (data.medicalTreatment === 'ongoing') score += 2
  if (data.workImpact === 'cant_work') score += 3
  else if (data.workImpact === 'missed_days' || data.workImpact === 'reduced_capacity') score += 1
  if (data.accidentDate) {
    const months = monthsAgo(data.accidentDate)
    if (months > 18) score += 3
    else if (months > 12) score += 2
  }
  if (score >= 5) return 'high'
  if (score >= 2) return 'medium'
  return 'low'
}

export function suggestLawyerType(data: Partial<IntakeForm>): string {
  const type = (data.accidentType ?? '').toLowerCase()
  if (type.includes('truck')) return 'Commercial Vehicle Accident Attorney'
  if (type.includes('workplace')) return "Workers' Compensation Attorney"
  if (type.includes('dog') || type.includes('bite')) return 'Animal Attack / Personal Injury Attorney'
  if (type.includes('slip') || type.includes('fall')) return 'Premises Liability Attorney'
  if (type.includes('bicycle')) return 'Bicycle Accident Attorney'
  if (type.includes('pedestrian')) return 'Pedestrian Accident Attorney'
  if (type.includes('motorcycle')) return 'Motorcycle Accident Attorney'
  return 'Personal Injury Attorney'
}

export function computeUrgencyFactors(data: Partial<IntakeForm>): string[] {
  const factors: string[] = []
  if (data.medicalTreatment === 'er' || data.medicalTreatment === 'surgery')
    factors.push('serious_medical')
  if (data.workImpact === 'cant_work') factors.push('lost_income')
  if (data.policeReport === false) factors.push('no_police_report')
  if (data.accidentDate && monthsAgo(data.accidentDate) > 18) factors.push('statute_risk')
  return factors
}

export function suggestResources(data: Partial<IntakeForm>): Array<{ label: string; href: string }> {
  const type = (data.accidentType ?? '').toLowerCase()
  const resources: Array<{ label: string; href: string }> = []
  if (type.includes('car')) resources.push({ label: 'What to Do After a Car Accident', href: '/guides/after-car-accident' })
  if (type.includes('truck')) resources.push({ label: 'What to Do After a Truck Accident', href: '/guides/after-truck-accident' })
  if (type.includes('motorcycle')) resources.push({ label: 'What to Do After a Motorcycle Crash', href: '/guides/after-motorcycle-crash' })
  resources.push({ label: 'Dealing With Insurance Adjusters', href: '/guides/dealing-with-insurance-adjusters' })
  resources.push({ label: 'Am I at Fault?', href: '/guides/am-i-at-fault' })
  resources.push({ label: 'Evidence Collection Checklist', href: '/tools/evidence-checklist' })
  return resources.slice(0, 4)
}

