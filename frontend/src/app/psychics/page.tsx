import { fetchStrapi } from "@/utils/strapi";
import { PSYCHICS_QUERY } from "@/queries/psychics";
import Hero from "../components/hero";
import Testimonials from "../components/testimonials";
import { Preachers } from "../components/preachers";

const COMP_MAP = {
  ComponentUiBanner: Hero,
  ComponentPreachersPreachers: Preachers,
  ComponentUiTestimonials: Testimonials,
};

export default async function About() {
  const { sections } = await fetchStrapi({
    query: PSYCHICS_QUERY,
    key: "psychicsPage",
  })();

  return (
    <section className="psychics-page">
      {sections.map(({ __typename: typename, ...props }, i) => {
        const Comp = COMP_MAP[typename];

        return Comp && <Comp key={i} {...props} />;
      })}
    </section>
  );
}
