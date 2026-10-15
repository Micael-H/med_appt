import { useState } from 'react';
import { readAppointments, storageKey } from '../../services/appointments';
import doctors, { formatAppointmentDate } from '../data/doctors';
import DoctorCard from '../DoctorCard/DoctorCard';
import FindDoctorSearch from '../FindDoctorSearch/FindDoctorSearch';
import './BookAppointment.css';


function BookingSession({ user }) {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selected, setSelected] = useState(null);
  const [appointments, setAppointments] = useState(() => readAppointments(user));
  const [message, setMessage] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const filtered = doctors.filter((doctor) => `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(query.trim().toLowerCase()) && (!specialty || doctor.specialty === specialty));
  function save(next) {
    try { sessionStorage.setItem(storageKey(user), JSON.stringify(next)); setAppointments(next); window.dispatchEvent(new Event('stayhealthy:appointments')); return true; }
    catch { setMessage('Your browser could not save this appointment. Allow session storage and try again.'); return false; }
  }
  function book(details) {
    if (!user?.id) return 'Please log in before booking.';
    const currentTime = Date.now();
    setNow(currentTime);
    if (new Date(`${details.date}T${details.time}`).getTime() <= currentTime) return 'Choose a future available time.';
    if (appointments.some((item) => item.date === details.date && item.time === details.time)) return 'You already have an appointment at this time. Choose another time.';
    if (!save([...appointments, { ...details, id: crypto.randomUUID() }])) return 'Unable to save this appointment.';
    setMessage(`Appointment confirmed with ${details.doctorName} on ${formatAppointmentDate(details.date)} at ${details.time}.`);
    setSelected(null);
    return '';
  }
  function cancel(item) {
    if (save(appointments.filter((appointment) => appointment.id !== item.id))) setMessage(`Appointment with ${item.doctorName} cancelled.`);
  }
  const upcoming = appointments.filter((item) => new Date(`${item.date}T${item.time}`).getTime() > now).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  return (
    <section id="main-content" className="container booking-page">
      <header className="booking-intro"><p className="eyebrow">CARE THAT FITS YOUR DAY</p><h1>Find your doctor.</h1><p>Explore our specialists and choose an appointment time that works for you.</p><p className="booking-demo">Course demonstration · fictional doctors and appointments stored only in this browser tab. No real consultation is booked.</p></header>
      <FindDoctorSearch query={query} specialty={specialty} onQueryChange={setQuery} onSpecialtyChange={setSpecialty} />
      <p className="booking-result-count" role="status">{filtered.length} {filtered.length === 1 ? 'doctor' : 'doctors'} found</p>
      <div className="booking-doctors">{filtered.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} user={user} appointments={upcoming} isSelected={selected?.id === doctor.id} onBook={book} onCancel={cancel} onClose={() => setSelected(null)} onSelect={(item) => { setSelected(item); setMessage(''); }} />)}</div>
      {!filtered.length && <p className="booking-panel">No doctors match your search. Try another name or specialty.</p>}
      <p className="booking-status" role="status">{message}</p>
      {user?.id && <section className="booking-appointments" aria-labelledby="my-appointments"><h2 id="my-appointments">My upcoming appointments</h2><p className="booking-demo">Keep this tab open to retain your demonstration bookings. To change a booking, cancel it and select a new slot.</p>{!upcoming.length ? <p>No upcoming appointments.</p> : <ul>{upcoming.map((item) => <li key={item.id}><div><h3>{item.doctorName}</h3><p>{formatAppointmentDate(item.date)} · {item.time} local time</p><p className="booking-reminder">Reminder: your appointment is {formatAppointmentDate(item.date)} at {item.time}.</p></div><button className="button outline" type="button" onClick={() => cancel(item)} aria-label={`Cancel appointment with ${item.doctorName} on ${item.date} at ${item.time}`}>Cancel appointment</button></li>)}</ul>}</section>}
    </section>
  );
}

export default function BookAppointment({ user }) {
  return <BookingSession key={user?.id || 'guest'} user={user} />;
}
