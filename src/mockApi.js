// DEMO MODE ONLY. Pretends to be the backend using localStorage so the frontend
// can run without Node/MySQL. It follows the same rules as the exam brief
// (permissions, private details, one approved claim, no claims after return).
// Switch it off for the real submission: run `npm run dev` instead of `npm run demo`.
import { getToken, setToken, ApiError } from './session.js';

const KEY = 'ucu_demo_db_v1';
const wait = (v) => new Promise((r) => setTimeout(() => r(v), 150));
const fail = (message, status = 400, errors) => { throw new ApiError(message, status, errors); };
const now = () => new Date().toISOString();

function seed() {
  const d = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
  return {
    next: 100,
    users: [
      { id: 1, name: 'Admin Grace', email: 'admin@ucu.ac.ug', password: 'password123', role: 'admin' },
      { id: 2, name: 'Namusoke Ruth', email: 'namusoke@students.ucu.ac.ug', password: 'password123', role: 'student' },
      { id: 3, name: 'Okello James', email: 'okello@students.ucu.ac.ug', password: 'password123', role: 'student' },
    ],
    items: [
      { id: 1, reporter_id: 2, type: 'found', title: 'Set of keys', category: 'Keys', description: 'Keys with a blue keyring found under a chair after a lecture.', date: d(1), location: 'N5B lecture hall', private_details: 'Inscription "J.O." on the back of the keyring.', photo_url: '', status: 'open' },
      { id: 2, reporter_id: 3, type: 'lost', title: 'Black laptop charger', category: 'Laptop or charger', description: 'Black 65W charger with a white tape mark on the cable.', date: d(2), location: 'Hamu Mukasa Library', private_details: '', photo_url: '', status: 'open' },
      { id: 3, reporter_id: 3, type: 'found', title: 'Water bottle', category: 'Water bottle', description: 'Green steel water bottle with stickers.', date: d(4), location: 'Touch of Class Restaurant', private_details: 'Name "Kato" written under the lid.', photo_url: '', status: 'returned' },
    ],
    claims: [
      { id: 1, item_id: 3, claimant_id: 2, evidence: 'It is my bottle, my brother wrote Kato under the lid.', status: 'approved', admin_reason: 'Evidence matches the private details.', created_at: now() },
    ],
  };
}

const load = () => {
  try { const db = JSON.parse(localStorage.getItem(KEY)); if (db) return db; } catch { /* ignore */ }
  const db = seed(); localStorage.setItem(KEY, JSON.stringify(db)); return db;
};
const save = (db) => localStorage.setItem(KEY, JSON.stringify(db));

const me = (db) => {
  const id = Number((getToken() || '').replace('demo-', ''));
  return db.users.find((u) => u.id === id) || null;
};
const needUser = (db) => me(db) || fail('Please log in to continue.', 401);
const needAdmin = (db) => {
  const u = needUser(db);
  if (u.role !== 'admin') fail('Only the administrator can do this.', 403);
  return u;
};

// What the backend would send for an item. Private details only for owner/admin.
function shape(db, item, viewer) {
  const owner = viewer && viewer.id === item.reporter_id;
  const admin = viewer && viewer.role === 'admin';
  const out = { ...item, is_owner: Boolean(owner) };
  if (!(owner || admin)) delete out.private_details;
  delete out.reporter_id;
  if (viewer) {
    const c = db.claims.find((x) => x.item_id === item.id && x.claimant_id === viewer.id);
    if (c) out.my_claim = { id: c.id, status: c.status, evidence: c.evidence, admin_reason: c.admin_reason };
  }
  return out;
}

const readPhoto = (file) => new Promise((resolve) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.readAsDataURL(file);
});

function validateItem(f) {
  const e = {};
  if (!f.title || f.title.length < 3) e.title = 'Title must be at least 3 characters.';
  if (!f.category) e.category = 'Choose a category.';
  if (!f.description || f.description.length < 10) e.description = 'Description must be at least 10 characters.';
  if (!f.date) e.date = 'Choose a date.';
  if (!f.location) e.location = 'Choose a location.';
  if (f.type === 'found' && !f.private_details) e.private_details = 'Found items need private identifying details.';
  if (Object.keys(e).length) fail('Please correct the highlighted fields.', 400, e);
}

export const mockApi = {
  async register({ name, email, password }) {
    const db = load();
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      fail('That email is already registered.', 409, { email: 'This email is already registered. Log in instead.' });
    const user = { id: db.next++, name, email, password, role: 'student' };
    db.users.push(user); save(db);
    return wait({ token: `demo-${user.id}`, user: { id: user.id, name, role: user.role } });
  },
  async login({ email, password }) {
    const u = load().users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) fail('Email or password is incorrect. Check them and try again.', 401);
    return wait({ token: `demo-${u.id}`, user: { id: u.id, name: u.name, role: u.role } });
  },
  async logout() { return wait({ ok: true }); },

  async listItems(f) {
    const db = load();
    const q = (f.q || '').toLowerCase();
    const list = db.items.filter((i) =>
      (!q || [i.title, i.description, i.category, i.location].some((t) => t.toLowerCase().includes(q))) &&
      (!f.type || i.type === f.type) && (!f.category || i.category === f.category) &&
      (!f.location || i.location === f.location) && (!f.date || i.date === f.date) &&
      (!f.status || i.status === f.status));
    return wait(list.slice().reverse().map((i) => shape(db, i, null)));
  },
  async getItem(id) {
    const db = load();
    const item = db.items.find((i) => i.id === Number(id));
    if (!item) fail('This report does not exist.', 404);
    return wait(shape(db, item, me(db)));
  },
  async createItem(form) {
    const db = load(); const u = needUser(db);
    const f = Object.fromEntries(form.entries());
    validateItem(f);
    const photo = form.get('photo');
    const item = {
      id: db.next++, reporter_id: u.id, type: f.type, title: f.title, category: f.category,
      description: f.description, date: f.date, location: f.location,
      private_details: f.type === 'found' ? f.private_details : '',
      photo_url: photo && photo.size ? await readPhoto(photo) : '', status: 'open',
    };
    db.items.push(item); save(db);
    return wait({ id: item.id });
  },
  async updateItem(id, form) {
    const db = load(); const u = needUser(db);
    const item = db.items.find((i) => i.id === Number(id));
    if (!item) fail('This report does not exist.', 404);
    if (item.reporter_id !== u.id) fail('You can only edit your own reports.', 403);
    if (item.status === 'returned') fail('A returned item can no longer be edited.', 409);
    const f = Object.fromEntries(form.entries());
    validateItem({ ...f, type: item.type });
    Object.assign(item, { title: f.title, category: f.category, description: f.description, date: f.date, location: f.location });
    if (item.type === 'found') item.private_details = f.private_details;
    const photo = form.get('photo');
    if (photo && photo.size) item.photo_url = await readPhoto(photo);
    save(db);
    return wait({ id: item.id });
  },
  async myItems() {
    const db = load(); const u = needUser(db);
    return wait(db.items.filter((i) => i.reporter_id === u.id).map((i) => shape(db, i, u)));
  },

  async claimItem(id, evidence) {
    const db = load(); const u = needUser(db);
    const item = db.items.find((i) => i.id === Number(id));
    if (!item) fail('This report does not exist.', 404);
    if (item.type !== 'found') fail('Only found items can be claimed.', 400);
    if (item.reporter_id === u.id) fail('You cannot claim an item you reported as found.', 403);
    if (item.status === 'returned') fail('This item was already returned, so it cannot be claimed.', 409);
    if (db.claims.some((c) => c.item_id === item.id && c.claimant_id === u.id)) fail('You already claimed this item.', 409);
    const claim = { id: db.next++, item_id: item.id, claimant_id: u.id, evidence, status: 'pending', admin_reason: '', created_at: now() };
    db.claims.push(claim); save(db);
    return wait(claim);
  },
  async myClaims() {
    const db = load(); const u = needUser(db);
    return wait(db.claims.filter((c) => c.claimant_id === u.id).map((c) => ({
      id: c.id, item_id: c.item_id, item_title: db.items.find((i) => i.id === c.item_id)?.title,
      status: c.status, admin_reason: c.admin_reason, created_at: c.created_at,
    })));
  },

  async adminClaims() {
    const db = load(); needAdmin(db);
    return wait(db.claims.slice().reverse().map((c) => {
      const item = db.items.find((i) => i.id === c.item_id);
      return {
        id: c.id, item_id: c.item_id, item_title: item.title, item_status: item.status,
        item_private_details: item.private_details, claimant_name: db.users.find((x) => x.id === c.claimant_id).name,
        evidence: c.evidence, status: c.status, admin_reason: c.admin_reason, created_at: c.created_at,
      };
    }));
  },
  async decideClaim(id, { decision, reason }) {
    const db = load(); needAdmin(db);
    const claim = db.claims.find((c) => c.id === Number(id));
    if (!claim) fail('This claim does not exist.', 404);
    const item = db.items.find((i) => i.id === claim.item_id);
    if (claim.status !== 'pending') fail('This claim was already decided.', 409);
    if (!reason || reason.length < 5) fail('A reason is required.', 400);
    if (decision === 'approved') {
      if (item.status === 'returned') fail('This item was already returned.', 409);
      if (db.claims.some((c) => c.item_id === item.id && c.status === 'approved'))
        fail('Another claim for this item is already approved. Reject this one or confirm the return first.', 409);
    }
    claim.status = decision; claim.admin_reason = reason; save(db);
    return wait(claim);
  },
  async confirmReturn(itemId) {
    const db = load(); needAdmin(db);
    const item = db.items.find((i) => i.id === Number(itemId));
    if (!item) fail('This report does not exist.', 404);
    if (!db.claims.some((c) => c.item_id === item.id && c.status === 'approved'))
      fail('Approve a claim before confirming a return.', 409);
    item.status = 'returned'; save(db);
    return wait({ ok: true });
  },
};
