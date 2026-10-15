// Adapted from IBM's AppointmentFormIC; the original controlled form is retained.
import { useId, useState } from 'react';

export default function AppointmentFormIC({ user, onSubmit }) {
  const [name, setName] = useState(user.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [error, setError] = useState('');
  const id = useId();
  function handleFormSubmit(event) {
    event.preventDefault();
    if (!name.trim() || phoneNumber.replace(/\D/g, '').length < 7) { setError('Enter a name and valid phone number.'); return; }
    onSubmit({ name: name.trim(), phoneNumber: phoneNumber.trim() });
  }
  return <form onSubmit={handleFormSubmit} className="booking-form"><div className="field"><label htmlFor={`${id}-name`}>Patient name</label><input id={`${id}-name`} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} /></div><div className="field"><label htmlFor={`${id}-phone`}>Phone number</label><input id={`${id}-phone`} type="tel" autoComplete="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} required minLength={7} maxLength={25} /></div>{error && <p role="alert" className="booking-error">{error}</p>}<button type="submit" className="button">Join demo queue</button></form>;
}
