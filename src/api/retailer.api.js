// src/api/retailer.api.js
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
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
};

// ── Deliveries ───────────────────────────────────────────
export const getMyDeliveries = (retailerId) =>
  request(`/api/deliveries/retailer/${retailerId}`);

export const createDelivery = (payload) =>
  request("/api/deliveries", { method: "POST", body: JSON.stringify(payload) });

export const deleteDelivery = (id) =>
  request(`/api/deliveries/${id}`, { method: "DELETE" });

// ── Batches ──────────────────────────────────────────────
export const getMyBatches = () => request("/api/batches");

// ── Verification ─────────────────────────────────────────
export const generateCode = (delivery_id) =>
  request("/api/verification/generate", {
    method: "POST",
    body: JSON.stringify({ delivery_id }),
  });

// ── Ratings ──────────────────────────────────────────────
export const submitRating = (payload) =>
  request("/api/ratings", { method: "POST", body: JSON.stringify(payload) });

// ── Settings ─────────────────────────────────────────────
export const updateRetailerProfile = (id, payload) =>
  request(`/api/retailers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteRetailerAccount = (id) =>
  request(`/api/retailers/${id}`, { method: "DELETE" });
