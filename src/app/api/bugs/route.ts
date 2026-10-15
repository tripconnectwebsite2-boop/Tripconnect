import { NextResponse } from "next/server";
import { createBug } from "@/lib/db";
import { BugCategory, BugSeverity } from "@/lib/types";

// Rate limiting map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const now = Date.now();

    // 5 submissions per 5 minutes per IP
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => now - t < 5 * 60 * 1000);
    if (validTimestamps.length >= 8) {
      return NextResponse.json(
        { error: "Too many bug reports submitted recently. Please try again in a few minutes." },
        { status: 429 }
      );
    }
    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    const body = await req.json();

    // Honeypot check (hidden field bots fill out)
    if (body.website_trap || body.fax_number) {
      // Silently discard spam bot
      return NextResponse.json({
        success: true,
        message: "Report received.",
        ticket_id: "BUG-SPAM-PROTECTED",
      });
    }

    const {
      title,
      description,
      steps_to_reproduce,
      category,
      severity,
      page_url,
      reporter_name,
      reporter_email,
      screenshot_url,
      device_info,
    } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Please provide a descriptive title (at least 3 characters)." },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string" || description.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a detailed description (at least 5 characters)." },
        { status: 400 }
      );
    }

    const validCategories: BugCategory[] = [
      "booking_issue",
      "visual_glitch",
      "broken_link",
      "performance",
      "content_error",
      "mobile_issue",
      "other",
    ];

    const validSeverities: BugSeverity[] = ["low", "medium", "high", "critical"];

    const sanitizedCategory: BugCategory = validCategories.includes(category)
      ? category
      : "other";

    const sanitizedSeverity: BugSeverity = validSeverities.includes(severity)
      ? severity
      : "medium";

    const bug = await createBug({
      title: title.trim().slice(0, 150),
      description: description.trim().slice(0, 2000),
      steps_to_reproduce: steps_to_reproduce ? String(steps_to_reproduce).trim().slice(0, 2000) : undefined,
      category: sanitizedCategory,
      severity: sanitizedSeverity,
      page_url: page_url ? String(page_url).trim().slice(0, 300) : undefined,
      reporter_name: reporter_name ? String(reporter_name).trim().slice(0, 80) : undefined,
      reporter_email: reporter_email ? String(reporter_email).trim().slice(0, 100) : undefined,
      screenshot_url: (() => {
        if (!screenshot_url || typeof screenshot_url !== "string") return undefined;
        const clean = screenshot_url.trim();
        if (clean.startsWith("data:image/") || clean.startsWith("/") || clean.startsWith("http://") || clean.startsWith("https://")) {
          // Allow up to 2.5MB data URL
          return clean.slice(0, 2500000);
        }
        return undefined;
      })(),
      device_info: device_info && typeof device_info === "object" ? {
        browser: device_info.browser ? String(device_info.browser).slice(0, 100) : undefined,
        os: device_info.os ? String(device_info.os).slice(0, 100) : undefined,
        screen_resolution: device_info.screen_resolution ? String(device_info.screen_resolution).slice(0, 50) : undefined,
        user_agent: device_info.user_agent ? String(device_info.user_agent).slice(0, 300) : undefined,
      } : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bug report submitted successfully! Thank you for helping us improve Trip Connect.",
        bug: {
          id: bug.id,
          title: bug.title,
          status: bug.status,
          severity: bug.severity,
          created_at: bug.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit bug report." },
      { status: 500 }
    );
  }
}
