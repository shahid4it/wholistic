export const READERS_QUERY = `
query {
  preachers {
   oneliner
   rating
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
