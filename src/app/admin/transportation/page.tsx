"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploadField from "@/components/admin/ImageUploadField";
import Image from "next/image";
import { TransportationVehicle, VehicleCategory } from "@/lib/types";

export default function AdminTransportationPage() {
  const [vehicles, setVehicles] = useState<TransportationVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editingVeh, setEditingVeh] = useState<Partial<TransportationVehicle> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form helper strings
  const [featuresInput, setFeaturesInput] = useState("");
  const [routesInput, setRoutesInput] = useState("");

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (categoryFilter !== "all") query.set("category", categoryFilter);

      const res = await fetch(`/api/admin/transportation?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVehicles(data.vehicles || []);
      }
    } catch (err: any) {
      console.error("Failed to load vehicles", err);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const openCreateModal = () => {
    setEditingVeh({
      name: "",
      category: (categoryFilter !== "all" ? categoryFilter : "normal") as VehicleCategory,
      subtitle: "",
      brand: "",
      badge: "Popular Choice",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
      starting_price: "₹14 / km",
      capacity_pax: 4,
      capacity_luggage: 2,
      best_for: "Sightseeing, Airport Transfers, Outstation Trips",
      features: ["Chilled AC", "Clean Sanitized Cabin", "Professional Chauffeur"],
      description: "",
      routes: [],
      is_active: true,
      order: vehicles.length + 1,
    });
    setFeaturesInput("Chilled AC\nClean Sanitized Cabin\nProfessional Chauffeur");
    setRoutesInput("");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (veh: TransportationVehicle) => {
    setEditingVeh({ ...veh });
    setFeaturesInput(Array.isArray(veh.features) ? veh.features.join("\n") : "");
    setRoutesInput(Array.isArray(veh.routes) ? veh.routes.join("\n") : "");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVeh) return;

    if (!editingVeh.name?.trim()) {
      setErrorMessage("Vehicle name is required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload: Partial<TransportationVehicle> = {
      ...editingVeh,
      features: featuresInput
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      routes: routesInput
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
    };

    try {
      const isEdit = Boolean(editingVeh.id);
      const url = isEdit
        ? `/api/admin/transportation/${editingVeh.id}`
        : `/api/admin/transportation`;
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save vehicle");
      }

      setSuccessMessage(isEdit ? "Vehicle updated successfully!" : "New vehicle created successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
      setIsModalOpen(false);
      setEditingVeh(null);
      fetchVehicles();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/transportation/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccessMessage("Vehicle deleted successfully.");
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchVehicles();
      } else {
        alert("Failed to delete vehicle.");
      }
    } catch {
      alert("Error deleting vehicle.");
    }
  };

  const handleToggleActive = async (veh: TransportationVehicle) => {
    try {
      const res = await fetch(`/api/admin/transportation/${veh.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !veh.is_active }),
      });
      if (res.ok) {
        fetchVehicles();
      }
    } catch {
      // Ignore
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
      v.brand?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const normalCount = vehicles.filter((v) => v.category === "normal").length;
  const premiumCount = vehicles.filter((v) => v.category === "premium").length;
  const busCount = vehicles.filter((v) => v.category === "bus").length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transportation Fleet Manager</h1>
            </div>
            <p className="text-sm text-on-surface-variant mt-1">
              Manage Standard Cabs, Premium Segment cars (Mercedes-Benz, Audi, BMW), and Interstate Buses.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold shadow-md hover:bg-primary/90 transition-all text-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            + Add Vehicle / Bus
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-sm font-medium animate-fadeIn">
            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
            {successMessage}
          </div>
        )}

        {/* Filter Tabs & Search */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === "all"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
              }`}
            >
              All Vehicles
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/15 font-semibold">
                {vehicles.length}
              </span>
            </button>

            <button
              onClick={() => setCategoryFilter("normal")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === "normal"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
              }`}
            >
              Standard Cabs
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/15 font-semibold">
                {normalCount}
              </span>
            </button>

            <button
              onClick={() => setCategoryFilter("premium")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === "premium"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
              }`}
            >
              Premium Segment
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/15 font-semibold">
                {premiumCount}
              </span>
            </button>

            <button
              onClick={() => setCategoryFilter("bus")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                categoryFilter === "bus"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
              }`}
            >
              All-India Buses
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/15 font-semibold">
                {busCount}
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search vehicle, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant/60"
            />
          </div>
        </div>

        {/* Vehicles Grid / Table */}
        {loading ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            <p className="text-sm text-on-surface-variant mt-2 font-medium">Loading fleet data...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-8">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">directions_car</span>
            <h3 className="text-lg font-bold">No vehicles found</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Click &quot;+ Add Vehicle / Bus&quot; above to list your first vehicle.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((veh) => {
              const categoryColor =
                veh.category === "normal"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                  : veh.category === "premium"
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";

              const categoryLabel =
                veh.category === "normal"
                  ? "Standard Cab"
                  : veh.category === "premium"
                  ? "Premium Segment"
                  : "Interstate Bus";

              return (
                <div
                  key={veh.id}
                  className={`bg-surface-container-lowest rounded-2xl border ${
                    veh.is_active ? "border-outline-variant/30" : "border-outline/20 opacity-70"
                  } overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col`}
                >
                  {/* Image Banner */}
                  <div className="relative h-44 w-full bg-surface-container">
                    {veh.image ? (
                      <Image
                        src={veh.image}
                        alt={veh.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-4xl">directions_car</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${categoryColor} backdrop-blur-md`}>
                        {categoryLabel}
                      </span>
                      {veh.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md">
                          {veh.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleActive(veh)}
                        title={veh.is_active ? "Currently Live (Click to Disable)" : "Disabled (Click to Activate)"}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md transition-all ${
                          veh.is_active
                            ? "bg-emerald-600 text-white"
                            : "bg-rose-600 text-white"
                        }`}
                      >
                        {veh.is_active ? "Active" : "Inactive"}
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-lg text-on-surface leading-tight">{veh.name}</h3>
                          <p className="text-xs text-primary font-medium mt-0.5">{veh.subtitle}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-baseline gap-1 text-primary font-bold text-base">
                        <span>{veh.starting_price}</span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="material-symbols-outlined text-[16px] text-primary">group</span>
                          <span>{veh.capacity_pax} Pax</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="material-symbols-outlined text-[16px] text-primary">luggage</span>
                          <span>{veh.capacity_luggage} Luggage</span>
                        </div>
                      </div>

                      {/* Routes snippet for buses */}
                      {veh.category === "bus" && veh.routes && veh.routes.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block mb-1">
                            Popular Routes:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {veh.routes.slice(0, 3).map((r, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium truncate max-w-full">
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                      <button
                        onClick={() => openEditModal(veh)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(veh.id, veh.name)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-500/10 transition-all"
                        title="Delete vehicle"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create / Edit Modal */}
        {isModalOpen && editingVeh && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl border border-outline-variant/30 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {editingVeh.id ? "edit_note" : "add_circle"}
                  </span>
                  <h2 className="text-xl font-bold">
                    {editingVeh.id ? "Edit Vehicle" : "Add Vehicle / Bus"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {errorMessage}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-5 text-xs">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2">
                    Fleet Category *
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setEditingVeh({ ...editingVeh, category: "normal" })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        editingVeh.category === "normal"
                          ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm"
                          : "bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      <span className="block font-semibold">Standard Cabs</span>
                      <span className="text-[10px] opacity-80">(Normal)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingVeh({ ...editingVeh, category: "premium" })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        editingVeh.category === "premium"
                          ? "bg-amber-600 text-white border-amber-600 font-bold shadow-sm"
                          : "bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      <span className="block font-semibold">Premium Segment</span>
                      <span className="text-[10px] opacity-80">(Luxury)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingVeh({ ...editingVeh, category: "bus" })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        editingVeh.category === "bus"
                          ? "bg-blue-600 text-white border-blue-600 font-bold shadow-sm"
                          : "bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      <span className="block font-semibold">All-India Buses</span>
                      <span className="text-[10px] opacity-80">(Bus Booking)</span>
                    </button>
                  </div>
                </div>

                {/* Name & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Vehicle Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maruti Suzuki Dzire / Mercedes-Benz / Volvo Sleeper"
                      value={editingVeh.name || ""}
                      onChange={(e) => setEditingVeh({ ...editingVeh, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Brand / Manufacturer
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maruti Suzuki, Toyota, Mercedes-Benz, Volvo"
                      value={editingVeh.brand || ""}
                      onChange={(e) => setEditingVeh({ ...editingVeh, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>
                </div>

                {/* Subtitle & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Subtitle / Model Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Compact AC Sedan / Executive Luxury / Multi-Axle AC Sleeper"
                      value={editingVeh.subtitle || ""}
                      onChange={(e) => setEditingVeh({ ...editingVeh, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Most Popular / VIP Luxury / Interstate Sleeper"
                      value={editingVeh.badge || ""}
                      onChange={(e) => setEditingVeh({ ...editingVeh, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>
                </div>

                {/* Price, Pax, Luggage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Starting Price / Rate *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹14 / km or ₹6,500 / 8h or ₹1,200 / Berth"
                      value={editingVeh.starting_price || ""}
                      onChange={(e) => setEditingVeh({ ...editingVeh, starting_price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Passenger Capacity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4 or 30-36 Sleepers"
                      value={editingVeh.capacity_pax ?? ""}
                      onChange={(e) => setEditingVeh({ ...editingVeh, capacity_pax: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Luggage Capacity
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 or Lower Cargo Boot"
                      value={editingVeh.capacity_luggage ?? ""}
                      onChange={(e) => setEditingVeh({ ...editingVeh, capacity_luggage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>
                </div>

                {/* Image Upload Field */}
                <div>
                  <ImageUploadField
                    label="Vehicle Photo *"
                    value={editingVeh.image || ""}
                    onChange={(url) => setEditingVeh({ ...editingVeh, image: url })}
                    helperText="Upload any high-res vehicle photo from your PC or paste an image URL."
                  />
                </div>

                {/* Best For */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Best For / Recommended Uses
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Airport Transfers, Munnar Mountain Trips, Interstate Night Tours"
                    value={editingVeh.best_for || ""}
                    onChange={(e) => setEditingVeh({ ...editingVeh, best_for: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                  />
                </div>

                {/* Features (One per line) */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Key Features (One feature per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder={"Chilled Air Conditioning\nUniformed Driver\nSanitized Interior\nUSB Charging"}
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-mono"
                  />
                </div>

                {/* Routes (for buses) */}
                {editingVeh.category === "bus" && (
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Popular Routes (One route per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder={"Kochi ⇄ Bangalore\nKochi ⇄ Chennai\nKochi ⇄ Hyderabad\nAll-India Tour Charter"}
                      value={routesInput}
                      onChange={(e) => setRoutesInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-mono"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Vehicle description, comfort details, and highlights..."
                    value={editingVeh.description || ""}
                    onChange={(e) => setEditingVeh({ ...editingVeh, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                  />
                </div>

                {/* Active Switch & Order */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingVeh.is_active)}
                      onChange={(e) => setEditingVeh({ ...editingVeh, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-on-surface">Publish Live on Website</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-on-surface-variant font-medium">Display Order:</span>
                    <input
                      type="number"
                      value={editingVeh.order ?? 1}
                      onChange={(e) => setEditingVeh({ ...editingVeh, order: Number(e.target.value) })}
                      className="w-16 px-2 py-1 rounded-lg bg-surface-container border border-outline-variant/30 text-center font-bold"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Save Vehicle
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
