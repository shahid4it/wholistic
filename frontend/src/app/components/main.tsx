import { ReactNode, useEffect } from "react";
import { Parallax } from "./parallax";
import { SmoothScroll } from "./smoothScroll";

import Header from "./header";
import Footer from "./footer";
import Subscribe from "./subscribe";

interface MainProps {
  children: ReactNode;
}
export default async function Main({ children }: MainProps) {
  return (
    <>
      <SmoothScroll />
      <Parallax />
      <Header />
      {children}
      <Subscribe />
      <Footer />
      <div id="modal-container"></div>
    </>
  );
}
