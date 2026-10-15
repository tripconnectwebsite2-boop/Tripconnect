import fs from "fs";
import path from "path";
import {
  TravelPackage,
  Destination,
  Enquiry,
  EnquiryNote,
  SpecialOffer,
  Review,
  SiteSettings,
  SiteContent,
  EnquiryStatus,
} from "../types";
import {
  initialDestinations,
  initialPackages,
  initialReviews,
  initialOffers,
  initialSettings,
  initialSiteContent,
} from "./seed-data";
import { createAdminClient } from "../supabase/admin";

interface DatabaseStore {
  packages: TravelPackage[];
  destinations: Destination[];
  enquiries: Enquiry[];
  enquiry_notes: EnquiryNote[];
  offers: SpecialOffer[];
  reviews: Review[];
  settings: SiteSettings;
  content: SiteContent;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureStore(): DatabaseStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseStore = {
      packages: initialPackages,
      destinations: initialDestinations,
      enquiries: [
        {
          id: "enq-sample-1",
          customer_name: "Anita Menon",
          phone: "+91 98470 12345",
          email: "anita.menon@example.com",
          package_id: "pkg-classic-kerala",
          package_title: "Classic Kerala Grand Tour",
          preferred_destination: "Munnar & Alleppey",
          travel_date: "2026-11-20",
          traveller_count: 2,
          additional_requirements: "Honeymoon setup on houseboat requested, vegetarian meals.",
          status: "new",
          privacy_notice_version: "1.0",
          marketing_consent: true,
          marketing_consent_timestamp: new Date().toISOString(),
          source_page: "/packages/classic-kerala-grand-tour",
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: "enq-sample-2",
          customer_name: "Rahul Sharma",
          phone: "+91 98200 54321",
          email: "rahul.sharma@example.com",
          package_id: "pkg-munnar-tea-trails",
          package_title: "Munnar Cloud Mist & Tea Trails",
          preferred_destination: "Munnar",
          travel_date: "2026-12-15",
          traveller_count: 4,
          additional_requirements: "Family trip with senior parents, prefer ground floor rooms.",
          status: "contacted",
          privacy_notice_version: "1.0",
          marketing_consent: false,
          source_page: "/contact",
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 20).toISOString(),
        },
      ],
      enquiry_notes: [
        {
          id: "note-1",
          enquiry_id: "enq-sample-2",
          note: "Spoke with Rahul on WhatsApp. Sent custom itinerary with senior-friendly cottage options.",
          created_by: "tripconnectwebsite2@gmail.com",
          created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
        },
      ],
      offers: initialOffers,
      reviews: initialReviews,
      settings: initialSettings,
      content: initialSiteContent,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.content) {
      parsed.content = initialSiteContent;
      saveStore(parsed);
    }
    return parsed;
  } catch {
    return {
      packages: initialPackages,
      destinations: initialDestinations,
      enquiries: [],
      enquiry_notes: [],
      offers: initialOffers,
      reviews: initialReviews,
      settings: initialSettings,
      content: initialSiteContent,
    };
  }
}

function saveStore(store: DatabaseStore) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf-8");
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

// -----------------------------------------------------------------------------
// Packages
// -----------------------------------------------------------------------------
export async function getPackages(filters?: {
  category?: string;
  destination?: string;
  maxPrice?: number;
  status?: string;
  search?: string;
  includeUnverified?: boolean;
}): Promise<TravelPackage[]> {
  const store = ensureStore();
  let result = store.packages;

  if (filters?.status) {
    result = result.filter((p) => p.status === filters.status);
    if (!filters.includeUnverified) {
      result = result.filter((p) => p.content_verified);
    }
  } else {
    // Default public behavior: only published and verified
    result = result.filter((p) => p.status === "published" && p.content_verified);
  }

  if (filters?.category && filters.category !== "All") {
    result = result.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters?.destination && filters.destination !== "All") {
    const destSlug = filters.destination.toLowerCase();
    result = result.filter(
      (p) =>
        p.destination_id?.toLowerCase().includes(destSlug) ||
        p.destination_name?.toLowerCase().includes(destSlug) ||
        p.title.toLowerCase().includes(destSlug)
    );
  }

  if (filters?.maxPrice && filters.maxPrice > 0) {
    result = result.filter((p) => p.starting_price <= filters.maxPrice!);
  }

  if (filters?.search && filters.search.trim().length > 0) {
    const query = filters.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.short_description.toLowerCase().includes(query) ||
        p.highlights.some((h) => h.toLowerCase().includes(query)) ||
        (p.destination_name && p.destination_name.toLowerCase().includes(query))
    );
  }

  return result;
}

export async function getPackageBySlug(
  slug: string,
  includeDrafts = false
): Promise<TravelPackage | null> {
  const store = ensureStore();
  const pkg = store.packages.find((p) => p.slug === slug);
  if (!pkg) return null;
  if (!includeDrafts && (pkg.status !== "published" || !pkg.content_verified)) {
    return null;
  }
  return pkg;
}

export async function getPackageById(id: string): Promise<TravelPackage | null> {
  const store = ensureStore();
  return store.packages.find((p) => p.id === id) || null;
}

export async function createPackage(data: Partial<TravelPackage>): Promise<TravelPackage> {
  const store = ensureStore();
  const now = new Date().toISOString();
  const newPackage: TravelPackage = {
    id: `pkg-${Date.now()}`,
    title: data.title || "Untitled Package",
    slug:
      data.slug ||
      (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `package-${Date.now()}`),
    destination_id: data.destination_id || null,
    destination_name: data.destination_name || "",
    category: data.category || "Kerala Tours",
    short_description: data.short_description || "",
    description: data.description || "",
    starting_price: Number(data.starting_price) || 0,
    currency: "INR",
    duration_days: Number(data.duration_days) || 1,
    duration_nights: Number(data.duration_nights) || 0,
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
    inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
    exclusions: Array.isArray(data.exclusions) ? data.exclusions : [],
    accommodation_details: data.accommodation_details || "",
    gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsEueUPJrI0O1sHnvIQdp-xgXpkaYKfOkgLG6MC7pdryUyfy__v92icO0eIqpBYlE15-9goslKClobZY9z8oaCniCTHIB5G5ssC8EhDlcIrNcgMgjqyfniZ5typYoNow0w1ZzunISf4YBooojKwq3dxn1-LaKsVNNA4fxmrTJ0YAEgLoQIlWtwVBhWM2MfH9ffWIfAfJ89oaPVDmMPsvCUj4WWokPYvJ0KhoTul8CRrbBTqKSw15J8jw"
    ],
    departure_dates: data.departure_dates || "Daily flexible departures upon enquiry.",
    availability_notes: data.availability_notes || "Subject to seasonal availability.",
    status: data.status || "draft", // Defaults to DRAFT
    content_verified: Boolean(data.content_verified),
    seo_title: data.seo_title || data.title,
    seo_description: data.seo_description || data.short_description,
    published_at: data.status === "published" ? now : null,
    created_at: now,
    updated_at: now,
  };

  store.packages.unshift(newPackage);
  saveStore(store);
  return newPackage;
}

export async function updatePackage(
  id: string,
  data: Partial<TravelPackage>
): Promise<TravelPackage | null> {
  const store = ensureStore();
  const index = store.packages.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updated: TravelPackage = {
    ...store.packages[index],
    ...data,
    published_at:
      data.status === "published" && !store.packages[index].published_at
        ? now
        : store.packages[index].published_at,
    updated_at: now,
  };

  store.packages[index] = updated;
  saveStore(store);
  return updated;
}

export async function deletePackage(id: string): Promise<boolean> {
  const store = ensureStore();
  const initialLength = store.packages.length;
  store.packages = store.packages.filter((p) => p.id !== id);
  saveStore(store);
  return store.packages.length < initialLength;
}

// -----------------------------------------------------------------------------
// Destinations
// -----------------------------------------------------------------------------
export async function getDestinations(onlyPublished = true): Promise<Destination[]> {
  const store = ensureStore();
  if (onlyPublished) {
    return store.destinations.filter((d) => d.status === "published");
  }
  return store.destinations;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const store = ensureStore();
  return store.destinations.find((d) => d.slug === slug) || null;
}

export async function createDestination(data: Partial<Destination>): Promise<Destination> {
  const store = ensureStore();
  const now = new Date().toISOString();
  const newDest: Destination = {
    id: `dest-${Date.now()}`,
    name: data.name || "New Destination",
    slug:
      data.slug ||
      (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `destination-${Date.now()}`),
    region: data.region || "Kerala",
    short_description: data.short_description || "",
    description: data.description || "",
    cover_image:
      data.cover_image ||
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCzwJauBQYcLbtjGtABpJpcaUOhNXWkeONV1e_6XO5-ecYvYrgSypw1qr2W0oslFPX81kUzt-ZHQ9CZsyx-Pp03zo0bUkargRdMM7g5Um5MInTOH01gD8CTKxyZMyMwXmdmw9Eo3tBaOBQde3kPrMl-P7qcC359ZFyTMtMvMlmduh2YTAjNbTzORzljYpB21iRDw0CrblpxqWsvWuDbrA7pMo26-MRd3xAIM2GAcn7NH5p8gYx4gWPDw",
    status: data.status || "published",
    seo_title: data.seo_title || data.name,
    seo_description: data.seo_description || data.short_description,
    created_at: now,
    updated_at: now,
  };
  store.destinations.push(newDest);
  saveStore(store);
  return newDest;
}

export async function updateDestination(
  id: string,
  data: Partial<Destination>
): Promise<Destination | null> {
  const store = ensureStore();
  const idx = store.destinations.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  store.destinations[idx] = {
    ...store.destinations[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  saveStore(store);
  return store.destinations[idx];
}

export async function deleteDestination(id: string): Promise<boolean> {
  const store = ensureStore();
  const initial = store.destinations.length;
  store.destinations = store.destinations.filter((d) => d.id !== id);
  saveStore(store);
  return store.destinations.length < initial;
}

// -----------------------------------------------------------------------------
// Enquiries CRM
// -----------------------------------------------------------------------------
export async function getEnquiries(filters?: {
  status?: string;
  search?: string;
}): Promise<Enquiry[]> {
  const store = ensureStore();
  let result = [...store.enquiries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (filters?.status && filters.status !== "all") {
    result = result.filter((e) => e.status === filters.status);
  }

  if (filters?.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (e) =>
        e.customer_name.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.preferred_destination && e.preferred_destination.toLowerCase().includes(q)) ||
        (e.package_title && e.package_title.toLowerCase().includes(q))
    );
  }

  return result;
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  const store = ensureStore();
  return store.enquiries.find((e) => e.id === id) || null;
}

export async function createEnquiry(
  data: Omit<Enquiry, "id" | "created_at" | "updated_at">
): Promise<Enquiry> {
  const store = ensureStore();
  const now = new Date().toISOString();
  const newEnquiry: Enquiry = {
    ...data,
    id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: data.status || "new",
    created_at: now,
    updated_at: now,
  };

  store.enquiries.unshift(newEnquiry);
  saveStore(store);
  return newEnquiry;
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<Enquiry | null> {
  const store = ensureStore();
  const idx = store.enquiries.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  store.enquiries[idx].status = status;
  store.enquiries[idx].updated_at = new Date().toISOString();
  saveStore(store);
  return store.enquiries[idx];
}

export async function getEnquiryNotes(enquiryId: string): Promise<EnquiryNote[]> {
  const store = ensureStore();
  return store.enquiry_notes.filter((n) => n.enquiry_id === enquiryId);
}

export async function addEnquiryNote(
  enquiryId: string,
  note: string,
  createdBy = "tripconnectwebsite2@gmail.com"
): Promise<EnquiryNote> {
  const store = ensureStore();
  const newNote: EnquiryNote = {
    id: `note-${Date.now()}`,
    enquiry_id: enquiryId,
    note,
    created_by: createdBy,
    created_at: new Date().toISOString(),
  };
  store.enquiry_notes.push(newNote);
  saveStore(store);
  return newNote;
}

// -----------------------------------------------------------------------------
// Offers
// -----------------------------------------------------------------------------
export async function getOffers(onlyActiveAndCurrent = true): Promise<SpecialOffer[]> {
  const store = ensureStore();
  const today = new Date().toISOString().split("T")[0];

  if (onlyActiveAndCurrent) {
    return store.offers.filter(
      (o) =>
        o.status === "active" &&
        o.content_verified &&
        o.valid_from <= today &&
        o.valid_until >= today
    );
  }
  return store.offers;
}

export async function createOffer(data: Partial<SpecialOffer>): Promise<SpecialOffer> {
  const store = ensureStore();
  const now = new Date().toISOString();
  const newOffer: SpecialOffer = {
    id: `offer-${Date.now()}`,
    title: data.title || "Limited Special Offer",
    description: data.description || "",
    package_id: data.package_id || null,
    package_title: data.package_title || "",
    discount_type: data.discount_type || "percentage",
    discount_value: data.discount_value || 10,
    promotional_price: data.promotional_price || null,
    valid_from: data.valid_from || new Date().toISOString().split("T")[0],
    valid_until: data.valid_until || "2026-12-31",
    status: data.status || "active",
    content_verified: Boolean(data.content_verified),
    created_at: now,
    updated_at: now,
  };
  store.offers.unshift(newOffer);
  saveStore(store);
  return newOffer;
}

export async function updateOffer(
  id: string,
  data: Partial<SpecialOffer>
): Promise<SpecialOffer | null> {
  const store = ensureStore();
  const idx = store.offers.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  store.offers[idx] = {
    ...store.offers[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  saveStore(store);
  return store.offers[idx];
}

export async function deleteOffer(id: string): Promise<boolean> {
  const store = ensureStore();
  const initial = store.offers.length;
  store.offers = store.offers.filter((o) => o.id !== id);
  saveStore(store);
  return store.offers.length < initial;
}

// -----------------------------------------------------------------------------
// Reviews
// -----------------------------------------------------------------------------
export async function getReviews(onlyApproved = true): Promise<Review[]> {
  const store = ensureStore();
  if (onlyApproved) {
    return store.reviews.filter((r) => r.status === "approved");
  }
  return store.reviews;
}

export async function createReview(data: Partial<Review>): Promise<Review> {
  const store = ensureStore();
  const now = new Date().toISOString();
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    customer_display_name: data.customer_display_name || "Verified Traveler",
    review_text: data.review_text || "",
    rating: Number(data.rating) || 5,
    package_id: data.package_id || null,
    source_or_verification_note:
      data.source_or_verification_note || "Verified Guest Feedback",
    status: data.status || "draft",
    created_at: now,
    updated_at: now,
  };
  store.reviews.unshift(newReview);
  saveStore(store);
  return newReview;
}

export async function updateReview(id: string, data: Partial<Review>): Promise<Review | null> {
  const store = ensureStore();
  const idx = store.reviews.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  store.reviews[idx] = {
    ...store.reviews[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  saveStore(store);
  return store.reviews[idx];
}

export async function deleteReview(id: string): Promise<boolean> {
  const store = ensureStore();
  const initial = store.reviews.length;
  store.reviews = store.reviews.filter((r) => r.id !== id);
  saveStore(store);
  return store.reviews.length < initial;
}

// -----------------------------------------------------------------------------
// Site Settings
// -----------------------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const store = ensureStore();
  return store.settings;
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<SiteSettings> {
  const store = ensureStore();
  store.settings = {
    ...store.settings,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  saveStore(store);
  return store.settings;
}

// -----------------------------------------------------------------------------
// Site Content & Media CMS (All Text & Images)
// -----------------------------------------------------------------------------
export async function getSiteContent(): Promise<SiteContent> {
  const store = ensureStore();
  return store.content || initialSiteContent;
}

export async function updateSiteContent(
  content: Partial<SiteContent>
): Promise<SiteContent> {
  const store = ensureStore();
  store.content = {
    ...(store.content || initialSiteContent),
    ...content,
    updated_at: new Date().toISOString(),
  };
  saveStore(store);
  return store.content;
}
