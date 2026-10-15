import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authenticateAccount } from '../../services/auth.js';
import './Login.css';

export default function Login({ onAuthenticated }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // IBM conversion lab, exercise 4: capture credentials and return Home on success.
  const [fields, setFields] = useState({ email: '', password: '' });
  function resetForm() {
    setFields({ email: '', password: '' });
    setError('');
  }
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    values.email = values.email.trim();
    setBusy(true);
    setError('');
    try {
      const user = await authenticateAccount('login', values);
      form.reset();
      onAuthenticated(user);
      navigate('/');
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="container auth-layout login-layout" id="main-content">
      <section className="auth-copy"><p className="eyebrow">Welcome back</p><h1>Good to see<br />you again.</h1><p>Log in to book appointments and keep your patient profile up to date.</p><ul className="benefits"><li>Care that fits your schedule</li><li>Your appointments in one place</li></ul></section>
      <section className="form-card" aria-labelledby="login-title">
        <h2 id="login-title">Log in</h2>
        <p className="form-intro">New to StayHealthy? <Link to="/signup">Create an account</Link></p>
        <form onSubmit={submit} onReset={resetForm} aria-busy={busy}>
          <fieldset className="static-fields" disabled={busy}>
            <legend className="sr-only">Log in to your account</legend>
            <div className="form-grid">
              <div className="field"><label htmlFor="login-email">Email</label><input id="login-email" name="email" value={fields.email} onChange={event => setFields(previous => ({ ...previous, email: event.target.value }))} type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></div>
              <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" name="password" value={fields.password} onChange={event => setFields(previous => ({ ...previous, password: event.target.value }))} type="password" autoComplete="current-password" required maxLength={72} /></div>
            </div>
            <div className="form-actions"><button className="button button-primary" type="submit">{busy ? 'Logging in…' : 'Login'}</button><button className="button button-secondary" type="reset">Reset</button></div>
          </fieldset>
          {error && <p className="form-status" role="alert">{error}</p>}
        </form>
      </section>
    </section>
  );
}
