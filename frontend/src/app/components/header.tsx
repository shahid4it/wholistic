import Link from "next/link";
import Image from "next/image";
import { fetchStrapi } from "@/utils/strapi";
import { HEADER_QUERY } from "@/queries/header";
import { BookASession } from "./BookASession";
import { getSessionUserId } from "@/utils/session";
import { HeaderMenu } from "./header-menu";

export default async function Header() {
  const data = await fetchStrapi({ query: HEADER_QUERY, key: "header" })();
  const userId = getSessionUserId();
  let user = undefined;

  if (userId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers?filters[id][$eq]=${userId}&fields[0]=firstName&fields[1]=lastName`,
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
        <HeaderMenu>
          <ul className="nav">
            {data.links?.map(({ title, href, links }) =>
              !links?.length ? (
                <li key={title}>
                  <Link href={href || "#"}>{title}</Link>
                </li>
              ) : (
                <li key={title} className="dropdown">
                  <a className="dropdown-toggle" href="#">{title}</a>
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
              ) : (
                <Link href={"/auth/login"}>Login</Link>
              )}
            </li>
            <li>
              <BookASession />
            </li>
          </ul>
        </HeaderMenu>
      </div>
    </header>
  );
}
