import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/db";
import { sendAdminEnquiryEmail } from "@/lib/notifications/email";

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

    // 2. Persist to Admin Panel CRM Database
    const enquiry = await createEnquiry({
      customer_name: name,
      phone: phone || "Not Provided",
      email: email.toLowerCase(),
      package_id: body.package_id || null,
      package_title: body.package_title || subject || "Website Contact Form",
      preferred_destination: body.preferred_destination || body.destination || null,
      travel_date: body.travel_date ? String(body.travel_date).trim() : null,
      traveller_count: body.traveller_count ? Number(body.traveller_count) : 2,
      additional_requirements: message,
      status: "new",
      privacy_notice_version: "1.0",
      marketing_consent: Boolean(body.marketing_consent),
      marketing_consent_timestamp: body.marketing_consent ? new Date().toISOString() : null,
      source_page: body.source_page || "/contact",
    });

    // 3. Send Email Notification via Resend to configured admin email
    let emailResult = null;
    try {
      emailResult = await sendAdminEnquiryEmail(enquiry);
    } catch (emailErr) {
      console.error("[Contact API] Email notification failed:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received and registered successfully.",
        enquiryId: enquiry.id,
        enquiry,
        emailResult,
      },
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

