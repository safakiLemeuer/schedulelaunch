import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { applicationId, documents } = await req.json()
  if (!applicationId || !documents || Object.keys(documents).length === 0) {
    return NextResponse.json({ error: 'Missing application ID or documents' }, { status: 400 })
  }

  const app = await prisma.gsaApplication.findFirst({ where: { id: applicationId, userId: session.user.id } })
  if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

  const docSummary = Object.entries(documents as Record<string, string>)
    .map(([key, content]) => {
      const preview = content.substring(0, 8000)
      return `=== ${key.toUpperCase()} ===\nCharacter count: ${content.length}\n\n${preview}${content.length > 8000 ? '\n\n[TRUNCATED]' : ''}`
    })
    .join('\n\n')

  const systemPrompt = `You are a senior GSA MAS Contracting Officer with 20 years of experience evaluating Schedule offers. Review this new offeror's submission and identify every deficiency.

RULES:
- Score each element 0-100.
- Flag specific problematic text and explain why.
- Check character counts (10,000 limit per eOffer field).

RESPOND IN JSON ONLY (no markdown):
{
  "overallScore": <0-100>,
  "overallVerdict": "<LIKELY AWARD | NEEDS WORK | AT RISK | WILL BE REJECTED>",
  "executiveSummary": "<2-3 sentences>",
  "categories": {},
  "dealbreakers": [],
  "clarificationRisks": [],
  "strengths": []
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Analyze this GSA MAS offer:\n\n${docSummary}` }],
      }),
    })

    const data = await response.json()
    const text = data.content?.map((b: any) => b.text || '').join('') || ''
    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const result = JSON.parse(cleaned)

    const review = await prisma.aiReview.create({
      data: {
        applicationId,
        overallScore: result.overallScore,
        verdict: result.overallVerdict,
        summary: result.executiveSummary,
        findings: result.categories,
        dealbreakers: result.dealbreakers,
        strengths: result.strengths,
      },
    })

    await prisma.gsaApplication.update({
      where: { id: applicationId },
      data: {
        readinessScore: result.overallScore,
        lastReviewedAt: new Date(),
        status: result.overallScore >= 85 ? 'READY_TO_SUBMIT' : 'UNDER_REVIEW',
      },
    })

    return NextResponse.json({ ...result, reviewId: review.id })
  } catch (error: any) {
    console.error('AI Review error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
