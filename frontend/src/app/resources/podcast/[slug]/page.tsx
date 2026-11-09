import { notFound } from "next/navigation";
import { asList, fetchStrapi } from "@/utils/strapi";
import { RESOURCES_SLUG_QUERY } from "@/queries/resource-slug";
import { StrapiImage } from "@/app/components/StrapiImage";
import Markdown from "react-markdown";
import Hero from "@/app/components/hero";
import { getSessionUserId } from "@/utils/session";
import { MembersOnly } from "@/app/components/MembersOnly";

export default async function Page({ params: { slug } }) {
  // members only: logged-out visitors get the gate (no title or audio link)
  if (!getSessionUserId()) {
    return (
      <article>
        <section className="resources-page">
          <div className="resources-banner">
            <div className="container">
              <h1>Resources - Podcast</h1>
            </div>
          </div>
          <MembersOnly next={`/resources/podcast/${encodeURIComponent(slug)}`} what="this podcast" />
        </section>
      </article>
    );
  }

  const [blog] = asList(
    await fetchStrapi({
      query: RESOURCES_SLUG_QUERY(slug),
      key: "blogs",
    })()
  );

  if (!blog) notFound();

  return (
    <article>
      <Hero
        title={blog.title}
        content={blog.summary}
        backdrop={blog.thumbnail}
      />

      <section className="introduction">
        <div className="container">
          <div className="">
            <time className="">
              Published on:{" "}
              {new Date(Date.parse(blog.publishDate)).toLocaleDateString()}
            </time>
            <div>
              <audio
                src={
                  blog.resourceUrl ||
                  (blog.resource?.url &&
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}${blog.resource.url}`)
                }
                controls
                muted
              ></audio>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
