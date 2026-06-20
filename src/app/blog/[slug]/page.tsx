import { Metadata } from "next";
import Link from "next/link";
import {system_design_centralized_data_channels} from "../../../components/blogs/system-design-centralized-data-channels";
import { building_real_time_data_systems } from "@/src/components/blogs/building-real-time-data-systems";
import { event_driven_architectures_gcp } from "@/src/components/blogs/event-driven-architectures-gcp";
import { database_performance_optimization } from "@/src/components/blogs/database-performance-optimization";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  content: React.ReactNode;
}

const blogPosts: Record<string, BlogPost> = {
  ...system_design_centralized_data_channels,
  ...building_real_time_data_systems,
  ...event_driven_architectures_gcp,
  ...database_performance_optimization
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = blogPosts[params.slug];
  return {
    title: `${post?.title || "Blog Post"} | Pradumn Kumar`,
    description: post?.content ? "Read the full blog post" : "Blog post not found",
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = blogPosts[params.slug];

  if (!post) {
    return (
      <div className="container-custom py-16 sm:py-24">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Sorry, the blog post you're looking for doesn't exist.
        </p>
        <Link href="/blog" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-16 sm:py-24">
      <Link href="/blog" className="text-blue-600 dark:text-blue-400 font-medium hover:underline mb-8 inline-block">
        ← Back to Blog
      </Link>

      <article className="max-w-3xl">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span>{post.date}</span>
            <span className="tech-badge">{post.category}</span>
            <span>{post.readTime} read</span>
          </div>
        </header>

        <div className="prose prose-sm sm:prose lg:prose-lg prose-invert max-w-none">
          <div className="text-slate-300 leading-relaxed space-y-4">
            {post.content}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            ← Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
}
