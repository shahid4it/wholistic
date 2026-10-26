"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { parseTags, tagsHref } from "@/utils/strapi";

/**
 * Link for a pill: on an already filtered Readers page it adds the tag to the
 * current filters; anywhere else it starts a new filter with just that tag.
 */
export function useTagHref() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = pathname === "/readers" ? searchParams.getAll("tag") : [];
  return (tag: string) => tagsHref(parseTags([...current, tag]));
}
