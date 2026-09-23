// Set VITE_API_BASE to point at a remote API; falls back to the dev proxy.
const BASE = import.meta.env.VITE_API_BASE || '/api';
export const TOKEN_KEY = 'ha_user_token';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
};

async function req(path, options = {}) {
  const token = getToken();
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong');
    err.status = res.status;
    err.code = data.code;
    throw err;
  }
  return data;
}

export const api = {
  hotels: (params) => req('/hotels?' + new URLSearchParams(params)),
  hotel: (id) => req(`/hotels/${id}`),
  prices: (id) => req(`/hotels/${id}/prices`),
  roomTypes: () => req('/room-types'),
  mealPlans: () => req('/meal-plans'),
  destinations: () => req('/destinations'),
  createLead: (body) => req('/leads', { method: 'POST', body }),
  signup: (body) => req('/auth/signup', { method: 'POST', body }),
  login: (body) => req('/auth/login', { method: 'POST', body }),
  me: () => req('/auth/me'),
};

export const money = (n, currency = 'INR') => {
  if (n == null) return '—';
  const symbol = { INR: '₹', AED: 'AED ', USD: '$' }[currency] || '';
  return symbol + Number(n).toLocaleString('en-IN');
};

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
