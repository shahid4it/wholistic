import { gql } from "@/utils/strapi";

export const PSYCHICS_SLUG_QUERY = (slug = "") => `query getPsychicsPage  {
    preachers(filters: {slug: {eq: ${gql(slug)}}}) {
        name
        bio
        tags
        abilities
        style
        topics
        tools
        oneliner
          slug
          services {
          title
          slug
          }
        profile {
            url
        }
    }
      
}`;

export const PSYCHICS_TESTIMONIALS_SLUG_QUERY = (
  slug = ""
) => `query getPsychicsTestimonials  {
    
  testimonials(filters:  {
     reader:  {
        slug:  {
           eq: ${gql(slug)}
        }
     }
  }) {
    client
    content
    rating
  }
      
}`;

export const PSYCHICS_BLOG_SLUG_QUERY = (
  slug = ""
) => `query getPsychicsBlogs  {
   
  blogs(filters:  {
     author:  {
        slug:  {
           eq: ${gql(slug)}
        }
     }
  }) {
    title
    summary
    slug
    publishDate
    category
    thumbnail {
        url
    }
  }
      
}`;
