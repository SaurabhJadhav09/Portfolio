// src/components/sections/Skills.tsx
import React from 'react';

// Make sure you’ve added Devicon’s CSS in your _app.tsx or your index.html’s <head>:
// <link
//   rel="stylesheet"
//   href="https://cdn.jsdelivr.net/npm/devicon@2.2.0/devicon.min.css"
// />

type Section = {
  icon: string;
  title: string;
  tags: React.ReactNode[];
};

const sections: Section[] = [
  {
    icon: 'fas fa-code',
    title: 'Programming Languages',
    tags: [
      <>🐍 Python</>,
      <>｡🇯‌🇸‌ JavaScript</>,
      <>🛢 SQL</>,
      <>♨️ Java</>
    ]
  },
  {
    icon: 'fas fa-tools',
    title: 'Frameworks & Libraries',
    tags: [
      <>⚛️ React</>,
      <>🚀 Next.js</>,
      <>💚 Node.js</>,
      <>🍃 Spring Boot</>
    ]
  },
  {
    icon: 'fas fa-cog',
    title: 'Tools & Technologies',
    tags: [
      <>🔧 Git & GitHub</>,
      <>🐳 Docker</>,
      <>📊 Power BI</>,
      <>📋 Jira</>
    ]
  },
  // {
  //   icon: 'fas fa-database',
  //   title: 'Databases & Cloud',
  //   tags: [
  //     <>🗄️ MySQL</>,
  //     <>🍃 MongoDB</>,
  //     <>☁️ AWS</>,
  //     <>🔥 Firebase</>
  //   ]
  // }
];

export default function Skills() {
  return (
    <section id="skills" className="skills" aria-label="Technical skills">
      <div className="container">
        <h2 className="section-title">Skills & Technologies</h2>
        <div className="skills-grid">
          {sections.map((sec, idx) => (
            <div key={idx} className="skill-category glass-card">
              <h3>
                <i className={sec.icon} aria-hidden="true" /> {sec.title}
              </h3>
              <div className="skill-tags">
                {sec.tags.map((tag, i) => (
                  <span key={i} className="skill-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
