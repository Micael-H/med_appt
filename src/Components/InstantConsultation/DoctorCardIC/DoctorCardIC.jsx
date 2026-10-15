// Adapted from IBM's DoctorCardIC: Popup + form + UUID booking/cancellation state.
import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { v4 as uuidv4 } from 'uuid';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';

export default function DoctorCardIC({ doctor, user }) {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const titleId = useId();
  function handleFormSubmit(details) {
    if (!user?.id || appointments.length) return;
    setAppointments([{ ...details, id: uuidv4() }]);
  }
  function handleCancel(appointmentId) {
    setAppointments((previous) => previous.filter((appointment) => appointment.id !== appointmentId));
    setShowModal(false);
  }
  return <article className="booking-doctor">
    <div className="booking-avatar" aria-hidden="true">{doctor.initials}</div>
    <div className="booking-doctor-info"><p className="eyebrow">{doctor.specialty}</p><h2>{doctor.name}</h2><p>{doctor.experience} years of experience</p><p>★ {doctor.rating} out of 5 · {doctor.reviews} sample reviews</p><span className="booking-badge">Available now · demonstration</span></div>
    <button type="button" className="button" onClick={() => setShowModal(true)}>{appointments.length ? 'View / cancel demo booking' : 'Consult now'}</button>
    <Popup modal nested open={showModal} onClose={() => setShowModal(false)} closeOnDocumentClick={false} className="booking-ic-popup" contentStyle={{ width: 'min(92vw, 560px)', maxHeight: '88vh', overflowY: 'auto', borderRadius: '16px', padding: '24px', background: '#fff' }} overlayStyle={{ background: '#123f357a' }}>
      <section role="dialog" aria-modal="true" className="booking-ic-dialog" aria-labelledby={titleId}><div className="booking-panel-heading"><h2 id={titleId}>{doctor.name}</h2><button className="button outline" type="button" onClick={() => setShowModal(false)}>Close</button></div><p>{doctor.specialty}</p><p className="booking-demo">Course simulation only. No doctor will connect.</p>{!user?.id ? <p>Please <Link className="booking-text-link" to="/login">log in</Link> to join the demo queue.</p> : appointments.length ? <div role="status"><h3>Demo booking confirmed</h3>{appointments.map((appointment) => <div key={appointment.id}><p>Patient: {appointment.name}</p><p>Queue reference: {appointment.id.slice(0, 8)}</p><button className="button outline" type="button" onClick={() => handleCancel(appointment.id)}>Cancel demo booking</button></div>)}</div> : <AppointmentFormIC user={user} onSubmit={handleFormSubmit} />}</section>
    </Popup>
  </article>;
}
