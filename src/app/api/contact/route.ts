import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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

// Create reusable transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Send email function
async function sendContactEmail(data: z.infer<typeof contactSchema>) {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #4b5563; }
          .value { color: #1f2937; margin-top: 5px; }
          .scope { background: white; padding: 15px; border-left: 4px solid #667eea; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">🔔 New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Contact:</div>
              <div class="value">${data.contact}</div>
            </div>
            ${
              data.organization
                ? `
            <div class="field">
              <div class="label">Organization:</div>
              <div class="value">${data.organization}</div>
            </div>
            `
                : ''
            }
            <div class="field">
              <div class="label">Project Scope:</div>
              <div class="scope">${data.scope.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Contact Form Submission

Name: ${data.name}
Contact: ${data.contact}
${data.organization ? `Organization: ${data.organization}` : ''}

Project Scope:
${data.scope}
  `.trim();

  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'ROOTZ491 Website'}" <${
      process.env.SMTP_USER
    }>`,
    to: process.env.CONTACT_EMAIL,
    replyTo: data.contact,
    subject: `New Contact Form: ${data.name}${
      data.organization ? ` (${data.organization})` : ''
    }`,
    text: textContent,
    html: htmlContent,
  });
}

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

    // Send email using nodemailer
    try {
      await sendContactEmail(validatedData);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Return success to user even if email fails (log for debugging)
      // In production, you might want to store in database as backup
    }

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
