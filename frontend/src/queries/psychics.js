export const PSYCHICS_QUERY = `query getPsychicsPage  {
  psychicsPage {
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
        marquee
        title
        content
        preachers {
          name
          bio
          tags
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
    }
  }
}`;
