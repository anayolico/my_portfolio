import React from 'react'
import ProjectCard from '../components/ProjectCard.jsx'
import ima3 from '../components/ima-and/ima3.jpg'
import ima4 from '../components/ima-and/ima4.jpg'
import ima5 from '../components/ima-and/ima5.jpeg'
import ima6 from '../components/ima-and/ima6.png'
export default function Projects(){
  const projects = [
    {
      title: 'Construction Company Website',
      desc: 'A modern, responsive website built for a Nigerian construction company, showcasing residential and commercial projects, service offerings, and client engagement features. Optimized for performance, clean UI, and seamless contact integration to strengthen the company’s online presence.',
      image: ima4,
      tech: ['React.js','Node.js'],
      demoLink: 'https://construction-website-eosin-alpha.vercel.app/',
      codeLink: 'https://github.com/anayolico/construction-website'
    },
    {
      title: 'AI Calculator Web App',
      desc: 'Interactive calculator powered by AI-assisted suggestions and advanced UX patterns.',
      image: ima3,
      tech: ['Next.js','AI'],
      demoLink: 'https://my-ai-calculator.vercel.app/',
      codeLink: 'https://github.com/anayolico/my-ai-calculator'
    },
    {
      title: 'Task Management Dashboard',
      desc: 'Full-featured dashboard with real-time task tracking, filtering, and user collaboration features.',
      image: ima5,
      tech: ['React','Node.js','MongoDB'],
      demoLink: 'https://task-dashboard-frontend-two.vercel.app',
      codeLink: 'https://github.com/anayolico/task-dashboard-backend'
    },
    {
      title: 'Weather Forecast App',
      desc: 'Real-time weather application with location search, forecasts, and animated weather visualizations.',
      image: ima6,
      tech: ['React','API','CSS Animations'],
      demoLink: 'https://weather-app-xi-tawny-68.vercel.app',
      codeLink: 'https://github.com/anayolico/weather-app'
    }
  ]

  return (
    <section id="projects" className="py-16">
      <h2 className="text-2xl font-bold text-white mb-6">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <ProjectCard
            key={p.title}
            title={p.title}
            desc={p.desc}
            image={p.image}
            tech={p.tech}
            demoLink={p.demoLink}
            codeLink={p.codeLink}
          />
        ))}
      </div>
    </section>
  )
}
