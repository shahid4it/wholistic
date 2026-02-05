import { fetchStrapi } from "@/utils/strapi";
import { PSYCHICS_QUERY } from "@/queries/psychics";
import Hero from "../components/hero";
import Testimonials from "../components/testimonials";
import { Preachers } from "../components/preachers";
import Section from "../components/section";

const COMP_MAP = {
  ComponentUiBanner: Hero,
  ComponentUiSection: Section,
  ComponentPreachersPreachers: Preachers,
  ComponentUiTestimonials: Testimonials,
};

export default async function About() {
  const { sections } = await fetchStrapi({
    query: PSYCHICS_QUERY,
    key: "psychicsPage",
  })();

  const preachers = await fetchStrapi({
    query: `query { preachers (filters: {rating: {gte: 4.3}}) {name
          oneliner
          services {
          title
          slug
          }
          slug
          tags
          profile {
            url
          }} }`,
    key: "preachers",
  })();

  return (
    <section className="psychics-page">
      {sections.map(({ __typename: typename, ...props }, i) => {
        const Comp = COMP_MAP[typename];

        return Comp && <Comp key={i} {...props} />;
      })}
      {/* <Preachers
        title="Client Favorites"
        marquee="Client Favorites . Client Favorites . "
        preachers={preachers}
      /> */}
    </section>
  );
}
