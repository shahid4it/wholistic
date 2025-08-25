import Link from "next/link";
import { StrapiImage } from "./StrapiImage";

export function RelatedArticles({ title, content, blogs }) {
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-8">
            <h3 className="section-title">{title}</h3>
            <div className="col-7 offset-1">
              <p className="body-large">{content}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="related-articles">
        <div className="container">
          {blogs.map((props) => (
            <div className="row">
              <div className="col-3">
                <article key={props.title} className="article">
                  {props.thumbnail && (
                    <div className="article-image">
                      <StrapiImage
                        src={props.thumbnail?.url}
                        alt=""
                        width={300}
                        height={170}
                      />
                    </div>
                  )}
                  <div className="article-content">
                    <h3>
                      <Link href={"#"}>{props.title}</Link>
                    </h3>
                    <p>{props.summary}</p>
                  </div>
                </article>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
