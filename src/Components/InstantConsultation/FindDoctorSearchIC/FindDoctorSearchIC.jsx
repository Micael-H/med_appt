// Adapted from IBM's FindDoctorSearchIC: catalogue, focus/blur and SPA routing.
import { useId, useState } from 'react';
import doctors from '../../data/doctors';

export default function FindDoctorSearchIC({ searchText, onSearch }) {
  const [doctorResultHidden, setDoctorResultHidden] = useState(true);
  const id = useId();
  const specialties = [...new Set(doctors.filter((doctor) => doctor.availableNow).map((doctor) => doctor.specialty))];
  return <div className="booking-search booking-ic-search" onFocus={() => setDoctorResultHidden(false)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDoctorResultHidden(true); }}>
    <div className="field"><label htmlFor={id}>Search doctor or specialty</label><input id={id} type="search" value={searchText} aria-describedby={`${id}-hint`} onChange={(event) => onSearch(event.target.value)} placeholder="General Physician" /><p id={`${id}-hint`} className="field-hint">Type a name or select a specialty below.</p></div>
    {!doctorResultHidden && <div className="booking-ic-suggestions" aria-label="Suggested specialties">{specialties.map((specialty) => <button className="button outline" type="button" key={specialty} onClick={() => { onSearch(specialty); setDoctorResultHidden(true); }}>{specialty}</button>)}</div>}
  </div>;
}
