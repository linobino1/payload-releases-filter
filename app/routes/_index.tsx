import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Markdown from "react-markdown";
import { codeToHtml } from "shiki";
import { useEffect, useRef } from "react";
import { cache } from "~/util/cache";
import Gutter from "~/components/Gutter";
import { format } from "date-fns";
import { cn } from "~/util/cn";
import { fetchReleases } from "~/util/githubApi";

export const meta: MetaFunction = () => {
  return [
    { title: "PayloadCMS Releases Filter" },
    {
      name: "description",
      content:
        "Filter the release notes of PayloadCMS by version 2 or 3 (beta)",
    },
  ];
};

export const loader = async () => {
  if (cache.has("releases")) {
    return cache.get("releases");
  }
  const releases = await fetchReleases();

  cache.set("releases", releases);

  return releases;
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const containerRef = useRef<HTMLDivElement>(null);

  // run syntax highlighting on all <code> elements inside the markdown
  useEffect(() => {
    const darkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    containerRef.current?.querySelectorAll("pre code").forEach((code) => {
      codeToHtml(code.textContent ?? "", {
        lang: code.getAttribute("data-language") ?? "plaintext",
        theme: darkMode ? "dark-plus" : "light-plus",
        structure: "inline",
      }).then((html) => {
        code.innerHTML = html;
      });
    });
  }, []);

  return (
    <>
      <Gutter>
        <h1 className="my-8 text-3xl font-bold">PayloadCMS releases filter</h1>
      </Gutter>
      <div ref={containerRef}>
        {/* <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre> */}
        <ul className="space-y-8">
          {data.map((release: any, index: number) => {
            const { body, published_at, url, id } = release;

            return (
              <li key={index}>
                <Gutter>
                  <div className={cn("grid gap-4 grid-cols-[120px_1fr]")}>
                    <div
                      className="mt-1 text-end"
                      title={format(published_at, "PPpp")}
                    >
                      {/* <Date iso={release.published_at} /> */}
                      <div>{format(published_at, "PP")}</div>
                    </div>
                    <div
                      className={cn(
                        "border-l-2 pl-4 border-zinc-200 dark:border-zinc-700 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
                        {
                          // "border-gray-300": index % 2 === 1,
                        }
                      )}
                    >
                      <Markdown
                        children={release.body}
                        components={{
                          p: (props) => <p {...props} className="mb-2" />,
                          h1: (props) => (
                            <h1
                              {...props}
                              className="text-2xl font-bold my-3"
                            />
                          ),
                          h2: (props) => (
                            <h2 {...props} className="text-xl font-bold my-2" />
                          ),
                          h3: (props) => (
                            <h3
                              {...props}
                              className="text-lg font-bold mt-6 mb-4"
                            />
                          ),
                          h4: (props) => (
                            <h4
                              {...props}
                              className="text-base font-bold my-2"
                            />
                          ),
                          a: (props) => (
                            <a
                              {...props}
                              href={props.href as string}
                              className="text-blue-500 underline"
                              target="_blank"
                            />
                          ),
                          ul: (props) => (
                            <ul {...props} className="list-disc" />
                          ),
                          ol: (props) => (
                            <ol {...props} className="list-decimal" />
                          ),
                          li: (props) => <li {...props} className="ml-4" />,
                          code: (props) => {
                            const multiline = props.children
                              ?.toString()
                              .includes("\n");
                            return (
                              <code
                                {...props}
                                data-language={/language-(\w+)/
                                  .exec(props.className || "")?.[0]
                                  .replace("language-", "")}
                                className={cn(
                                  "text-sm bg-zinc-50 inline-block rounded px-1 font-mono",
                                  "dark:bg-zinc-800 dark:color-zinc-50",
                                  { "block px-4 py-4 my-4": multiline }
                                )}
                              />
                            );
                          },
                        }}
                      />
                    </div>
                  </div>
                </Gutter>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
