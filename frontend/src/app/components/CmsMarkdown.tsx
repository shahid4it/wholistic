import Markdown, { type Components } from "react-markdown";

// Links in CMS text always open in a new tab so visitors don't leave the page.
const components: Components = {
  a: ({ node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
};

export function CmsMarkdown({ children }: { children?: string | null }) {
  return <Markdown components={components}>{children}</Markdown>;
}
