import { asList, fetchStrapi, parseTags } from "@/utils/strapi";
import { TagFilter } from "../components/tagFilter";
import { ScrollToReaders } from "../components/scrollToReaders";
import { PREACHERS_BY_TAGS_QUERY, PSYCHICS_QUERY } from "@/queries/psychics";
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

export default async function About({ searchParams = {} }) {
  const { sections = [] } = await fetchStrapi({
    query: PSYCHICS_QUERY,
    key: "psychicsPage",
  })();

  // /readers?tag=Love&tag=Tarot: the readers section lists everyone with ALL
  // of those tags instead of the editor's picks.
  const requested = parseTags(searchParams.tag);
  let tags = requested;
  let tagged = null;
  if (requested.length) {
    const wanted = requested.map((t) => t.toLowerCase());
    const candidates = asList(
      await fetchStrapi({
        query: PREACHERS_BY_TAGS_QUERY(requested),
        key: "preachers",
      })(),
    );
    tagged = candidates.filter((p) => {
      const own = asList(p.tagList).map((t) => t.name.toLowerCase());
      return wanted.every((t) => own.includes(t));
    });
    // show tags as the CMS spells them ("love" in the URL -> "Love")
    const canonical = new Map(
      candidates.flatMap((p) => asList(p.tagList)).map((t) => [t.name.toLowerCase(), t.name]),
    );
    tags = requested.map((t) => canonical.get(t.toLowerCase()) ?? t);
  }

  const preachers = await fetchStrapi({
    query: `query { preachers (filters: {rating: {gte: 4.3}}) {name
          oneliner
          services {
          title
          slug
          }
          slug
          tags
          tagList { name }
          profile {
            url
          }} }`,
    key: "preachers",
  })();

  return (
    <section className="psychics-page">
      <ScrollToReaders tags={tags} />
      {sections.map(({ __typename: typename, ...props }, i) => {
        const Comp = COMP_MAP[typename];

        if (tagged && typename === "ComponentPreachersPreachers") {
          return (
            <Preachers
              key={i}
              {...props}
              id="readers"
              marquee={`${tags.join(" . ")} . `}
              preachers={tagged}
            >
              <TagFilter tags={tags} count={tagged.length} />
            </Preachers>
          );
        }

        // #readers: where tag links and "Clear filters" land, below the hero
        const anchor = typename === "ComponentPreachersPreachers" ? { id: "readers" } : {};
        return Comp && <Comp key={i} {...props} {...anchor} />;
      })}
      {/* <Preachers
        title="Client Favorites"
        marquee="Client Favorites . Client Favorites . "
        preachers={preachers}
      /> */}
    </section>
  );
}
