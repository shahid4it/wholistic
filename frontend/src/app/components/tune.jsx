"use client";

import { useEffect } from "react";
import { StringTune } from "@fiddle-digital/string-tune";

export function Tune() {
  useEffect(() => {
    const instance = StringTune.getInstance();
    instance.start(60); // or your preferred FPS
  }, []);

  return <></>;
}
