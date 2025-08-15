import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__background">
        <Image
          src="/images/hero.png"
          width={1200}
          height={700}
          alt="Hero Background"
        />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">
          Your companion in your journey to wholeness
        </h1>
        <Link href="#" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    </section>
  );
}
