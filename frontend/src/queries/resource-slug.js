import { gql } from "@/utils/strapi";

export const RESOURCES_SLUG_QUERY = (slug = "") => `
query {
  blogs(filters: {slug: {eq: ${gql(slug)}}}, pagination: {limit: 1}) {
   title
   summary
   content
   tags
   slug
   category
   publishDate
   resourceUrl
   thumbnail {
      url
   }
   resource {
      url
   }
  }
}
`;
