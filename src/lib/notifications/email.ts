import { Enquiry } from "../types";

export interface EmailNotificationResult {
  success: boolean;
  channel: "email";
  status: "sent" | "failed" | "simulated";
  messageId?: string;
  error?: string;
}

export async function sendAdminEnquiryEmail(enquiry: Enquiry): Promise<EmailNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "tripconnectwebsite2@gmail.com";
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || "notifications@tripconnect.in";

  const emailSubject = `[New Enquiry] ${enquiry.customer_name} — ${
    enquiry.package_title || enquiry.preferred_destination || "Bespoke Journey"
  }`;

  const emailHtml = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #171c22; line-height: 1.6;">
      <div style="background-color: #006193; padding: 24px; border-radius: 12px 12px 0 0; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 600;">Trip Connect — New Travel Enquiry</h2>
        <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">Received via tripconnect.in concierge desk</p>
      </div>

      <div style="background-color: #f7f9ff; padding: 24px; border: 1px solid #dee3eb; border-top: none; border-radius: 0 0 12px 12px;">
        <h3 style="margin-top: 0; font-size: 16px; color: #006193;">Customer Details</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: 600; width: 140px;">Name:</td>
            <td style="padding: 6px 0;">${enquiry.customer_name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Phone / WhatsApp:</td>
            <td style="padding: 6px 0;"><a href="tel:${enquiry.phone}" style="color: #006193;">${enquiry.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Email:</td>
            <td style="padding: 6px 0;"><a href="mailto:${enquiry.email}" style="color: #006193;">${enquiry.email}</a></td>
          </tr>
        </table>

        <h3 style="margin-top: 0; font-size: 16px; color: #006193;">Travel Preferences</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: 600; width: 140px;">Package / Circuit:</td>
            <td style="padding: 6px 0;">${enquiry.package_title || enquiry.preferred_destination || "Custom Itinerary"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Travel Date / Month:</td>
            <td style="padding: 6px 0;">${enquiry.travel_date || "Flexible / Not finalized"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Travellers:</td>
            <td style="padding: 6px 0;">${enquiry.traveller_count} Persons</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Special Notes:</td>
            <td style="padding: 6px 0;">${enquiry.additional_requirements || "None specified"}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #dee3eb; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/enquiries" 
             style="display: inline-block; background-color: #006193; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Open Enquiry in CRM
          </a>
        </div>
      </div>
    </div>
  `;

  if (apiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [adminEmail],
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          channel: "email",
          status: "sent",
          messageId: data.id,
        };
      } else {
        const errText = await response.text();
        return {
          success: false,
          channel: "email",
          status: "failed",
          error: `Email provider error: ${errText}`,
        };
      }
    } catch (err: any) {
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
