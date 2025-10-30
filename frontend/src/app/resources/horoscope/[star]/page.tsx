import { fetchStrapi } from "@/utils/strapi";
import { HOROSCOPE_QUERY } from "@/queries/horoscope";
import { StrapiImage } from "@/app/components/StrapiImage";

export default async function Page({ params: { star = "Aries" } }) {
  const [data = { content: "" }] = await fetchStrapi({
    query: HOROSCOPE_QUERY(star),
    key: "horoscopes",
  })();

  return (
    <section className="horoscope-content">
      <div className="container">
        <div className="row">
          <div className="col-2">
            <h3 className="section-title horoscope-title">
              <span>Monthly</span>
              {star}
            </h3>
          </div>
          <div className="col-6">
            <div
              className="horoscope-description"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </div>
        {data.image?.url && (
          <div className="row">
            <div className="col-6">
              <figure className="horoscope-image">
                <StrapiImage
                  src={data.image?.url}
                  alt=""
                  width={800}
                  height={400}
                  string="parallax"
                  string-parallax=".2"
                />
              </figure>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
