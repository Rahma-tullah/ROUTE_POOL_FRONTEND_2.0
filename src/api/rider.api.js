// src/api/rider.api.js
import { getToken } from "./auth.api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const request = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
};

// ── Batches ──────────────────────────────────────────────
export const getMyBatches = (riderId) =>
  request(`/api/batches/rider/${riderId}`);

export const getBatchWithDeliveries = (batchId) =>
  request(`/api/status/batch/${batchId}`);

// ── Status updates ───────────────────────────────────────
export const updateDeliveryStatus = (deliveryId, status) =>
  request(`/api/status/delivery/${deliveryId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const updateBatchStatus = (batchId, status) =>
  request(`/api/status/batch/${batchId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

// ── Verification ─────────────────────────────────────────
export const verifyDeliveryCode = (delivery_id, code) =>
  request("/api/verification/verify", {
    method: "POST",
    body: JSON.stringify({ delivery_id, code }),
  });

// ── Ratings ──────────────────────────────────────────────
export const getMyRatings = (riderId) =>
  request(`/api/ratings/rider/${riderId}`);

// ── Settings ─────────────────────────────────────────────
export const updateRiderProfile = (id, payload) =>
  request(`/api/riders/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteRiderAccount = (id) =>
  request(`/api/riders/${id}`, { method: "DELETE" });

// ── Available batches (unassigned) ───────────────────────
export const getAvailableBatches = () => request("/api/batches/available");

export const claimBatch = (batchId) =>
  request(`/api/batches/${batchId}/claim`, { method: "POST" });
