export const HOROSCOPE_QUERY = (starName = "Aries") => `
query {
    horoscopes(filters: {starName: {eq: "${starName}"}}, sort: "publishDate:desc", pagination: {limit: 1}) {
        title
        content
        image {
            url
        }
    }
}
`;
