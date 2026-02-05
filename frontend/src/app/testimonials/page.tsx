import Hero from "../components/hero";
import { Testimonials } from "../components/testimonials/testimonials";
import Introduction from "../components/introduction";
import { fetchStrapi } from "@/utils/strapi";
import { TESTIMONIALS_QUERY } from "@/queries/testimonials";
import { Psychics } from "../components/psychics/psychics";

const COMP_MAP = {
  ComponentUiBanner: Hero,
  ComponentUiSection: Introduction,
  ComponentPreachersPreachers: Psychics,
  ComponentUiTestimonials: Testimonials,
};

export default async function TestimonialsPage() {
  const { sections } = await fetchStrapi({
    query: TESTIMONIALS_QUERY,
    key: "testimonialsPage",
  })();

  return (
    <section className="testimonials-page">
      {sections.map(({ __typename: typename, ...props }, i) => {
        const Comp = COMP_MAP[typename];

        return Comp && <Comp key={i} {...props} />;
      })}
    </section>
  );
}
