import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config.js';
import './ProfileCard.css';

export default function ProfileCard({ user, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  function cancel() {
    setName(user.name);
    setPhone(user.phone);
    setError('');
    setEditing(false);
  }
  function edit() {
    setName(user.name);
    setPhone(user.phone);
    setMessage('');
    setEditing(true);
  }
  async function save(event) {
    event.preventDefault();
    const nextName = name.trim();
    const nextPhone = phone.trim();
    if (nextName.length < 4 || !/^\d{10}$/.test(nextPhone)) {
      setError('Enter a name with at least 4 characters and a phone number with exactly 10 digits.');
      return;
    }
    setBusy(true);
    setError('');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'auth-token': user.token },
        body: JSON.stringify({ name: nextName, phone: nextPhone }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || (response.status === 401 ? 'Your session expired. Please log in again.' : 'Unable to update your profile. Please try again.'));
      if (!result.authtoken) throw new Error('The server did not return an updated session. Please log in again.');
      onUpdated({ ...user, name: nextName, phone: nextPhone, token: result.authtoken });
      setEditing(false);
      setMessage('Your profile has been updated.');
    } catch (failure) {
      setError(failure.name === 'AbortError' ? 'The request timed out. Please try again.' : failure instanceof TypeError ? 'Unable to connect. Please check your connection.' : failure.message);
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }
  if (!user?.token) return <section className="container profile-page"><h1>Your profile</h1><p><Link to="/login">Log in</Link> to view your profile.</p></section>;
  return (
    <section className="container profile-page" aria-labelledby="profile-title">
      <p className="eyebrow">Your account</p><h1 id="profile-title">Your profile</h1>
      <div className="form-card profile-card">
        {editing ? <form onSubmit={save} aria-busy={busy}>
          <fieldset className="static-fields" disabled={busy}>
            <legend className="sr-only">Edit patient profile</legend>
            <div className="form-grid">
              <div className="field"><label htmlFor="profile-name">Name</label><input id="profile-name" value={name} onChange={event => setName(event.target.value)} autoComplete="name" required minLength={4} maxLength={120} /></div>
              <div className="field"><label htmlFor="profile-phone">Phone Number</label><input id="profile-phone" type="tel" value={phone} onChange={event => setPhone(event.target.value)} autoComplete="tel" required minLength={10} maxLength={10} pattern="[0-9]{10}" title="Enter exactly 10 digits" /></div>
              <div className="field"><label htmlFor="profile-email">Email</label><input id="profile-email" type="email" value={user.email} readOnly aria-describedby="profile-email-hint" /><p className="field-hint" id="profile-email-hint">Your account email cannot be changed here.</p></div>
            </div>
            <div className="form-actions"><button className="button button-primary" type="submit">{busy ? 'Saving…' : 'Save'}</button><button className="button button-secondary" type="button" onClick={cancel}>Cancel</button></div>
          </fieldset>
        </form> : <><dl className="profile-details"><div><dt>Name</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Phone Number</dt><dd>{user.phone}</dd></div><div><dt>Role</dt><dd>Patient</dd></div></dl><button className="button button-primary" onClick={edit}>Edit Profile</button></>}
        {error && <p className="form-status" role="alert">{error}</p>}
        {message && <p className="form-status" role="status">{message}</p>}
      </div>
    </section>
  );
}
