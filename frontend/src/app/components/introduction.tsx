import Image from "next/image";
import { StrapiImage } from "./StrapiImage";
import { CmsMarkdown } from "@/app/components/CmsMarkdown";

export default function Introduction({ title, content, image, below }) {
  return (
    <>
      <section className="introduction">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <h3 className="section-title">{title}</h3>
              <div className="col-7 offset-1 body-large">
                <CmsMarkdown>{content}</CmsMarkdown>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
