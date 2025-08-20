import { StrapiImage } from "./StrapiImage";

export function Founders({ content = "", preachers = [], marquee = "" }) {
  return (
    <section className="section founder">
      <div className="marquee">
        <div className="marquee__inner">
          <span>{marquee}</span>
          <span>{marquee}</span>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-3 offset-1">
            <div className="founder__image">
              {preachers[0] && (
                <StrapiImage
                  src={preachers[0].profile?.url}
                  width={627}
                  height={850}
                  alt="Founder"
                />
              )}
            </div>
          </div>
          <div className="col-4" string="parallax" string-parallax=".5">
            <div className="founder__content">
              <p className="body-mid">{content}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
