import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Last Peace of Art",
  description: "Create, share, and connect. Your space for projects, blogs, CVs, and discussions.",
  openGraph: {
    title: "Last Peace of Art",
    description: "Create, share, and connect. Your space for projects, blogs, CVs, and discussions.",
  },
};

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:pb-32 sm:pt-32">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your space to{" "}
            <span className="bg-gradient-to-r from-zinc-600 to-zinc-900 bg-clip-text text-transparent dark:from-zinc-300 dark:to-white">
              create, share, connect
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400">
            Showcase your projects, write about your passions, share your CV, or start a discussion.
            The last peace of art is where your ideas find their home.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Get Started Free
            </Link>
            <Link
              href="/projects"
              className="rounded-lg border border-zinc-300 px-8 py-3 text-sm font-medium text-zinc-700 transition-all hover:scale-105 dark:border-zinc-600 dark:text-zinc-300"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 px-4 py-20 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">What you can do</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 px-4 py-20 text-center dark:border-zinc-800">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to share your work?</h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            Join our community of creators, writers, and thinkers.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </>
  );
}

const features = [
  { icon: "🚀", title: "Projects", desc: "Upload and showcase your work with rich media, tags, and links." },
  { icon: "✍️", title: "Blog", desc: "Write about any topic and share your knowledge with the world." },
  { icon: "📄", title: "CV", desc: "Create a stunning public profile to present your skills and experience." },
  { icon: "💬", title: "Forum", desc: "Start discussions, ask questions, and connect with the community." },
];

function FeatureCard({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  return (
    <div
      className="group rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-600"
      style={{ animation: `fadeInUp 0.5s ease ${index * 0.1}s both` }}
    >
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{desc}</p>
    </div>
  );
}
