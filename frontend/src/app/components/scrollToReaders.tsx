"use client";

import { useEffect, useRef } from "react";

/**
 * Brings the Readers list (#readers, just below the hero) into view when tag
 * filters change, or on arriving with filters, so tag links don't need a #hash
 * in the URL. Landing on /readers without filters keeps the normal top-of-page.
 * scroll-margin-top on #readers keeps it clear of the fixed header.
 */
export function ScrollToReaders({ tags }) {
  const key = tags.join("\n");
  // last filters acted on; comparing against it (not a "first run" flag) also
  // ignores React Strict Mode running the effect twice in development
  const seen = useRef<string | null>(null);

  useEffect(() => {
    if (seen.current === key) return;
    const arriving = seen.current === null;
    seen.current = key;
    if (arriving && !key) return;
    requestAnimationFrame(() =>
      document.getElementById("readers")?.scrollIntoView({ behavior: arriving ? "auto" : "smooth" }),
    );
  }, [key]);

  return null;
}
