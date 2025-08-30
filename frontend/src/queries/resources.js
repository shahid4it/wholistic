export const RESOURCES_QUERY = `
query {
  blogs {
   title
   summary
   tags
   slug
   category
   publishDate
   thumbnail {
      url
   }
    resource {
      url
    }
  }
}
`;
