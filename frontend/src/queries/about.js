export const ABOUT_QUERY = `query getAboutPage  {
  about {
    sections {
      ... on ComponentUiBanner {
        __typename
        title
        content
        backdrop {
          url
        }
      }

      ... on ComponentPreachersFounders {
        __typename
        marquee
        content
        preachers {
          name
          bio
          profile {
            url
          }
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

      ... on ComponentUiIntro  {
      __typename
        content
        images {
          url
        }
      }
    }
  }
}`;
