export const FOOTER_QUERY = `query getFooter {
  footer {
    logo {
      url
    }
    links {
      href
      title
    }
    socials {
      href
      title
    }
    copyright
  }
}
`;
