export const todayISO = () => new Date().toISOString().slice(0, 10);

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

export function checkPhoto(file) {
  if (!file) return '';
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) return 'Choose a JPG, PNG or WebP image.';
  if (file.size > MAX_PHOTO_BYTES) return 'The photo is larger than 3 MB. Choose a smaller image.';
  return '';
}
