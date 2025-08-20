"use client";

import StringTune, { StringParallax } from "@fiddle-digital/string-tune";
import { useEffect } from "react";

export function NewsletterAnimation() {
  useEffect(() => {
    const tune = StringTune.getInstance();
    tune.use(StringParallax);
    tune.start(60); // Start at 60 FPS (adjust as needed)
  }, []);
  return <></>;
}
