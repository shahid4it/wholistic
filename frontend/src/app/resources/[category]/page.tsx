import { RESOURCES_QUERY } from "@/queries/resources";
import { fetchStrapi } from "@/utils/strapi";
import { StrapiImage } from "../../components/StrapiImage";
import Link from "next/link";
import Image from "next/image";

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

export default async function Page({ params: { category = "blogs" } }) {
  const blogs = await fetchStrapi({
    query: RESOURCES_QUERY(category),
    key: "blogs",
  })();

  return (
    <section className="resources-page">
      <div className="resources-banner">
        <div className="container">
          <h1>
            Resources -{" "}
            <span style={{ textTransform: "capitalize" }}>{category}</span>
          </h1>
        </div>
      </div>
      <section className="section resources__content">
        <div className="container">
          <ul className="videos">
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
                    <article className="resource-item resource-item--video">
                      <figure className="resource-item__image">
                        <StrapiImage
                          src={thumbnail?.url}
                          alt=""
                          width={400}
                          height={300}
                        />
                      </figure>
                      <div className="resource-item__content blog-content">
                        <time className="date">
                          {months[date.getMonth()]} {date.getDate()},{" "}
                          {date.getFullYear()}
                        </time>
                        <h3 className="title">
                          <Link href={`/resources/${category}/${slug ?? ""}`}>
                            {title}
                          </Link>
                        </h3>
                        <p>{blogs.summary}</p>
                        <div className="tags">
                          {blogs.tags?.split(",").map((tag) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
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
