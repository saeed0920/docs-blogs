import { notFound } from "next/navigation";
import Link from "next/link";
import { toShamsi } from "@/lib/date";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { blog } from "@/lib/source";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  if (!page) notFound();

  const Mdx = page.data.body;
  const dir = page.data.dir ?? "ltr";

  return (
    <>
      <Link
        className="border w-20 py-1 px-2 mb-8 mt-4 ml-10 text-center rounded-2xl"
        href="/blog"
      >
        Back
      </Link>
      <div
        dir={dir}
        className="w-full flex items-center justify-between max-w-[1400px] mx-auto px-4 py-12 rounded-xl border md:px-8"
      >
        <h1 className="mb-2 text-3xl font-bold">{page.data.title}</h1>
        <p className="mb-4 text-fd-muted-foreground">{page.data.description}</p>
      </div>
      <article
        dir={dir}
        className="w-full max-w-[1400px] mx-auto flex flex-col px-4 py-8"
      >
        <div className="prose min-w-0">
          <InlineTOC className="mb-4" items={page.data.toc} />
          <Mdx components={defaultMdxComponents} />
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div>
            {dir === "rtl" ? (
              <p className="mb-1 mt-4 border-t pt-2 text-fd-muted-foreground">
                نوشته شده توسط
              </p>
            ) : (
              <p className="mb-1 mt-4 border-t pt-2 text-fd-muted-foreground">
                Written by
              </p>
            )}
            <p className="font-medium">{page.data.author}</p>
          </div>
          <div>
            {dir === "rtl" ? (
              <p className="mb-1 text-sm text-fd-muted-foreground">در تاریخ</p>
            ) : (
              <p className="mb-1 text-sm text-fd-muted-foreground">At</p>
            )}
            <p className="font-medium">
              {dir == "rtl"
                ? toShamsi(page.data.date)
                : new Date(page.data.date).toDateString()}
            </p>
          </div>
        </div>
      </article>
    </>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
