import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="headeer__left">
          <Link href={"/"}>Wholistic</Link>
        </div>
        <div className="headeer__right">
          <nav className="menu">
            <ul className="nav">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="#">Our Services</Link>
              </li>
              <li>
                <Link href="#">Psychics</Link>
              </li>
              <li>
                <Link href="#">Pricing</Link>
              </li>
              <li>
                <Link href="#">Resources</Link>
              </li>
              <li>
                <Link href="#">Contact Us</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
