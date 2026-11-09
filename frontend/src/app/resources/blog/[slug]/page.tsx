import { notFound, redirect } from "next/navigation";
import { asList, fetchStrapi } from "@/utils/strapi";
import { RESOURCES_SLUG_QUERY } from "@/queries/resource-slug";
import { StrapiImage } from "@/app/components/StrapiImage";
import { clean } from "@/utils/sanitize";

export default async function Page({ params: { slug } }) {
  const [blog] = asList(
    await fetchStrapi({
      query: RESOURCES_SLUG_QUERY(slug),
      key: "blogs",
    })()
  );

  if (!blog) notFound();
  // Podcasts and videos are members only and have their own (gated) pages;
  // the slug lookup above matches any category, so don't show them here.
  if (blog.category === "podcast") redirect(`/resources/podcast/${encodeURIComponent(slug)}`);
  if (blog.category === "video") redirect("/resources/video");
  if (blog.category === "online-classes") redirect("/resources/online-classes");

  return (
    <article className="blog-post">
      {blog.thumbnail?.url && (
        <div className="blog-post__image">
          <StrapiImage
            src={blog.thumbnail.url}
            width={1920}
            height={900}
            alt=""
            priority
            data-parallax="1"
          />
        </div>
      )}

      <section className="blog-post__content">
        <div className="container">
          <h1 className="blog-post__title">{blog.title}</h1>
          <time className="publish-date">
            Published on:{" "}
            {new Date(Date.parse(blog.publishDate)).toLocaleDateString()}
          </time>
          <div className="content">
            <div dangerouslySetInnerHTML={{ __html: clean(blog.content) }} />
          </div>
        </div>
      </section>
    </article>
  );
}
