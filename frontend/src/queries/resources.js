export const RESOURCES_QUERY = (category = "blog") => `
query {
  blogs(filters: {category: {eq: "${category}"}}) {
   title
   summary
   tags
   slug
   category
   publishDate
   thumbnail {
      url
   }
  }
}
`;
