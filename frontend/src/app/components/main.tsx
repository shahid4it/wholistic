import { ReactNode, useEffect } from "react";
import { Tune } from "./tune";

import Header from "./header";
import Footer from "./footer";
import Subscribe from "./subscribe";

interface MainProps {
  children: ReactNode;
}
export default async function Main({ children }: MainProps) {
  return (
    <>
      <Tune />
      <Header />
      {children}
      <Subscribe />
      <Footer />
      <div id="modal-container"></div>
    </>
  );
}
