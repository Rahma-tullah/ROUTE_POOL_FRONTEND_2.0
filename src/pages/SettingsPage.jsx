// src/pages/SettingsPage.jsx
import { useState } from "react";
import {
  updateRetailerProfile,
  deleteRetailerAccount,
} from "../api/retailer.api";
import { updateRiderProfile, deleteRiderAccount } from "../api/rider.api";
import { clearToken } from "../api/auth.api";

/* ── Icons ─────────────────────────────── */
const Icon = ({ d, className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);
const I = {
  user: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  store:
    "M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z",
  truck:
    "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
  check: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  warning:
    "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z",
  trash:
    "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
  pencil:
    "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125",
};

/* ── Shared field ─────────────────────── */
const Field = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-xs font-medium text-gray-500 uppercase tracking-widest"
      style={{ fontFamily: "var(--font-mono)" }}>
      {label}
    </label>
    <input
      className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900
      placeholder-gray-300 outline-none focus:ring-2 focus:ring-orange-300 focus:border-green-500
      ${error ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
);

const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-xs font-medium text-gray-400 uppercase tracking-widest"
      style={{ fontFamily: "var(--font-mono)" }}>
      {label}
    </label>
    <div className="px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-500 select-all">
      {value || "—"}
    </div>
  </div>
);

const PrimaryBtn = ({ children, loading, className = "", ...props }) => (
  <button
    className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2
    hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 ${className}`}
    style={{ background: "var(--accent)" }}
    disabled={loading}
    {...props}>
    {loading ? "Saving..." : children}
  </button>
);

const GhostBtn = ({ children, className = "", ...props }) => (
  <button
    className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border
    hover:bg-gray-50 transition-colors flex items-center gap-2 ${className}`}
    style={{ borderColor: "var(--border)" }}
    {...props}>
    {children}
  </button>
);

/* ── Section wrapper ──────────────────── */
const Section = ({ title, description, icon, children, danger }) => (
  <div
    className={`bg-white rounded-2xl border overflow-hidden ${danger ? "border-red-200" : ""}`}
    style={danger ? {} : { borderColor: "var(--border)" }}>
    <div
      className={`px-6 py-5 border-b flex items-start gap-4 ${danger ? "bg-red-50 border-red-200" : "border-gray-100"}`}>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
        ${danger ? "bg-red-100" : "bg-green-50"}`}>
        <Icon
          d={icon}
          className={`w-5 h-5 ${danger ? "text-red-500" : "text-green-500"}`}
        />
      </div>
      <div>
        <h3
          className={`font-semibold text-sm ${danger ? "text-red-700" : "text-gray-900"}`}>
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
    <div className="px-6 py-6">{children}</div>
  </div>
);

/* ── Delete confirmation ───────────────── */
const DeleteConfirm = ({ userType, onConfirm, onCancel, loading }) => {
  const [typed, setTyped] = useState("");
  const keyword = "DELETE";
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex gap-3">
        <Icon
          d={I.warning}
          className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
        />
        <div>
          <p className="text-sm font-semibold text-red-700 mb-1">
            This cannot be undone
          </p>
          <p className="text-xs text-red-600 leading-relaxed">
            Your account, profile data, and all associated records will be
            permanently removed.
            {userType === "retailer" && " Your deliveries will not be deleted."}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500">
          Type{" "}
          <span className="font-bold text-red-600 font-mono">{keyword}</span> to
          confirm
        </label>
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="DELETE"
          className="w-full px-4 py-3 rounded-xl border border-red-200 text-sm font-mono text-gray-900
            bg-white outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 placeholder-gray-300"
        />
      </div>
      <div className="flex gap-3">
        <GhostBtn onClick={onCancel}>Cancel</GhostBtn>
        <button
          onClick={onConfirm}
          disabled={typed !== keyword || loading}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600
            hover:bg-red-700 transition-colors disabled:opacity-40 flex items-center gap-2 flex-1 justify-center">
          {loading ? (
            "Deleting..."
          ) : (
            <>
              <Icon d={I.trash} className="w-4 h-4" /> Delete my account
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ── Main SettingsPage ─────────────────── */
export default function SettingsPage({ user, onLogout }) {
  const isRetailer = user.user_type === "retailer";
  const VEHICLES = ["motorcycle", "bicycle", "car"];

  // Profile form state
  const [shopName, setShopName] = useState(user.shop_name || "");
  const [vehicleType, setVehicleType] = useState(
    user.vehicle_type || "motorcycle",
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Delete state
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const payload = isRetailer
        ? { shop_name: shopName }
        : { vehicle_type: vehicleType };

      if (isRetailer) {
        await updateRetailerProfile(user.id, payload);
      } else {
        await updateRiderProfile(user.id, payload);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      if (isRetailer) {
        await deleteRetailerAccount(user.id);
      } else {
        await deleteRiderAccount(user.id);
      }
      clearToken();
      onLogout?.();
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your profile and account preferences.
        </p>
      </div>

      {/* Account info — read only */}
      <Section
        title="Account information"
        icon={I.user}
        description="These details are set at signup and cannot be changed here.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadOnlyField label="Full name" value={user.name} />
          <ReadOnlyField label="Email address" value={user.email} />
          <ReadOnlyField label="Phone" value={user.phone} />
          <ReadOnlyField
            label="Account type"
            value={isRetailer ? "Retailer" : "Rider"}
          />
          {user.created_at && (
            <ReadOnlyField
              label="Member since"
              value={new Date(user.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          )}
        </div>
      </Section>

      {/* Editable profile section */}
      <Section
        title={isRetailer ? "Shop details" : "Rider details"}
        icon={isRetailer ? I.store : I.truck}
        description={
          isRetailer
            ? "Update your shop name as it appears to riders and on your deliveries."
            : "Update your vehicle type. This affects which deliveries you're assigned."
        }>
        <div className="flex flex-col gap-5">
          {isRetailer ? (
            <Field
              label="Shop name"
              placeholder="My Store Ltd."
              value={shopName}
              onChange={(e) => {
                setShopName(e.target.value);
                setSaveSuccess(false);
              }}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-medium text-gray-500 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}>
                Vehicle type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {VEHICLES.map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      setVehicleType(v);
                      setSaveSuccess(false);
                    }}
                    className={`py-3 rounded-xl text-sm font-semibold capitalize border-2 transition-all
                      ${
                        vehicleType === v
                          ? "border-green-500 bg-green-50 text-green-800"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {saveError && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
              {saveError}
            </p>
          )}

          <div className="flex items-center gap-4">
            <PrimaryBtn loading={saving} onClick={handleSave}>
              <Icon d={I.pencil} className="w-4 h-4" />
              Save changes
            </PrimaryBtn>
            {saveSuccess && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <Icon d={I.check} className="w-4 h-4" />
                Saved successfully
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <Section
        title="Delete account"
        icon={I.trash}
        description="Permanently delete your Route Pool account and all associated profile data."
        danger>
        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-200
              hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2">
            <Icon d={I.trash} className="w-4 h-4" />
            Delete my account
          </button>
        ) : (
          <>
            {deleteError && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200 mb-4">
                {deleteError}
              </p>
            )}
            <DeleteConfirm
              userType={user.user_type}
              onConfirm={handleDelete}
              onCancel={() => {
                setShowDelete(false);
                setDeleteError("");
              }}
              loading={deleting}
            />
          </>
        )}
      </Section>
    </div>
  );
}
