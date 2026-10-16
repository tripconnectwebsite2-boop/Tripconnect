import AdminLayout from "@/components/admin/AdminLayout";
import { getEnquiries, getPackages } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboardOverview() {
  const enquiries = await getEnquiries();
  const allPackages = await getPackages({ status: "all" });

  const newCount = enquiries.filter((e) => e.status === "new").length;
  const contactedCount = enquiries.filter((e) => e.status === "contacted").length;
  const confirmedCount = enquiries.filter((e) => e.status === "confirmed").length;
  const publishedPackagesCount = allPackages.filter((p) => p.status === "published").length;
  const draftPackagesCount = allPackages.filter((p) => p.status === "draft").length;

  const recentEnquiries = enquiries.slice(0, 6);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">
              Operations Dashboard
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Trip Connect Kochi — Enquiries &amp; Package Pipeline
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/content"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-white font-label-md text-label-md font-semibold hover:bg-on-secondary-container transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">edit_document</span>
              <span>Edit Website Text &amp; Images</span>
            </Link>
            <Link
              href="/admin/packages"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Package</span>
            </Link>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">inbox</span>
              <span>View All Enquiries</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-outline uppercase tracking-wider block mb-1">
                New Enquiries
              </span>
              <span className="font-display-hero text-4xl font-bold text-primary">{newCount}</span>
              <span className="text-xs text-outline block mt-1">Awaiting first response</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">mark_email_unread</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-outline uppercase tracking-wider block mb-1">
                In Discussion
              </span>
              <span className="font-display-hero text-4xl font-bold text-amber-600">{contactedCount}</span>
              <span className="text-xs text-outline block mt-1">Consultation in progress</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">chat</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-outline uppercase tracking-wider block mb-1">
                Confirmed Trips
              </span>
              <span className="font-display-hero text-4xl font-bold text-secondary">{confirmedCount}</span>
              <span className="text-xs text-outline block mt-1">Itinerary finalized</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-outline uppercase tracking-wider block mb-1">
                Active Packages
              </span>
              <span className="font-display-hero text-4xl font-bold text-on-surface">
                {publishedPackagesCount}
              </span>
              <span className="text-xs text-outline block mt-1">{draftPackagesCount} in draft</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">luggage</span>
            </div>
          </div>
        </div>

        {/* Recent Enquiries CRM Table */}
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
                Recent Guest Enquiries
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Live submissions from website enquiry forms and custom package builders
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-primary hover:underline text-sm font-semibold flex items-center gap-1"
            >
              <span>Open Full CRM</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant font-label-md text-xs uppercase tracking-wider border-b border-outline-variant/20">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Package / Route</th>
                  <th className="py-3.5 px-6">Travel Date</th>
                  <th className="py-3.5 px-6">Party Size</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-body-sm">
                {recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-outline">
                      No customer enquiries recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentEnquiries.map((enq) => {
                    const statusBadgeColors = {
                      new: "bg-primary/10 text-primary border-primary/20",
                      contacted: "bg-amber-500/10 text-amber-700 border-amber-500/20",
                      confirmed: "bg-secondary-container text-on-secondary-container border-secondary/20",
                      closed: "bg-surface-container-high text-outline border-outline-variant/20",
                    }[enq.status];

                    const cleanPhone = enq.phone.replace(/[^0-9]/g, "");
                    const waUrl = `https://wa.me/${cleanPhone}`;

                    return (
                      <tr key={enq.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-on-surface">{enq.customer_name}</div>
                          <div className="text-xs text-outline">{enq.phone}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-on-surface">
                            {enq.package_title || enq.preferred_destination || "Tailor-made"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">
                          {enq.travel_date || "Flexible"}
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">
                          {enq.traveller_count} Persons
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusBadgeColors}`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <span className="material-symbols-outlined text-[18px]">chat</span>
                            </a>
                            <Link
                              href={`/admin/enquiries?id=${enq.id}`}
                              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-xs font-medium transition-colors"
                            >
                              Manage
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/transportation"
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 transition-all flex items-center gap-4 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">directions_car</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Transportation Fleet
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Normal cars, luxury Benz/Audi & All-India buses
              </p>
            </div>
          </Link>

          <Link
            href="/admin/content"
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 transition-all flex items-center gap-4 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">edit_document</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Content & Media
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Edit hero banners, text, images & phone
              </p>
            </div>
          </Link>

          <Link
            href="/admin/packages"
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 transition-all flex items-center gap-4 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">luggage</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Tour Packages
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Kerala & India bespoke itineraries
              </p>
            </div>
          </Link>

          <Link
            href="/admin/bugs"
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 transition-all flex items-center gap-4 group shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">bug_report</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Bug Reports
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                User glitch reports & tech status
              </p>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
