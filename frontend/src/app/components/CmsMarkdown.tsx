import Markdown, { type Components } from "react-markdown";

// External links in CMS text open in a new tab so visitors don't leave the site.
const components: Components = {
  a: ({ node, href, ...props }) =>
    /^https?:\/\//.test(href ?? "") ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ) : (
      <a href={href} {...props} />
    ),
};

export function CmsMarkdown({ children }: { children?: string | null }) {
  return <Markdown components={components}>{children}</Markdown>;
}
