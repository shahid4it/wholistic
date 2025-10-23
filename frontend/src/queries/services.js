export const SERVICES_QUERY = `query getServicesPage  {
  servicesPage  {
    sections {
      ... on ComponentUiBanner {
        __typename
        title
        content
        backdrop {
          url
        }
      }

      ... on ComponentUiTestimonials {
      __typename
        title
        content
        background {
          url
        }
        testimonials {
          client
          content
        }
      }

      ... on ComponentServicesServices {
        __typename
        title
        content
        services {
            title
            content
            slug
            thumbnail {
              url
            }
        }
      }
    }
  }
}`;
