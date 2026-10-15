import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/db";
import { sendAdminEnquiryEmail } from "@/lib/notifications/email";

// Simple in-memory rate limiting map: IP -> timestamp
const ipRateMap = new Map<string, number[]>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const timestamps = ipRateMap.get(ip) || [];
    // Filter last 10 minutes
    const recent = timestamps.filter((t) => now - t < 1000 * 60 * 10);

    // Limit to 5 submissions per 10 minutes per IP
    if (recent.length >= 5) {
      return NextResponse.json(
        { error: "Too many enquiry requests. Please wait a few moments before trying again." },
        { status: 429 }
      );
    }
    recent.push(now);
    ipRateMap.set(ip, recent);

    const body = await request.json();

    // 1. Validate required fields with fallback aliases
    const customer_name = body.customer_name || body.name;
    const phone = body.phone;
    const email = body.email;
    const package_id = body.package_id;
    const package_title = body.package_title;
    const preferred_destination = body.preferred_destination || body.destination_preference;
    const travel_date = body.travel_date || body.travel_dates;
    const traveller_count = body.traveller_count || body.group_size;
    const additional_requirements = body.additional_requirements || body.special_requirements;
    const marketing_consent = body.marketing_consent;
    const privacy_consent = body.privacy_consent;
    const bot_trap = body.bot_trap;

    // Honeypot spam check - silent acceptance so bot does not retry with alternate vectors
    if (bot_trap) {
      return NextResponse.json(
        { success: true, message: "Enquiry recorded.", is_bot: true },
        { status: 200 }
      );
    }

    if (!customer_name || typeof customer_name !== "string" || customer_name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    // Phone validation
    const cleanPhone = String(phone || "").replace(/[^0-9+]/g, "");
    if (!cleanPhone || cleanPhone.length < 8 || cleanPhone.length > 16) {
      return NextResponse.json(
        { error: "Please provide a valid phone or WhatsApp number with country code." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const pax = Math.max(1, parseInt(String(traveller_count || "2"), 10) || 2);

    // 2. Persist to database
    const enquiry = await createEnquiry({
      customer_name: customer_name.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      package_id: package_id || null,
      package_title: package_title || null,
      preferred_destination: preferred_destination || null,
      travel_date: travel_date ? String(travel_date).trim() : null,
      traveller_count: pax,
      additional_requirements: additional_requirements ? String(additional_requirements).trim().slice(0, 1000) : null,
      status: "new",
      privacy_notice_version: "1.0",
      marketing_consent: Boolean(marketing_consent),
      marketing_consent_timestamp: marketing_consent ? new Date().toISOString() : null,
      source_page: body.source_page || null,
    });

    // 3. Trigger email notification (resilient: failures are logged without failing client submission)
    try {
      await sendAdminEnquiryEmail(enquiry);
    } catch (notifErr) {
      console.error("[Notification Warning] Email dispatch failed:", notifErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your travel enquiry has been received. Our Kochi concierge team will contact you within 24 hours.",
        enquiryId: enquiry.id,
        enquiry,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[Enquiry API Error]:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your enquiry. Please try again or chat with us on WhatsApp." },
      { status: 500 }
    );
  }
}
