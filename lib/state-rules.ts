// lib/state-rules.ts
import type { StateRules, ReportingDeadline } from '@/types/state-rules'

export const STATE_RULES: Record<'CA' | 'AZ', StateRules> = {
  CA: {
    sol: {
      personalInjury: 24,
      propertyDamage: 36,
      wrongfulDeath: 24,
    },
    faultRule: {
      type: 'pure_comparative',
      summary:
        'California uses pure comparative fault — you may recover damages even if you were partly at fault, with your award reduced in proportion to your share of responsibility.',
    },
    insuranceMinimums: {
      perPerson: '$30,000',
      perAccident: '$60,000',
      propertyDamage: '$15,000',
    },
    reportingDeadlines: [
      {
        accidentTypes: [
          'Car Accident',
          'Truck Accident',
          'Motorcycle Crash',
          'Bicycle Accident',
          'Pedestrian Accident',
        ],
        label: 'DMV SR-1 Report',
        deadlineDays: 10,
        details:
          'Required when an accident results in injury, death, or property damage over $1,000. File with the California DMV within 10 days.',
      },
      {
        accidentTypes: [],
        label: 'Government Entity Claim',
        deadlineDays: 180,
        details:
          'Claims against any California state or local government entity must be filed within 6 months of the incident. Missing this deadline is a hard bar to recovery.',
      },
      {
        accidentTypes: ['Workplace Injury'],
        label: "Workers' Compensation Notice",
        deadlineDays: 30,
        details:
          'Report the injury to your employer within 30 days. File a formal DWC-1 claim within 1 year of the injury date.',
      },
      {
        accidentTypes: ['Car Accident', 'Truck Accident', 'Motorcycle Crash'],
        label: 'UM/UIM Claim',
        deadlineDays: null,
        details:
          'Uninsured/underinsured motorist claims must be reported promptly per your policy terms. A lawsuit must be filed within 2 years under California law.',
      },
    ],
  },
  AZ: {
    sol: {
      personalInjury: 24,
      propertyDamage: 24,
      wrongfulDeath: 24,
    },
    faultRule: {
      type: 'pure_comparative',
      summary:
        'Arizona uses pure comparative fault — you may recover damages regardless of your share of fault, with your award reduced proportionally. There is no threshold that bars recovery.',
    },
    insuranceMinimums: {
      perPerson: '$25,000',
      perAccident: '$50,000',
      propertyDamage: '$15,000',
    },
    reportingDeadlines: [
      {
        accidentTypes: [],
        label: 'Government Entity Claim',
        deadlineDays: 180,
        details:
          'Claims against Arizona state, county, or municipal entities require pre-suit notice within 180 days of the incident. Missing this deadline bars your claim.',
      },
      {
        accidentTypes: ['Workplace Injury'],
        label: "Workers' Compensation Claim",
        deadlineDays: 365,
        details:
          'File a workers\' compensation claim within 1 year of the injury date. Report the injury to your employer as soon as possible.',
      },
      {
        accidentTypes: ['Car Accident', 'Truck Accident', 'Motorcycle Crash'],
        label: 'UM/UIM Claim',
        deadlineDays: null,
        details:
          'Uninsured/underinsured motorist claims must be reported promptly per your policy terms. Review your policy for specific notice requirements.',
      },
    ],
  },
}

export function getRelevantDeadlines(
  state: 'CA' | 'AZ',
  accidentType: string
): ReportingDeadline[] {
  return STATE_RULES[state].reportingDeadlines
    .filter(
      d => d.accidentTypes.length === 0 || d.accidentTypes.includes(accidentType)
    )
    .slice(0, 3)
}
