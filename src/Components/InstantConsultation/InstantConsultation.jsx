// Adapted from IBM's InstantConsultationBooking lab. See SOURCE.md.
import { useSearchParams } from 'react-router-dom';
import doctors from '../data/doctors';
import FindDoctorSearchIC from './FindDoctorSearchIC/FindDoctorSearchIC';
import DoctorCardIC from './DoctorCardIC/DoctorCardIC';
import '../BookAppointment/BookAppointment.css';
import './InstantConsultation.css';

export default function InstantConsultation({ user }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get('speciality') || '';
  const filteredDoctors = doctors.filter((doctor) => doctor.availableNow && `${doctor.specialty} ${doctor.name}`.toLowerCase().includes(searchText.trim().toLowerCase()));
  function handleSearch(value) {
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set('speciality', value); else next.delete('speciality');
    setSearchParams(next, { replace: true });
  }
  return <section id="main-content" className="container booking-page"><header className="booking-intro"><p className="eyebrow">WITHOUT AN APPOINTMENT</p><h1>Instant consultation</h1><p>Find a doctor and explore the consultation flow.</p><p className="booking-demo">Academic simulation: fictional availability, no live doctor or real medical service. Queue details are kept only while this page is open.</p></header><FindDoctorSearchIC searchText={searchText} onSearch={handleSearch} /><p className="booking-result-count" role="status">{filteredDoctors.length} doctors available in this demonstration</p><div className="booking-doctors">{filteredDoctors.map((doctor) => <DoctorCardIC key={`${user?.id || 'guest'}-${doctor.id}`} doctor={doctor} user={user} />)}</div>{!filteredDoctors.length && <p>No doctors found. Try a different name or specialty.</p>}</section>;
}
