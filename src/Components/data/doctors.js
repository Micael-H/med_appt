const doctors = [
  { id: 'maya-patel', name: 'Dr. Maya Patel', specialty: 'General Physician', experience: 12, rating: 4.9, reviews: 128, availableNow: true, initials: 'MP' },
  { id: 'james-wilson', name: 'Dr. James Wilson', specialty: 'Cardiologist', experience: 16, rating: 4.8, reviews: 96, availableNow: false, initials: 'JW' },
  { id: 'sofia-almeida', name: 'Dr. Sofia Almeida', specialty: 'Dermatologist', experience: 9, rating: 4.9, reviews: 84, availableNow: true, initials: 'SA' },
  { id: 'daniel-chen', name: 'Dr. Daniel Chen', specialty: 'Pediatrician', experience: 11, rating: 4.7, reviews: 105, availableNow: false, initials: 'DC' },
];

export function appointmentDates() {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  });
}

export function availableSlots(doctorId, date) {
  if (!appointmentDates().includes(date)) return [];
  const shift = (doctors.findIndex((doctor) => doctor.id === doctorId) + Number(date.slice(-2))) % 2;
  return shift ? ['09:30', '11:00', '14:30', '16:00'] : ['09:00', '10:30', '14:00', '15:30'];
}

export function formatAppointmentDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default doctors;
