import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import './GiveReviews.css';

function keyFor(user) { return `stayhealthy.reviews.${user.id}`; }
function readReviews(user) {
  if (!user?.id) return [];
  try {
    const value = JSON.parse(sessionStorage.getItem(keyFor(user)) || '[]');
    return Array.isArray(value) ? value.filter((review) => review && typeof review.appointmentId === 'string' && typeof review.name === 'string' && typeof review.comments === 'string' && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5) : [];
  } catch { return []; }
}
function consultationDate(appointment) {
  const parsed = new Date(`${appointment.date}T${appointment.time || '12:00'}`);
  return Number.isNaN(parsed.getTime()) ? 'Date unavailable' : parsed.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function ReviewsSession({ user, appointments }) {
  const [reviews, setReviews] = useState(() => readReviews(user));
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const consultations = appointments.filter((appointment) => appointment && typeof appointment.id === 'string');
  function submitReview(appointment, details) {
    if (!user?.id) return 'Please log in to submit a review.';
    if (reviews.some((review) => review.appointmentId === appointment.id)) return 'A review has already been submitted for this consultation.';
    const next = [...reviews, { ...details, appointmentId: appointment.id }];
    try { sessionStorage.setItem(keyFor(user), JSON.stringify(next)); }
    catch { return 'Your browser could not save the review. Allow session storage and try again.'; }
    setReviews(next);
    setSelected(null);
    setMessage(`Your review of ${appointment.doctorName} was submitted.`);
    return '';
  }
  return <section className="container reviews-page" aria-labelledby="reviews-title"><header className="reviews-intro"><p className="eyebrow">YOUR EXPERIENCE MATTERS</p><h1 id="reviews-title">Consultation reviews</h1><p>Share feedback on communication and your consultation experience.</p><p className="reviews-note">Course demonstration. Reviews relate to your demonstration bookings and remain in this browser tab. They are not published as real patient feedback.</p></header>
    {!user?.id ? <p>Please <Link className="reviews-link" to="/login">log in</Link> to view your consultations and give feedback.</p> : !consultations.length ? <div className="reviews-empty"><h2>No consultations to review</h2><p>Your bookings will appear here.</p><Link className="button" to="/appointments">Find a doctor</Link></div> : <div className="reviews-list">{consultations.map((appointment) => {
      const review = reviews.find((item) => item.appointmentId === appointment.id);
      return <article className="review-consultation" key={appointment.id}><div className="review-row"><div><h2>{appointment.doctorName}</h2><p>{appointment.specialty}</p><p>{consultationDate(appointment)} · local time</p></div><button className="button" type="button" disabled={Boolean(review)} onClick={() => { setSelected(appointment.id); setMessage(''); }} aria-label={`${review ? 'Review submitted for' : 'Give review for'} ${appointment.doctorName} on ${appointment.date}`}>{review ? 'Review submitted' : 'Give review'}</button></div>
        {selected === appointment.id && !review && <ReviewForm user={user} doctorName={appointment.doctorName} onSubmit={(details) => submitReview(appointment, details)} onCancel={() => setSelected(null)} />}
        {review && <div className="review-submitted"><p><strong>{review.rating} out of 5 stars</strong> · {review.name}</p><p className="review-comment">{review.comments}</p></div>}
      </article>;
    })}</div>}
    <p className="reviews-status" role="status">{message}</p>
  </section>;
}

export default function GiveReviews({ user, appointments = [] }) {
  return <ReviewsSession key={user?.id || 'guest'} user={user} appointments={Array.isArray(appointments) ? appointments : []} />;
}

export function ReviewForm({ user, doctorName, onSubmit, onCancel }) {
  const id = useId();
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get('name') || '').trim();
    const comments = String(values.get('comments') || '').trim();
    const rating = Number(values.get('rating'));
    if (!name || !comments || !Number.isInteger(rating) || rating < 1 || rating > 5) { setError('Enter your name, a comment and a rating from 1 to 5.'); return; }
    const result = onSubmit({ name, comments, rating });
    if (result) setError(result);
  }
  return <form className="review-form" onSubmit={submit} aria-label={`Review ${doctorName}`}>
    <div className="field"><label htmlFor={`${id}-name`}>Your name</label><input id={`${id}-name`} name="name" autoComplete="name" defaultValue={user?.name || ''} maxLength={100} required /></div>
    <fieldset className="review-rating"><legend>Consultation rating</legend><div>{[1, 2, 3, 4, 5].map((rating) => <label key={rating}><input type="radio" name="rating" value={rating} required /><span aria-hidden="true">{'★'.repeat(rating)}</span><span>{rating} {rating === 1 ? 'star' : 'stars'}</span></label>)}</div></fieldset>
    <div className="field"><label htmlFor={`${id}-comments`}>Review comments</label><textarea id={`${id}-comments`} name="comments" required maxLength={1000} rows={4} aria-describedby={`${id}-hint`} /><p className="field-hint" id={`${id}-hint`}>Describe communication and your experience. Avoid personal medical information. Maximum 1,000 characters.</p></div>
    {error && <p className="review-error" role="alert">{error}</p>}
    <div className="review-actions"><button className="button" type="submit">Submit review</button><button className="button outline" type="button" onClick={onCancel}>Cancel</button></div>
  </form>;
}
