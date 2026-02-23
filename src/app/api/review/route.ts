import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { applicationId, documents } = await req.json()

  if (!applicationId || !documents || Object.keys(documents).length === 0) {
    return NextResponse.json({ error: 'Missing application ID or documents' }, { status: 400 })
  }

  // Verify ownership
  const app = await prisma.gsaApplication.findFirst({
    where: { id: applicationId, userId: session.user.id },
  })
  if (!app) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  // Build document summary for analysis
  const docSummary = Object.entries(documents as Record<string, string>)
    .map(([key, content]) => {
      const preview = (content as string).substring(0, 8000)
      return `=== ${key.toUpperCase()} ===\nCharacter count: ${(content as string).length}\n\n${preview}${(content as string).length > 8000 ? '\n\n[TRUNCATED]' : ''}`
    })
    .join('\n\n')

  const systemPrompt = `You are a senior GSA MAS Contracting Officer with 20 years of experience evaluating Schedule offers. You are reviewing a new offeror's submission package. Your job is to identify every deficiency, gap, and risk that would cause you to reject this offer or send clarification requests.

RULES:
- Be brutally honest. Sugar-coating wastes the offeror's time and money.
- Score each element 0-100 based on how well it meets GSA requirements.
- A score of 0 means the element is completely missing.
- A score of 50 means present but inadequate — would trigger clarification.
- A score of 80+ means meets minimum requirements.
- A score of 95+ means exceeds expectations.
- Flag SPECIFIC text that is problematic and explain WHY.
- If something is missing entirely, say so. Do not infer or hallucinate content.
- Check character counts. eOffer fields have 10,000 character limits.
- For 518210C content, search for the word "cloud" in labor category titles and descriptions.

RESPOND IN EXACTLY THIS JSON FORMAT (no markdown, no backticks, just raw JSON):
{
  "overallScore": <number 0-100>,
  "overallVerdict": "<LIKELY AWARD | NEEDS WORK | AT RISK | WILL BE REJECTED>",
  "executiveSummary": "<2-3 sentences>",
  "categories": {
    "<category_id>": {
      "score": <number 0-100>,
      "findings": [
        {
          "elementId": "<string>",
          "score": <number 0-100>,
          "severity": "<critical|major|minor|pass>",
          "finding": "<specific issue>",
          "impact": "<why this matters>",
          "fix": "<exact action to take>"
        }
      ]
    }
  },
  "dealbreakers": ["<issues that WILL cause rejection>"],
  "clarificationRisks": ["<issues that will trigger CO clarification>"],
  "strengths": ["<what's good>"]
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
        messages: [
          {
            role: 'user',
            content: `Analyze this GSA MAS offer package:\n\n${docSummary}`,
          },
        ],
      }),
    })

    const data = await response.json()
    const text = data.content?.map((b: any) => b.text || '').join('') || ''

    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    const result = JSON.parse(cleaned)

    // Save review to database
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

    // Update application score
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
