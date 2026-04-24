import { NextResponse } from 'next/server'

// Stub CRM webhook — logs payload and returns 200.
// Replace with real CRM forwarding (HubSpot, etc.) before go-live.
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[webhook] CRM payload received:', JSON.stringify(body))

  return NextResponse.json({ received: true })
}
