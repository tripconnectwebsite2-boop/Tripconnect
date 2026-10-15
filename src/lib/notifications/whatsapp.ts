export interface WhatsAppClickToChatOptions {
  phone?: string;
  packageTitle?: string;
  customerName?: string;
  customMessage?: string;
}

/**
 * Constructs a safe, sanitized WhatsApp click-to-chat URL.
 * Defaults to the verified Trip Connect concierge desk (+91 9400886838).
 */
export function buildWhatsAppChatUrl(options: WhatsAppClickToChatOptions = {}): string {
  const defaultPhone = "919400886838";
  const rawPhone = options.phone || defaultPhone;
  // Clean phone to only digits
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");

  let message = "";
  if (options.customMessage) {
    message = options.customMessage;
  } else if (options.packageTitle) {
    message = `Hello Trip Connect! I am interested in planning the "${options.packageTitle}" tour. Could you please share more details and availability?`;
  } else {
    message = "Hello Trip Connect! I would like to consult with your travel concierge about planning a bespoke Kerala holiday.";
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a follow-up WhatsApp message URL for administrators responding to an enquiry.
 */
export function buildAdminFollowUpWhatsAppUrl(
  customerPhone: string,
  customerName: string,
  packageOrDest?: string | null
): string {
  const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
  const subject = packageOrDest ? ` for "${packageOrDest}"` : "";
  const message = `Hello ${customerName}, thank you for contacting Trip Connect Kochi! We received your travel enquiry${subject}. I would be delighted to assist you with curating your itinerary. When would be a convenient time to discuss your preferences?`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
