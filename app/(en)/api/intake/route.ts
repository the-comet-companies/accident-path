import { NextResponse } from 'next/server'
import { IntakeFormSchema } from '@/types/intake'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = IntakeFormSchema.safeParse(body)
  if (!parsed.success) {
    console.error('Intake validation error:', parsed.error.issues)
    return NextResponse.json(
      { error: 'Invalid submission' },
      { status: 400 }
    )
  }

  const data = parsed.data
  const { error } = await getSupabase()
    .from('intake_sessions')
    .insert({
      accident_type: data.accidentType,
      accident_date: data.accidentDate,
      city: data.city,
      state: data.state,
      injuries: data.injuries,
      medical: data.medicalTreatment,
      police_report: data.policeReport,
      insurance: data.insuranceStatus,
      work_impact: data.workImpact,
      urgency_factors: data.urgencyFactors,
      name: data.name ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      consent: data.consent,
    })

  if (error) {
    console.error('Intake insert error:', error.message, { code: error.code })
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
