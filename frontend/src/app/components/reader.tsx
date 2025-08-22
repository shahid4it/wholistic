"use client";

import Link from "next/link";
import { StrapiImage } from "./StrapiImage";

export default function ({ name, bio, profile, tags, onBooking }) {
  return (
    <>
      <div className="reader">
        <div className="reader__image">
          <StrapiImage
            src={profile?.url}
            width={400}
            height={400}
            alt="Reader Image"
          />
        </div>
        <div className="reader__content">
          <div className="upper-content">
            <div className="name">
              <h3>
                <Link href={`/psychics/${name}`}>{name}</Link>
              </h3>
              <div className="rating">
                <span>4.7</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.88364 1.18255C6.20581 0.571926 7.08034 0.571926 7.40251 1.18255L8.86513 3.95474C8.98937 4.19022 9.21582 4.35475 9.47817 4.40014L12.5667 4.93452C13.2469 5.05223 13.5172 5.88395 13.036 6.37905L10.8515 8.62674C10.6659 8.81767 10.5794 9.08387 10.6173 9.34741L11.0635 12.4499C11.1618 13.1332 10.4543 13.6473 9.83469 13.3426L7.02195 11.9596C6.78303 11.8421 6.50312 11.8421 6.2642 11.9596L3.45146 13.3426C2.8319 13.6473 2.1244 13.1332 2.22267 12.4499L2.66884 9.34741C2.70673 9.08387 2.62024 8.81767 2.43468 8.62674L0.250144 6.37905C-0.23104 5.88395 0.0392026 5.05223 0.719498 4.93452L3.80798 4.40014C4.07033 4.35475 4.29678 4.19022 4.42102 3.95474L5.88364 1.18255Z"
                    fill="#FDA43C"
                  />
                </svg>
                <span>(4658)</span>
              </div>
            </div>
            <div className="bio">
              <p>{bio}</p>
            </div>
            <div className="tags">
              {tags?.split(",").map((tag) => (
                <Link key={tag} href={"#"} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <button onClick={onBooking} type="button" className="button">
            Book a session
          </button>
        </div>
      </div>
    </>
  );
}
