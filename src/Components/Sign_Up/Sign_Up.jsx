import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authenticateAccount } from '../../services/auth.js';
import './Sign_Up.css';


export default function Signup({ onAuthenticated }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // IBM conversion lab, exercises 2–3: controlled fields and 10-digit phone.
  const [fields, setFields] = useState({ name: '', email: '', phone: '', password: '' });
  function resetForm() {
    setFields({ name: '', email: '', phone: '', password: '' });
    setError('');
  }
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    delete values.role;
    values.name = values.name.trim();
    values.email = values.email.trim();
    values.phone = values.phone.trim();
    if (values.name.length < 4 || !/^\d{10}$/.test(values.phone)) {
      setError('Enter a name with at least 4 characters and a phone number with exactly 10 digits.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const user = await authenticateAccount('register', values);
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
    <section className="container auth-layout" id="main-content">
      <section className="auth-copy">
        <p className="eyebrow">Care starts here</p>
        <h1>Your health.<br />Your time.</h1>
        <p>Create your StayHealthy account to find a doctor and manage your care in one place.</p>
        <ul className="benefits"><li>Find the right doctor</li><li>Choose a convenient appointment</li><li>Manage your patient profile</li></ul>
      </section>
      <section className="form-card" aria-labelledby="signup-title">
        <h2 id="signup-title">Create an account</h2>
        <p className="form-intro">Already a member? <Link to="/login">Log in</Link></p>
        <form onSubmit={submit} onReset={resetForm} aria-busy={busy}>
          <fieldset className="static-fields" disabled={busy}>
            <legend className="sr-only">Patient registration</legend>
            <div className="form-grid">
              <div className="field"><label htmlFor="signup-role">Role</label><select id="signup-role" name="role" aria-describedby="role-hint"><option value="patient">Patient</option></select><p className="field-hint" id="role-hint">Online registration is available for patients.</p></div>
              <div className="field"><label htmlFor="signup-name">Name</label><input id="signup-name" name="name" value={fields.name} onChange={event => setFields(previous => ({ ...previous, name: event.target.value }))} autoComplete="name" minLength={4} maxLength={120} required placeholder="Your full name" /></div>
              <div className="field"><label htmlFor="signup-phone">Phone Number</label><input id="signup-phone" name="phone" value={fields.phone} onChange={event => setFields(previous => ({ ...previous, phone: event.target.value }))} type="tel" autoComplete="tel" minLength={10} maxLength={10} pattern="[0-9]{10}" title="Enter exactly 10 digits" required placeholder="Your phone number" /></div>
              <div className="field"><label htmlFor="signup-email">Email</label><input id="signup-email" name="email" value={fields.email} onChange={event => setFields(previous => ({ ...previous, email: event.target.value }))} type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" /></div>
              <div className="field"><label htmlFor="signup-password">Password</label><input id="signup-password" name="password" value={fields.password} onChange={event => setFields(previous => ({ ...previous, password: event.target.value }))} type="password" autoComplete="new-password" minLength={8} maxLength={72} required aria-describedby="password-hint" /><p className="field-hint" id="password-hint">Use 8–72 characters.</p></div>
            </div>
            <div className="form-actions"><button className="button button-primary" type="submit">{busy ? 'Creating account…' : 'Sign Up'}</button><button className="button button-secondary" type="reset">Reset</button></div>
          </fieldset>
          {error && <p className="form-status" role="alert">{error}</p>}
        </form>
      </section>
    </section>
  );
}
