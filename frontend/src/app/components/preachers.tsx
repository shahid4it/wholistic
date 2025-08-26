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

      <Readers readers={preachers} />
    </section>
  );
}
