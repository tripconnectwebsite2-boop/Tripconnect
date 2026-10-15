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
  BugReport,
  BugStatus,
  BugSeverity,
  BugCategory,
  CustomPage,
} from "../types";
import {
  initialDestinations,
  initialPackages,
  initialReviews,
  initialOffers,
  initialSettings,
  initialSiteContent,
  initialPages,
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
  bugs?: BugReport[];
  pages?: CustomPage[];
}

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", ".data")
  : path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const initialBugs: BugReport[] = [
  {
    id: "bug-sample-1",
    title: "Mobile menu drawer overlaps header on viewport < 380px",
    description: "When viewing on smaller mobile devices like iPhone SE, the top navigation toggle drawer has a slight z-index conflict with the sticky header.",
    steps_to_reproduce: "1. Open site on screen width 375px\n2. Tap burger icon\n3. Notice top 10px overlaps status bar.",
    category: "mobile_issue",
    severity: "medium",
    status: "investigating",
    page_url: "http://localhost:3000/",
    reporter_name: "Rahul Verma",
    reporter_email: "rahul.v@test.com",
    device_info: {
      browser: "Mobile Safari 17.4",
      os: "iOS 17.4",
      screen_resolution: "375x667",
      user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)...",
    },
    admin_notes: "Checked CSS z-index stack. Planning fix for next styling patch.",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "bug-sample-2",
    title: "Enquiry form submit button double-click triggers duplicate request",
    description: "Rapidly clicking the 'Send Concierge Enquiry' button can send two submissions within milliseconds before button disable takes effect.",
    steps_to_reproduce: "1. Fill in enquiry fields\n2. Rapidly double-click submit button\n3. Check console network tab.",
    category: "booking_issue",
    severity: "high",
    status: "resolved",
    page_url: "http://localhost:3000/contact",
    reporter_name: "Priya Nair",
    reporter_email: "priya.nair@example.com",
    device_info: {
      browser: "Chrome 123.0",
      os: "Windows 11",
      screen_resolution: "1920x1080",
    },
    admin_notes: "Fixed by adding submitting state lock and debounce check.",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    resolved_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

function ensureStore(): DatabaseStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    // If running in /tmp on Vercel, attempt to clone from bundled repo .data/db.json
    const bundledDb = path.join(process.cwd(), ".data", "db.json");
    if (fs.existsSync(bundledDb) && DB_FILE !== bundledDb) {
      try {
        const raw = fs.readFileSync(bundledDb, "utf-8");
        fs.writeFileSync(DB_FILE, raw, "utf-8");
        return JSON.parse(raw);
      } catch {
        // Fall back to code initial seed below
      }
    }

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
      bugs: initialBugs,
      pages: initialPages,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    let mutated = false;
    if (!parsed.content) {
      parsed.content = initialSiteContent;
      mutated = true;
    }
    if (!parsed.bugs) {
      parsed.bugs = initialBugs;
      mutated = true;
    }
    if (!parsed.pages) {
      parsed.pages = initialPages;
      mutated = true;
    }
    if (!parsed.settings?.google_reviews_url) {
      parsed.settings = {
        ...(parsed.settings || initialSettings),
        google_reviews_url: initialSettings.google_reviews_url,
        google_review_count: parsed.settings?.google_review_count ?? initialSettings.google_review_count,
        google_rating: parsed.settings?.google_rating ?? initialSettings.google_rating,
        google_reviews_last_synced: parsed.settings?.google_reviews_last_synced ?? initialSettings.google_reviews_last_synced,
        google_reviews_auto_sync: parsed.settings?.google_reviews_auto_sync ?? true,
      };
      mutated = true;
    }
    if (mutated) {
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
      bugs: initialBugs,
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

export async function deleteEnquiry(id: string): Promise<boolean> {
  const store = ensureStore();
  const initialLength = store.enquiries.length;
  store.enquiries = store.enquiries.filter((e) => e.id !== id);
  if (store.enquiries.length === initialLength) return false;
  // Also remove associated notes
  store.enquiry_notes = store.enquiry_notes.filter((n) => n.enquiry_id !== id);
  saveStore(store);
  return true;
}

export async function deleteEnquiriesBulk(ids: string[]): Promise<{ count: number }> {
  const store = ensureStore();
  const idSet = new Set(ids);
  const initialLength = store.enquiries.length;
  store.enquiries = store.enquiries.filter((e) => !idSet.has(e.id));
  const count = initialLength - store.enquiries.length;
  store.enquiry_notes = store.enquiry_notes.filter((n) => !idSet.has(n.enquiry_id));
  saveStore(store);
  return { count };
}

export async function clearAllEnquiries(): Promise<{ count: number }> {
  const store = ensureStore();
  const count = store.enquiries.length;
  store.enquiries = [];
  store.enquiry_notes = [];
  saveStore(store);
  return { count };
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

// -----------------------------------------------------------------------------
// Bug Reporting System
// -----------------------------------------------------------------------------
export async function getBugs(filters?: {
  status?: string;
  severity?: string;
  category?: string;
}): Promise<BugReport[]> {
  const store = ensureStore();
  let list = store.bugs || [];

  if (filters?.status && filters.status !== "all") {
    list = list.filter((b) => b.status === filters.status);
  }
  if (filters?.severity && filters.severity !== "all") {
    list = list.filter((b) => b.severity === filters.severity);
  }
  if (filters?.category && filters.category !== "all") {
    list = list.filter((b) => b.category === filters.category);
  }

  return [...list].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getBugById(id: string): Promise<BugReport | null> {
  const store = ensureStore();
  const found = (store.bugs || []).find((b) => b.id === id);
  return found || null;
}

export async function createBug(
  data: Omit<BugReport, "id" | "status" | "created_at" | "updated_at">
): Promise<BugReport> {
  const store = ensureStore();
  const newBug: BugReport = {
    ...data,
    id: `bug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!store.bugs) store.bugs = [];
  store.bugs.unshift(newBug);
  saveStore(store);
  return newBug;
}

export async function updateBug(
  id: string,
  updates: Partial<BugReport>
): Promise<BugReport | null> {
  const store = ensureStore();
  if (!store.bugs) store.bugs = [];
  const idx = store.bugs.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const existing = store.bugs[idx];
  const updatedStatus = updates.status || existing.status;
  const resolvedAt =
    updatedStatus === "resolved" || updatedStatus === "closed"
      ? existing.resolved_at || now
      : null;

  store.bugs[idx] = {
    ...existing,
    ...updates,
    status: updatedStatus,
    resolved_at: resolvedAt,
    updated_at: now,
  };
  saveStore(store);
  return store.bugs[idx];
}

export async function deleteBug(id: string): Promise<boolean> {
  const store = ensureStore();
  if (!store.bugs) return false;
  const initial = store.bugs.length;
  store.bugs = store.bugs.filter((b) => b.id !== id);
  saveStore(store);
  return store.bugs.length < initial;
}

// -----------------------------------------------------------------------------
// Custom Dynamic Pages (CMS)
// -----------------------------------------------------------------------------
export async function getCustomPages(filters?: {
  status?: "draft" | "published";
  show_in_header?: boolean;
  show_in_footer?: boolean;
}): Promise<CustomPage[]> {
  const store = ensureStore();
  let pages = store.pages || [];
  if (filters?.status) {
    pages = pages.filter((p) => p.status === filters.status);
  }
  if (filters?.show_in_header !== undefined) {
    pages = pages.filter((p) => p.show_in_header === filters.show_in_header);
  }
  if (filters?.show_in_footer !== undefined) {
    pages = pages.filter((p) => p.show_in_footer === filters.show_in_footer);
  }
  return [...pages].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getCustomPageBySlug(slug: string): Promise<CustomPage | null> {
  const store = ensureStore();
  const page = (store.pages || []).find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  );
  return page || null;
}

export async function getCustomPageById(id: string): Promise<CustomPage | null> {
  const store = ensureStore();
  const page = (store.pages || []).find((p) => p.id === id);
  return page || null;
}

export async function createCustomPage(
  data: Omit<CustomPage, "id" | "created_at" | "updated_at">
): Promise<CustomPage> {
  const store = ensureStore();
  if (!store.pages) store.pages = [];

  // Generate clean slug
  let baseSlug = (data.slug || data.title)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!baseSlug) baseSlug = `page-${Date.now()}`;

  let finalSlug = baseSlug;
  let counter = 1;
  while (store.pages.some((p) => p.slug === finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const newPage: CustomPage = {
    ...data,
    id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    slug: finalSlug,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store.pages.unshift(newPage);
  saveStore(store);
  return newPage;
}

export async function updateCustomPage(
  id: string,
  data: Partial<CustomPage>
): Promise<CustomPage | null> {
  const store = ensureStore();
  if (!store.pages) store.pages = [];
  const idx = store.pages.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const existing = store.pages[idx];
  let finalSlug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    let slugCandidate = data.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slugCandidate) slugCandidate = existing.slug;

    const conflict = store.pages.some(
      (p) => p.id !== id && p.slug === slugCandidate
    );
    if (!conflict) {
      finalSlug = slugCandidate;
    }
  }

  store.pages[idx] = {
    ...existing,
    ...data,
    slug: finalSlug,
    updated_at: new Date().toISOString(),
  };

  saveStore(store);
  return store.pages[idx];
}

export async function deleteCustomPage(id: string): Promise<boolean> {
  const store = ensureStore();
  if (!store.pages) return false;
  const initial = store.pages.length;
  store.pages = store.pages.filter((p) => p.id !== id);
  saveStore(store);
  return store.pages.length < initial;
}
