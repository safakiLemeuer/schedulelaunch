import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name || normalizedEmail.split('@')[0],
      },
    })
  }

  // Create session
  await createSession(user.id)

  return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
}
