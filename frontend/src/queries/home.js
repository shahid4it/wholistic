export const HOME_QUERY = `query getHomePage  {
  home  {
    sections {
      ... on ComponentUiBanner {
        __typename
        title
        content
        backdrop {
          url
        }
      }

      ... on ComponentServicesServices {
        __typename
        title
        content
        marquee
        services {
            title,

            thumbnail {
              url
            }
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
          services {
          title
          slug
          }
          profile {
            url
          }
        }
      }

      ...on ComponentUiSection {
      __typename
        title
        content
        
      }

      ... on ComponentUiIntro  {
      __typename
        content
        images {
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

      ... on ComponentUiFaqs {
      __typename
        title
        content
        image {
           url
        }

        faqs {
          question
          answer
        }
      }
    }
  }
}`;
