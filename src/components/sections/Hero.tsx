// src/components/sections/Hero.tsx
'use client';
import Image from "next/image";


export default function Hero() {
  return (
    <section id="home" className="hero" aria-label="Introduction">
      <div className="hero-background">
        <div className="floating-shapes" aria-hidden="true">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      <div className="hero-content">
        <div className="hero-avatar glass-card">
          <div className="avatar-placeholder">
            <Image
              src="/profile.png"
              alt="Saurabh Jadhav"
              width={120}
              height={120}
              className="avatar-image"
              priority
            />
           
          </div>
        </div>
        <h1 className="hero-title">
          Hi, I'm <span className="gradient-text">Saurabh Jadhav</span>
        </h1>
        <div className="typing-container" aria-live="polite">
          <span id="typingText" className="typing-text">Software Developer</span>
          <span className="cursor">|</span>
        </div>
        <p className="hero-description">
          Passionate Software Developer specializing in JavaScript, Java, React, Spring Boot, Python, and Data Analytics. With 1 year of hands-on internship experience, I focus on building scalable applications, automating testing workflows, and crafting data-driven solutions. I enjoy transforming complex problems into high-performance, user-centric digital experiences.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="glass-btn primary">
            <i className="fas fa-envelope" aria-hidden="true"></i> Get In Touch
          </a>
          <a href="#projects" className="glass-btn secondary">
            <i className="fas fa-code" aria-hidden="true"></i> View Projects
          </a>
          <a href="/Saurabh_Jadhav_Resume.pdf" className="glass-btn secondary" id="resumeBtn">
            <i className="fas fa-download" aria-hidden="true"></i> Download Resume
          </a>
        </div>
        <div className="hero-stats" role="region" aria-label="Professional statistics">
          <div className="stat-item glass-card">
            <h3>1</h3>
            <p>Year of Experience</p>
          </div>
          <div className="stat-item glass-card">
            <h3>10+</h3>
            <p>Projects Completed</p>
          </div>
          <button
            id="certificationsBtn"
            className="stat-item glass-card"
            aria-label="View certifications"
          >
            <h3>5+</h3>
            <p>Certifications</p>
          </button>
          <div className="stat-item glass-card">
            <h3>10K+</h3>
            <p>Lines of Code</p>
          </div>
        </div>
      </div>
    </section>
  );
}
