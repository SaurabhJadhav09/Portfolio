// src/components/sections/About.tsx
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faGraduationCap,
  faBriefcase,
  faCode,
} from '@fortawesome/free-solid-svg-icons';

export default function About() {
  const education = [
    {
      date: '2020 - 2024',
      degree: 'B.Tech in Electronics & Computer Engineering',
      inst: 'Pillai College of Engineering, New Panvel',
      grade: 'CGPA: 7.7/10',
    },
    {
      date: '2018 - 2020',
      degree: 'H.S.C (XII)',
      inst: 'KLE Science and Commerce College, Navi Mumbai',
      grade: '65%',
    },
    {
      date: '2017 - 2018',
      degree: 'S.S.C (X)',
      inst: 'St.Joseph High School, New Panvel',
      grade: '80%',
    },
  ];

  return (
    <section id="about" className="about" aria-label="About me">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-card glass-card">
            <div className="about-text">
              <h3>Software Developer</h3>
              <p>
                Currently working as a Software Engineer Intern at NPCI (National
                Payments Corporation of India), where I integrate systems,
                enhance code quality, and perform comprehensive testing. Proficient
                in React, Java, Python and SQL.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} aria-hidden="true" />
                  <span>Mumbai, India</span>
                </div>
                <div className="highlight-item">
                  <FontAwesomeIcon icon={faGraduationCap} aria-hidden="true" />
                  <span>B.Tech in Electronics & Computer Engineering</span>
                </div>
                <div className="highlight-item">
                  <FontAwesomeIcon icon={faBriefcase} aria-hidden="true" />
                  <span>Software Engineer at NPCI</span>
                </div>
                <div className="highlight-item">
                  <FontAwesomeIcon icon={faCode} aria-hidden="true" />
                  <span>Full Stack Development</span>
                </div>
              </div>
            </div>
          </div>
          <div className="education-timeline">
            <h3>Education Journey</h3>
            <div className="timeline">
              {education.map((ed, idx) => (
                <div key={idx} className="timeline-item glass-card">
                  <div className="timeline-date">{ed.date}</div>
                  <div className="timeline-content">
                    <h4>{ed.degree}</h4>
                    <p>{ed.inst}</p>
                    <span className="grade">{ed.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
