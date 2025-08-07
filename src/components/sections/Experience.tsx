// src/components/sections/Experience.tsx


const experiences = [
  {
    current: true,
    role: 'Software Engineer Intern',
    comp: 'National Payments Corporation of India (NPCI)',
    dur: 'Dec 2024 – Present',
    loc: 'Mumbai',
    details: [
      'Integrated ULS into TDS application for centralized logs',
      'Resolved SonarQube & AppSec issues in InfraAutomation',
      'Wrote JUnit tests achieving 70–80%+ coverage',
      'Performed API automation testing for BMS application',
    ],
    tech: ['React', 'Javascript', 'Java', 'Junit'],
  },
  {
    current: false,
    role: 'Software Engineering Intern',
    comp: 'MHTECHIN',
    dur: 'Jun 2024 – Nov 2024',
    loc: 'Pune',
    details: [
      'Developed & deployed MHTECHIN mobile app on Google Play',
      'Implemented CI/CD workflows improving efficiency by 30%',
      'Led intern team and managed documentation',
      'Collaborated cross-functionally',
    ],
    tech: ['Flutter', 'Android', 'Team Leadership', 'CI/CD'],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="experience" aria-label="Work experience">
      <div className="container">
        <h2 className="section-title">Professional Experience</h2>
        <div className="experience-timeline">
          {experiences.map((exp, idx) => (
            <div
              className="timeline-row"
              key={idx}
              style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              {/* Marker outside the card */}
              <div
                className={`timeline-marker${exp.current ? ' current' : ''}`}
                aria-hidden="true"
              />
              {/* Timeline card content */}
              <div className={`timeline-item glass-card${exp.current ? ' current' : ''}`}>
                

                <div className="timeline-content">
                  <div className="experience-header">
                    <h3>{exp.role}</h3>
                    <span className="company">{exp.comp}</span>
                    <div className="duration-location">
                      <span className="duration">{exp.dur}</span>
                      <span className="location">{exp.loc}</span>
                    </div>
                  </div>
                  <ul className="achievements">
                    {exp.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <div className="experience-tech">
                    {exp.tech.map((t, i) => (
                      <span key={i} className="tech-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
