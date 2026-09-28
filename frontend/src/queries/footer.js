export const FOOTER_QUERY = `query getFooter {
  footer {
    logo {
      url
    }
    links (pagination: {limit: 20}) {
      id
      href
      title
    }
    linksHeading
    socials {
      id
      href
      title
    }
    socialHeading
    servicesHeading
    copyright
  }
}
`;
