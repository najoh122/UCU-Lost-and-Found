export function Loading({ label = 'Loading…' }) {
  return <p className="loading" role="status">{label}</p>;
}

export function EmptyState({ title, children }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// type: 'error' | 'success' | 'info'
export function Alert({ type = 'info', children }) {
  return (
    <div className={`alert ${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
