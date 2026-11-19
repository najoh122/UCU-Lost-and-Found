import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Field from '../components/Field.jsx';
import { Alert, Loading, EmptyState } from '../components/Feedback.jsx';
import { formatDate } from '../utils.js';

function ClaimCard({ claim, onChanged }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function decide(decision) {
    if (reason.trim().length < 5) {
      setError('Write a reason of at least 5 characters before you approve or reject.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await api.decideClaim(claim.id, { decision, reason: reason.trim() });
      onChanged(`Claim ${decision}.`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function confirmReturn() {
    if (!window.confirm('Confirm that the owner has collected this item? This closes the listing.')) return;
    setBusy(true);
    setError('');
    try {
      await api.confirmReturn(claim.item_id);
      onChanged('Item marked as returned.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="panel claim">
      <div className="claim-head">
        <h3><Link to={`/items/${claim.item_id}`}>{claim.item_title}</Link></h3>
        <StatusBadge kind={claim.status} />
        {claim.item_status === 'returned' && <StatusBadge kind="returned" />}
      </div>
      <p className="meta">Claimed by {claim.claimant_name} on {formatDate(claim.created_at)}</p>

      <div className="compare">
        <div>
          <h4>Claimant's evidence</h4>
          <p>{claim.evidence}</p>
        </div>
        <div>
          <h4>Finder's private details</h4>
          <p>{claim.item_private_details || 'None recorded.'}</p>
        </div>
      </div>

      {claim.admin_reason && <p><strong>Decision reason:</strong> {claim.admin_reason}</p>}
      {error && <Alert type="error">{error}</Alert>}

      {claim.status === 'pending' && (
        <>
          <Field id={`reason-${claim.id}`} label="Reason for your decision"
            hint="The claimant will see this.">
            <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
          <div className="actions">
            <button type="button" className="btn primary" disabled={busy} onClick={() => decide('approved')}>Approve claim</button>
            <button type="button" className="btn danger" disabled={busy} onClick={() => decide('rejected')}>Reject claim</button>
          </div>
        </>
      )}

      {claim.status === 'approved' && claim.item_status === 'open' && (
        <div className="actions">
          <button type="button" className="btn primary" disabled={busy} onClick={confirmReturn}>
            Confirm item collected
          </button>
        </div>
      )}
    </li>
  );
}

export default function Admin() {
  const [claims, setClaims] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('pending');

  const load = useCallback(() => {
    setError('');
    return api.adminClaims().then(setClaims).catch((e) => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChanged = (msg) => { setMessage(msg); load(); };

  if (error) return <Alert type="error">{error}</Alert>;
  if (!claims) return <Loading label="Loading claims…" />;

  const shown = claims.filter((c) => !filter || c.status === filter);
  const pendingCount = claims.filter((c) => c.status === 'pending').length;

  return (
    <>
      <h1>Review claims</h1>
      <p className="lead">{pendingCount} {pendingCount === 1 ? 'claim is' : 'claims are'} waiting for your review.</p>
      {message && <Alert type="success">{message}</Alert>}

      <div className="field narrow-field">
        <label htmlFor="filter">Show claims</label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Waiting for review</option>
          <option value="approved">Approved for collection</option>
          <option value="rejected">Rejected</option>
          <option value="">All claims</option>
        </select>
      </div>

      {shown.length === 0 ? (
        <EmptyState title="No claims here">
          <p>There are no claims with this status right now.</p>
        </EmptyState>
      ) : (
        <ul className="list">
          {shown.map((c) => <ClaimCard key={c.id} claim={c} onChanged={handleChanged} />)}
        </ul>
      )}
    </>
  );
}
