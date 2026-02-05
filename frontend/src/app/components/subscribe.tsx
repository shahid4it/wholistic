import { fetchStrapi } from "@/utils/strapi";
import Image from "next/image";
import { NEWSLETTER_QUERY } from "@/queries/newsletter";
import { NewsletterAnimation } from "./newsletter-animation";
import { StrapiImage } from "./StrapiImage";
import SubscribeForm from "./SubscribeForm";

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
                string-repeat="true"
              />
            </div>
          </div>
          <div className="col-3 offset-1">
            <div className="subscribe__content">
              <div className="content">
                <h2>{data.title}</h2>
                <p className="body-mid">{data.content}</p>
              </div>
              <SubscribeForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
