"use client";

import { PropsWithChildren, useState } from "react";

export function HeaderMenu({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

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
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
        </svg>
      </button>
    </div>
  );
}
