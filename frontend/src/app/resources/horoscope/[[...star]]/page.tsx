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
      <section className="">
        {/* <div className="container"> */}
        <div className="starsigns">
          {Object.entries(durations).map(([name, duration]) => (
            <Link
              href={`/resources/horoscope/${name}`}
              key={name}
              className={`starsign ${star[0] === name ? "active" : ""}`}
            >
              <figure className="starsign-image">{Icons[name]}</figure>
              <p className="starsign-name">{name}</p>
              <p className="starsign-duration">{duration}</p>
            </Link>
          ))}
          {/* </div> */}
        </div>
      </section>
      <section className="introduction intro">
        <div className="container">
          <div>
            <div className="row">
              <div className="">
                <h3 className="section-title horoscope-title">
                  {star} Monthly Horoscope
                </h3>
              </div>
              <div className="col-7 offset-1">
                <p
                  className="body-large"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              </div>
            </div>
            {data.image?.url && (
              <figure className="row horoscope-image">
                <StrapiImage
                  className="col-8"
                  src={data.image?.url}
                  alt=""
                  width={800}
                  height={400}
                />
              </figure>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
