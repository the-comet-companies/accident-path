export interface ReportingDeadline {
  accidentTypes: string[] // empty array = applies to all accident types
  label: string
  deadlineDays: number | null // null = "per policy terms" (e.g. UM/UIM)
  details: string
}

export interface StateRules {
  sol: {
    personalInjury: number  // months
    propertyDamage: number
    wrongfulDeath: number
  }
  faultRule: {
    type: 'pure_comparative' | 'modified_comparative' | 'contributory' | 'no_fault'
    summary: string
  }
  insuranceMinimums: {
    perPerson: string
    perAccident: string
    propertyDamage: string
  }
  reportingDeadlines: ReportingDeadline[]
}
