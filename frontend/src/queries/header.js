export const HEADER_QUERY = `query getHeader {
  header {
    logo {
      url
    }
    links {
      id
      href
      title
      links {
        id
        href
        title
      }
    }
  }
}
`;
