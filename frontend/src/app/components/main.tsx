"use client";
import { ReactNode, useEffect } from "react";

import { StringTune } from "@fiddle-digital/string-tune";
import Header from "./header";
import Footer from "./footer";

interface MainProps {
  children: ReactNode;
}
export default function Main({ children }: MainProps) {
  useEffect(() => {
    const instance = StringTune.getInstance();
    instance.start(60); // or your preferred FPS
  }, []);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
