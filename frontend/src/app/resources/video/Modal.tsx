"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function VideoModal() {
  const params = useSearchParams();
  const router = useRouter();

  const url = params.get("video");

  const open = !!url;

  return (
    <article className={`modal ${open ? "show" : ""}`}>
      <button type="button" className="modal_backdrop" onClick={router.back} />

      <div className="modal_main modal_main--video">
        <div className="modal_title">
          <h3>Video</h3>
          <button type="button" onClick={router.back}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L17 17M1 17L17 1L1 17Z"
                stroke="#C55341"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="modal_content">
          <iframe
            src={url!}
            width="100%"
            height="600"
            className="iframe"
            style={{ border: "none" }}
          />
        </div>
      </div>
    </article>
  );
}
