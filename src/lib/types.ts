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
  updated_at: string;
}
