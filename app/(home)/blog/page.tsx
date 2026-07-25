import Image from "next/image";
import Link from "next/link";
import { blog } from "@/lib/source";
import DefaultIcon from "@/components/defaultIcon";

export default function Home() {
  const posts = blog.getPages();

  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.data?.date).getTime() - new Date(a.data?.date).getTime(),
  );

  return (
    <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-fd-muted-foreground mt-2">
          Thoughts, tutorials, and notes on what I'm building.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
        {sortedPosts.map((post) => {
          const image = post.data?.image;

          return (
            <Link
              key={post.url}
              href={post.url}
              dir={post.data?.dir || "ltr"}
              className="group flex mb-5 break-inside-avoid flex-col rounded-xl border border-fd-border bg-fd-card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-fd-primary/40"

            >
              <div className="relative w-full h-40 overflow-hidden bg-fd-secondary">
                {image ?
                  <Image
                    src={image}
                    alt={post.data.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  : <DefaultIcon className="size-full" />}
              </div>
              <div className="p-6 flex flex-col flex-1">
                {post.data.date && (
                  <time className="text-xs text-fd-muted-foreground mb-2">
                    {new Date(post.data.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}

                <h2 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-fd-primary transition-colors">
                  {post.data.title}
                </h2>

                <p className="text-sm text-fd-muted-foreground line-clamp-3 flex-1">
                  {post.data.description}
                </p>

                {post.data.tags && post.data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-fd-border">
                    {post.data.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-fd-secondary text-fd-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
