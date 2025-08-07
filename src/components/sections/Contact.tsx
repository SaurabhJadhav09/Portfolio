// src/components/sections/Contact.tsx
'use client';
import { useState, FormEvent, ChangeEvent } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
    setError(''); setSuccess('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const {name,email,subject,message} = form;
    if(!name||!email||!subject||!message){setError('Please fill all fields');return;}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){setError('Invalid email');return;}
    // simulate submit
    setTimeout(() => { setSuccess('Message sent!'); setForm({name:'',email:'',subject:'',message:''}); }, 1000);
  };

  return (
    <section id="contact" className="contact" aria-label="Contact information">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-intro">
          <p>Always open to discuss new opportunities, projects, or tech—reach out!</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            {[
              {icon:'fas fa-envelope',label:'Email','value':'sidr092003@gmail.com',href:'mailto:sidr092003@gmail.com',text:'Send Email'},
  
              {icon:'fas fa-map-marker-alt',label:'Location','value':'Mumbai, India',href:'#',text:'Available for Remote Work'}
            ].map((c,i)=>(
              <div key={i} className="contact-card glass-card">
                <i className={c.icon} aria-hidden="true"></i>
                <h3>{c.label}</h3>
                <p>{c.value}</p>
                {c.href!=='#' 
                  ? <a href={c.href} className="contact-link">{c.text}</a>
                  : <span className="availability">{c.text}</span>}
              </div>
            ))}
          </div>
          <div className="contact-form glass-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <input name="name" type="text" className="form-control glass-input" placeholder="Your Name" value={form.name} onChange={handleChange} required />
                  <span className="error-message">{error && 'Name required'}</span>
                </div>
                <div className="form-group">
                  <input name="email" type="email" className="form-control glass-input" placeholder="Your Email" value={form.email} onChange={handleChange} required />
                  <span className="error-message">{error && 'Valid email required'}</span>
                </div>
              </div>
              <div className="form-group">
                <input name="subject" type="text" className="form-control glass-input" placeholder="Subject" value={form.subject} onChange={handleChange} required />
                <span className="error-message">{error && 'Subject required'}</span>
              </div>
              <div className="form-group">
                <textarea name="message" rows={5} className="form-control glass-input" placeholder="Your Message" value={form.message} onChange={handleChange} required />
                <span className="error-message">{error && 'Message required'}</span>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
              <button id="submitBtn" type="submit" className="glass-btn primary full-width">
                <span className="btn-text"><i className="fas fa-paper-plane"></i> Send Message</span>
                <span className="btn-loading hidden"> Send</span>
              </button>
            </form>
          </div>
        </div>
        <div className="social-section">
          <h3>Connect With Me</h3>
          <div className="social-links">
            {[
              {icon:'fab fa-github',href:'https://github.com/SaurabhJadhav09',label:'GitHub'},
              {icon:'fab fa-linkedin',href:'https://www.linkedin.com/in/saurabh-jadhav-791626213/',label:'LinkedIn'},
              {icon:'fas fa-envelope',href:'mailto:sidr092003@gmail.com',label:'Email'},
            ].map((s,i)=>(
              <a key={i} href={s.href} className="social-link glass-btn" target="_blank" rel="noopener noreferrer">
                <i className={s.icon}></i> {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
