import Link from "next/link";
import { fetchStrapi } from "@/utils/strapi";
import { HEADER_QUERY } from "@/queries/header";
import { BookASession } from "./BookASession";

export default async function Header() {
  const data = await fetchStrapi({ query: HEADER_QUERY, key: "header" })();

  return (
    <header className="header">
      <div className="container">
        <div className="headeer__left">
          <Link href={"/"}>Wholistic</Link>
        </div>
        <div className="headeer__right">
          <nav className="menu">
            <ul className="nav">
              {data.links?.map(({ title, href }) => (
                <li>
                  <Link href={href || "#"}>{title}</Link>
                </li>
              ))}
              <li>
                <BookASession />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
