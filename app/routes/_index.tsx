import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import Markdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import { cache } from "~/util/cache";
import Gutter from "~/components/Gutter";
import { format } from "date-fns";
import { cn } from "~/util/cn";
import { fetchReleases } from "~/util/githubApi";
import Code from "~/components/Code";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URLSearchParams(new URL(request.url).search);

  let releases = [];
  if (cache.has("releases")) {
    const cached = cache.get("releases");
    releases = Array.isArray(cached) ? cached : [];
  } else {
    releases = await fetchReleases();

    // cache for 3 minutes
    cache.set("releases", releases, 60 * 3);
  }

  // filter the releases
  const version = searchParams.get("version") ?? "3";
  const sort = searchParams.get("sort") ?? "desc";
  let from = searchParams.get("from");
  let to = searchParams.get("to");
  const breaking = searchParams.get("breaking") === "on";

  // filter by major version
  releases = releases.filter((release: any) =>
    release.name.startsWith(`v${version}`)
  );

  // get the options for the select elements (they shouldn't be affected by sorting and breaking changes filter)
  let fromTo = (
    releases.map((release: any) => ({
      id: release.id,
      name: release.name,
    })) as []
  ).reverse() as any[];

  // apply filters (from, to, breaking changes)
  releases = releases.filter((release: any) => {
    let result = true;
    if (breaking) {
      result &&= release.body.includes("BREAKING CHANGE");
    }
    if (from) {
      result &&= release.id >= from;
    }
    if (to) {
      result &&= release.id <= to;
    }
    return result;
  });

  // sort the releases
  if (sort === "asc") {
    releases.reverse();
  }

  return {
    releases,
    fromTo,
  };
};

export default function Index() {
  const { releases, fromTo } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useNavigation();
  const containerRef = useRef<HTMLDivElement>(null);

  const defaults = {
    from: fromTo[0]?.id ?? "",
    to: fromTo[fromTo.length - 1]?.id ?? "",
    version: "3",
    sort: "desc",
    breaking: false,
  };
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [version, setVersion] = useState(defaults.version);
  const [sort, setSort] = useState(defaults.sort);
  const [breaking, setBreaking] = useState(defaults.breaking);
  useEffect(() => {
    setFrom(searchParams.get("from") ?? defaults.from);
    setTo(searchParams.get("to") ?? defaults.to);
    setVersion(searchParams.get("version") ?? defaults.version);
    setBreaking(searchParams.get("breaking") === "on" || defaults.breaking);
  }, [searchParams, fromTo]);

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  const defaultInputProps = {
    className: "p-2 bg-zinc-50 dark:bg-zinc-800",
  };
  const defaultLabelProps = {
    className: "text-sm flex gap-2 items-center",
  };

  return (
    <>
      <Gutter>
        <h1 className="my-8 text-3xl font-bold">PayloadCMS releases filter</h1>
        <Form
          method="get"
          className={cn("flex gap-4 flex-wrap my-4 transition-opacity", {
            "opacity-70": state !== "idle",
          })}
          onChange={(e) => {
            e.currentTarget.requestSubmit();
          }}
        >
          <label {...defaultLabelProps}>
            version
            <select
              {...defaultInputProps}
              name="version"
              value={version}
              onChange={(e) => {
                // let's start from the top when changing the version
                e.stopPropagation();
                navigate(`?version=${e.target.value}`);
              }}
            >
              <option value="3">v3.0.0 (beta)</option>
              <option value="2">v2.x</option>
            </select>
          </label>
          <div className="flex gap-4">
            <label {...defaultLabelProps}>
              from
              <select
                {...defaultInputProps}
                name="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {fromTo.length ? (
                  fromTo.map((release: any) => (
                    <option key={release.id} value={release.id}>
                      {release.name}
                    </option>
                  ))
                ) : (
                  <option value="">No releases</option>
                )}
              </select>
            </label>
            <label {...defaultLabelProps}>
              to
              <select
                {...defaultInputProps}
                name="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {fromTo.length ? (
                  fromTo.map((release: any) => (
                    <option key={release.id} value={release.id}>
                      {release.name}
                    </option>
                  ))
                ) : (
                  <option value="">No releases</option>
                )}
              </select>
            </label>
          </div>
          <div className="flex gap-4">
            <label {...defaultLabelProps}>
              sort
              <select
                {...defaultInputProps}
                name="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </label>
            <label
              {...defaultLabelProps}
              title={
                'will filter the releases by the keyword "BREAKING CHANGES"'
              }
            >
              breaking changes only
              <input
                {...defaultInputProps}
                type="checkbox"
                name="breaking"
                checked={breaking}
                onChange={(e) => setBreaking(e.target.checked)}
              />
            </label>
          </div>
          <div className="basis-full flex gap-4 items-center">
            <button
              type="button"
              onClick={handleReset}
              className="underline text-blue-500 bg-transparent text-sm"
            >
              reset
            </button>
            <div className="text-xs text-gray-500">
              {state === "idle" ? `${releases.length} releases` : "loading..."}
            </div>
          </div>
        </Form>
      </Gutter>
      <div ref={containerRef}>
        {/* <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre> */}
        <ul className="space-y-8">
          {!releases.length && (
            <li>
              <Gutter>
                <div className="text-center">No releases found</div>
              </Gutter>
            </li>
          )}
          {releases.map((release: any, index: number) => {
            const { body, published_at, url, id } = release;

            return (
              <li key={index}>
                <Gutter>
                  <div
                    className={cn(
                      "grid gap-4 grid-cols-1 sm:grid-cols-[100px_1fr]"
                    )}
                  >
                    <div
                      className="mt-1 text-sm sm:text-end text-zinc-500"
                      title={format(published_at, "PPpp")}
                    >
                      <div>{format(published_at, "PP")}</div>
                    </div>
                    <div
                      className={cn(
                        "border-l-2 pl-4 border-zinc-200  overflow-x-hidden w-full dark:border-zinc-700 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                      )}
                    >
                      <Markdown
                        children={body}
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
                            <ul {...props} className="list-disc mb-4" />
                          ),
                          ol: (props) => (
                            <ol {...props} className="list-decimal pl-4 mb-4" />
                          ),
                          li: (props) => <li {...props} className="ml-4" />,
                          code: (props) => (
                            <Code
                              {...props}
                              language={/language-(\w+)/
                                .exec(props.className || "")?.[0]
                                .replace("language-", "")}
                              multiline={props.children
                                ?.toString()
                                .includes("\n")}
                            />
                          ),
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
      <footer className="mt-8 mb-8 text-xs text-gray-500">
        <Gutter>
          <Link to={"https://github.com/linobino1/payload-releases-filter"}>
            repo of this page
          </Link>
        </Gutter>
      </footer>
    </>
  );
}
