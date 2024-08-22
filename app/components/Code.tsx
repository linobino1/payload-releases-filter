import { useEffect, useRef } from "react";
import { codeToHtml } from "shiki";
import { cn } from "~/util/cn";

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  language?: string;
  multiline?: boolean;
}

const Code: React.FC<CodeProps> = ({
  language = "plaintext",
  multiline,
  children,
  className,
  ...props
}) => {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const darkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = darkMode ? "github-dark" : "github-light";
    codeToHtml(ref.current?.textContent ?? "", {
      lang: language,
      theme: multiline ? theme : "none",
      structure: "inline",
    })
      .then((html) => {
        if (!ref.current) return;
        ref.current.innerHTML = html;
      })
      .catch(console.error);
  }, []);

  return (
    <code
      {...props}
      ref={ref}
      className={cn(
        "text-sm bg-zinc-50 inline-block rounded px-1 font-mono",
        "dark:bg-zinc-800 dark:color-zinc-50",
        { "block px-4 py-4 my-4": multiline },
        className
      )}
    >
      {children}
    </code>
  );
};
export default Code;
