import Hero from "../../components/hero";
import Testimonials from "../../components/testimonials";
import Introduction from "../../components/introduction";
import { fetchStrapi } from "@/utils/strapi";
import { SERVICE_SLUG_QUERY } from "@/queries/service-slug";
import { Preachers } from "../../components/preachers";
import { RelatedArticles } from "@/app/components/RelatedArticles";
import Section from "@/app/components/section";
import { Psychics } from "@/app/components/psychics/psychics";

const COMP_MAP = {
  ComponentUiBanner: Hero,
  ComponentUiSection: Section,
  ComponentPreachersPreachers: Psychics,
  ComponentUiIntro: (props) => (
    <Introduction {...props} title="When do you need this service?" below />
  ),
  ComponentUiTestimonials: Testimonials,
  ComponentBlogsRelatedArticles: RelatedArticles,
};

export default async function Service({ params: { slug = "" } }) {
  const [{ sections }] = await fetchStrapi({
    query: SERVICE_SLUG_QUERY(slug),
    key: "services",
  })();

  return (
    <section className="service-page">
      {sections.map(({ __typename: typename, ...props }, i) => {
        const Comp = COMP_MAP[typename];

        return Comp && <Comp key={i} {...props} inner />;
      })}
    </section>
  );
}
