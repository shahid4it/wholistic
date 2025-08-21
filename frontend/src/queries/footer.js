export const FOOTER_QUERY = `query getFooter {
  footer {
    logo {
      url
    }
    links (pagination: {limit: 20}) {
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
