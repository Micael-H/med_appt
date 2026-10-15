import { Link } from 'react-router-dom';
import './ReportsLayout.css';

export default function ReportsLayout({ user }) {
  if (!user?.token) return <section className="container reports-page"><h1>Reports</h1><p><Link to="/login">Log in</Link> to view reports.</p></section>;
  return <section className="container reports-page" aria-labelledby="reports-title">
    <p className="eyebrow">Patient resources</p><h1 id="reports-title">Your reports</h1>
    <p className="reports-intro">This academic demonstration includes a fictional sample report. It contains no real patient information.</p>
    <article className="report-card" aria-labelledby="sample-report-title">
      <div><span className="report-badge">Sample · PDF</span><h2 id="sample-report-title">Patient health report</h2><p>Fictional report supplied for the course demonstration.</p></div>
      <div className="report-actions"><a className="button button-primary" href="/patient_report.PDF" target="_blank" rel="noopener noreferrer">View report<span className="sr-only"> (opens in a new tab)</span></a><a className="button button-secondary" href="/patient_report.PDF" download="patient_report.PDF">Download report</a></div>
    </article>
  </section>;
}
