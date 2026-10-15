import { Enquiry } from "../types";
import { Resend } from "resend";

export interface EmailNotificationResult {
  success: boolean;
  channel: "email";
  status: "sent" | "failed" | "simulated";
  messageId?: string;
  error?: string;
}

export async function sendAdminEnquiryEmail(enquiry: Enquiry): Promise<EmailNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  const adminEmail =
    process.env.CONTACT_EMAIL ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.NOTIFICATION_EMAIL_TO ||
    process.env.ADMIN_ALLOWED_EMAIL ||
    "tripconnectwebsite2@gmail.com";
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || "onboarding@resend.dev";
  const crmUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://tripconnwct-website.vercel.app"}/admin/enquiries`;

  const rawPhone = enquiry.phone || "";
  const digitsOnly = rawPhone.replace(/[^0-9]/g, "");
  const waNumber = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
  const hasValidPhone = waNumber.length >= 10;
  const waMessage = encodeURIComponent(
    `Hello ${enquiry.customer_name || ""}, thank you for contacting Trip Connect! We received your travel enquiry regarding ${
      enquiry.package_title || enquiry.preferred_destination || "your Kerala holiday"
    }. How can we assist you with planning your itinerary?`
  );
  const waUrl = hasValidPhone ? `https://wa.me/${waNumber}?text=${waMessage}` : "";

  const emailSubject = `✦ [New Enquiry] ${enquiry.customer_name} — ${
    enquiry.package_title || enquiry.preferred_destination || "Bespoke Kerala Circuit"
  }`;

  const emailHtml = `
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <tr>
    <td align="center">
      <!-- Main Container Card (600px Max) -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
        
        <!-- Luxury Emerald Header -->
        <tr>
          <td style="background-color: #047857; padding: 28px 32px; text-align: left; background: linear-gradient(135deg, #065f46 0%, #047857 100%);">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); color: #fef3c7; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.3);">
                    ✦ New Concierge Enquiry
                  </span>
                  <h1 style="color: #ffffff; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; margin: 12px 0 4px 0; letter-spacing: -0.3px;">
                    Trip Connect
                  </h1>
                  <p style="color: #d1fae5; font-size: 13px; margin: 0; letter-spacing: 0.3px;">
                    Kochi Head Office • God's Own Country Travel Desk
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body Section -->
        <tr>
          <td style="padding: 32px;">
            <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 20px 0;">
              You have received a new luxury itinerary enquiry through your website. Here are the traveler's submitted details:
            </p>

            <!-- Guest & Trip Details Table -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 24px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b; font-size: 13px; width: 140px;">
                  Traveler Name
                </td>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 14px;">
                  ${enquiry.customer_name}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b; font-size: 13px;">
                  Email Address
                </td>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; color: #047857; font-size: 14px; font-weight: 600;">
                  <a href="mailto:${enquiry.email}" style="color: #047857; text-decoration: none;">${enquiry.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b; font-size: 13px;">
                  WhatsApp / Phone
                </td>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px; font-weight: 600;">
                  <a href="tel:${enquiry.phone}" style="color: #0f172a; text-decoration: none;">${enquiry.phone || "Not Provided"}</a>
                  ${
                    hasValidPhone
                      ? `
                  <a href="${waUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-left: 8px; vertical-align: middle; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
                    <span style="font-size: 13px; vertical-align: middle; margin-right: 3px;">💬</span>
                    <span style="vertical-align: middle;">Chat on WhatsApp</span>
                  </a>`
                      : ""
                  }
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b; font-size: 13px;">
                  Destination / Tour
                </td>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; color: #b45309; font-size: 14px; font-weight: 700;">
                  ${enquiry.package_title || enquiry.preferred_destination || "Bespoke Kerala Circuit"}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b; font-size: 13px;">
                  Travel Dates
                </td>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px;">
                  ${enquiry.travel_date || "Flexible / To Be Confirmed"}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 18px; font-weight: 600; color: #64748b; font-size: 13px;">
                  No. of Travelers
                </td>
                <td style="padding: 12px 18px; color: #0f172a; font-size: 14px; font-weight: 600;">
                  ${enquiry.traveller_count} Guests
                </td>
              </tr>
            </table>

            <!-- Requirements / Message Card -->
            <div style="background-color: #ffffff; border-left: 4px solid #d97706; padding: 18px 20px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 28px; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
              <span style="display: block; font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                Special Wishes & Notes
              </span>
              <p style="color: #1e293b; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
                ${enquiry.additional_requirements || "No specific customization notes provided."}
              </p>
            </div>

            <!-- Action Button: Open in Admin CRM & Reply to Guest -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              ${
                hasValidPhone
                  ? `
              <tr>
                <td align="center" style="padding-bottom: 12px;">
                  <a href="${waUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 32px; border-radius: 8px; box-shadow: 0 2px 10px rgba(37, 211, 102, 0.35);">
                    <span style="font-size: 16px; vertical-align: middle; margin-right: 6px;">💬</span>
                    <span style="vertical-align: middle;">Chat with ${enquiry.customer_name} on WhatsApp</span>
                  </a>
                </td>
              </tr>`
                  : ""
              }
              <tr>
                <td align="center" style="padding-bottom: 12px;">
                  <a href="${crmUrl}" style="display: inline-block; background-color: #047857; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 13px 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(4, 120, 87, 0.25);">
                    📋 View in Admin CRM
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <a href="mailto:${enquiry.email}" style="color: #047857; font-size: 13px; font-weight: 600; text-decoration: underline;">
                    ✉ Direct Reply to Guest (${enquiry.email})
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 22px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #64748b; font-size: 12px; margin: 0 0 6px 0; font-weight: 600;">
              Trip Connect • Curated Bespoke Journeys • Kochi, Kerala
            </p>
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
              Kerala Tourism Approved Partner • Ayyappankavu, Ernakulam – 682018
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
  `;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        replyTo: enquiry.email,
        subject: emailSubject,
        html: emailHtml,
        text: `New Enquiry Received from ${enquiry.customer_name}\n\nPhone: ${enquiry.phone || "Not Provided"}${hasValidPhone ? ` (WhatsApp: ${waUrl})` : ""}\nEmail: ${enquiry.email}\nPackage: ${enquiry.package_title || enquiry.preferred_destination || "Custom Itinerary"}\nDate: ${enquiry.travel_date || "Flexible"}\nGuests: ${enquiry.traveller_count}\nNotes: ${enquiry.additional_requirements || "None"}\n\nView CRM: ${crmUrl}`,
      });

      if (error) {
        console.error("[Email Notification Error] Resend returned error:", error);
        return {
          success: false,
          channel: "email",
          status: "failed",
          error: error.message,
        };
      }

      console.log(`[Email Notification] Successfully sent enquiry email via Resend (ID: ${data?.id})`);
      return {
        success: true,
        channel: "email",
        status: "sent",
        messageId: data?.id,
      };
    } catch (err: any) {
      console.error("[Email Notification Error] Failed to send via Resend SDK:", err);
      return {
        success: false,
        channel: "email",
        status: "failed",
        error: err?.message || "Network error while dispatching email",
      };
    }
  }

  // Safe developer fallback: Log simulated email delivery
  console.log(`[SIMULATED EMAIL NOTIFICATION] To: ${adminEmail} | Subject: ${emailSubject}`);
  return {
    success: true,
    channel: "email",
    status: "simulated",
    messageId: `sim-${Date.now()}`,
  };
}
