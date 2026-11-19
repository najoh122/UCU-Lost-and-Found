// All communication with the Express backend lives in this one file.
import { getToken, setToken, ApiError } from './session.js';
import { mockApi } from './mockApi.js';

export { getToken, setToken, ApiError };

const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) {
    payload = form; // FormData: the browser sets the multipart header itself
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError('Cannot reach the server. Check your internet connection and try again.', 0);
  }

  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }

  if (!res.ok) {
    if (res.status === 401 && token) window.dispatchEvent(new Event('auth:expired'));
    throw new ApiError(data?.message || 'Something went wrong. Please try again.', res.status, data?.errors);
  }
  return data;
}

const realApi = {
  // auth
  register: (b) => request('/auth/register', { method: 'POST', body: b }),
  login: (b) => request('/auth/login', { method: 'POST', body: b }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // items
  listItems: (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    return request(`/items?${params}`);
  },
  getItem: (id) => request(`/items/${id}`),
  createItem: (form) => request('/items', { method: 'POST', form }),
  updateItem: (id, form) => request(`/items/${id}`, { method: 'PUT', form }),
  myItems: () => request('/my/items'),

  // claims
  claimItem: (id, evidence) => request(`/items/${id}/claims`, { method: 'POST', body: { evidence } }),
  myClaims: () => request('/my/claims'),

  // admin
  adminClaims: () => request('/admin/claims'),
  decideClaim: (id, b) => request(`/admin/claims/${id}`, { method: 'PATCH', body: b }),
  confirmReturn: (itemId) => request(`/admin/items/${itemId}/return`, { method: 'POST' }),
};

// Demo mode (npm run demo) uses fake data stored in the browser, so the frontend
// can be shown without the backend. Normal mode talks to the real Express server.
export const api = import.meta.env.VITE_USE_MOCK === 'true' ? mockApi : realApi;
