const LABELS = {
  lost: 'Lost', found: 'Found', open: 'Still open', returned: 'Returned',
  pending: 'Waiting for review', approved: 'Approved for collection', rejected: 'Rejected',
};

// The text is always shown, so meaning never depends on colour alone.
export default function StatusBadge({ kind }) {
  return <span className={`badge ${kind}`}>{LABELS[kind] || kind}</span>;
}
