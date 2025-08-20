import Image from "next/image";
import Link from "next/link";

import Reader from "./reader";

export default function Readers({ readers = [] }) {
  return (
    <section className="readers-list">
      <div className="container">
        <div className="row">
          {readers.map((preacher) => (
            <div className="col-4" key={preacher.name}>
              <Reader {...preacher} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
