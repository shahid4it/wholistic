import Image from "next/image";
export default function FAQ() {
  type FaqItem = { q: string; a: string };

  const faqs: FaqItem[] = [
    {
      q: "What can I expect from a psychic reading?",
      a: "Every psychic advisor has a slightly different style, but California Psychics prides itself on offering a warm, welcoming, and nonjudgmental psychic reading experience. Once your call or chat connects, you’re entirely welcome to take some time to get to know your chosen psychic advisor. This is also a wonderful time to share any relevant background information. Alternatively, you can simply begin asking your questions and dive right into your psychic reading.",
    },
    {
      q: "Do you offer support?",
      a: "Yes, email support 7 days a week and priority chat for Pro plans.",
    },
    {
      q: "Is there a free trial?",
      a: "A 7-day trial is available—no credit card required.",
    },
  ];
  return (
    <section className="questions">
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="list" role="list">
              {faqs.map(({ q, a }, i) => (
                <details key={i} className="item" role="listitem">
                  <summary className="question">
                    <span>{q}</span>
                    <span className="icon" aria-hidden="true" />
                  </summary>
                  <div className="answer">
                    <p>{a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
          <div className="col-3 offset-1">
            <div className="image-holder">
              <Image
                src="/images/image-faq.png"
                width={600}
                height={700}
                alt="FAQ's"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
