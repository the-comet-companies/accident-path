import { NextResponse } from 'next/server'
import { ToolLeadSchema } from '@/types/tool-lead'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ToolLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  const data = parsed.data

  const { error } = await getSupabase()
    .from('tool_leads')
    .insert({
      tool_slug: data.toolSlug,
      pattern: data.pattern,
      email: data.email ?? null,
      phone: data.phone ?? null,
      city: data.city ?? null,
      state: data.toolContext?.state ?? null,
      tool_context: data.toolContext,
      consent: data.consent,
    })

  if (error) {
    console.error('Tool lead insert error:', error.message)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }

  const webhookUrl = process.env.N8N_TOOL_LEAD_WEBHOOK_URL
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch((err) => console.error('[tool-lead] n8n webhook error:', err))
  }

  return NextResponse.json({ success: true })
}
