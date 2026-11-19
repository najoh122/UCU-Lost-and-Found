import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import ItemCard from '../components/ItemCard.jsx';
import { Loading, EmptyState, Alert } from '../components/Feedback.jsx';
import { formatDate } from '../utils.js';

export default function MyActivity() {
  const [items, setItems] = useState(null);
  const [claims, setClaims] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.myItems(), api.myClaims()])
      .then(([i, c]) => { setItems(i); setClaims(c); })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!items || !claims) return <Loading label="Loading your activity…" />;

  return (
    <>
      <h1>My activity</h1>

      <section aria-labelledby="my-reports">
        <h2 id="my-reports">My reports</h2>
        {items.length === 0 ? (
          <EmptyState title="You have not reported anything yet">
            <Link className="btn primary" to="/report">Report an item</Link>
          </EmptyState>
        ) : (
          <ul className="grid">{items.map((i) => <ItemCard key={i.id} item={i} />)}</ul>
        )}
      </section>

      <section aria-labelledby="my-claims">
        <h2 id="my-claims">My claims</h2>
        {claims.length === 0 ? (
          <EmptyState title="You have not made any claims">
            <p>Find your item in the <Link to="/">listings</Link> and send a claim.</p>
          </EmptyState>
        ) : (
          <ul className="list">
            {claims.map((c) => (
              <li key={c.id} className="panel">
                <h3><Link to={`/items/${c.item_id}`}>{c.item_title}</Link></h3>
                <StatusBadge kind={c.status} />
                <p className="meta">Sent on {formatDate(c.created_at)}</p>
                {c.admin_reason && <p><strong>Administrator's response:</strong> {c.admin_reason}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
