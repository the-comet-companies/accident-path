import { describe, it, expect } from 'vitest'
import { STATE_RULES, getRelevantDeadlines } from '@/lib/state-rules'

describe('STATE_RULES', () => {
  it('CA has a 24-month personal injury SOL', () => {
    expect(STATE_RULES.CA.sol.personalInjury).toBe(24)
  })

  it('AZ has a 24-month personal injury SOL', () => {
    expect(STATE_RULES.AZ.sol.personalInjury).toBe(24)
  })

  it('both states use pure_comparative fault', () => {
    expect(STATE_RULES.CA.faultRule.type).toBe('pure_comparative')
    expect(STATE_RULES.AZ.faultRule.type).toBe('pure_comparative')
  })

  it('CA minimum per-person liability is $30,000', () => {
    expect(STATE_RULES.CA.insuranceMinimums.perPerson).toBe('$30,000')
  })

  it('AZ minimum per-person liability is $25,000', () => {
    expect(STATE_RULES.AZ.insuranceMinimums.perPerson).toBe('$25,000')
  })
})

describe('getRelevantDeadlines', () => {
  it('always includes the government entity claim deadline', () => {
    const deadlines = getRelevantDeadlines('CA', 'Slip & Fall')
    expect(deadlines.some(d => d.label === 'Government Entity Claim')).toBe(true)
  })

  it('includes DMV SR-1 for Car Accident in CA', () => {
    const deadlines = getRelevantDeadlines('CA', 'Car Accident')
    expect(deadlines.some(d => d.label === 'DMV SR-1 Report')).toBe(true)
  })

  it('does NOT include DMV SR-1 for Workplace Injury in CA', () => {
    const deadlines = getRelevantDeadlines('CA', 'Workplace Injury')
    expect(deadlines.some(d => d.label === 'DMV SR-1 Report')).toBe(false)
  })

  it('includes Workers Compensation for Workplace Injury in CA', () => {
    const deadlines = getRelevantDeadlines('CA', 'Workplace Injury')
    expect(deadlines.some(d => d.label.includes("Workers' Compensation"))).toBe(true)
  })

  it('returns at most 3 deadlines', () => {
    const deadlines = getRelevantDeadlines('CA', 'Car Accident')
    expect(deadlines.length).toBeLessThanOrEqual(3)
  })

  it('AZ Workplace Injury deadline is 365 days', () => {
    const deadlines = getRelevantDeadlines('AZ', 'Workplace Injury')
    const wc = deadlines.find(d => d.label.includes("Workers' Compensation"))
    expect(wc?.deadlineDays).toBe(365)
  })

  it('CA Workplace Injury notice deadline is 30 days', () => {
    const deadlines = getRelevantDeadlines('CA', 'Workplace Injury')
    const wc = deadlines.find(d => d.label.includes("Workers' Compensation"))
    expect(wc?.deadlineDays).toBe(30)
  })
})
