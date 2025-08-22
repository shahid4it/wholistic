export const PSYCHICS_SLUG_QUERY = (slug = "") => `query getPsychicsPage  {
    preacher(filters: {slug: {eq: "${slug}"}}) {
        name
        bio
        tags
        profile {
            url
        }
    }
      
}`;
