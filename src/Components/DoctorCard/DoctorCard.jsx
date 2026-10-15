import AppointmentForm from '../AppointmentForm/AppointmentForm';
import { formatAppointmentDate } from '../data/doctors';

export default function DoctorCard({ doctor, user, appointments = [], isSelected, onSelect, onClose, onBook, onCancel, actionLabel = 'Book appointment' }) {
  const doctorAppointments = appointments.filter((item) => item.doctorId === doctor.id);
  return (
    <article className="booking-doctor booking-doctor-with-form">
      <div className="booking-doctor-summary">
      <div className="booking-avatar" aria-hidden="true">{doctor.initials}</div>
      <div className="booking-doctor-info"><p className="eyebrow">{doctor.specialty}</p><h2>{doctor.name}</h2><p>{doctor.experience} years of experience</p><p><span aria-label={`${doctor.rating} out of 5 stars`}>★ {doctor.rating}</span> · {doctor.reviews} sample reviews</p><span className="booking-badge">{doctor.availableNow ? 'Available for instant consultation' : 'Appointments available'}</span></div>
      <button className="button" type="button" onClick={() => onSelect(doctor)} aria-label={`${actionLabel} with ${doctor.name}`}>{actionLabel}</button>
      </div>
      {doctorAppointments.length > 0 && <div className="booking-card-appointments">{doctorAppointments.map((appointment) => <div className="booking-card-appointment" key={appointment.id}><p>Booked: {formatAppointmentDate(appointment.date)} · {appointment.time}</p><button className="button outline" type="button" onClick={() => onCancel(appointment)} aria-label={`Cancel appointment with ${doctor.name} on ${appointment.date} at ${appointment.time}`}>Cancel appointment</button></div>)}</div>}
      {isSelected && <AppointmentForm doctor={doctor} user={user} appointments={appointments} onBook={onBook} onClose={onClose} />}
    </article>
  );
}
