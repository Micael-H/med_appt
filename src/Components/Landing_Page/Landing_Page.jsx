import { Link } from 'react-router-dom'
import './LandingPage.css'
export default function LandingPage() {
  return <><section className="hero-section container"><div className="hero-copy">
    <span className="eyebrow">CARE WITHOUT DISTANCE</span><h1>Your health.<br />Our <span>responsibility.</span></h1>
    <p>Find the right doctor, choose a time that fits your day and make room for care, wherever you are.</p>
    <div className="hero-actions"><Link className="button" to="/appointments">Find a doctor →</Link><Link className="button outline" to="/instant-consultation">Consult now</Link></div>
    <p className="hero-caption">A StayHealthy Inc. initiative.<br />More access. More care. More possibilities.</p></div>
    <div className="hero-art" aria-hidden="true"><div className="cross">✚</div><span>Care that brings us closer.</span><div className="art-note">✓ You come first.</div></div></section>
    <section className="home-benefits container" aria-label="How it works"><article><span>01</span><h2>Find your specialist</h2><p>Search by name or specialty and compare experience and ratings.</p></article><article><span>02</span><h2>Choose your time</h2><p>See available times and reserve a consultation.</p></article><article><span>03</span><h2>Stay in control</h2><p>Review and cancel your scheduled appointments in one place.</p></article></section></>
}
