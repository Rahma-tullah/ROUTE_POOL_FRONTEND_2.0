// src/api/auth.api.js
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

// ── Signup ───────────────────────────────────────────────
export const signup = async (payload) => {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ── Request OTP (login) ──────────────────────────────────
export const requestOtp = async (email) => {
  return request("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// ── Verify OTP ───────────────────────────────────────────
export const verifyOtp = async (email, otp) => {
  return request("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
};

// ── Get current user (after login) ──────────────────────
export const getCurrentUser = async () => {
  return request("/api/auth/me");
};

// ── Token helpers ────────────────────────────────────────
export const saveToken = (token) => localStorage.setItem("rp_token", token);
export const getToken = () => localStorage.getItem("rp_token");
export const clearToken = () => localStorage.removeItem("rp_token");
