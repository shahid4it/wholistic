export const TESTIMONIALS_QUERY = `query getTestimonialPage  {
  testimonialsPage  {
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
          services {
          title
          slug
          }
          slug
          tags
          profile {
            url
          }
        }
      }

  ... on ComponentUiTestimonials {
  __typename
    title
    testimonials {
      client
      content
    }
  }

      ... on ComponentUiIntro  {
        content
        images {
          url
        }
      }
    }
  }
}`;
