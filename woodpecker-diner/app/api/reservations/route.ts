import { NextResponse } from 'next/server'

type Reservering = {
  date: string
  time: string
  guests: string
  name: string
  email: string
  phone: string
  note?: string
}

const VERPLICHT = ['date', 'time', 'guests', 'name', 'email', 'phone'] as const

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<Reservering> | null

  if (!body || VERPLICHT.some((veld) => !body[veld])) {
    return NextResponse.json(
      { success: false, message: 'Vul alle velden in om te reserveren.' },
      { status: 400 },
    )
  }

  const endpoint = process.env.ODOO_RESERVATIONS_URL
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.ODOO_API_KEY ? { Authorization: `Bearer ${process.env.ODOO_API_KEY}` } : {}),
      },
      body: JSON.stringify(body),
    }).catch(() => null)

    if (!res?.ok) {
      return NextResponse.json(
        { success: false, message: 'Reservering kon niet worden doorgezet.' },
        { status: 502 },
      )
    }
  }

  return NextResponse.json({ success: true, message: 'Reservation confirmed' })
}
