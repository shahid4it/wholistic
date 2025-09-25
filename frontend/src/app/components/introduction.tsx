import Image from "next/image";
import { StrapiImage } from "./StrapiImage";
import Markdown from "react-markdown";

export default function Introduction({ title, content, image, below }) {
  return (
    <>
      <section className="introduction">
        <div className="container">
          <div className="row">
            <div className="col-8">
              <h3 className="section-title">{title}</h3>
              <div className="col-7 offset-1 body-large">
                <Markdown>{content}</Markdown>
              </div>
            </div>
          </div>
        </div>
      </section>
      {!below && (
        <section className="introduction-below">
          <div className="container">
            <div className="row">
              <div className="col-5">
                <div className="image-holder">
                  <Image
                    src={image ? image.url : "/images/intro-image.png"}
                    // src={profile?.url}
                    width={1000}
                    height={800}
                    alt="Hero Background"
                    string="parallax"
                    string-parallax="1"
                  />
                </div>
              </div>
              <div className="col-3">
                <p className="body-mid">
                  At Wholistic, we believe in nurturing your mind, body and soul
                  as healing modalities that ignore one of these will most
                  certainly lead to an imbalance in the others. We recognize
                  that the mind, body, and soul are interconnected, and that
                  true healing and growth can only be achieved by addressing all
                  three aspects. As our clients, your mind and body will find
                  solace in services provided by our expert therapists, yogis
                  and reiki masters, while you will be able to decode your soul
                  and its deeper musings through our astrologers and tarot card
                  readers who are specialized in the divination arts. With this
                  wide range of services and modalities, Wholistic is just the
                  companion that you need on your path to self-awareness,
                  transcendence and wholeness.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
