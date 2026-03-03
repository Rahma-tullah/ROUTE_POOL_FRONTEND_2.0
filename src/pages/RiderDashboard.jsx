// src/pages/RiderDashboard.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import {
  getMyBatches,
  getBatchWithDeliveries,
  updateDeliveryStatus,
  updateBatchStatus,
  verifyDeliveryCode,
  getMyRatings,
  getAvailableBatches,
  claimBatch,
} from "../api/rider.api";
import SettingsPage from "./SettingsPage";
import BatchMap from "../components/BatchMap";
import ChatBot from "../components/ChatBot";
import { clearToken } from "../api/auth.api";

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
  star: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  logout:
    "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9",
  chevron: "m19.5 8.25-7.5 7.5-7.5-7.5",
  key: "M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z",
  check: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  x: "M6 18 18 6M6 6l12 12",
  refresh:
    "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99",
  package:
    "m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
  map: "M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z",
  grid: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
  cog: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
};

const STATUS = {
  pending: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  created: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
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
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
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

const StatCard = ({ label, value, color = "#111827", sub }) => (
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
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const Stars = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Icon
        key={n}
        d={I.star}
        className={`w-3.5 h-3.5 ${n <= value ? "stroke-green-500 fill-green-500" : "stroke-gray-200 fill-transparent"}`}
      />
    ))}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
      <div
        className="flex items-center justify-between px-6 py-5 border-b"
        style={{ borderColor: "var(--border)" }}>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <Icon d={I.x} className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const PrimaryBtn = ({ children, loading, className = "", ...props }) => (
  <button
    className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2
    hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 ${className}`}
    style={{ background: "var(--accent)" }}
    disabled={loading}
    {...props}>
    {loading ? "Loading..." : children}
  </button>
);
const GhostBtn = ({ children, ...props }) => (
  <button
    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border hover:bg-gray-50
    transition-colors flex items-center gap-2"
    style={{ borderColor: "var(--border)" }}
    {...props}>
    {children}
  </button>
);
const SuccessBtn = ({ children, loading, ...props }) => (
  <button
    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-500
    flex items-center gap-2 transition-all disabled:opacity-40"
    disabled={loading}
    {...props}>
    {loading ? "Loading..." : children}
  </button>
);

/* ── Code input ────────────────────────── */
const CodeInput = ({ value, onChange }) => {
  const refs = useRef([]);
  const digits = (value + "        ").slice(0, 8).split("");
  const handle = (e, i) => {
    const ch = e.target.value
      .replace(/[^0-9a-zA-Z]/g, "")
      .slice(-1)
      .toUpperCase();
    const next = [...digits];
    next[i] = ch;
    onChange(next.join("").trimEnd());
    if (ch && i < 7) refs.current[i + 1]?.focus();
  };
  const onKey = (e, i) => {
    if (e.key === "Backspace") {
      const next = [...digits];
      if (next[i]?.trim()) {
        next[i] = " ";
        onChange(next.join("").trimEnd());
      } else if (i > 0) refs.current[i - 1]?.focus();
    }
  };
  const onPaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData
      .getData("text")
      .replace(/\s/g, "")
      .toUpperCase()
      .slice(0, 8);
    onChange(p);
    refs.current[Math.min(p.length, 7)]?.focus();
  };
  return (
    <div className="flex gap-1.5">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d.trim()}
          onChange={(e) => handle(e, i)}
          onKeyDown={(e) => onKey(e, i)}
          onPaste={onPaste}
          maxLength={1}
          className="flex-1 aspect-square text-center text-lg font-bold rounded-xl border-2
            border-gray-200 bg-white text-green-500 outline-none
            focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
          style={{ fontFamily: "var(--font-mono)" }}
        />
      ))}
    </div>
  );
};

/* ── Verify Modal ──────────────────────── */
const VerifyModal = ({ delivery, onClose, onVerified }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const handleVerify = async () => {
    if (code.trim().length < 8) {
      setError("Enter the full 8-character code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verifyDeliveryCode(delivery.id, code.trim());
      setSuccess(true);
      setTimeout(() => {
        onVerified();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
      setCode("");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="Verify Delivery" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div
          className="bg-gray-50 rounded-xl p-4 border"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-xs text-gray-400 font-medium mb-1">
            Delivering to
          </p>
          <p className="font-semibold text-gray-900">
            {delivery.customer_name}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">{delivery.address}</p>
        </div>
        {success ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Icon d={I.check} className="w-8 h-8 text-green-600" />
            </div>
            <p className="font-semibold text-green-700">Delivery confirmed!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-medium text-gray-500 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-mono)" }}>
                Code from retailer / customer
              </label>
              <CodeInput value={code} onChange={setCode} />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <GhostBtn onClick={onClose}>Cancel</GhostBtn>
              <PrimaryBtn
                loading={loading}
                onClick={handleVerify}
                className="flex-1 justify-center">
                <Icon d={I.check} className="w-4 h-4" /> Confirm delivery
              </PrimaryBtn>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

/* ── Batch card ────────────────────────── */
const BatchCard = ({ batch, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [loadingD, setLoadingD] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [updatingBatch, setUpdatingBatch] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const loadDeliveries = useCallback(async () => {
    setLoadingD(true);
    try {
      const res = await getBatchWithDeliveries(batch.id);
      setDeliveries(res.data?.deliveries || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingD(false);
    }
  }, [batch.id]);

  const handleExpand = () => {
    setExpanded((p) => !p);
    if (!expanded && deliveries.length === 0) loadDeliveries();
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    setUpdatingId(deliveryId);
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      await loadDeliveries();
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBatchStatus = async (newStatus) => {
    setUpdatingBatch(true);
    try {
      await updateBatchStatus(batch.id, newStatus);
      onRefresh();
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdatingBatch(false);
    }
  };

  const allDelivered =
    deliveries.length > 0 && deliveries.every((d) => d.status === "delivered");

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--border)" }}>
      {/* Header */}
      <button
        onClick={handleExpand}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <Icon d={I.package} className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              Batch <span style={{ color: "var(--accent)" }}>#{batch.id}</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {batch.total_deliveries} deliveries ·{" "}
              {new Date(batch.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge status={batch.status} />
          {batch.status !== "created" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                loadDeliveries();
                setShowMap(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                text-green-800 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors">
              <Icon d={I.map} className="w-3.5 h-3.5" /> View route
            </button>
          )}
          <Icon
            d={I.chevron}
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {showMap && (
        <BatchMap deliveries={deliveries} onClose={() => setShowMap(false)} />
      )}

      {expanded && (
        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          {/* Batch actions */}
          {batch.status === "created" && (
            <div
              className="px-6 py-3 flex items-center gap-3 border-b"
              style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
              <p className="text-sm text-green-800 flex-1">Ready to start?</p>
              <PrimaryBtn
                loading={updatingBatch}
                onClick={() => handleBatchStatus("in_transit")}>
                Start batch
              </PrimaryBtn>
            </div>
          )}
          {batch.status === "in_transit" && allDelivered && (
            <div
              className="px-6 py-3 flex items-center gap-3 border-b"
              style={{ background: "#F0FDF4", borderColor: "#BBF7D0" }}>
              <p className="text-sm text-green-700 flex-1">
                All done! Complete this batch.
              </p>
              <SuccessBtn
                loading={updatingBatch}
                onClick={() => handleBatchStatus("completed")}>
                Complete batch
              </SuccessBtn>
            </div>
          )}

          {/* Deliveries */}
          {loadingD ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" />
            </div>
          ) : deliveries.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">
              No deliveries found
            </p>
          ) : (
            deliveries.map((d, i) => (
              <div
                key={d.id}
                className={`px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-3
                  hover:bg-gray-50 transition-colors
                  ${i !== deliveries.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: "var(--border)" }}>
                <div className="flex-1 min-w-0">
                  {/* Pickup info per delivery */}
                  {d.retailers && (
                    <div
                      className="mb-2 pb-2 border-b flex items-start gap-2"
                      style={{ borderColor: "#BBF7D0" }}>
                      <span
                        className="text-xs font-semibold text-green-700 uppercase tracking-wider mt-0.5 flex-shrink-0"
                        style={{ fontFamily: "var(--font-mono)" }}>
                        Pickup:
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-gray-800">
                          {d.retailers.shop_name || d.retailers.name}
                        </span>
                        {d.retailers.shop_address && (
                          <span className="text-xs text-gray-500">
                            {" "}
                            · {d.retailers.shop_address}
                          </span>
                        )}
                        {d.retailers.phone && (
                          <a
                            href={`tel:${d.retailers.phone}`}
                            className="text-xs text-green-700 font-medium ml-1 hover:underline">
                            · {d.retailers.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm">
                      {d.customer_name}
                    </p>
                    <Badge status={d.status} />
                  </div>
                  <p className="text-xs text-gray-500">{d.address}</p>
                  {d.customer_phone && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {d.customer_phone}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {d.status === "pending" && batch.status === "in_transit" && (
                    <GhostBtn
                      onClick={() => handleStatusUpdate(d.id, "in_transit")}
                      disabled={updatingId === d.id}>
                      {updatingId === d.id ? "Updating..." : "Mark in transit"}
                    </GhostBtn>
                  )}
                  {d.status === "in_transit" && (
                    <button
                      onClick={() => setVerifyTarget(d)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                        text-green-800 bg-green-50 border-2 border-green-200 hover:bg-green-100 transition-colors">
                      <Icon d={I.key} className="w-4 h-4" /> Enter code
                    </button>
                  )}
                  {d.status === "delivered" && (
                    <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                      <Icon d={I.check} className="w-4 h-4" /> Done
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {verifyTarget && (
        <VerifyModal
          delivery={verifyTarget}
          onClose={() => setVerifyTarget(null)}
          onVerified={() => {
            loadDeliveries();
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

/* ── Ratings tab ───────────────────────── */
const RatingsTab = ({ user }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMyRatings(user.id)
      .then((r) => setRatings(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);
  const avg = ratings.length
    ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1)
    : null;

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total ratings" value={ratings.length} />
        <StatCard
          label="Average score"
          value={avg || "—"}
          color="var(--accent)"
          sub={avg ? "out of 5.0" : "no ratings yet"}
        />
        <StatCard
          label="5-star"
          value={ratings.filter((r) => r.stars === 5).length}
          color="var(--success)"
        />
      </div>
      {ratings.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border"
          style={{ borderColor: "var(--border)" }}>
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Icon d={I.star} className="w-7 h-7 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-500">No ratings yet</p>
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--border)" }}>
          {ratings.map((r, i) => (
            <div
              key={r.id}
              className={`px-6 py-4 flex items-start gap-4 ${i !== ratings.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: "var(--border)" }}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <Stars value={r.stars} />
                  <span
                    className="text-xs text-gray-400"
                    style={{ fontFamily: "var(--font-mono)" }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                {r.comment ? (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {r.comment}
                  </p>
                ) : (
                  <p className="text-xs text-gray-300 italic">No comment</p>
                )}
              </div>
              <div
                className="text-2xl font-extrabold flex-shrink-0"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                }}>
                {r.stars}/5
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main ──────────────────────────────── */
export default function RiderDashboard({ user, onLogout }) {
  const [batches, setBatches] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [claimingId, setClaimingId] = useState(null);
  const [tab, setTab] = useState("batches");
  const [filter, setFilter] = useState("active");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyBatches(user.id);
      setBatches(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  const loadAvailable = useCallback(async () => {
    setLoadingAvailable(true);
    try {
      const res = await getAvailableBatches();
      setAvailableBatches(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAvailable(false);
    }
  }, []);

  const handleClaim = async (batchId) => {
    setClaimingId(batchId);
    try {
      await claimBatch(batchId);
      await Promise.all([load(), loadAvailable()]);
    } catch (e) {
      alert(e.message || "Failed to claim batch");
    } finally {
      setClaimingId(null);
    }
  };

  useEffect(() => {
    load();
    loadAvailable();
  }, [load, loadAvailable]);

  const stats = {
    total: batches.length,
    active: batches.filter((b) => ["created", "in_transit"].includes(b.status))
      .length,
    completed: batches.filter((b) => b.status === "completed").length,
    deliveries: batches.reduce((s, b) => s + (b.total_deliveries || 0), 0),
  };

  const filtered = batches.filter((b) => {
    if (filter === "active")
      return ["created", "in_transit"].includes(b.status);
    if (filter === "completed") return b.status === "completed";
    return true;
  });

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
            Rider
          </p>
          <p className="text-white text-sm font-medium truncate">
            {user?.name || user?.email}
          </p>
          {user?.vehicle_type && (
            <span className="inline-block mt-1.5 text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-md capitalize">
              {user.vehicle_type}
            </span>
          )}
          {user?.average_rating && (
            <div className="flex items-center gap-1.5 mt-2">
              <Stars value={Math.round(user.average_rating)} />
              <span className="text-gray-400 text-xs">
                {Number(user.average_rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {[
            { id: "batches", label: "Batches", icon: I.truck },
            { id: "ratings", label: "Ratings", icon: I.star },
            { id: "settings", label: "Settings", icon: I.cog },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-colors
                ${tab === id ? "text-green-500 bg-green-500/15" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`}>
              <Icon d={icon} className="w-4 h-4" /> {label}
            </button>
          ))}
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
                {tab === "batches"
                  ? "My Batches"
                  : tab === "ratings"
                    ? "My Ratings"
                    : "Settings"}
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
          {tab === "batches" && (
            <button
              onClick={load}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm font-medium
              text-gray-600 border hover:bg-gray-50 transition-colors"
              style={{ borderColor: "var(--border)" }}>
              <Icon d={I.refresh} className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
        </div>

        {tab === "settings" ? (
          <div className="px-4 md:px-8 py-6">
            <SettingsPage user={user} onLogout={onLogout} />
          </div>
        ) : (
          <div className="px-4 md:px-8 py-6 flex flex-col gap-6">
            {tab === "batches" ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <StatCard label="Total batches" value={stats.total} />
                  <StatCard
                    label="Active"
                    value={stats.active}
                    color="var(--accent)"
                  />
                  <StatCard
                    label="Completed"
                    value={stats.completed}
                    color="var(--success)"
                  />
                  <StatCard label="All deliveries" value={stats.deliveries} />
                </div>

                <div
                  className="flex gap-1 p-1 rounded-xl w-full sm:w-fit overflow-x-auto"
                  style={{ background: "#EEEBE4" }}>
                  {[
                    { k: "active", l: "Active" },
                    { k: "completed", l: "Completed" },
                    { k: "all", l: "All" },
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

                {/* Available batches section */}
                {availableBatches.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="font-bold text-gray-900 text-sm">
                        Available Batches
                      </p>
                      <span className="text-xs text-gray-400 ml-auto">
                        {availableBatches.length} unclaimed
                      </span>
                    </div>
                    {availableBatches.map((b) => (
                      <div
                        key={b.id}
                        className="bg-white rounded-2xl border p-4 flex items-center justify-between gap-4"
                        style={{
                          borderColor: "var(--accent)",
                          borderWidth: "1.5px",
                        }}>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            Batch #{b.id}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {b.total_deliveries} deliveries · Created{" "}
                            {new Date(b.created_at).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                        <button
                          onClick={() => handleClaim(b.id)}
                          disabled={claimingId === b.id}
                          className="px-4 py-2 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                          style={{
                            background: "#16A34A",
                            boxShadow: "0 3px 10px rgba(22,163,74,0.35)",
                          }}>
                          {claimingId === b.id ? "Claiming..." : "Accept batch"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* My batches section */}
                {batches.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="font-bold text-gray-900 text-sm">
                      My Batches
                    </p>
                    <span className="text-xs text-gray-400 ml-auto">
                      {batches.length} total
                    </span>
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-green-200 border-t-green-500 animate-spin" />
                      <p className="text-sm text-gray-400">
                        Loading batches...
                      </p>
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
                        No {filter !== "all" ? filter : ""} batches
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Batches are assigned automatically by the system
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {filtered.map((b) => (
                      <BatchCard key={b.id} batch={b} onRefresh={load} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <RatingsTab user={user} />
            )}
          </div>
        )}
      </main>
      <ChatBot user={user} userType="rider" />
    </div>
  );
}
