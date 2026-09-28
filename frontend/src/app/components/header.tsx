import Link from "next/link";
import Image from "next/image";
import { fetchStrapi } from "@/utils/strapi";
import { HEADER_QUERY } from "@/queries/header";
import { BookASession } from "./BookASession";
import { HeaderMenu } from "./header-menu";
import { UserMenu } from "./UserMenu";

export default async function Header() {
  const data = await fetchStrapi({ query: HEADER_QUERY, key: "header" })();

  return (
    <header className="header">
      <div className="container">
        <div className="header__left">
          <Link href={"/"}>
            <Image
              src={
                data.logo?.url
                  ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${data.logo.url}`
                  : "/images/logo.svg"
              }
              width={193}
              height={64}
              alt="Wholistic Logo"
            />
          </Link>
        </div>
        <HeaderMenu>
          <ul className="nav">
            {data.links?.map(({ id, title, href, links }) =>
              !links?.length ? (
                <li key={id}>
                  <Link href={href || "#"}>{title}</Link>
                </li>
              ) : (
                <li key={id} className="dropdown">
                  <a className="dropdown-toggle" href="#">{title}</a>
                  <ul className="dropdown-menu">
                    {links.map(({ id: subId, title, href: subhref }) => (
                      <li key={subId}>
                        <Link href={`${href}${subhref}`}>{title}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            )}
            <li>
              <UserMenu />
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
