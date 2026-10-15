export type PackageCategory =
  | "Kerala Tours"
  | "India Tours"
  | "Family Trips"
  | "Honeymoon Packages"
  | "Adventure & Nature"
  | "Weekend & Short Trips"
  | "Custom / Tailor-Made Trips";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activity?: string;
  image?: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  slug: string;
  destination_id: string | null;
  destination_name?: string;
  category: PackageCategory;
  short_description: string;
  description: string;
  starting_price: number;
  currency: string;
  duration_days: number;
  duration_nights: number;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  accommodation_details?: string;
  gallery: string[];
  departure_dates?: string;
  availability_notes?: string;
  status: "draft" | "published" | "archived";
  content_verified: boolean;
  seo_title?: string;
  seo_description?: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  region: "Kerala" | "South India" | "North India" | "Pan India";
  short_description: string;
  description: string;
  cover_image: string;
  status: "draft" | "published" | "archived";
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = "new" | "contacted" | "confirmed" | "closed";

export interface Enquiry {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  package_id?: string | null;
  package_title?: string | null;
  preferred_destination?: string | null;
  travel_date?: string | null;
  traveller_count: number;
  additional_requirements?: string | null;
  status: EnquiryStatus;
  privacy_notice_version: string;
  marketing_consent: boolean;
  marketing_consent_timestamp?: string | null;
  source_page?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnquiryNote {
  id: string;
  enquiry_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  package_id?: string | null;
  package_title?: string | null;
  discount_type: "percentage" | "fixed_amount" | "special_perk";
  discount_value?: number | null;
  promotional_price?: number | null;
  valid_from: string; // YYYY-MM-DD
  valid_until: string; // YYYY-MM-DD
  status: "draft" | "active" | "inactive" | "expired";
  content_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  customer_display_name: string;
  review_text: string;
  rating: number;
  package_id?: string | null;
  source_or_verification_note?: string | null;
  status: "draft" | "approved" | "hidden";
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  business_name: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  whatsapp_number: string;
  instagram_handle: string;
  business_hours: string;
  ga_measurement_id?: string;
  search_console_id?: string;
  google_reviews_url?: string;
  google_review_count?: number;
  google_rating?: number;
  google_reviews_last_synced?: string;
  google_reviews_auto_sync?: boolean;
  updated_at: string;
}

export interface SiteContent {
  id?: string;
  // Brand & Global
  brand_name: string;
  logo_url: string;
  // Hero Section
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string;
  hero_primary_cta_text: string;
  hero_primary_cta_link: string;
  hero_secondary_cta_text: string;
  hero_secondary_cta_link: string;
  hero_floating_badge: string;
  // Kerala Tours Section
  kerala_badge: string;
  kerala_title: string;
  kerala_subtitle: string;
  kerala_image: string;
  kerala_feature_1_title: string;
  kerala_feature_1_desc: string;
  kerala_feature_2_title: string;
  kerala_feature_2_desc: string;
  kerala_feature_3_title: string;
  kerala_feature_3_desc: string;
  kerala_tour1_title?: string;
  kerala_tour1_desc?: string;
  kerala_tour1_price?: string;
  kerala_tour1_image?: string;
  kerala_tour2_title?: string;
  kerala_tour2_desc?: string;
  kerala_tour2_price?: string;
  kerala_tour2_image?: string;
  kerala_tour3_title?: string;
  kerala_tour3_desc?: string;
  kerala_tour3_price?: string;
  kerala_tour3_image?: string;
  // Why Choose Us Section
  why_badge: string;
  why_title: string;
  why_subtitle: string;
  why_image: string;
  why_card_1_title: string;
  why_card_1_desc: string;
  why_card_2_title: string;
  why_card_2_desc: string;
  why_card_3_title: string;
  why_card_3_desc: string;
  why_card_4_title: string;
  why_card_4_desc: string;
  // About Page
  about_badge: string;
  about_title: string;
  about_subtitle: string;
  about_image: string;
  about_story_title?: string;
  about_story_p1: string;
  about_story_p2: string;
  about_mission_title: string;
  about_mission_desc: string;
  // Contact & Footer
  contact_phone: string;
  contact_email: string;
  whatsapp_number: string;
  contact_address: string;
  business_hours: string;
  contact_hours?: string;
  footer_description: string;
  footer_copyright: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
// Bug Reporting System
// -----------------------------------------------------------------------------
export type BugSeverity = "low" | "medium" | "high" | "critical";
export type BugStatus = "open" | "investigating" | "resolved" | "closed";
export type BugCategory =
  | "booking_issue"
  | "visual_glitch"
  | "broken_link"
  | "performance"
  | "content_error"
  | "mobile_issue"
  | "other";

export interface BugReport {
  id: string;
  title: string;
  description: string;
  steps_to_reproduce?: string;
  category: BugCategory;
  severity: BugSeverity;
  status: BugStatus;
  page_url?: string;
  reporter_name?: string;
  reporter_email?: string;
  screenshot_url?: string;
  device_info?: {
    browser?: string;
    os?: string;
    screen_resolution?: string;
    user_agent?: string;
  };
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
}
