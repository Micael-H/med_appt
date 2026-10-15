import { useState } from 'react';
import doctors from '../data/doctors';

export default function FindDoctorSearch({ query, specialty, onQueryChange, onSpecialtyChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))];
  const suggestions = specialties.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <form className="booking-search" role="search" onSubmit={(event) => event.preventDefault()}>
      <div className="booking-search-suggestions" onFocus={() => setShowSuggestions(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setShowSuggestions(false); }}>
        <div className="field"><label htmlFor="doctor-search">Search by doctor name or specialty</label><input id="doctor-search" type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Try Maya Patel or Dermatologist" aria-describedby="doctor-search-hint" onKeyDown={(event) => { if (event.key === 'Escape') setShowSuggestions(false); }} /><p id="doctor-search-hint" className="field-hint">Type to filter doctors, or use Tab to choose a suggested specialty.</p></div>
        {showSuggestions && suggestions.length > 0 && <div className="booking-specialty-suggestions" aria-label="Suggested specialties">{suggestions.map((item) => <button className="button outline" type="button" key={item} onClick={() => { onSpecialtyChange(item); onQueryChange(''); setShowSuggestions(false); }}>{item}</button>)}</div>}
      </div>
      <div className="field"><label htmlFor="doctor-specialty">Specialty</label><select id="doctor-specialty" value={specialty} onChange={(event) => onSpecialtyChange(event.target.value)}><option value="">All specialties</option>{specialties.map((item) => <option key={item}>{item}</option>)}</select></div>
    </form>
  );
}
