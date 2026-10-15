import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support standard field variations (e.g. name / fullName / customer_name)
    const name = (body.name || body.fullName || body.customer_name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || body.comments || body.requirements || body.additional_requirements || "").trim();
    const phone = (body.phone || "").trim();
    const subject = (body.subject || `New Contact Form Submission from ${name || "Website Visitor"}`).trim();

    // 1. Strict Server-Side Validation: Ensure no required fields are blank
    if (!name) {
      return NextResponse.json(
        { error: "Name is required and cannot be blank." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required and cannot be blank." },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Message is required and cannot be blank." },
        { status: 400 }
      );
    }

    // 2. Validate Resend API Key
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[Contact API] RESEND_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "Email service is temporarily unconfigured. Please contact support." },
        { status: 500 }
      );
    }

    // 3. Validate Recipient Contact Email
    const toEmail = process.env.CONTACT_EMAIL;
    if (!toEmail) {
      console.error("[Contact API] CONTACT_EMAIL is not defined in environment variables.");
      return NextResponse.json(
        { error: "Recipient contact email is not configured." },
        { status: 500 }
      );
    }

    // 4. Initialize Resend client
    const resend = new Resend(apiKey);

    // 5. Send email with strict requirements:
    //    - from: "onboarding@resend.dev"
    //    - to: process.env.CONTACT_EMAIL
    //    - reply_to: user's submitted email
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: toEmail,
      replyTo: email,
      subject,
      text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ""}Message:\n${message}\n\nSubmitted at: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">New Contact Form Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569; width: 100px;">From Name:</td>
              <td style="padding: 8px 0; color: #0f172a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">Email:</td>
              <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #475569;">Phone:</td>
              <td style="padding: 8px 0; color: #0f172a;">${phone}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top: 20px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; font-weight: 600; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message:</p>
            <p style="margin: 8px 0 0; color: #0f172a; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">
            Reply to this email directly to respond to <strong>${email}</strong>.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[Contact API] Resend email dispatch error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to deliver email through Resend." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully.", id: data?.id },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Contact API] Unexpected error handling submission:", err);
    return NextResponse.json(
      { error: err?.message || "An unexpected error occurred while processing your message." },
      { status: 500 }
    );
  }
}
