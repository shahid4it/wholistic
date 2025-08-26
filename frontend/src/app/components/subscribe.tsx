import { fetchStrapi } from "@/utils/strapi";
import Image from "next/image";
import { NEWSLETTER_QUERY } from "@/queries/newsletter";
import { NewsletterAnimation } from "./newsletter-animation";
import { StrapiImage } from "./StrapiImage";

export default async function Subscribe() {
  const data = await fetchStrapi({
    query: NEWSLETTER_QUERY,
    key: "newsletter",
  })();

  return (
    <section className="subscribe">
      <NewsletterAnimation />
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="subscribe__image">
              <StrapiImage
                src={data.image?.url}
                width={900}
                height={1000}
                alt="Hero Background"
                string="parallax"
                string-parallax="0.2"
                string-parallax-bias="0.0"
                string-repeat
              />
            </div>
          </div>
          <div className="col-3 offset-1">
            <div className="subscribe__content">
              <div className="content">
                <h2>Subscribe to our newsletter</h2>
                <p className="body-mid">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eleifend odio ut ante tristique, non pulvinar tellus tempor.
                  In convallis accumsan ipsum.{" "}
                </p>
              </div>
              <div className="subscribe-form">
                <div className="input-field">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your name" />
                </div>

                <div className="input-field">
                  <label>Email Address</label>
                  <input type="text" placeholder="Enter your email address" />
                </div>
                <button className="button">Sign up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
