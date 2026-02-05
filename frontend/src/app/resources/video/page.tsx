import { RESOURCES_QUERY } from "@/queries/resources";
import { fetchStrapi } from "@/utils/strapi";
import { StrapiImage } from "../../components/StrapiImage";
import Link from "next/link";
import Image from "next/image";
import { VideoModal } from "./Modal";

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

export default async function Page() {
  const videos = await fetchStrapi({
    query: RESOURCES_QUERY("video"),
    key: "blogs",
  })();

  return (
    <>
      <section className="resources-page">
        <div className="resources-banner">
          <div className="container">
            <h1>
              Resources -{" "}
              <span style={{ textTransform: "capitalize" }}>Video</span>
            </h1>
          </div>
        </div>
        <section className="section resources__content">
          <div className="container">
            <ul className="videos">
              {videos.map(
                ({
                  title,
                  thumbnail,
                  summary,
                  publishDate,
                  tags = "",
                  resourceUrl,
                }) => {
                  const date = new Date(Date.parse(publishDate || ""));
                  return (
                    <li className="col" key={title}>
                      <article className="resource-item resource-item--video">
                        <figure className="resource-item__image">
                          <Link href={`?video=${resourceUrl}`}>
                            <StrapiImage
                              src={thumbnail?.url}
                              alt=""
                              width={400}
                              height={300}
                            />
                          </Link>
                        </figure>
                        <div className="resource-item__content blog-content">
                          <time className="date">
                            {months[date.getMonth()]} {date.getDate()},{" "}
                            {date.getFullYear()}
                          </time>
                          <h3 className="title">
                            <Link href={`?video=${resourceUrl}`}>{title}</Link>
                          </h3>
                          {summary ? <p>{summary}</p> : null}
                          {tags && (
                            <div className="tags">
                              {tags?.split(",").map((tag) => (
                                <span key={tag} className="tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
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
      <VideoModal />
    </>
  );
}
