import Image from "next/image";
import { StrapiImage } from "./StrapiImage";
import Markdown from "react-markdown";

export default function Section({ title, content, image }) {
  return (
    <>
      <section className="introduction">
        <div className="container">
          <div className="row">
            <div className="col-2">
              <h3 className="section-title">{title}</h3>
            </div>
            <div className="body-large col-6">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        </div>
      </section>
      {image?.length > 0 && (
        <section className="two-image-section introduction-below">
          <div className="container">
            <div className="row">
              {image.map(({ url }) => (
                <div className="image-holder" key={url}>
                  <StrapiImage
                    src={url}
                    width={1000}
                    height={800}
                    alt="Hero Background"
                    string="parallax"
                    string-parallax=".2"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
