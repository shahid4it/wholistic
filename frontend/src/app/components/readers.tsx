import Image from "next/image";
import Link from "next/link";

import Reader from "./reader";

export default function Readers() {
  return (
    <section className="readers-list">
      <div className="container">
        <div className="row">
          <div className="col-4">
            <Reader />
          </div>
          <div className="col-4">
            <Reader />
          </div>
          <div className="col-4">
            <Reader />
          </div>

          <div className="col-4">
            <Reader />
          </div>
        </div>
      </div>
    </section>
  );
}
