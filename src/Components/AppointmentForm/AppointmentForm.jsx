import { useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentDates, availableSlots, formatAppointmentDate } from '../data/doctors';

function isFutureAppointment(date, time) {
  return new Date(`${date}T${time}`).getTime() > Date.now();
}

export default function AppointmentForm({ doctor, user, appointments = [], onBook, onClose }) {
  const [dates] = useState(() => appointmentDates());
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const slots = availableSlots(doctor.id, date);
  function submit(event) {
    event.preventDefault();
    if (!user?.id) return;
    if (!slots.includes(time) || !isFutureAppointment(date, time)) { setError('Choose a future available time.'); return; }
    const values = new FormData(event.currentTarget);
    const name = String(values.get('patientName')).trim();
    const phone = String(values.get('phone')).trim();
    if (!name || phone.replace(/\D/g, '').length < 7) { setError('Enter your name and a valid phone number.'); return; }
    const result = onBook({ doctorId: doctor.id, doctorName: doctor.name, specialty: doctor.specialty, date, time, patientName: name, phone });
    if (result) setError(result);
  }
  return (
    <section className="booking-panel" aria-labelledby="appointment-title">
      <div className="booking-panel-heading"><h2 id="appointment-title">Book with {doctor.name}</h2><button className="button outline" type="button" onClick={onClose}>Close</button></div>
      {!user?.id ? <p>Please <Link className="booking-text-link" to="/login">log in</Link> or <Link className="booking-text-link" to="/signup">sign up</Link> to book an appointment.</p> : <form onSubmit={submit} className="booking-form">
        <div className="field"><label htmlFor="patient-name">Patient name</label><input id="patient-name" name="patientName" autoComplete="name" defaultValue={user.name || ''} required maxLength={100} /></div>
        <div className="field"><label htmlFor="patient-phone">Phone number</label><input id="patient-phone" name="phone" type="tel" autoComplete="tel" defaultValue={user.phone || ''} required minLength={7} maxLength={25} /></div>
        <div className="field"><label htmlFor="appointment-date">Appointment date</label><select id="appointment-date" value={date} onChange={(event) => { setDate(event.target.value); setTime(''); setError(''); }}>{dates.map((day) => <option key={day} value={day}>{formatAppointmentDate(day)}</option>)}</select></div>
        <fieldset className="booking-times"><legend>Available times (your local time)</legend><div>{slots.map((slot) => { const occupied = appointments.some((item) => item.doctorId === doctor.id && item.date === date && item.time === slot); return <label className={`booking-slot ${occupied ? 'booking-slot-disabled' : ''}`} key={slot}><input type="radio" name="appointmentTime" value={slot} checked={time === slot} onChange={() => setTime(slot)} disabled={occupied} required />{slot}{occupied ? ' · booked' : ''}</label>; })}</div></fieldset>
        {error && <p role="alert" className="booking-error">{error}</p>}
        <button className="button" type="submit">Confirm appointment</button>
      </form>}
    </section>
  );
}
