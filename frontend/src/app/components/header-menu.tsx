"use client";

import { PropsWithChildren, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function HeaderMenu({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLNavElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuRef.current) return;

    // Setup collapsible menus on mobile
    const dropdownItems = menuRef.current.querySelectorAll(".dropdown");

    dropdownItems.forEach((item) => {
      // Add has-submenu class
      if (item.querySelector(".dropdown-menu")) {
        item.classList.add("has-submenu");
      }

      // Get the toggle element (a or button with dropdown-toggle class)
      const toggle = item.querySelector(".dropdown-toggle");
      const submenu = item.querySelector(".dropdown-menu");

      if (toggle && submenu) {
        // Handle click on toggle
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Only toggle on mobile
          if (window.innerWidth <= 768) {
            submenu.classList.toggle("open");
            item.classList.toggle("open");
          }
        });

        // Close submenu when a link is clicked
        submenu.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", () => {
            submenu.classList.remove("open");
            item.classList.remove("open");
          });
        });
      }
    });

    // Close all submenus when main menu closes
    return () => {
      dropdownItems.forEach((item) => {
        item.classList.remove("open");
        const submenu = item.querySelector(".dropdown-menu");
        if (submenu) {
          submenu.classList.remove("open");
        }
      });
    };
  }, [isOpen]);

  return (
    <div className="header__right">
      <button
        className="header__backdrop"
        onClick={() => setIsOpen(false)}
      ></button>
      <nav className={`menu ${isOpen ? "show" : ""} `} ref={menuRef}>
        {children}
      </nav>
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
