import { gql } from "@/utils/strapi";

export const HOROSCOPE_QUERY = (starName = "Aries") => `
query {
    horoscopes(filters: {starName: {eq: ${gql(starName)}}}, sort: "publishDate:desc", pagination: {limit: 1}) {
        title
        content
        image {
            url
        }
    }
}
`;
