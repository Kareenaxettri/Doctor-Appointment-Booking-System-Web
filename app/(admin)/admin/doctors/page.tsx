"use client";

import { useCallback, useEffect, useState, startTransition } from "react";
import {
  handleCreateDoctor,
  handleDeleteDoctor,
  handleListDoctors,
  handleUpdateDoctor,
} from "@/lib/actions/doctor-action";
import { Doctor } from "@/lib/api/doctors";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { getProfileImageUrl, getInitials, deduplicateDoctorPhotos, DOCTOR_PLACEHOLDER_URL } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [metaTotal, setMetaTotal] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [formOpen, setFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const loadDoctors = useCallback(
    async (p = page) => {
      setLoading(true);
      const result = await handleListDoctors({ page: p, limit: PAGE_SIZE });
      setLoading(false);
      if (!result.success) {
        setError(result.message || "Failed to load doctors");
        return;
      }
      setDoctors(result.data || []);
      if (result.meta?.total) {
        setMetaTotal(result.meta.total);
        setTotalDoctors(result.meta.total);
      } else {
        setMetaTotal(null);
        setTotalDoctors(result.data?.length === PAGE_SIZE ? PAGE_SIZE * (p + 1) : PAGE_SIZE * p);
      }
    },
    [page],
  );

  useEffect(() => {
    startTransition(() => {
      loadDoctors(1);
      setPage(1);
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const openCreate = () => {
    setEditingDoctor(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setFormError(null);

    const result = editingDoctor
      ? await handleUpdateDoctor(editingDoctor.id, formData)
      : await handleCreateDoctor(formData);

    setSubmitting(false);
    if (!result.success) {
      setFormError(result.message || "Failed to save doctor");
      return;
    }

    setToast(editingDoctor ? "Doctor updated successfully" : "Doctor created successfully");
    setToastType("success");
    setFormOpen(false);
    form.reset();
    loadDoctors();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    const result = await handleDeleteDoctor(deleteTarget.id);
    setDeleteSubmitting(false);
    if (!result.success) {
      setToast(result.message || "Failed to delete doctor");
      setToastType("error");
      setDeleteTarget(null);
      return;
    }
    setToast("Doctor deleted successfully");
    setToastType("success");
    setDeleteTarget(null);
    loadDoctors();
  };

  const filteredDoctors = deduplicateDoctorPhotos(doctors.filter((d) => {
    const q = search.toLowerCase();
    return (
      (d.fullName || d.name || "").toLowerCase().includes(q) ||
      (d.specialty || d.specialization || "").toLowerCase().includes(q) ||
      (d.clinic || d.clinicAddress || "").toLowerCase().includes(q)
    );
  }));

  const totalPages = Math.ceil(totalDoctors / PAGE_SIZE);

  return (
    <div style={{ padding: "2rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", maxWidth: "72rem" }} className="px-6 lg:px-8 py-8 max-w-6xl">
      <style>{`
        .admin-search:focus {
          outline: none;
          border-color: var(--brand) !important;
          box-shadow: 0 0 0 3px var(--brand-light);
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--brand) !important;
          box-shadow: 0 0 0 3px var(--brand-light);
        }
        .admin-btn-primary:hover { opacity: 0.92; }
        .admin-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .admin-btn-secondary:hover { background: var(--bg-hover) !important; }
        .admin-btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
        .admin-table-row:hover td { background: var(--bg-hover) !important; }
        .admin-edit-btn:hover { text-decoration: underline; }
        .admin-delete-btn:hover { text-decoration: underline; }
        .admin-close-btn:hover { background: var(--border) !important; }
        .admin-file-input::file-selector-button {
          margin-right: 0.75rem;
          border-radius: 6px;
          border: none;
          background: var(--brand);
          color: var(--fg-inverse);
          padding: 6px 12px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .admin-file-input::file-selector-button:hover { opacity: 0.9; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--fg)" }} className="text-2xl font-bold tracking-tight">Doctors</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--fg-tertiary)", marginTop: "0.25rem" }} className="text-sm text-[#64748b] mt-1">Manage doctors, specialties, and profile images.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="flex items-center gap-3">
          <div style={{ position: "relative" }} className="relative">
            <svg style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "var(--fg-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors..."
              className="admin-search"
              style={{ paddingLeft: "2.25rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--fg)", fontSize: "0.875rem", width: "14rem" }}
            />
          </div>
          <button
            onClick={openCreate}
            className="admin-btn-primary shrink-0"
            style={{ borderRadius: "8px", background: "var(--brand)", color: "var(--fg-inverse)", fontSize: "0.875rem", fontWeight: 600, paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", boxShadow: "var(--shadow-sm)", border: "none", cursor: "pointer", transition: "opacity 0.15s", flexShrink: 0 }}
          >
            + Add doctor
          </button>
        </div>
      </div>

      {toast && (
        <div style={{
          marginBottom: "1rem",
          borderRadius: "8px",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          border: toastType === "success"
            ? "1px solid color-mix(in srgb, var(--success) 20%, transparent)"
            : "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
          background: toastType === "success"
            ? "color-mix(in srgb, var(--success) 8%, transparent)"
            : "color-mix(in srgb, var(--accent) 8%, transparent)",
          color: toastType === "success" ? "var(--success)" : "var(--accent)",
        }}>
          <svg style={{ width: "1rem", height: "1rem", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            {toastType === "success" ? (
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
            )}
          </svg>
          {toast}
        </div>
      )}

      {error && (
        <div style={{
          marginBottom: "1rem",
          borderRadius: "8px",
          border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
          background: "color-mix(in srgb, var(--accent) 8%, transparent)",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          fontSize: "0.875rem",
          color: "var(--accent)",
          fontWeight: 500,
        }}>
          {error}
        </div>
      )}

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        <table style={{ width: "100%", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--fg-tertiary)" }}>
              <th style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", fontWeight: 500 }}>Doctor</th>
              <th style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", fontWeight: 500 }}>Specialty</th>
              <th style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", fontWeight: 500 }}>Fee</th>
              <th style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", fontWeight: 500 }}>Experience</th>
              <th style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", fontWeight: 500, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ height: "2rem", width: "2rem", borderRadius: "50%", border: "4px solid color-mix(in srgb, var(--brand) 30%, transparent)", borderTopColor: "var(--brand)", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ fontSize: "0.875rem", color: "var(--fg-tertiary)" }}>Loading doctors...</p>
                  </div>
                </td>
              </tr>
            )}
            {!loading && !error && filteredDoctors.length === 0 && (
              <tr>
                <td colSpan={5} style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "4rem", paddingBottom: "4rem", textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "var(--bg-surface-raised)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg style={{ width: "1.5rem", height: "1.5rem", color: "var(--fg-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path d="M9 11a3 3 0 100-6 3 3 0 000 6z" />
                        <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "var(--fg-tertiary)" }}>{search ? "No doctors match your search." : "No doctors yet."}</p>
                  </div>
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              filteredDoctors.map((doctor) => {
                const photo = getProfileImageUrl(doctor.photo || doctor.profileImage);
                return (
                  <tr key={doctor.id} className="admin-table-row" style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}>
                    <td style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {photo ? (
                          <img src={photo} alt={`${doctor.fullName || doctor.name || "Doctor"} profile`} style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
                        ) : (
                          <img src={DOCTOR_PLACEHOLDER_URL} alt={`${doctor.fullName || doctor.name || "Doctor"} profile`} style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border)" }} />
                        )}
                        <div>
                          <p style={{ fontWeight: 500, color: "var(--fg)" }}>{doctor.fullName || doctor.name || "Doctor"}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--fg-tertiary)" }}>{doctor.contactNumber || "No contact"}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem", color: "var(--fg-tertiary)" }}>{doctor.specialty || doctor.specialization || "N/A"}</td>
                    <td style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem", color: "var(--fg)", fontWeight: 500 }}>Rs. {doctor.consultationFee || 1500}</td>
                    <td style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem", color: "var(--fg-tertiary)" }}>{doctor.experienceYears || 0}+ yrs</td>
                    <td style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.875rem", paddingBottom: "0.875rem", textAlign: "right" }}>
                      <button
                        onClick={() => openEdit(doctor)}
                        className="admin-edit-btn"
                        style={{ marginRight: "0.75rem", fontSize: "0.875rem", color: "var(--brand)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(doctor)}
                        className="admin-delete-btn"
                        style={{ fontSize: "0.875rem", color: "var(--accent)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.875rem", color: "var(--fg-tertiary)" }} className="flex items-center justify-between mt-4 text-sm">
          <p>
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalDoctors)} of {totalDoctors} doctors
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="flex items-center gap-2">
            <button
              onClick={() => { const p = page - 1; setPage(p); loadDoctors(p); }}
              disabled={page <= 1}
              className="admin-btn-secondary"
              style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem", paddingTop: "0.375rem", paddingBottom: "0.375rem", borderRadius: "6px", border: "1px solid var(--border)", color: "var(--fg)", fontWeight: 500, background: "var(--bg-surface)", cursor: "pointer", transition: "background 0.15s" }}
            >
              Previous
            </button>
            <span style={{ color: "var(--fg)", fontWeight: 500 }}>Page {page}</span>
            <button
              onClick={() => { const p = page + 1; setPage(p); loadDoctors(p); }}
              disabled={page >= totalPages}
              className="admin-btn-secondary"
              style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem", paddingTop: "0.375rem", paddingBottom: "0.375rem", borderRadius: "6px", border: "1px solid var(--border)", color: "var(--fg)", fontWeight: 500, background: "var(--bg-surface)", cursor: "pointer", transition: "background 0.15s" }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {formOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", zIndex: 50 }} className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div style={{ background: "var(--bg-surface)", borderRadius: "10px", width: "100%", maxWidth: "36rem", padding: "1.5rem", boxShadow: "var(--shadow-lg)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--fg)" }}>{editingDoctor ? "Edit doctor" : "Add new doctor"}</h2>
              <button onClick={() => setFormOpen(false)} className="admin-close-btn" style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "var(--bg-surface-raised)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-tertiary)", border: "none", cursor: "pointer", transition: "background 0.15s" }}>
                <svg style={{ width: "1rem", height: "1rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {formError && (
              <div style={{ marginBottom: "1rem", borderRadius: "8px", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)", background: "color-mix(in srgb, var(--accent) 8%, transparent)", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", fontSize: "0.875rem", color: "var(--accent)" }}>{formError}</div>
            )}

            <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--fg)", marginBottom: "0.375rem" }}>Full name *</label>
                  <input name="fullName" defaultValue={editingDoctor?.fullName || editingDoctor?.name || ""} className="admin-input" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", paddingLeft: "0.875rem", paddingRight: "0.875rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", background: "var(--bg-surface)", color: "var(--fg)" }} placeholder="Dr. John Smith" required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--fg)", marginBottom: "0.375rem" }}>Specialty *</label>
                  <input name="specialty" defaultValue={editingDoctor?.specialty || editingDoctor?.specialization || ""} className="admin-input" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", paddingLeft: "0.875rem", paddingRight: "0.875rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", background: "var(--bg-surface)", color: "var(--fg)" }} placeholder="Cardiology" required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--fg)", marginBottom: "0.375rem" }}>Clinic</label>
                  <input name="clinic" defaultValue={editingDoctor?.clinic || editingDoctor?.clinicAddress || ""} className="admin-input" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", paddingLeft: "0.875rem", paddingRight: "0.875rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", background: "var(--bg-surface)", color: "var(--fg)" }} placeholder="Mediciti Hospital" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--fg)", marginBottom: "0.375rem" }}>Contact number</label>
                  <input name="contactNumber" defaultValue={editingDoctor?.contactNumber || ""} className="admin-input" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", paddingLeft: "0.875rem", paddingRight: "0.875rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", background: "var(--bg-surface)", color: "var(--fg)" }} placeholder="9841234567" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--fg)", marginBottom: "0.375rem" }}>Consultation fee</label>
                  <input name="consultationFee" defaultValue={editingDoctor?.consultationFee || ""} type="number" className="admin-input" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", paddingLeft: "0.875rem", paddingRight: "0.875rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", background: "var(--bg-surface)", color: "var(--fg)" }} placeholder="1500" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--fg)", marginBottom: "0.375rem" }}>Experience (years)</label>
                  <input name="experienceYears" defaultValue={editingDoctor?.experienceYears || ""} type="number" className="admin-input" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", paddingLeft: "0.875rem", paddingRight: "0.875rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", background: "var(--bg-surface)", color: "var(--fg)" }} placeholder="10" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--fg)", marginBottom: "0.375rem" }}>Bio</label>
                  <textarea name="bio" defaultValue={editingDoctor?.bio || ""} rows={3} className="admin-input" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", paddingLeft: "0.875rem", paddingRight: "0.875rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", background: "var(--bg-surface)", color: "var(--fg)", resize: "none" }} placeholder="Brief description about the doctor..." />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--fg)", marginBottom: "0.375rem" }}>Profile photo</label>
                  <input name="photo" type="file" accept="image/*" className="admin-file-input" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", paddingLeft: "0.875rem", paddingRight: "0.875rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", background: "var(--bg-surface)", color: "var(--fg)" }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem" }}>
                <button type="button" onClick={() => setFormOpen(false)} className="admin-btn-secondary" style={{ borderRadius: "8px", border: "1px solid var(--border)", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--fg)", background: "var(--bg-surface)", cursor: "pointer", transition: "background 0.15s" }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="admin-btn-primary" style={{ borderRadius: "8px", background: "var(--brand)", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-inverse)", border: "none", cursor: "pointer", transition: "opacity 0.15s" }}>
                  {submitting ? "Saving..." : editingDoctor ? "Save changes" : "Create doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          userName={deleteTarget.fullName || deleteTarget.name || "this doctor"}
          submitting={deleteSubmitting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
