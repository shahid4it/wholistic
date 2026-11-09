"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Fetched client-side so header.tsx can stay a plain, cacheable server
// component instead of calling cookies() itself (BUG-14).
export function UserMenu() {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const pathname = usePathname();

  // Re-checked on every navigation: login/signup redirect client-side, and the
  // header (in the layout) stays mounted, so a fetch on mount alone kept
  // showing "Login" after signing in until the page was reloaded.
  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/session", { cache: "no-store", signal: ctrl.signal })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
    return () => ctrl.abort();
  }, [pathname]);

  if (!user) {
    return <Link href={"/auth/login"}>Login</Link>;
  }

  return (
    <div className="dropdown">
      <a className="dropdown-toggle" href="#">
        {user.firstName} {user.lastName}
      </a>
      <ul className="dropdown-menu">
        <li>
          <Link href="#">Profile</Link>
        </li>
        <li>
          <form action="/auth/logout" method="POST">
            <button type="submit">Logout</button>
          </form>
        </li>
      </ul>
    </div>
  );
}
