import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Field from '../components/Field.jsx';
import { Alert, Loading } from '../components/Feedback.jsx';
import { formatDate } from '../utils.js';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();

  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState(location.state?.flash || '');
  const [evidence, setEvidence] = useState('');
  const [evidenceError, setEvidenceError] = useState('');
  const [claimError, setClaimError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setError('');
    return api.getItem(id).then(setItem).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function submitClaim(ev) {
    ev.preventDefault();
    setClaimError('');
    if (evidence.trim().length < 15) {
      setEvidenceError('Explain in at least 15 characters why this is yours, for example describe an inscription or marking.');
      return;
    }
    setEvidenceError('');
    setBusy(true);
    try {
      await api.claimItem(id, evidence.trim());
      setFlash('Your claim was sent. The administrator will review it.');
      setEvidence('');
      await load();
    } catch (err) {
      setClaimError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error) return <Alert type="error">{error}</Alert>;
  if (!item) return <Loading label="Loading report…" />;

  const isOwner = item.is_owner;
  const claim = item.my_claim;
  const canClaim = user?.role === 'student' && item.type === 'found'
    && item.status === 'open' && !isOwner && !claim;

  return (
    <article className="panel detail">
      {flash && <Alert type="success">{flash}</Alert>}

      <div className="detail-grid">
        {item.photo_url
          ? <img src={item.photo_url} alt={`Photo of ${item.title}`} />
          : <div className="no-photo big" aria-hidden="true">No photo</div>}
        <div>
          <div className="badges">
            <StatusBadge kind={item.type} />
            <StatusBadge kind={item.status} />
          </div>
          <h1>{item.title}</h1>
          <dl>
            <dt>Category</dt><dd>{item.category}</dd>
            <dt>Campus location</dt><dd>{item.location}</dd>
            <dt>{item.type === 'found' ? 'Date found' : 'Date lost'}</dt><dd>{formatDate(item.date)}</dd>
            <dt>Description</dt><dd>{item.description}</dd>
          </dl>

          {isOwner && (
            <>
              {item.private_details && (
                <div className="private-box">
                  <h2>Private details (only you and the administrator)</h2>
                  <p>{item.private_details}</p>
                </div>
              )}
              {item.status === 'open' && (
                <Link className="btn secondary" to={`/report/${item.id}/edit`}>Edit this report</Link>
              )}
            </>
          )}
        </div>
      </div>

      {item.status === 'returned' && (
        <Alert type="info">This item has been returned to its owner, so no more claims can be made.</Alert>
      )}

      {item.type === 'lost' && item.status === 'open' && !isOwner && (
        <Alert type="info">
          Did you find this item? <Link to="/report">Report it as found</Link> so the owner can claim it.
        </Alert>
      )}

      {claim && (
        <section className="claim-status" aria-labelledby="my-claim">
          <h2 id="my-claim">Your claim</h2>
          <StatusBadge kind={claim.status} />
          <p><strong>What you wrote:</strong> {claim.evidence}</p>
          {claim.admin_reason && <p><strong>Administrator's response:</strong> {claim.admin_reason}</p>}
          {claim.status === 'approved' && item.status === 'open' && (
            <p>Your claim is approved. Collect the item from the administrator. The listing is marked as returned after you collect it.</p>
          )}
        </section>
      )}

      {!user && item.type === 'found' && item.status === 'open' && (
        <p><Link to="/login" state={{ from: `/items/${item.id}` }}>Log in</Link> to claim this item.</p>
      )}

      {canClaim && (
        <section aria-labelledby="claim-title">
          <h2 id="claim-title">Is this yours?</h2>
          {claimError && <Alert type="error">{claimError}</Alert>}
          <form onSubmit={submitClaim} noValidate>
            <Field id="evidence" label="Why do you believe this item is yours?" error={evidenceError}
              hint="Only you and the administrator can read this. Describe something only the owner would know.">
              <textarea rows={4} maxLength={1000} value={evidence} onChange={(e) => setEvidence(e.target.value)} />
            </Field>
            <button className="btn primary" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send claim'}
            </button>
          </form>
        </section>
      )}
    </article>
  );
}
