// src/components/sections/Projects.tsx


const projects = [
  {
    title: 'Smart Travel Planner',
    desc: 'Full-stack travel planning application with AI itineraries.',
    icon: 'fas fa-map-marked-alt',
    category: ['web','ai'],
    highlights: [
      'Responsive React frontend',
      'OpenAI GPT-3.5 API integration',
      'Top 10% at Avishkar'
    ],
    tech: ['React','OpenAI API','PHP','MySQL'],
    github: 'https://github.com/SaurabhJadhav09/Tales-of-India',
    demo: 'https://smart-travel-planner.vercel.app'
  },
  {
    title: 'Jarvis – AI Voice Assistant',
    desc: 'Python assistant with NLP, browser automation, and music control.',
    icon: 'fas fa-microphone',
    category: ['ai'],
    highlights: [
      'Voice recognition & TTS',
      'Browser automation (Google/Youtube)',
      'Custom music library'
    ],
    tech: ['Python','speech_recognition','OpenAI GPT-3.5'],
    github: 'https://github.com/SaurabhJadhav09/Jarvis---Virtual-Assistant-',
    demo: '#'
  },
  {
    title: 'Sales Analytics Dashboard',
    desc: 'BI dashboard visualizing $1.2M+ sales with Power BI.',
    icon: 'fas fa-chart-bar',
    category: ['data'],
    highlights: [
      'Analyzed $1.2M sales data',
      'Interactive filters',
      'Automated reporting'
    ],
    tech: ['Power BI','DAX','SQL Server','Python'],
    github: 'https://github.com/SaurabhJadhav09/Blinkit-Power-BI-Dashboard',
    demo: '#'
  },
];

export default function Projects() {
  return (
    <section id="projects" className="projects" aria-label="Featured projects">
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>
        {/* <div className="projects-filter">
          {['All','Web Apps','AI/ML','Data Analytics'].map((label,i) => (
            <button key={i} className={`filter-btn${label==='All'?' active':''}`}>{label}</button>
          ))}
        </div> */}
        <div className="projects-grid">
          {projects.map((p,i) => (
            <div key={i} className="project-card glass-card featured" data-category={p.category.join(' ')}>
              <div className="project-badge">Featured</div>
              <div className="project-image">
                <i className={p.icon + ' project-icon'} aria-hidden="true"></i>
              </div>
              <div className="project-content">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="project-highlights">
                  <ul>
                    {p.highlights.map((h,j) => <li key={j}>{h}</li>)}
                  </ul>
                </div>
                <div className="project-tech">
                  {p.tech.map((t,j) => <span key={j} className="tech-tag">{t}</span>)}
                </div>
                <div className="project-actions">
                  <a href={p.github} className="glass-btn secondary" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-github"></i> Code
                  </a>
                  <a href={p.demo} className="glass-btn primary" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-external-link-alt"></i> Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
