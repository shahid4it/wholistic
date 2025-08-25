export const SERVICE_SLUG_QUERY = (slug = "") => `query getHomePage  {
  services(filters: {slug: {eq: "${slug}"}}) {
    sections {
      ... on ComponentUiBanner {
        __typename
        title
        content
        backdrop {
          url
        }
      }

      ... on ComponentPreachersPreachers {
        __typename
        title
        content
        marquee
        preachers {
          name
          oneliner
          slug
          tags
          profile {
            url
          }
        }
      }

      ...on ComponentUiSection {
      __typename
        title
        content
        image {
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

      ... on ComponentBlogsRelatedArticles {
      __typename
      title
      content
      blogs {
      title
      summary
      thumbnail {
      url}
      }
      }
    }
  }
}`;
