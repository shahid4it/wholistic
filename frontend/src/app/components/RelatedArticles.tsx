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
      <div className="container">
        <div className="blogs">
          {blogs.map((props) => (
            <div key={props.title} className="blog">
              {props.thumbnail && (
                <StrapiImage
                  src={props.thumbnail?.url}
                  alt=""
                  width={300}
                  height={170}
                />
              )}
              <h3>
                <Link href={"#"}>{props.title}</Link>
              </h3>
              <p>{props.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
