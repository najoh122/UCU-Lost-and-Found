import { useEffect, useState } from 'react';
import LostFoundScene from "../LostFoundScene";
import { api } from '../api.js';
import { CATEGORIES, LOCATIONS } from '../constants.js';
import ItemCard from '../components/ItemCard.jsx';
import { Loading, EmptyState, Alert } from '../components/Feedback.jsx';
import Hero from '../components/Hero.jsx';

const EMPTY_FILTERS = { q: '', type: '', category: '', location: '', date: '', status: '' };

export default function Home() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Re-fetch whenever a filter changes (after a short pause while typing).
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      api.listItems(filters)
        .then((data) => { if (!cancelled) setItems(data); })
        .catch((e) => { if (!cancelled) setError(e.message); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [filters]);

  const set = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <>
      <Hero />
      <LostFoundScene/>

      <section aria-labelledby="filters-title" className="panel">
        <h2 id="filters-title" className="sr-only">Search and filter</h2>
        <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
          <div className="field wide">
            <label htmlFor="q">Search by keyword</label>
            <input id="q" type="search" placeholder="For example: blue keyring" value={filters.q} onChange={set('q')} />
          </div>
          <div className="field">
            <label htmlFor="type">Report type</label>
            <select id="type" value={filters.type} onChange={set('type')}>
              <option value="">Lost and found</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={filters.category} onChange={set('category')}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="location">Campus location</label>
            <select id="location" value={filters.location} onChange={set('location')}>
              <option value="">All locations</option>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" value={filters.date} onChange={set('date')} />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" value={filters.status} onChange={set('status')}>
              <option value="">Open and returned</option>
              <option value="open">Still open</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          {hasFilters && (
            <button type="button" className="btn secondary" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear filters
            </button>
          )}
        </form>
      </section>

      <section aria-labelledby="results-title">
        <h2 id="results-title">
          {loading ? 'Searching…' : `${items.length} ${items.length === 1 ? 'report' : 'reports'}`}
        </h2>
        {error && <Alert type="error">{error} <button type="button" className="link-btn" onClick={() => setFilters({ ...filters })}>Try again</button></Alert>}
        {loading && <Loading label="Loading reports…" />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title={hasFilters ? 'No reports match your search' : 'No reports yet'}>
            <p>{hasFilters
              ? 'Try fewer filters or a different keyword.'
              : 'Be the first to report a lost or found item.'}</p>
          </EmptyState>
        )}
        {!loading && !error && items.length > 0 && (
          <ul className="grid">{items.map((item) => <ItemCard key={item.id} item={item} />)}</ul>
        )}
      </section>
    </>
  );
}
