import { notFound } from "next/navigation";
import Link from "next/link";
import { toShamsi } from "@/lib/date";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { puzzley } from "@/lib/source";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = puzzley.getPage([params.slug]);
  if (!page) notFound();

  const Mdx = page.data.body;
  const dir = page.data.dir ?? "ltr";

  return (
    <>
      <Link
        className="border w-20 py-1 px-2 mb-8 mt-4 ml-10 text-center rounded-2xl"
        href="/puzzley"
      >
        Back
      </Link>

      <div
        dir={dir}
        className="w-full flex flex-col gap-3 justify-between max-w-[1400px] mx-auto px-4 py-12 rounded-xl border md:px-8"
      >
        <h1 className="text-3xl font-bold">{page.data.title}</h1>

        <p className="text-fd-muted-foreground">{page.data.description}</p>

        {page.data.period && (
          <p className="text-sm text-fd-muted-foreground">
            {dir === "rtl" ? "بازه زمانی" : "Period"}: {page.data.period}
          </p>
        )}
      </div>

      <article
        dir={dir}
        className="w-full max-w-[1400px] mx-auto flex flex-col px-4 py-8"
      >
        <div className="prose min-w-0">
          <InlineTOC className="mb-4" items={page.data.toc} />
          <Mdx components={defaultMdxComponents} />
        </div>

        <div className="flex flex-col gap-4 text-sm mt-6 border-t pt-4">
          <div>
            <p className="text-fd-muted-foreground mb-1">
              {dir === "rtl" ? "نویسندگان" : "Contributors"}
            </p>

            <ul className="space-y-1">
              {page.data.contributors?.map((c: any, i: number) => (
                <li key={i} className="font-medium">
                  {dir === "rtl"
                    ? `${c.name}${c.alias ? ` (${c.alias})` : ""}`
                    : `${c.alias ?? c.name}`}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1 text-fd-muted-foreground">
              {dir === "rtl" ? "تاریخ آماده‌سازی" : "Prepared"}
            </p>
            <p className="font-medium">{page.data.prepared}</p>
          </div>

          <div>
            <p className="mb-1 text-fd-muted-foreground">
              {dir === "rtl" ? "نویسنده" : "Author"}
            </p>
            <p className="font-medium">{page.data.author}</p>
          </div>

          <div>
            <p className="mb-1 text-fd-muted-foreground">
              {dir === "rtl" ? "تاریخ انتشار" : "Date"}
            </p>
            <p className="font-medium">
              {dir === "rtl"
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
  return puzzley
    .getPages()
    .map((page) => page.slugs?.[0])
    .filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    )
    .map((slug) => ({
      slug,
    }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = puzzley.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
