import fs from "fs";
import path from "path";
import os from "os";
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
  TransportationVehicle,
  VehicleCategory,
} from "../types";
import {
  initialDestinations,
  initialPackages,
  initialReviews,
  initialOffers,
  initialSettings,
  initialSiteContent,
  initialPages,
  initialTransportationVehicles,
} from "./seed-data";
import { createAdminClient } from "../supabase/admin";
import { fetchStoreFromFirestore, saveStoreToFirestore } from "../firebase/db";

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
  vehicles?: TransportationVehicle[];
}

function getDataDir(): string {
  // Always use OS temp directory when running in Vercel or any cloud serverless environment
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.NODE_ENV === "production"
  );

  if (isServerless) {
    try {
      return path.join(os.tmpdir(), "tripconnect-data");
    } catch {
      return "/tmp/tripconnect-data";
    }
  }

  return path.join(process.cwd(), ".data");
}

const DATA_DIR = getDataDir();
const DB_FILE = path.join(DATA_DIR, "db.json");

// In-memory cache ensures zero crashes if filesystem is strictly read-only
let inMemoryStore: DatabaseStore | null = null;

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
  // 1. If we already have inMemoryStore cached, return it immediately
  if (inMemoryStore) {
    return inMemoryStore;
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
    vehicles: initialTransportationVehicles,
  };

  try {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch {
      // Ignored if directory creation fails on read-only environments
    }

    if (!fs.existsSync(DB_FILE)) {
      // If running in /tmp on Vercel, attempt to clone from bundled repo .data/db.json
      const bundledDb = path.join(process.cwd(), ".data", "db.json");
      if (fs.existsSync(bundledDb) && DB_FILE !== bundledDb) {
        try {
          const raw = fs.readFileSync(bundledDb, "utf-8");
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed.vehicles) || parsed.vehicles.length === 0) {
            parsed.vehicles = initialTransportationVehicles;
          }
          inMemoryStore = parsed;
          try {
            fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
          } catch {}
          return parsed;
        } catch {
          // Fall back to code initial seed below
        }
      }

      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      } catch {}
      inMemoryStore = initial;
      return initial;
    }

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
    if (!Array.isArray(parsed.vehicles) || parsed.vehicles.length === 0) {
      parsed.vehicles = initialTransportationVehicles;
      mutated = true;
    }
    if (Array.isArray(parsed.pages)) {
      const filtered = parsed.pages.filter(
        (p: any) =>
          p.slug !== "luxury-houseboat-experience" &&
          p.slug !== "private-taxi-chauffeur"
      );
      if (filtered.length !== parsed.pages.length) {
        parsed.pages = filtered;
        mutated = true;
      }
    } else {
      parsed.pages = [];
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
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
      } catch {}
    }
    inMemoryStore = parsed;
    return parsed;
  } catch (err) {
    console.warn("[DatabaseStore] Disk access skipped, using in-memory store:", err);
    inMemoryStore = initial;
    return initial;
  }
}

async function getStoreAsync(): Promise<DatabaseStore> {
  const local = ensureStore();
  try {
    const cloud = await fetchStoreFromFirestore();
    if (cloud && typeof cloud === "object") {
      inMemoryStore = {
        ...local,
        ...cloud,
        packages: Array.isArray(cloud.packages) ? cloud.packages : local.packages,
        destinations: Array.isArray(cloud.destinations) ? cloud.destinations : local.destinations,
        content: cloud.content && typeof cloud.content === "object" ? cloud.content : local.content,
        settings: cloud.settings && typeof cloud.settings === "object" ? cloud.settings : local.settings,
        offers: Array.isArray(cloud.offers) ? cloud.offers : local.offers,
        reviews: Array.isArray(cloud.reviews) ? cloud.reviews : local.reviews,
        enquiries: Array.isArray(cloud.enquiries) ? cloud.enquiries : local.enquiries,
        pages: Array.isArray(cloud.pages) ? cloud.pages : local.pages,
        bugs: Array.isArray(cloud.bugs) ? cloud.bugs : (local.bugs || []),
        vehicles: Array.isArray(cloud.vehicles) && cloud.vehicles.length > 0 
          ? cloud.vehicles 
          : (Array.isArray(local.vehicles) && local.vehicles.length > 0 ? local.vehicles : initialTransportationVehicles),
      };
      return inMemoryStore!;
    }
  } catch {
    // Cloud fetch silent fallback
  }
  return local;
}

async function saveStore(store: DatabaseStore): Promise<void> {
  inMemoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("[DatabaseStore] Disk write skipped in serverless environment:", err);
  }
  // Persist to Cloud Firestore across all Vercel serverless containers
  await saveStoreToFirestore(store);
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
  const store = await getStoreAsync();
  let result = store.packages;

  if (filters?.status) {
    result = result.filter((p) => p.status === filters.status);
    if (!filters.includeUnverified) {
      result = result.filter((p) => p.content_verified && !p.slug.endsWith("-draft"));
    }
  } else {
    // Default public behavior: only published, verified and non-draft
    result = result.filter((p) => p.status === "published" && p.content_verified && !p.slug.endsWith("-draft"));
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
  const store = await getStoreAsync();
  const pkg = store.packages.find((p) => p.slug === slug);
  if (!pkg) return null;
  if (!includeDrafts && (pkg.status !== "published" || !pkg.content_verified || pkg.slug.endsWith("-draft"))) {
    return null;
  }
  return pkg;
}

export async function getPackageById(id: string): Promise<TravelPackage | null> {
  const store = await getStoreAsync();
  return store.packages.find((p) => p.id === id) || null;
}

export async function createPackage(data: Partial<TravelPackage>): Promise<TravelPackage> {
  const store = await getStoreAsync();
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
  await saveStore(store);
  return newPackage;
}

export async function updatePackage(
  id: string,
  data: Partial<TravelPackage>
): Promise<TravelPackage | null> {
  const store = await getStoreAsync();
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
  await saveStore(store);
  return updated;
}

export async function deletePackage(id: string): Promise<boolean> {
  const store = await getStoreAsync();
  const initialLength = store.packages.length;
  store.packages = store.packages.filter((p) => p.id !== id);
  await saveStore(store);
  return store.packages.length < initialLength;
}

// -----------------------------------------------------------------------------
// Destinations
// -----------------------------------------------------------------------------
export async function getDestinations(onlyPublished = true): Promise<Destination[]> {
  const store = await getStoreAsync();
  if (onlyPublished) {
    return store.destinations.filter((d) => d.status === "published");
  }
  return store.destinations;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const store = await getStoreAsync();
  return store.destinations.find((d) => d.slug === slug) || null;
}

export async function createDestination(data: Partial<Destination>): Promise<Destination> {
  const store = await getStoreAsync();
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
  await saveStore(store);
  return newDest;
}

export async function updateDestination(
  id: string,
  data: Partial<Destination>
): Promise<Destination | null> {
  const store = await getStoreAsync();
  const idx = store.destinations.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  store.destinations[idx] = {
    ...store.destinations[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  await saveStore(store);
  return store.destinations[idx];
}

export async function deleteDestination(id: string): Promise<boolean> {
  const store = await getStoreAsync();
  const initial = store.destinations.length;
  store.destinations = store.destinations.filter((d) => d.id !== id);
  await saveStore(store);
  return store.destinations.length < initial;
}

// -----------------------------------------------------------------------------
// Enquiries CRM
// -----------------------------------------------------------------------------
export async function getEnquiries(filters?: {
  status?: string;
  search?: string;
}): Promise<Enquiry[]> {
  const store = await getStoreAsync();
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
  const store = await getStoreAsync();
  return store.enquiries.find((e) => e.id === id) || null;
}

export async function createEnquiry(
  data: Omit<Enquiry, "id" | "created_at" | "updated_at">
): Promise<Enquiry> {
  const store = await getStoreAsync();
  const now = new Date().toISOString();
  const newEnquiry: Enquiry = {
    ...data,
    id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: data.status || "new",
    created_at: now,
    updated_at: now,
  };

  store.enquiries.unshift(newEnquiry);
  await saveStore(store);
  return newEnquiry;
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<Enquiry | null> {
  const store = await getStoreAsync();
  const idx = store.enquiries.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  store.enquiries[idx].status = status;
  store.enquiries[idx].updated_at = new Date().toISOString();
  await saveStore(store);
  return store.enquiries[idx];
}

export async function getEnquiryNotes(enquiryId: string): Promise<EnquiryNote[]> {
  const store = await getStoreAsync();
  return store.enquiry_notes.filter((n) => n.enquiry_id === enquiryId);
}

export async function addEnquiryNote(
  enquiryId: string,
  note: string,
  createdBy = "tripconnectwebsite2@gmail.com"
): Promise<EnquiryNote> {
  const store = await getStoreAsync();
  const newNote: EnquiryNote = {
    id: `note-${Date.now()}`,
    enquiry_id: enquiryId,
    note,
    created_by: createdBy,
    created_at: new Date().toISOString(),
  };
  store.enquiry_notes.push(newNote);
  await saveStore(store);
  return newNote;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const store = await getStoreAsync();
  const initialLength = store.enquiries.length;
  store.enquiries = store.enquiries.filter((e) => e.id !== id);
  if (store.enquiries.length === initialLength) return false;
  // Also remove associated notes
  store.enquiry_notes = store.enquiry_notes.filter((n) => n.enquiry_id !== id);
  await saveStore(store);
  return true;
}

export async function deleteEnquiriesBulk(ids: string[]): Promise<{ count: number }> {
  const store = await getStoreAsync();
  const idSet = new Set(ids);
  const initialLength = store.enquiries.length;
  store.enquiries = store.enquiries.filter((e) => !idSet.has(e.id));
  const count = initialLength - store.enquiries.length;
  store.enquiry_notes = store.enquiry_notes.filter((n) => !idSet.has(n.enquiry_id));
  await saveStore(store);
  return { count };
}

export async function clearAllEnquiries(): Promise<{ count: number }> {
  const store = await getStoreAsync();
  const count = store.enquiries.length;
  store.enquiries = [];
  store.enquiry_notes = [];
  await saveStore(store);
  return { count };
}

// -----------------------------------------------------------------------------
// Offers
// -----------------------------------------------------------------------------
export async function getOffers(onlyActiveAndCurrent = true): Promise<SpecialOffer[]> {
  const store = await getStoreAsync();
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
  const store = await getStoreAsync();
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
  await saveStore(store);
  return newOffer;
}

export async function updateOffer(
  id: string,
  data: Partial<SpecialOffer>
): Promise<SpecialOffer | null> {
  const store = await getStoreAsync();
  const idx = store.offers.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  store.offers[idx] = {
    ...store.offers[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  await saveStore(store);
  return store.offers[idx];
}

export async function deleteOffer(id: string): Promise<boolean> {
  const store = await getStoreAsync();
  const initial = store.offers.length;
  store.offers = store.offers.filter((o) => o.id !== id);
  await saveStore(store);
  return store.offers.length < initial;
}

// -----------------------------------------------------------------------------
// Reviews
// -----------------------------------------------------------------------------
export async function getReviews(onlyApproved = true): Promise<Review[]> {
  const store = await getStoreAsync();
  if (onlyApproved) {
    return store.reviews.filter((r) => r.status === "approved");
  }
  return store.reviews;
}

export async function createReview(data: Partial<Review>): Promise<Review> {
  const store = await getStoreAsync();
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
  await saveStore(store);
  return newReview;
}

export async function updateReview(id: string, data: Partial<Review>): Promise<Review | null> {
  const store = await getStoreAsync();
  const idx = store.reviews.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  store.reviews[idx] = {
    ...store.reviews[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  await saveStore(store);
  return store.reviews[idx];
}

export async function deleteReview(id: string): Promise<boolean> {
  const store = await getStoreAsync();
  const initial = store.reviews.length;
  store.reviews = store.reviews.filter((r) => r.id !== id);
  await saveStore(store);
  return store.reviews.length < initial;
}

// -----------------------------------------------------------------------------
// Site Settings
// -----------------------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const store = await getStoreAsync();
  return store.settings;
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<SiteSettings> {
  const store = await getStoreAsync();
  store.settings = {
    ...store.settings,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  await saveStore(store);
  return store.settings;
}

// -----------------------------------------------------------------------------
// Site Content & Media CMS (All Text & Images)
// -----------------------------------------------------------------------------
export async function getSiteContent(): Promise<SiteContent> {
  const store = await getStoreAsync();
  return store.content || initialSiteContent;
}

export async function updateSiteContent(
  content: Partial<SiteContent>
): Promise<SiteContent> {
  const store = await getStoreAsync();
  store.content = {
    ...(store.content || initialSiteContent),
    ...content,
    updated_at: new Date().toISOString(),
  };
  await saveStore(store);
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
  const store = await getStoreAsync();
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
  const store = await getStoreAsync();
  const found = (store.bugs || []).find((b) => b.id === id);
  return found || null;
}

export async function createBug(
  data: Omit<BugReport, "id" | "status" | "created_at" | "updated_at">
): Promise<BugReport> {
  const store = await getStoreAsync();
  const newBug: BugReport = {
    ...data,
    id: `bug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!store.bugs) store.bugs = [];
  store.bugs.unshift(newBug);
  await saveStore(store);
  return newBug;
}

export async function updateBug(
  id: string,
  updates: Partial<BugReport>
): Promise<BugReport | null> {
  const store = await getStoreAsync();
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
  await saveStore(store);
  return store.bugs[idx];
}

export async function deleteBug(id: string): Promise<boolean> {
  const store = await getStoreAsync();
  if (!store.bugs) return false;
  const initial = store.bugs.length;
  store.bugs = store.bugs.filter((b) => b.id !== id);
  await saveStore(store);
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
  const store = await getStoreAsync();
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
  const store = await getStoreAsync();
  const page = (store.pages || []).find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  );
  return page || null;
}

export async function getCustomPageById(id: string): Promise<CustomPage | null> {
  const store = await getStoreAsync();
  const page = (store.pages || []).find((p) => p.id === id);
  return page || null;
}

export async function createCustomPage(
  data: Omit<CustomPage, "id" | "created_at" | "updated_at">
): Promise<CustomPage> {
  const store = await getStoreAsync();
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
  await saveStore(store);
  return newPage;
}

export async function updateCustomPage(
  id: string,
  data: Partial<CustomPage>
): Promise<CustomPage | null> {
  const store = await getStoreAsync();
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

  await saveStore(store);
  return store.pages[idx];
}

export async function deleteCustomPage(id: string): Promise<boolean> {
  const store = await getStoreAsync();
  if (!store.pages) return false;
  const initial = store.pages.length;
  store.pages = store.pages.filter((p) => p.id !== id);
  await saveStore(store);
  return store.pages.length < initial;
}

// -----------------------------------------------------------------------------
// Transportation Fleet & Vehicle Functions
// -----------------------------------------------------------------------------
export async function getTransportationVehicles(options?: {
  category?: VehicleCategory;
  activeOnly?: boolean;
}): Promise<TransportationVehicle[]> {
  const store = await getStoreAsync();
  let list = Array.isArray(store.vehicles) && store.vehicles.length > 0
    ? store.vehicles
    : initialTransportationVehicles;

  if (options?.category) {
    list = list.filter((v) => v.category === options.category);
  }
  if (options?.activeOnly) {
    list = list.filter((v) => v.is_active);
  }

  return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getTransportationVehicleById(
  id: string
): Promise<TransportationVehicle | null> {
  const store = await getStoreAsync();
  const list = Array.isArray(store.vehicles) && store.vehicles.length > 0
    ? store.vehicles
    : initialTransportationVehicles;
  return list.find((v) => v.id === id) || null;
}

export async function createTransportationVehicle(
  data: Partial<TransportationVehicle>
): Promise<TransportationVehicle> {
  const store = await getStoreAsync();
  if (!Array.isArray(store.vehicles) || store.vehicles.length === 0) {
    store.vehicles = [...initialTransportationVehicles];
  }

  const id = data.id || `veh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  const newVehicle: TransportationVehicle = {
    id,
    name: data.name?.trim() || "New Vehicle",
    category: data.category || "normal",
    subtitle: data.subtitle?.trim() || "",
    brand: data.brand?.trim() || "",
    badge: data.badge?.trim() || "",
    image: data.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    starting_price: data.starting_price || "₹14 / km",
    capacity_pax: data.capacity_pax ?? 4,
    capacity_luggage: data.capacity_luggage ?? 2,
    best_for: data.best_for || "",
    features: Array.isArray(data.features) ? data.features : [],
    description: data.description?.trim() || "",
    routes: Array.isArray(data.routes) ? data.routes : [],
    is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
    order: data.order !== undefined ? Number(data.order) : store.vehicles.length + 1,
    created_at: now,
    updated_at: now,
  };

  store.vehicles.push(newVehicle);
  await saveStore(store);
  return newVehicle;
}

export async function updateTransportationVehicle(
  id: string,
  data: Partial<TransportationVehicle>
): Promise<TransportationVehicle | null> {
  const store = await getStoreAsync();
  if (!Array.isArray(store.vehicles) || store.vehicles.length === 0) {
    store.vehicles = [...initialTransportationVehicles];
  }

  const idx = store.vehicles.findIndex((v) => v.id === id);
  if (idx === -1) return null;

  const existing = store.vehicles[idx];
  store.vehicles[idx] = {
    ...existing,
    ...data,
    updated_at: new Date().toISOString(),
  };

  await saveStore(store);
  return store.vehicles[idx];
}

export async function deleteTransportationVehicle(id: string): Promise<boolean> {
  const store = await getStoreAsync();
  if (!Array.isArray(store.vehicles)) return false;
  const initial = store.vehicles.length;
  store.vehicles = store.vehicles.filter((v) => v.id !== id);
  await saveStore(store);
  return store.vehicles.length < initial;
}
