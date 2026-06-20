import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Pradumn Kumar",
  description: "Technical articles and insights",
};

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Building Real-Time Data Systems: Lessons from Vehicle Telemetry",
      excerpt: "Designing high-reliability real-time systems for embedded platforms. Discusses timing constraints, signal degradation detection, and distributed data management using SOME/IP and AUTOSAR.",
      date: "2024-01-15",
      category: "Embedded Systems",
      readTime: "12 min",
    },
    {
      id: 2,
      title: "Event-Driven Architectures on GCP: From Pub/Sub to Cloud Functions",
      excerpt: "Explore building scalable event-driven systems using GCP services. Learn how to decouple services, handle asynchronous workflows, and optimize costs with Cloud Run and Cloud Tasks.",
      date: "2024-01-10",
      category: "Cloud Architecture",
      readTime: "10 min",
    },
    {
      id: 3,
      title: "Database Performance Optimization: From 850+ Queries to <50",
      excerpt: "Practical guide to optimizing Django ORM queries. Covers select_related, prefetch_related, bulk operations, and query profiling techniques to achieve dramatic performance improvements.",
      date: "2024-01-05",
      category: "Backend",
      readTime: "11 min",
    },
    {
      id: 4,
      title: "System Design: Centralized Data Channels and Singleton Patterns",
      excerpt: "Designing maintainable interfaces for microservices. Learn how to implement centralized data channels as a single source of truth and enable seamless protocol updates with minimal code changes.",
      date: "2023-12-28",
      category: "System Design",
      readTime: "13 min",
    },
  ];

  return (
    <div className="container-custom py-16 sm:py-24">
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Technical insights on embedded systems, real-time data platforms, system design, and cloud architecture from my experience building production systems.
        </p>
      </div>

      <div className="max-w-3xl">
        {posts.map((post) => (
          <article
            key={post.id}
            id={`post-${post.id}`}
            className="card card-hover mb-6 group"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span>{post.date}</span>
              <span className="tech-badge">{post.category}</span>
              <span>{post.readTime} read</span>
              <Link href={`/blog#post-${post.id}`} className="ml-auto text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Read More →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
