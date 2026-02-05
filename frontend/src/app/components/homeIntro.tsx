import Image from "next/image";
import { StrapiImage } from "./StrapiImage";
import Markdown from "react-markdown";

export default function HomeIntro({ title, content, image }) {
  return (
    <section className="introduction-below">
      <div className="container">
        <div className="row">
          <div className="col-5">
            <div className="image-holder">
              <Image
                src={image ? image.url : "/images/intro-image.png"}
                // src={profile?.url}
                width={1000}
                height={800}
                alt="Hero Background"
                string="parallax"
                string-parallax="1"
              />
            </div>
          </div>
          <div className="col-3">
            <p className="body-mid">{content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
