// src/pages/RetailerDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import {
  getMyDeliveries,
  createDelivery,
  deleteDelivery,
  generateCode,
  submitRating,
} from "../api/retailer.api";
import SettingsPage from "./SettingsPage";
import { clearToken } from "../api/auth.api";
import ChatBot from "../components/ChatBot";

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
  truck:
    "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
  plus: "M12 4.5v15m7.5-7.5h-15",
  logout:
    "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9",
  key: "M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z",
  star: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  trash:
    "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
  x: "M6 18 18 6M6 6l12 12",
  check: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  copy: "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
  refresh:
    "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99",
  user: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  grid: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
  cog: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
};

/* ── Status badge ─────────────────────── */
const STATUS = {
  pending: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  in_transit: {
    bg: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-500",
  },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  cancelled: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-400" },
};
const Badge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status?.replace("_", " ") || "pending"}
    </span>
  );
};

/* ── Stat card ────────────────────────── */
const StatCard = ({ label, value, color = "#111827" }) => (
  <div
    className="bg-white rounded-2xl border p-5"
    style={{ borderColor: "var(--border)" }}>
    <p
      className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2"
      style={{ fontFamily: "var(--font-mono)" }}>
      {label}
    </p>
    <p className="text-3xl font-extrabold" style={{ color }}>
      {value ?? "—"}
    </p>
  </div>
);

/* ── Modal ────────────────────────────── */
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div
        className="flex items-center justify-between px-6 py-5 border-b"
        style={{ borderColor: "var(--border)" }}>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <Icon d={I.x} className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

/* ── Field ────────────────────────────── */
const Field = ({ label, error, textarea, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-xs font-medium text-gray-500 uppercase tracking-widest"
      style={{ fontFamily: "var(--font-mono)" }}>
      {label}
    </label>
    {textarea ? (
      <textarea
        rows={3}
        className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900 resize-none
          placeholder-gray-300 outline-none focus:ring-2 focus:ring-orange-300 focus:border-green-500
          ${error ? "border-red-300" : "border-gray-200 hover:border-gray-300"}`}
        {...props}
      />
    ) : (
      <input
        className={`w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900
          placeholder-gray-300 outline-none focus:ring-2 focus:ring-orange-300 focus:border-green-500
          ${error ? "border-red-300" : "border-gray-200 hover:border-gray-300"}`}
        {...props}
      />
    )}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const PrimaryBtn = ({ children, loading, className = "", ...props }) => (
  <button
    className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2
    hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 ${className}`}
    style={{ background: "var(--accent)" }}
    disabled={loading}
    {...props}>
    {loading ? "Loading..." : children}
  </button>
);
const GhostBtn = ({ children, ...props }) => (
  <button
    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border hover:bg-gray-50
    transition-colors flex items-center gap-2"
    style={{ borderColor: "var(--border)" }}
    {...props}>
    {children}
  </button>
);

/* ── New Delivery Modal ───────────────── */
const NewDeliveryModal = ({ user, onClose, onCreated }) => {
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    address: "",
    package_description: "",
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };
  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim()) errs.customer_name = "Required";
    if (!form.customer_phone.trim()) errs.customer_phone = "Required";
    if (!form.address.trim()) errs.address = "Required";
    setErrors(errs);
    return !Object.keys(errs).length;
  };
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      await createDelivery({
        retailer_id: user.id,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        address: form.address,
        ...(form.package_description && {
          package_description: form.package_description,
        }),
        ...(form.latitude && { latitude: parseFloat(form.latitude) }),
        ...(form.longitude && { longitude: parseFloat(form.longitude) }),
      });
      onCreated();
      onClose();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="New Delivery" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field
          label="Customer name"
          placeholder="John Doe"
          value={form.customer_name}
          onChange={set("customer_name")}
          error={errors.customer_name}
        />
        <Field
          label="Customer phone"
          placeholder="+234 000 000 0000"
          value={form.customer_phone}
          onChange={set("customer_phone")}
          error={errors.customer_phone}
        />
        <Field
          label="Delivery address"
          placeholder="12 Lagos Street, Abuja"
          value={form.address}
          onChange={set("address")}
          error={errors.address}
        />
        <Field
          label="Package description (optional)"
          placeholder="1x fragile electronics"
          value={form.package_description}
          onChange={set("package_description")}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Latitude (optional)"
            placeholder="6.5244"
            type="number"
            value={form.latitude}
            onChange={set("latitude")}
          />
          <Field
            label="Longitude (optional)"
            placeholder="3.3792"
            type="number"
            value={form.longitude}
            onChange={set("longitude")}
          />
        </div>
        {apiError && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
            {apiError}
          </p>
        )}
        <div className="flex gap-3 pt-2">
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn
            loading={loading}
            onClick={handleSubmit}
            className="flex-1 justify-center">
            Create delivery
          </PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
};

/* ── Verify Code Modal ────────────────── */
const VerifyCodeModal = ({ delivery, onClose }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await generateCode(delivery.id);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(result.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Modal title="Verification Code" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div
          className="bg-gray-50 rounded-xl p-4 border"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-xs text-gray-400 font-medium mb-1">Delivery for</p>
          <p className="font-semibold text-gray-900">
            {delivery.customer_name}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">{delivery.address}</p>
        </div>
        {!result ? (
          <>
            <p className="text-sm text-gray-500 leading-relaxed">
              Generate a one-time code to confirm this delivery. Give it to the
              customer — the rider will enter it on arrival. Valid for 15
              minutes.
            </p>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                {error}
              </p>
            )}
            <PrimaryBtn
              loading={loading}
              onClick={handleGenerate}
              className="justify-center">
              <Icon d={I.key} className="w-4 h-4" /> Generate code
            </PrimaryBtn>
          </>
        ) : (
          <>
            <div
              className="rounded-2xl border-2 p-6 flex flex-col items-center gap-3 text-center"
              style={{ borderColor: "var(--accent)", background: "#F0FDF4" }}>
              <p
                className="text-xs font-medium text-green-500 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}>
                One-time code
              </p>
              <p
                className="text-5xl font-bold tracking-[0.2em]"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                }}>
                {result.code}
              </p>
              <p className="text-xs text-gray-400">
                Expires {new Date(result.expiresAt).toLocaleTimeString()}
              </p>
            </div>
            <GhostBtn onClick={handleCopy} className="justify-center w-full">
              <Icon d={copied ? I.check : I.copy} className="w-4 h-4" />
              {copied ? "Copied!" : "Copy code"}
            </GhostBtn>
          </>
        )}
      </div>
    </Modal>
  );
};

/* ── Rating Modal ─────────────────────── */
const RatingModal = ({ delivery, onClose, onRated }) => {
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async () => {
    if (!stars) {
      setError("Please select a rating");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await submitRating({ delivery_id: delivery.id, stars, comment });
      onRated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="Rate this delivery" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div
          className="bg-gray-50 rounded-xl p-4 border"
          style={{ borderColor: "var(--border)" }}>
          <p className="font-semibold text-gray-900">
            {delivery.customer_name}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">{delivery.address}</p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-xs font-medium text-gray-500 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}>
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setStars(n)}
                className="transition-transform hover:scale-110">
                <Icon
                  d={I.star}
                  className={`w-9 h-9 transition-colors
                  ${n <= (hovered || stars) ? "stroke-green-500 fill-green-500" : "stroke-gray-200 fill-transparent"}`}
                />
              </button>
            ))}
          </div>
        </div>
        <Field
          label="Comment (optional)"
          placeholder="Fast and careful delivery..."
          textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn
            loading={loading}
            onClick={handleSubmit}
            className="flex-1 justify-center">
            Submit rating
          </PrimaryBtn>
        </div>
      </div>
    </Modal>
  );
};

/* ── Main Dashboard ───────────────────── */
export default function RetailerDashboard({ user, onLogout }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("deliveries"); // "deliveries" | "settings"
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyDeliveries(user.id);
      setDeliveries(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    load();
  }, [load]);

  const openModal = (type, d = null) => {
    setSelectedDelivery(d);
    setActiveModal(type);
  };
  const closeModal = () => {
    setActiveModal(null);
    setSelectedDelivery(null);
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this delivery?")) return;
    try {
      await deleteDelivery(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter((d) => d.status === "pending").length,
    in_transit: deliveries.filter((d) => d.status === "in_transit").length,
    delivered: deliveries.filter((d) => d.status === "delivered").length,
  };
  const filtered =
    filter === "all"
      ? deliveries
      : deliveries.filter((d) => d.status === filter);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 w-60 flex-shrink-0 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "var(--sidebar)" }}>
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--accent)" }}>
              <div className="w-3 h-3 rounded-sm bg-white" />
            </div>
            <span className="text-white font-bold">Route Pool</span>
          </div>
        </div>
        <div className="px-4 py-4 border-b border-white/10">
          <p
            className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-1"
            style={{ fontFamily: "var(--font-mono)" }}>
            Retailer
          </p>
          <p className="text-white text-sm font-medium truncate">
            {user?.name || user?.email}
          </p>
          {user?.shop_name && (
            <p className="text-gray-400 text-xs mt-0.5 truncate">
              {user.shop_name}
            </p>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {[
            { id: "deliveries", label: "Overview", icon: I.grid },
            { id: "deliveries", label: "Deliveries", icon: I.truck },
            { id: "settings", label: "Settings", icon: I.cog },
          ].map(({ id, label, icon }) => {
            const active =
              label === "Settings" ? view === "settings" : view !== "settings";
            return (
              <button
                key={label}
                onClick={() => {
                  setView(id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-colors
                  ${active ? "text-green-500 bg-green-500/15" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`}>
                <Icon d={icon} className="w-4 h-4" /> {label}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => {
              clearToken();
              onLogout?.();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400
              hover:text-red-400 hover:bg-red-400/10 w-full text-left transition-colors">
            <Icon d={I.logout} className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Header */}
        <div
          className="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10"
          style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5 text-gray-600">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-gray-900">
                {view === "settings" ? "Settings" : "Deliveries"}
              </h1>
              <p
                className="text-xs text-gray-400 mt-0.5 hidden sm:block"
                style={{ fontFamily: "var(--font-mono)" }}>
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {view !== "settings" && (
            <div className="flex gap-2">
              <button
                onClick={load}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                text-gray-600 border hover:bg-gray-50 transition-colors"
                style={{ borderColor: "var(--border)" }}>
                <Icon d={I.refresh} className="w-4 h-4" /> Refresh
              </button>
              <PrimaryBtn onClick={() => openModal("new")}>
                <Icon d={I.plus} className="w-4 h-4" />
                <span className="hidden sm:inline">New delivery</span>
              </PrimaryBtn>
            </div>
          )}
        </div>

        {view === "settings" ? (
          <div className="px-4 md:px-8 py-6">
            <SettingsPage user={user} onLogout={onLogout} />
          </div>
        ) : (
          <div className="px-4 md:px-8 py-6 flex flex-col gap-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <StatCard label="Total" value={stats.total} />
              <StatCard label="Pending" value={stats.pending} />
              <StatCard
                label="In Transit"
                value={stats.in_transit}
                color="var(--accent)"
              />
              <StatCard
                label="Delivered"
                value={stats.delivered}
                color="var(--success)"
              />
            </div>

            {/* Filter tabs */}
            <div
              className="flex gap-1 p-1 rounded-xl w-full sm:w-fit overflow-x-auto"
              style={{ background: "#EEEBE4" }}>
              {[
                { k: "all", l: "All" },
                { k: "pending", l: "Pending" },
                { k: "in_transit", l: "In Transit" },
                { k: "delivered", l: "Delivered" },
              ].map(({ k, l }) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                  ${filter === k ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                  {l}
                </button>
              ))}
            </div>

            {/* Deliveries */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" />
                  <p className="text-sm text-gray-400">Loading deliveries...</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border"
                style={{ borderColor: "var(--border)" }}>
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Icon d={I.truck} className="w-7 h-7 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700">
                    No deliveries yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Create your first delivery to get started
                  </p>
                </div>
                <PrimaryBtn onClick={() => openModal("new")}>
                  <Icon d={I.plus} className="w-4 h-4" /> Create delivery
                </PrimaryBtn>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border overflow-hidden"
                style={{ borderColor: "var(--border)" }}>
                {/* Table header — desktop only */}
                <div
                  className="hidden md:grid grid-cols-[1fr_1fr_1fr_120px_140px] gap-4 px-6 py-3 border-b"
                  style={{
                    background: "#FAFAF8",
                    borderColor: "var(--border)",
                  }}>
                  {["Customer", "Address", "Package", "Status", "Actions"].map(
                    (h) => (
                      <p
                        key={h}
                        className="text-xs font-medium text-gray-400 uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-mono)" }}>
                        {h}
                      </p>
                    ),
                  )}
                </div>
                {filtered.map((d, i) => (
                  <div
                    key={d.id}
                    className={`px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors
                    ${i !== filtered.length - 1 ? "border-b" : ""}`}
                    style={{ borderColor: "var(--border)" }}>
                    {/* Mobile layout */}
                    <div className="md:hidden flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {d.customer_name}
                          </p>
                          <Badge status={d.status} />
                        </div>
                        <p className="text-xs text-gray-400">
                          {d.customer_phone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {d.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {(d.status === "pending" ||
                          d.status === "in_transit") && (
                          <button
                            onClick={() => openModal("verify", d)}
                            title="Generate code"
                            className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors">
                            <Icon d={I.key} className="w-4 h-4" />
                          </button>
                        )}
                        {d.status === "delivered" && (
                          <button
                            onClick={() => openModal("rate", d)}
                            title="Rate"
                            className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors">
                            <Icon d={I.star} className="w-4 h-4" />
                          </button>
                        )}
                        {(d.status === "pending" ||
                          d.status === "in_transit") && (
                          <button
                            onClick={() => handleDelete(d.id)}
                            title="Delete"
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                            <Icon d={I.trash} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_120px_140px] gap-4 items-center">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {d.customer_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {d.customer_phone}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {d.address}
                      </p>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {d.package_description || (
                          <span className="italic text-gray-300">
                            No description
                          </span>
                        )}
                      </p>
                      <div>
                        <Badge status={d.status} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {(d.status === "pending" ||
                          d.status === "in_transit") && (
                          <button
                            onClick={() => openModal("verify", d)}
                            title="Generate verification code"
                            className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors">
                            <Icon d={I.key} className="w-4 h-4" />
                          </button>
                        )}
                        {d.status === "delivered" && (
                          <button
                            onClick={() => openModal("rate", d)}
                            title="Rate this delivery"
                            className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors">
                            <Icon d={I.star} className="w-4 h-4" />
                          </button>
                        )}
                        {(d.status === "pending" ||
                          d.status === "in_transit") && (
                          <button
                            onClick={() => handleDelete(d.id)}
                            title="Delete delivery"
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                            <Icon d={I.trash} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {activeModal === "new" && (
        <NewDeliveryModal user={user} onClose={closeModal} onCreated={load} />
      )}
      {activeModal === "verify" && selectedDelivery && (
        <VerifyCodeModal delivery={selectedDelivery} onClose={closeModal} />
      )}
      {activeModal === "rate" && selectedDelivery && (
        <RatingModal
          delivery={selectedDelivery}
          onClose={closeModal}
          onRated={load}
        />
      )}
      <ChatBot user={user} userType="retailer" />
    </div>
  );
}
