import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { CATEGORIES, LOCATIONS } from '../constants.js';
import { todayISO, checkPhoto } from '../utils.js';
import Field from '../components/Field.jsx';
import { Alert, Loading } from '../components/Feedback.jsx';

const BLANK = {
  type: 'lost', title: '', category: '', description: '',
  date: todayISO(), location: '', private_details: '',
};

// One form used for both creating (/report) and editing (/report/:id/edit).
export default function ReportForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startType = searchParams.get('type') === 'found' ? 'found' : 'lost';

  const [form, setForm] = useState({ ...BLANK, type: startType });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);

  // Edit mode: load the existing report and fill the form.
  useEffect(() => {
    if (!editing) return;
    api.getItem(id)
      .then((item) => {
        if (!item.is_owner) throw new Error('You can only edit reports that you created.');
        setForm({
          type: item.type, title: item.title, category: item.category,
          description: item.description, date: item.date.slice(0, 10),
          location: item.location, private_details: item.private_details || '',
        });
        setPreview(item.photo_url || '');
      })
      .catch((e) => setServerError(e.message))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function handlePhoto(e) {
    const file = e.target.files[0];
    const problem = checkPhoto(file);
    setErrors((prev) => ({ ...prev, photo: problem }));
    if (problem) { e.target.value = ''; return; }
    setPhoto(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  }

  function validate() {
    const e = {};
    if (form.title.trim().length < 3) e.title = 'Enter a short title of at least 3 characters, for example "Set of keys".';
    if (!form.category) e.category = 'Choose the category that best fits the item.';
    if (form.description.trim().length < 10) e.description = 'Describe the item in at least 10 characters (colour, size, brand).';
    if (!form.date) e.date = 'Choose the date the item was lost or found.';
    else if (form.date > todayISO()) e.date = 'The date cannot be in the future. Choose today or an earlier date.';
    if (!form.location) e.location = 'Choose where on campus the item was lost or found.';
    if (form.type === 'found' && form.private_details.trim().length < 3)
      e.private_details = 'Add a detail only the owner would know, such as an inscription or a lock-screen picture.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const data = new FormData();
    ['type', 'title', 'category', 'description', 'date', 'location'].forEach((k) =>
      data.append(k, typeof form[k] === 'string' ? form[k].trim() : form[k]));
    if (form.type === 'found') data.append('private_details', form.private_details.trim());
    if (photo) data.append('photo', photo);

    setBusy(true);
    try {
      const saved = editing ? await api.updateItem(id, data) : await api.createItem(data);
      navigate(`/items/${saved.id || id}`, {
        state: { flash: editing ? 'Your report was updated.' : 'Your report was submitted.' },
      });
    } catch (err) {
      setServerError(err.message);
      setErrors({ ...err.fieldErrors });
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading label="Loading your report…" />;

  return (
    <section className="panel narrow">
      <h1>{editing ? 'Edit your report' : 'Report a lost or found item'}</h1>
      {serverError && <Alert type="error">{serverError}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="field">
          <legend>What are you reporting?</legend>
          <div className="radios">
            <label><input type="radio" name="type" value="lost" checked={form.type === 'lost'}
              onChange={set('type')} disabled={editing} /> I lost an item</label>
            <label><input type="radio" name="type" value="found" checked={form.type === 'found'}
              onChange={set('type')} disabled={editing} /> I found an item</label>
          </div>
        </fieldset>

        <Field id="title" label="Item title" error={errors.title}>
          <input type="text" maxLength={100} value={form.title} onChange={set('title')} />
        </Field>

        <Field id="category" label="Category" error={errors.category}>
          <select value={form.category} onChange={set('category')}>
            <option value="">Choose a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>

        <Field id="description" label="Public description" error={errors.description}
          hint="Everyone can read this. Do not include details that prove ownership.">
          <textarea rows={4} maxLength={500} value={form.description} onChange={set('description')} />
        </Field>

        <Field id="date" label={form.type === 'found' ? 'Date found' : 'Date lost'} error={errors.date}>
          <input type="date" max={todayISO()} value={form.date} onChange={set('date')} />
        </Field>

        <Field id="location" label="Campus location" error={errors.location}>
          <select value={form.location} onChange={set('location')}>
            <option value="">Choose a location</option>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>

        {form.type === 'found' && (
          <Field id="private_details" label="Private identifying details" error={errors.private_details}
            hint="Only you and the administrator can see this. Keep these details out of the public description and the photo.">
            <textarea rows={3} maxLength={500} value={form.private_details} onChange={set('private_details')} />
          </Field>
        )}

        <Field id="photo" label="Photo (optional)" error={errors.photo}
          hint="JPG, PNG or WebP, up to 3 MB. Do not show identifying marks in the photo.">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} />
        </Field>
        {preview && <img className="preview" src={preview} alt="Preview of the selected item" />}

        <div className="actions">
          <button className="btn primary" type="submit" disabled={busy}>
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Submit report'}
          </button>
          <button className="btn secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
