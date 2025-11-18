// "use client";
// import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchStrapi } from "@/utils/strapi";
import { HEADER_QUERY } from "@/queries/header";
import { BookASession } from "./BookASession";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function Header() {
  const data = await fetchStrapi({ query: HEADER_QUERY, key: "header" })();
  const token = cookies().get("auth")?.value;
  let user = undefined;
  // const [isOpen, setIsOpen] = useState(false);

  if (token) {
    try {
      const id = jwt.verify(token, process.env.JWT_SECRET!);
      if (id) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers?id=${id}`,
          {
            headers: {
              authorization: `bearer ${process.env.STRAPI_SUBSCRIBE_TOKEN}`,
            },
          }
        );

        if (res.ok) {
          const { data } = await res.json();
          user = data[0];
        }
      }
    } catch {}
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header__left">
          <Link href={"/"}>
            <Image
              src={"/images/logo.svg"}
              width={193}
              height={64}
              alt="Wholistic Logo"
            />
          </Link>
        </div>
        <div className="header__right">
          <nav className="menu">
            <ul className="nav">
              {data.links?.map(({ title, href, links }) =>
                !links?.length ? (
                  <li key={title}>
                    <Link href={href || "#"}>{title}</Link>
                  </li>
                ) : (
                  <li key={title} className="dropdown">
                    <a className="dropdown-toggle">{title}</a>
                    <ul className="dropdown-menu">
                      {links.map(({ title, href: subhref }) => (
                        <li key={title}>
                          <Link href={`${href}${subhref}`}>{title}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              )}
              <li>
                {user ? (
                  <div className="dropdown">
                    <button className="dropdown-toggle">
                      {user.firstName} {user.lastName}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link href="#">Profile</Link>
                      </li>
                      <li>
                        <Link href="/auth/logout">Logout</Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <Link href={"/auth/login"}>Login</Link>
                )}
              </li>
              <li>
                <BookASession />
              </li>
            </ul>
          </nav>
          <div className="menu-button">
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
          </div>
        </div>
      </div>
    </header>
  );
}
