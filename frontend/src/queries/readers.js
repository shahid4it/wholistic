export const READERS_QUERY = `
query {
  preachers {
   oneliner
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
