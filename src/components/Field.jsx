import { cloneElement } from 'react';

// A label + input + hint + error message, wired together for screen readers.
export default function Field({ id, label, hint, error, children }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ');
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      {cloneElement(children, {
        id,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': describedBy || undefined,
      })}
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}
