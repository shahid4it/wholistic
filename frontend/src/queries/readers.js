export const READERS_QUERY = `
query {
  preachers {
   oneliner
   rating
   testimonials { documentId }
   name
   slug
   specialty
   profile {
      url
   }
   services {
      title
   }
  }
}
`;
