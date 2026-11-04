import DOMPurify from "isomorphic-dompurify";

// Links in CMS-authored HTML always open in a new tab. Done in a hook because
// DOMPurify strips `target` by default; noopener stops the new tab reaching
// back through window.opener.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.hasAttribute("href")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

/** Strips scripts/event handlers etc. from CMS-authored HTML before it's rendered raw. */
export const clean = (html: string | null | undefined) => DOMPurify.sanitize(html ?? "");
