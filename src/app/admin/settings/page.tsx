"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">
            Portal &amp; Website Settings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Business contact details, operational hours, and integration statuses
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-secondary-container text-on-secondary-container text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Settings updated successfully. Changes are active immediately.</span>
          </div>
        )}

        {loading || !settings ? (
          <div className="py-16 text-center text-outline">Loading settings...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8 text-xs">
            {/* Business Contact Information */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-4">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">storefront</span>
                Verified Business Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Business Name</label>
                  <input
                    type="text"
                    value={settings.business_name}
                    onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Public Concierge Email</label>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">WhatsApp Desk Number</label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Physical Office Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Instagram Profile</label>
                  <input
                    type="text"
                    value={settings.instagram_handle}
                    onChange={(e) => setSettings({ ...settings, instagram_handle: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Operating Business Hours</label>
                  <input
                    type="text"
                    value={settings.business_hours}
                    onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Notification Integrations Status */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-4">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">notifications_active</span>
                Notification Integrations
              </h2>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[24px] text-primary">mail</span>
                    <div>
                      <span className="font-bold text-on-surface block">Email Concierge Dispatcher</span>
                      <span className="text-[11px] text-outline">
                        Sends new enquiry notifications to <code>tripconnectwebsite2@gmail.com</code>
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[10px] uppercase">
                    Active (Ready)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[24px] text-secondary">chat</span>
                    <div>
                      <span className="font-bold text-on-surface block">WhatsApp Click-to-Chat</span>
                      <span className="text-[11px] text-outline">
                        Direct guest concierge touchpoints configured for +91 9400886838
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[10px] uppercase">
                    Active
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[24px] text-outline">sms</span>
                    <div>
                      <span className="font-bold text-on-surface block">WhatsApp Business Cloud API (Automated)</span>
                      <span className="text-[11px] text-outline">
                        Outbound WhatsApp Business notifications pending Meta developer credentials
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-outline/20 text-outline font-bold text-[10px] uppercase">
                    Pending Credentials
                  </span>
                </div>
              </div>
            </div>

            {/* SEO & Tracking */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-4">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">query_stats</span>
                Search &amp; Analytics Credentials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Google Analytics 4 Measurement ID</label>
                  <input
                    type="text"
                    value={settings.ga_measurement_id || ""}
                    onChange={(e) => setSettings({ ...settings, ga_measurement_id: e.target.value })}
                    placeholder="e.g. G-XXXXXXXXXX"
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Google Search Console Verification Tag</label>
                  <input
                    type="text"
                    value={settings.search_console_id || ""}
                    onChange={(e) => setSettings({ ...settings, search_console_id: e.target.value })}
                    placeholder="e.g. google-site-verification=..."
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold shadow-sm disabled:opacity-50"
              >
                {saving ? "Saving Changes..." : "Save Settings"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
