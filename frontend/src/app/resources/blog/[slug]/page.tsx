import { fetchStrapi } from "@/utils/strapi";
import { RESOURCES_SLUG_QUERY } from "@/queries/resource-slug";
import { StrapiImage } from "@/app/components/StrapiImage";
import Markdown from "react-markdown";
import Hero from "@/app/components/hero";

export default async function Page({ params: { slug } }) {
  const [blog] = await fetchStrapi({
    query: RESOURCES_SLUG_QUERY(slug),
    key: "blogs",
  })();

  return (
    <article>
      <Hero
        title={blog.title}
        content={blog.summary}
        backdrop={blog.thumbnail}
      />

      <section className="introduction">
        <div className="container">
          <div>
            <time className="">
              Published on:{" "}
              {new Date(Date.parse(blog.publishDate)).toLocaleDateString()}
            </time>
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </section>
    </article>
  );
}
