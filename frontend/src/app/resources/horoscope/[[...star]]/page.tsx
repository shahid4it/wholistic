import { fetchStrapi } from "@/utils/strapi";
import { HOROSCOPE_QUERY } from "@/queries/horoscope";
import { Icons } from "./Icons";
import Link from "next/link";
import { StrapiImage } from "@/app/components/StrapiImage";

const durations = {
  Aries: "Mar 21 - Apr 19",
  Taurus: "Apr 20 - May 20",
  Gemini: "May 21 - Jun 20",
  Cancer: "Jun 21 - Jul 20",
  Leo: "Jul 21 - Aug 20",
  Virgo: "Aug 21 - Sep 20",
  Libra: "Sep 21 - Oct 20",
  Scorpio: "Oct 21 - Nov 20",
  Sagittarius: "Nov 21 - Dec 20",
  Capricorn: "Dec 21 - Jan 20",
  Aquarius: "Jan 21 - Feb 20",
  Pisces: "Feb 21 - Mar 20",
};

export default async function Page({ params: { star = ["Aries"] } }) {
  const [data = { content: "", image: { url: "" } }] = await fetchStrapi({
    query: HOROSCOPE_QUERY(star[0]),
    key: "horoscopes",
  })();

  return (
    <main className="resources-page">
      <div className="resources-banner">
        <div className="container">
          <h1>Resources - Horoscope</h1>
        </div>
      </div>
      <section className="starsigns">
        <div className="container">
          {Object.entries(durations).map(([name, duration]) => (
            <Link
              href={`/resources/horoscope/${name}`}
              key={name}
              className={`starsign ${star[0] === name ? "active" : ""}`}
            >
              <figure className="starsign-image">{Icons[name]}</figure>
              <div className="content">
                <h3>{name}</h3>
                <p>{duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="horoscope-content">
        <div className="container">
          <div>
            <div className="row">
              <div className="">
                <h3 className="section-title horoscope-title">
                  {star} Monthly Horoscope
                </h3>
              </div>
              <div className="col-7 offset-1">
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
                    />
                  </figure>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
