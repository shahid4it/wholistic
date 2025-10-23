export const SERVICES_LIST_QUERY = `query getServices  {
  services{
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
    
}`;
