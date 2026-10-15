import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatAppointmentDate } from '../data/doctors';
import './Notification.css';

// Mounted above Routes in App: bookings and cancellations refresh this shared card.
export default function Notification({ user, appointments = [] }) {
  const [now] = useState(() => Date.now());
  if (!user?.id) return null;
  const next = appointments.filter(item => new Date(`${item.date}T${item.time}`).getTime() > now)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  if (!next) return null;
  return <aside className="appointment-notification" aria-label="Appointment notification" role="status"><div className="container notification-content"><span><strong>Upcoming appointment</strong> · {next.doctorName} · {formatAppointmentDate(next.date)} at {next.time} (local time)</span><Link to="/appointments">Manage appointment</Link></div></aside>;
}
