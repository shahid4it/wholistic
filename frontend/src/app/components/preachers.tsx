import Markdown from "react-markdown";
import Readers from "./readers";

export function Preachers({ title, content, marquee, preachers, id = undefined, children = null }) {
  return (
    <section className="section our-readers" id={id}>
      <div className="marquee">
        <div className="marquee__inner">
          <span>{marquee}</span>
          <span>{marquee}</span>
        </div>
      </div>
      {children}
      <Readers readers={preachers} />
    </section>
  );
}
