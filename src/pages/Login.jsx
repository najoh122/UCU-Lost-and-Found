import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import Field from '../components/Field.jsx';
import { Alert } from '../components/Feedback.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function switchMode(next) {
    setMode(next);
    setErrors({});
    setServerError('');
  }

  function validate() {
    const e = {};
    if (mode === 'register' && form.name.trim().length < 2)
      e.name = 'Enter your full name (at least 2 characters).';
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = 'Enter a valid email address, for example name@students.ucu.ac.ug.';
    if (form.password.length < 8)
      e.password = 'Use at least 8 characters for your password.';
    if (mode === 'register' && form.confirm !== form.password)
      e.confirm = 'The passwords do not match. Type the same password again.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      const user = mode === 'login'
        ? await login(form.email.trim(), form.password)
        : await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate(from || (user.role === 'admin' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      setServerError(err.message);
      setErrors(err.fieldErrors || {});
    } finally {
      setBusy(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <section className="panel narrow">
      <h1>{isLogin ? 'Log in' : 'Create your account'}</h1>
      <p className="lead">
        {isLogin
          ? 'Log in to report an item, claim one you lost, or follow your claims.'
          : 'Register with your student details to report and claim items.'}
      </p>

      {import.meta.env.VITE_USE_MOCK === 'true' && (
        <Alert type="info">
          Demo mode. Student: namusoke@students.ucu.ac.ug, administrator: admin@ucu.ac.ug,
          password for both: password123.
        </Alert>
      )}
      {serverError && <Alert type="error">{serverError}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        {!isLogin && (
          <Field id="name" label="Full name" error={errors.name}>
            <input type="text" autoComplete="name" value={form.name} onChange={set('name')} />
          </Field>
        )}
        <Field id="email" label="Email address" error={errors.email}>
          <input type="email" autoComplete="email" value={form.email} onChange={set('email')} />
        </Field>
        <Field id="password" label="Password"
          hint={isLogin ? undefined : 'At least 8 characters.'} error={errors.password}>
          <input type="password" autoComplete={isLogin ? 'current-password' : 'new-password'}
            value={form.password} onChange={set('password')} />
        </Field>
        {!isLogin && (
          <Field id="confirm" label="Confirm password" error={errors.confirm}>
            <input type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} />
          </Field>
        )}
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}
        </button>
      </form>

      <p className="switch">
        {isLogin ? 'New to UCU Lost & Found? ' : 'Already have an account? '}
        <button type="button" className="link-btn" onClick={() => switchMode(isLogin ? 'register' : 'login')}>
          {isLogin ? 'Create an account' : 'Log in instead'}
        </button>
      </p>
    </section>
  );
}
