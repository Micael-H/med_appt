import doctors from '../Components/data/doctors';

export function storageKey(user) { return `stayhealthy.appointments.${user?.id || 'guest'}`; }
export function readAppointments(user) {
  if (!user?.id) return [];
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey(user)) || '[]');
    return Array.isArray(saved) ? saved.filter((item) => item && typeof item.id === 'string' && typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && typeof item.time === 'string' && /^\d{2}:\d{2}$/.test(item.time) && doctors.some((doctor) => doctor.id === item.doctorId)) : [];
  } catch { return []; }
}

