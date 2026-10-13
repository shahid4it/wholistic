import { gql } from "@/utils/strapi";

export const PSYCHICS_QUERY = `query getPsychicsPage  {
  psychicsPage {
    sections {
      ... on ComponentUiBanner {
        __typename
        title
        content
        backdrop {
          url
        }
      }

       ... on ComponentUiSection {
        __typename
        title
        content
        
      }

      ... on ComponentPreachersPreachers {
        __typename
        marquee
        title
        content
        preachers {
          name
          oneliner
   rating
   testimonials { documentId }
          services {
          title
          slug
          }
          slug
          tags
          tagList { name }
          profile {
            url
          }
        }
      }

      ... on ComponentUiTestimonials {
      __typename
        title
        content
        background {
          url
        }
        testimonials {
          client
          content
        }
}
    }
  }
}`;

/**
 * Everyone carrying ANY of these tags (case-insensitive). Callers narrow to
 * readers with ALL of them: Strapi can't AND several conditions on one
 * manyToMany relation, as each would have to match the same joined row.
 */
export const PREACHERS_BY_TAGS_QUERY = (tags = []) => `query {
  preachers(filters: {or: [${tags.map((t) => `{tagList: {name: {eqi: ${gql(t)}}}}`).join(", ")}]}, sort: "name") {
    name
    oneliner
    rating
    testimonials { documentId }
    services {
      title
      slug
    }
    slug
    tags
    tagList { name }
    profile {
      url
    }
  }
}`;
