import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const skills = [
    { category: 'Languages', items: ['C++', 'Python', 'JavaScript', 'SQL'] },
    { category: 'Frontend', items: ['React', 'Redux', 'CSS3', 'Responsive Design'] },
    { category: 'Backend', items: ['Django', 'ASGI/WSGI', 'NGINX', 'Websockets'] },
    { category: 'Cloud & Tools', items: ['GCP (Cloud Run, Pub/Sub)', 'Git', 'JIRA', 'Embedded Systems'] },
  ];

  const recentProjects = [
    {
      title: 'Kitchenly - Meal Planning Platform',
      description: 'Data-driven platform with event-driven architecture. Optimized DB performance (850+ → <50 queries), built interactive dashboards, integrated LLMs for multilingual insights via WhatsApp.',
      tags: ['Python', 'GCP', 'Cloud Run', 'Django'],
    },
    {
      title: 'Real-Time Data Degradation System',
      description: 'Multithreaded C++ system for vehicle telemetry. Detects missing/delayed signals under strict timing constraints using SOME/IP and IPC for distributed systems.',
      tags: ['C++', 'Real-Time Systems', 'AUTOSAR', 'Testing'],
    },
    {
      title: 'JLRCoderace - Recruitment Platform',
      description: 'Led team of 8 to build JLR\'s India engineering platform. Delivers coding assessments and MCQ-based tests for active hiring pipelines.',
      tags: ['Full-Stack', 'React', 'Django', 'Team Lead'],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="container-custom py-20 sm:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Senior Software Engineer<br /><span className="gradient-text">Building Scalable Systems</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl">
            5+ years building real-time data systems and embedded solutions at Jaguar Land Rover. Specialized in system design, full-stack development with Python & C++, and cloud-native architectures. Currently leading teams to deliver high-reliability platforms for critical automotive systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/projects" className="btn-primary group">
              View My Work
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <a href="#contact" className="btn-secondary">
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container-custom py-20 sm:py-32 border-t border-slate-200 dark:border-slate-700">
        <h2 className="text-4xl font-bold mb-12">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skillGroup) => (
            <div key={skillGroup.category} className="card">
              <h3 className="text-xl font-bold mb-4">{skillGroup.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill) => (
                  <span key={skill} className="tech-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="container-custom py-20 sm:py-32 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold">Recent Projects</h2>
          <Link href="/projects" className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-2">
            View All <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects.map((project, index) => (
            <div key={index} className="card card-hover group">
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="tech-badge">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href="/projects" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container-custom py-20 sm:py-32 border-t border-slate-200 dark:border-slate-700">
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            I'm open to exciting projects and collaborations. Feel free to reach out!
          </p>
          <a href="mailto:pradumnkumar6@gmail.com" className="btn-primary">
            Send Me an Email
          </a>
        </div>
      </section>
    </div>
  );
}
