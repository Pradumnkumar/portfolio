import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects | Pradumn Kumar",
  description: "View my technical projects and case studies",
};

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "Kitchenly - Meal Planning Platform",
      description: "Data-driven meal planning platform aggregating user preferences, recipes, and schedules. Built event-driven distributed system with Cloud Run, Pub/Sub, and Cloud Functions. Optimized database performance (850+ → <50 queries) using select_related and prefetch_related.",
      technologies: ["Python", "Django", "React", "GCP", "Cloud Run"],
      link: "https://kitchenly.co.in",
      image: "https://kitchenly.co.in/assets/logo-DATHPvZc.ico",
    },
    {
      id: 2,
      title: "Real-Time Data Degradation Detection System",
      description: "Multithreaded C++ system detecting missing or delayed vehicle telemetry signals under strict timing constraints. Led team of 3 to build system using SOME/IP and IPC for distributed vehicle subsystems.",
      technologies: ["C++", "Real-Time Systems", "AUTOSAR", "SOME/IP"],
      link: "/blog/building-real-time-data-systems",
      image: "www.jlr.com/themes/custom/jlr_corporate_2024/images/logos/logo-black-2025.svg",
    },
    {
      id: 3,
      title: "JLRCoderace - Recruitment Platform",
      description: "JLR's India engineering recruitment platform delivering coding assessments and MCQ-based tests. Led team of 8 to build and maintain platform used in active hiring pipelines.",
      technologies: ["React", "Django", "Full-Stack", "Team Lead"],
      link: "https://india.jlrcoderace.com",
      image: "www.jlr.com/themes/custom/jlr_corporate_2024/images/logos/logo-black-2025.svg",
    },
    {
      id: 4,
      title: "Telemetry Ingestion Pipelines",
      description: "Designed and implemented telemetry pipelines using SOME/IP and IPC to aggregate and route data across distributed vehicle subsystems. Developed modular service-oriented architectures using Adaptive AUTOSAR.",
      technologies: ["C++", "IPC", "AUTOSAR", "System Design"],
      link: "/blog/system-design-centralized-data-channels",
      image: "www.jlr.com/themes/custom/jlr_corporate_2024/images/logos/logo-black-2025.svg",
    },
    {
      id: 5,
      title: "Integration Testing Framework",
      description: "Built comprehensive integration testing frameworks in Python to validate system behavior through runtime log analysis and data verification. Engineered unit tests using Google Test with mocks and parameterized testing.",
      technologies: ["Python", "Testing", "GTest", "CI/CD"],
      link: "",//"/blog/database-performance-optimization",
      image: "www.jlr.com/themes/custom/jlr_corporate_2024/images/logos/logo-black-2025.svg",
    },
    {
      id: 6,
      title: "Intelligent Recipe Enrichment Pipeline",
      description: "Pub/Sub-driven pipeline integrating LLMs to generate multilingual audio insights delivered via WhatsApp. Used Gemini to extract nutrition, ingredients, and metadata with human verification.",
      technologies: ["Python", "GCP Pub/Sub", "LLMs", "Cloud Functions"],
      link: "/blog/event-driven-architectures-gcp",
      image: "https://kitchenly.co.in/assets/logo-DATHPvZc.ico",
    },
  ];

  return (
    <div className="container-custom py-16 sm:py-24">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Projects</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Selected projects from my 5+ years in embedded systems, real-time data platforms, and full-stack development at Jaguar Land Rover and side projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} id={`project-${project.id}`} className="card card-hover group">
            <div className="mb-4 h-16">
              {project.image.startsWith('http') || project.image.startsWith('www') ? (
                <img 
                  src={project.image.startsWith('www') ? 'https://' + project.image : project.image} 
                  alt={project.title}
                  className="h-full object-contain dark:invert"
                />
              ) : project.image ? (
                <div className="text-4xl">{project.image}</div>
              ) : null}
            </div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
            {project.link.startsWith('http') ? (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                View Project →
              </a>
            ) : (
              <Link href={project.link} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Read Details →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
