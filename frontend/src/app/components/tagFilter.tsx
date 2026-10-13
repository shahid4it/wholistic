"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { tagsHref } from "@/utils/strapi";

/**
 * Sticky filter bar on /readers?tag=…: one removable pill per selected tag, the
 * result count and "Clear filters". The site header is fixed and its height
 * changes with the viewport, so the bar measures it and sticks right underneath
 * (the stylesheet holds a fallback for SSR).
 */
export function TagFilter({ tags, count }) {
  const [top, setTop] = useState(0);

  useEffect(() => {
    const header = document.querySelector(".header");
    if (!header) return;
    const update = () => setTop(header.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tag-filter" style={top ? { top } : undefined}>
      <div className="container">
        <ul className="tag-filter__tags">
          {tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
              <Link
                href={tagsHref(tags.filter((t) => t !== tag))}
                scroll={false}
                className="tag-filter__remove"
                aria-label={`Remove ${tag} filter`}
              >
                ×
              </Link>
            </li>
          ))}
        </ul>
        <div className="tag-filter__actions">
          <span>
            {count
              ? `${count} ${count === 1 ? "result" : "results"}`
              : "No readers or healers match all of these tags"}
          </span>
          <Link href={tagsHref([])} scroll={false} className="tag-filter__clear">
            Clear filters
          </Link>
        </div>
      </div>
    </div>
  );
}
