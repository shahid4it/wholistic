import { gql } from "@/utils/strapi";

export const SERVICE_SLUG_QUERY = (slug = "") => `query getHomePage  {
  services(filters: {slug: {eq: ${gql(slug)}}}) {
    preachers {
      name
      oneliner
      rating
      testimonials { documentId }
      slug
      tags
      tagList { name }
      profile {
        url
      }
    }
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
   rating
   testimonials { documentId }
          slug
          tags
          tagList { name }
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

      ...on ComponentUiIntro {
      __typename
        content
        
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

    slug
    publishDate
    category
      thumbnail {
      url}
      }
      }
    }
  }
}`;
