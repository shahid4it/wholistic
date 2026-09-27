"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Fetched client-side so header.tsx can stay a plain, cacheable server
// component instead of calling cookies() itself (BUG-14).
export function UserMenu() {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, []);

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
