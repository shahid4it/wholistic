import Hero from "./components/hero";
import Testimonials from "./components/testimonials";
import FAQ from "./components/faq";
import Services from "./components/services";
import Introduction from "./components/introduction";
import { fetchStrapi } from "@/utils/strapi";
import { HOME_QUERY } from "@/queries/home";
import { Preachers } from "./components/preachers";

const COMP_MAP = {
  ComponentUiBanner: Hero,
  ComponentUiSection: Introduction,
  ComponentServicesServices: Services,
  ComponentPreachersPreachers: Preachers,
  ComponentUiTestimonials: Testimonials,
  ComponentUiFaqs: FAQ,
};

export default async function Home() {
  const { sections } = await fetchStrapi({ query: HOME_QUERY, key: "home" })();

  return (
    <section className="home">
      {sections?.map(({ __typename: typename, ...props }, i) => {
        const Comp = COMP_MAP[typename];

        return Comp && <Comp key={i} {...props} />;
      })}
    </section>
  );
}
