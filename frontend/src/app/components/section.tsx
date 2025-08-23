import Image from "next/image";
import { StrapiImage } from "./StrapiImage";

export default function Section({ title, content, image }) {
  return (
    <>
      <section className="introduction">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <h3 className="section-title">{title}</h3>
            </div>
            <div className="col-6">
              <p className="body-large">{content}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="two-image-section introduction-below">
        <div className="container">
          <div className="row">
            {image?.map(({ url }) => (
              <div className="image-holder">
                <StrapiImage
                  src={url}
                  width={1000}
                  height={800}
                  alt="Hero Background"
                  string="parallax"
                  string-parallax="1"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
