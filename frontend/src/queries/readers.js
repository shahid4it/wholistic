export const READERS_QUERY = `
query {
  preachers {
   oneliner
   name
   slug
   profile {
      url
   }
   services {
      title
   }
  }
}
`;
