import { fetchStrapi } from "@/utils/strapi";
import { SERVICES_QUERY } from "@/queries/services";
import Hero from "../components/hero";
import Testimonials from "../components/testimonials";
import { Services } from "../components/services/services";

const COMP_MAP = {
  ComponentUiBanner: Hero,
  ComponentUiTestimonials: Testimonials,
  ComponentServicesServices: Services,
};

export default async function ServicesPage() {
  const { sections } = await fetchStrapi({
    query: SERVICES_QUERY,
    key: "servicesPage",
  })();

  return (
    <main className="services-page">
      {sections.map(({ __typename: typename, ...props }, i) => {
        const Comp = COMP_MAP[typename];

        return <Comp {...props} key={i} />;
      })}
    </main>
  );
}
