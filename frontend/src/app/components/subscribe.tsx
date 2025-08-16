import Image from "next/image";

export default function Subscribe() {
  return (
    <section className="subscribe">
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="subscribe__image">
              <Image
                src="/images/subscribe.png"
                width={900}
                height={1000}
                alt="Hero Background"
              />
            </div>
          </div>
          <div className="col-3 offset-1">
            <div className="subscribe__content">
              <div className="content">
                <h2>Subscribe to our newsletter</h2>
                <p className="body-mid">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
                  eleifend odio ut ante tristique, non pulvinar tellus tempor.
                  In convallis accumsan ipsum.{" "}
                </p>
              </div>
              <div className="subscribe-form">
                <div className="input-field">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter your name" />
                </div>

                <div className="input-field">
                  <label>Email Address</label>
                  <input type="text" placeholder="Enter your email address" />
                </div>
                <button className="button">Sign up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
