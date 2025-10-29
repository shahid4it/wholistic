export const CONTACT_QUERY = `query getContactPage  {
  contact  {
    sections {
      ... on ComponentUiBanner {
        __typename
        title
        content
        backdrop {
          url
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
