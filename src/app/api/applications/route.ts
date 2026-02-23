import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const applications = await prisma.gsaApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      narratives: true,
      laborCategories: true,
      reviews: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  return NextResponse.json(applications)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const application = await prisma.gsaApplication.create({
    data: {
      userId: session.user.id,
      companyName: body.companyName || null,
      uei: body.uei || null,
      cage: body.cage || null,
      status: 'IN_PROGRESS',
    },
  })

  return NextResponse.json(application)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, ...data } = body

  const app = await prisma.gsaApplication.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!app) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await prisma.gsaApplication.update({
    where: { id },
    data,
  })

  return NextResponse.json(updated)
}
