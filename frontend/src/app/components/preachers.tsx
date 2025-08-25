import Readers from "./readers";

export function Preachers({ title, content, marquee, preachers }) {
  return (
    <section className="section our-readers">
      <div className="marquee">
        <div className="marquee__inner">
          <span>{marquee}</span>
          <span>{marquee}</span>
        </div>
      </div>
      {/* <section className="section-content">
        <div className="container">
          <div className="row">
            <div className="col-4">
              <h3 className="section-title">{title}</h3>
            </div>
            <div className="col-3 ">
              <div className="section-content">
                <p className="body-mid">{content}</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <Readers readers={preachers} />
    </section>
  );
}
