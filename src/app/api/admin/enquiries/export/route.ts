import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getEnquiries } from "@/lib/db";

function sanitizeCsvField(field: any): string {
  if (field === null || field === undefined) {
    return "";
  }
  let str = String(field).trim();

  // Prevent Spreadsheet Formula Injection (CSV Injection)
  if (str.length > 0 && ["=", "+", "-", "@", "\t", "\r"].includes(str[0])) {
    str = `'${str}`;
  }

  // Escape double quotes and enclose in quotes if needed
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  const enquiries = await getEnquiries({ status, search });

  const headers = [
    "Enquiry ID",
    "Customer Name",
    "Phone / WhatsApp",
    "Email Address",
    "Package / Destination",
    "Travel Date",
    "Traveller Count",
    "Status",
    "Marketing Consent",
    "Requirements / Notes",
    "Created At",
  ];

  const rows = enquiries.map((e) => [
    sanitizeCsvField(e.id),
    sanitizeCsvField(e.customer_name),
    sanitizeCsvField(e.phone),
    sanitizeCsvField(e.email),
    sanitizeCsvField(e.package_title || e.preferred_destination || "Custom Tour"),
    sanitizeCsvField(e.travel_date || "Flexible"),
    sanitizeCsvField(e.traveller_count),
    sanitizeCsvField(e.status.toUpperCase()),
    sanitizeCsvField(e.marketing_consent ? "YES" : "NO"),
    sanitizeCsvField(e.additional_requirements || ""),
    sanitizeCsvField(e.created_at),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\r\n");

  const filename = `trip-connect-enquiries-${new Date().toISOString().split("T")[0]}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
