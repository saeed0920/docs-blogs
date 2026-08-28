import Link from "next/link";
import { History } from "lucide-react";
import { IconBlog } from "@/public/icons/blog";
import { IconGit } from "@/public/icons/git";
import { IconJs } from "@/public/icons/js";
import { IconLinux } from "@/public/icons/linux";
import { appName, frontRoute, gitRoute, lpic1Route } from "@/lib/shared";

const sections = [
  {
    title: "LPIC-1",
    description: "Linux essentials and certification notes.",
    href: lpic1Route,
    icon: IconLinux,
  },
  {
    title: "FrontEnd",
    description: "JavaScript, React, and web development.",
    href: frontRoute,
    icon: IconJs,
  },
  {
    title: "Git",
    description: "Version control workflows and commands.",
    href: gitRoute,
    icon: IconGit,
  },
  {
    title: "Blog",
    description: "Thoughts, tutorials, and things I'm building.",
    href: "/blog",
    icon: IconBlog,
  },
  {
    title: "Changelog",
    description: "New guides, improvements, and fixes shipped here.",
    href: "/changelog",
    icon: History,
  },
];

export default function HomePage() {
  return (
    <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-16 md:py-24">
      <section className="mb-16 md:mb-20 max-w-2xl">
        <p className="text-sm text-fd-muted-foreground mb-3">Personal docs</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-playwrite)]">
          {appName}
        </h1>
        <p className="text-fd-muted-foreground text-lg leading-relaxed">
          Notes, guides, and write-ups on Linux, frontend, Git, and whatever
          I'm learning along the way.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {sections.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-xl border border-fd-border bg-fd-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-fd-primary/40 hover:shadow-md"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-fd-border bg-fd-secondary text-fd-muted-foreground transition-colors group-hover:text-fd-primary">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold mb-1 group-hover:text-fd-primary transition-colors">
                {title}
              </span>
              <span className="block text-sm text-fd-muted-foreground leading-relaxed">
                {description}
              </span>
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
