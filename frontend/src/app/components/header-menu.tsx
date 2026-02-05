"use client";

import { PropsWithChildren, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function HeaderMenu({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="header__right">
      <button
        className="header__backdrop"
        onClick={() => setIsOpen(false)}
      ></button>
      <nav className={`menu ${isOpen ? "show" : ""} `}>{children}</nav>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="menu-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
        </svg>
      </button>
    </div>
  );
}
