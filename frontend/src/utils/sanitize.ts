import DOMPurify from "isomorphic-dompurify";

/** Strips scripts/event handlers etc. from CMS-authored HTML before it's rendered raw. */
export const clean = (html: string | null | undefined) => DOMPurify.sanitize(html ?? "");
