"use client";

import { useCallback, useEffect, useState } from "react";
import {
  handleListUsers,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from "@/lib/actions/admin-user-action";
import { AdminUser, PaginationMeta } from "@/lib/api/admin-users";
import { getInitials } from "@/lib/utils";
import UserFormModal, { UserFormValues } from "@/components/UserFormModel";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModel";

const LIMIT = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeUser, setActiveUser] = useState<AdminUser | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await handleListUsers({ page, limit: LIMIT, search });
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Failed to load users");
      return;
    }

    setUsers(result.data || []);
    setMeta(result.meta || null);
  }, [page, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const openCreate = () => {
    setFormMode("create");
    setActiveUser(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setFormMode("edit");
    setActiveUser(user);
    setFormError(null);
    setFormOpen(true);
  };

  const submitForm = async (values: UserFormValues) => {
    setSubmitting(true);
    setFormError(null);

    if (formMode === "create") {
      const result = await handleCreateUser({
        fullName: values.fullName,
        email: values.email,
        contactNumber: values.contactNumber,
        gender: values.gender,
        role: values.role,
        password: values.password,
      });
      setSubmitting(false);
      if (!result.success) {
        setFormError(result.message || "Failed to create user");
        return;
      }
      setToast("User created successfully");
    } else if (activeUser) {
      const payload: Record<string, unknown> = {
        fullName: values.fullName,
        email: values.email,
        contactNumber: values.contactNumber,
        gender: values.gender,
        role: values.role,
      };
      if (values.password) payload.password = values.password;

      const result = await handleUpdateUser(activeUser.id, payload);
      setSubmitting(false);
      if (!result.success) {
        setFormError(result.message || "Failed to update user");
        return;
      }
      setToast("User updated successfully");
    }

    setFormOpen(false);
    loadUsers();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await handleDeleteUser(deleteTarget.id);
    setDeleting(false);

    if (!result.success) {
      setToast(result.message || "Failed to delete user");
      setDeleteTarget(null);
      return;
    }

    setToast("User deleted");
    setDeleteTarget(null);

    if (users.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      loadUsers();
    }
  };

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d2b36]">Users</h1>
          <p className="text-sm text-[#64748b] mt-1">
            View, search, create, edit, and remove platform accounts.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="shrink-0 rounded-lg bg-[#2f6f7e] text-white text-sm font-medium px-4 py-2.5 hover:bg-[#3d8a9c] transition"
        >
          + Add user
        </button>
      </div>

      <form onSubmit={onSearchSubmit} className="mb-5 flex gap-2 max-w-md">
        <div className="relative flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-lg border border-[#e2e8f0] bg-white text-[#1d2b36] pl-9 pr-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2f6f7e]/30 focus:border-[#2f6f7e]"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg border border-[#e2e8f0] px-4 py-2.5 text-sm font-medium text-[#1d2b36] hover:bg-[#f4f7fb] transition"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="rounded-lg px-3 py-2.5 text-sm text-[#64748b] hover:text-[#1d2b36] transition"
          >
            Clear
          </button>
        )}
      </form>

      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] text-left text-xs uppercase tracking-wide text-[#64748b]">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-[#64748b]">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-[#2f6f7e]/30 border-t-[#2f6f7e] animate-spin" />
                    Loading users…
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <p className="text-[#dc2626] text-sm font-medium">{error}</p>
                  <button
                    onClick={loadUsers}
                    className="mt-3 text-sm text-[#2f6f7e] underline underline-offset-2"
                  >
                    Try again
                  </button>
                </td>
              </tr>
            )}

            {!loading && !error && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-[#64748b]">
                  {search ? (
                    <>
                      No users match <span className="font-medium text-[#1d2b36]">&ldquo;{search}&rdquo;</span>.
                    </>
                  ) : (
                    "No users yet. Add your first user to get started."
                  )}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              users.map((user) => (
                <tr key={user.id} className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#f4f7fb]/60 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#2f6f7e]/10 text-[#2f6f7e] text-xs font-semibold flex items-center justify-center shrink-0">
                        {getInitials(user.fullName)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1d2b36] truncate">{user.fullName}</p>
                        <p className="text-xs text-[#64748b] truncate">{user.contactNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748b]">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-[#b45309]/15 text-[#b45309]"
                          : "bg-[#2f6f7e]/10 text-[#2f6f7e]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748b]">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="rounded-md px-2.5 py-1.5 text-xs font-medium border border-[#e2e8f0] text-[#1d2b36] hover:bg-[#f4f7fb] transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(user)}
                        className="rounded-md px-2.5 py-1.5 text-xs font-medium border border-[#dc2626]/20 text-[#dc2626] hover:bg-[#dc2626]/5 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && !error && meta && meta.total > 0 && (
        <div className="flex items-center justify-between mt-5 text-sm text-[#64748b]">
          <p>
            Showing page <span className="font-medium text-[#1d2b36]">{meta.page}</span> of{" "}
            <span className="font-medium text-[#1d2b36]">{totalPages}</span> &middot;{" "}
            {meta.total} total user{meta.total === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-sm font-medium text-[#1d2b36] hover:bg-[#f4f7fb] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-sm font-medium text-[#1d2b36] hover:bg-[#f4f7fb] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {formOpen && (
        <UserFormModal
          mode={formMode}
          initialUser={activeUser}
          submitting={submitting}
          serverError={formError}
          onClose={() => setFormOpen(false)}
          onSubmit={submitForm}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          userName={deleteTarget.fullName}
          submitting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1d2b36] text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}