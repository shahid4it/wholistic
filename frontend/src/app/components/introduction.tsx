import Image from "next/image";
import { StrapiImage } from "./StrapiImage";

export default function Introduction() {
  return (
    <>
      <section className="introduction">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <h3 className="section-title">Introduction</h3>
              <div className="col-7 offset-1">
                <p className="body-large">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eleifend odio ut ante tristique, non pulvinar tellus tempor.
                  In convallis accumsan ipsum. Nulla id lectus vitae nisl
                  commodo molestie. Pellentesque vitae nunc leo. Ut libero
                  risus, tristique a laoreet vitae, aliquam sed est.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="introduction-below">
        <div className="container">
          <div className="row">
            <div className="col-5">
              <div className="image-holder">
                <Image
                  src="/images/intro-image.png"
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
              <p className="body-mid">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                eleifend odio ut ante tristique, non pulvinar tellus tempor. In
                convallis accumsan ipsum. Nulla id lectus vitae nisl commodo
                molestie. Pellentesque vitae nunc leo. Ut libero risus,
                tristique a laoreet vitae, aliquam sed est. Morbi eu dignissim
                felis. Morbi lacinia eros id lacinia imperdiet. 
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
