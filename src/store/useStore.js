import { create } from 'zustand';
import { api } from '../api';

const today = new Date();
const plus = (n) => new Date(today.getTime() + n * 864e5).toISOString().slice(0, 10);

export const emptyFilters = {
  q: '', checkIn: plus(7), checkOut: plus(9), rooms: 1, adults: 2, children: 0,
  stars: [], minPrice: '', maxPrice: '', roomType: [], mealPlan: [], rating: '', sort: '',
};

export const useSearch = create((set, get) => ({
  filters: { ...emptyFilters },
  hotels: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: '',
  setFilter: (patch) => set((s) => ({ filters: { ...s.filters, ...patch }, page: 1 })),
  toggleArr: (key, value) =>
    set((s) => {
      const arr = s.filters[key];
      return { filters: { ...s.filters, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }, page: 1 };
    }),
  clearFilters: () => set((s) => ({ filters: { ...emptyFilters, q: s.filters.q, checkIn: s.filters.checkIn, checkOut: s.filters.checkOut }, page: 1 })),
  setPage: (page) => set({ page }),
  fetchHotels: async () => {
    const { filters, page } = get();
    set({ loading: true, error: '' });
    try {
      const params = { page, limit: 8 };
      for (const [k, v] of Object.entries(filters)) {
        if (['checkIn', 'checkOut', 'rooms', 'adults', 'children'].includes(k)) continue;
        if (Array.isArray(v) ? v.length : v !== '' && v != null) params[k] = Array.isArray(v) ? v.join(',') : v;
      }
      const res = await api.hotels(params);
      set({ hotels: res.data, total: res.total, pages: res.pages, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false, hotels: [] });
    }
  },
}));

export const useEnquiry = create((set) => ({
  open: false,
  context: null, // { hotelId, hotelName, roomType, mealPlan }
  openEnquiry: (context = {}) => set({ open: true, context }),
  closeEnquiry: () => set({ open: false }),
}));

export const useMasters = create((set, get) => ({
  roomTypes: [],
  mealPlans: [],
  load: async () => {
    if (get().roomTypes.length) return;
    const [roomTypes, mealPlans] = await Promise.all([api.roomTypes(), api.mealPlans()]);
    set({ roomTypes, mealPlans });
  },
}));

/* ---------------- customer accounts ---------------- */
import { TOKEN_KEY, getToken } from '../api';

const USER_KEY = 'ha_user';
const readUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
};
const persist = (token, user) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); else localStorage.removeItem(USER_KEY);
  } catch { /* storage unavailable */ }
};

export const useAuth = create((set) => ({
  token: getToken(),
  user: readUser(),
  login: async (body) => {
    const { token, user } = await api.login(body);
    persist(token, user);
    set({ token, user });
    return user;
  },
  logout: () => { persist('', null); set({ token: '', user: null }); },
  /**
   * Revalidates the stored session on load. Only a real rejection from the
   * server ends the session — a network blip, a cold start or an offline
   * moment must never sign the guest out, because the token is still good.
   */
  refresh: async () => {
    if (!getToken()) return;
    try {
      const { user } = await api.me();
      persist(getToken(), user);
      set({ user });
    } catch (e) {
      if (e?.status === 401 || e?.status === 403) {
        persist('', null);
        set({ token: '', user: null });
      }
      // anything else (offline, 5xx, CORS, timeout) leaves the session alone
    }
  },
}));
