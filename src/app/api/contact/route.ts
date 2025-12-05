import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contact: z.string().min(5, 'Contact information is required'),
  organization: z.string().optional(),
  scope: z.string().min(10, 'Please provide project details'),
  website: z.string().max(0, 'Invalid submission'), // Honeypot
});

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Example: Send email using environment variables
    // const SMTP_HOST = process.env.SMTP_HOST;
    // const SMTP_PORT = process.env.SMTP_PORT;
    // const SMTP_USER = process.env.SMTP_USER;
    // const SMTP_PASS = process.env.SMTP_PASS;
    // const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

    // await sendEmail({
    //   to: CONTACT_EMAIL,
    //   subject: `New Contact Form: ${validatedData.name}`,
    //   body: `
    //     Name: ${validatedData.name}
    //     Contact: ${validatedData.contact}
    //     Organization: ${validatedData.organization || 'N/A'}
    //     Scope: ${validatedData.scope}
    //   `,
    // });

    return NextResponse.json(
      { success: true, message: 'Message received successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
