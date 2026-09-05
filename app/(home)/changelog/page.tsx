import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Changelog from "@/content/changelog.mdx";
import { gitConfig, withBasePath } from "@/lib/shared";

export const metadata = {
  title: "Changelog",
  description: "New notes, guides, and improvements shipped across the site.",
};

export default function ChangelogPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-12 md:py-20">
      <section className="grid items-center gap-10 border-b border-fd-border pb-12 md:grid-cols-[1.05fr_0.95fr] md:pb-20">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-2 text-sm font-medium text-fd-primary">
            <span className="size-2 rounded-full bg-fd-primary shadow-[0_0_0_5px_var(--color-fd-accent)]" />
            Product updates
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            What changed,
            <span className="block text-fd-muted-foreground">and why it matters.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-fd-muted-foreground">
            A concise record of new guides, better reading experiences, and
            fixes shipped across the docs.
          </p>
          <a
            href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-85"
          >
            View repository
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-fd-border bg-fd-card p-3 shadow-2xl shadow-black/5">
          <Image
            src={withBasePath("/images/changelog-hero.svg")}
            alt="Illustrated release timeline showing version 1.4.0 shipped"
            width={960}
            height={720}
            priority
            className="h-auto w-full rounded-xl"
          />
        </div>
      </section>

      <section className="grid gap-8 py-12 md:grid-cols-[220px_minmax(0,720px)] md:gap-16 md:py-20">
        <aside>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fd-primary">
            Latest release
          </p>
          <p className="mt-2 text-sm text-fd-muted-foreground">August 28, 2026</p>
        </aside>
        <article className="prose max-w-none prose-headings:tracking-tight">
          <Changelog />
        </article>
      </section>
    </main>
  );
}
