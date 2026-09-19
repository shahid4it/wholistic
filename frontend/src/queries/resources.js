import { gql } from "@/utils/strapi";

export const RESOURCES_QUERY = (category = "blog") => `
query {
  blogs(filters: {category: {eq: ${gql(category)}}}) {
   title
   summary
   tags
   slug
   category
   publishDate
   resourceUrl
   resource {
    url
   }
   thumbnail {
      url
   }
  }
}
`;
