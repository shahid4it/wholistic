import { RESOURCES_QUERY } from "@/queries/resources";
import { fetchStrapi } from "@/utils/strapi";
import { StrapiImage } from "../components/StrapiImage";
import Link from "next/link";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function Resources() {
  const blogs = await fetchStrapi({ query: RESOURCES_QUERY, key: "blogs" })();

  return (
    <section className="resources-page">
      <div className="resources-banner">
        <div className="container">
          <h1>Resources - Articles</h1>
        </div>
      </div>
      <section className="section resources__content">
        <div className="container">
          <ul className="articles">
            {blogs.map(
              ({
                title,
                slug,
                thumbnail,
                summary,
                publishDate,
                tags = "",
                resource,
                category,
              }) => {
                const date = new Date(Date.parse(publishDate || ""));
                return (
                  <li className="col">
                    <article className="article">
                      <figure className="article__image">
                        <StrapiImage
                          src={thumbnail?.url}
                          alt=""
                          width={400}
                          height={300}
                        />
                      </figure>
                      <div className="article__content blog-content">
                        <time className="date">
                          {months[date.getMonth()]} {date.getDate()},{" "}
                          {date.getFullYear()}
                        </time>
                        <h3 className="title">
                          <Link href={`/resources/${slug ?? ""}`}>{title}</Link>
                        </h3>
                        <p>{summary}</p>
                        <div className="tags">
                          {tags?.split(",").map((tag) => (
                            <small className="tag" key={tag}>
                              {tag}
                            </small>
                          ))}
                        </div>
                      </div>
                    </article>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </section>
    </section>
  );
}
