"use client";

import { fetchStrapi } from "@/utils/strapi";
import { useEffect, useState } from "react";
import { READERS_QUERY } from "@/queries/readers";
import { BookingFormModal } from "./BookingFormModal";
import { BookingModal } from "./BookingModal";
import { BookingForm } from "./BookingForm";
import Image from "next/image";
import { createPortal } from "react-dom";
import { StrapiImage } from "./StrapiImage";

export function BookASession() {
  const [readers, setReaders] = useState([]);
  const [selectedReader, setSelectedReader] = useState();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    fetchStrapi({ query: READERS_QUERY, key: "preachers" })().then(setReaders);
    setRendered(true);
  }, []);

  return (
    <>
      <button
        className="button button-cta"
        onClick={() => setShowBookingModal(true)}
      >
        Book a Session
      </button>

      {rendered
        ? createPortal(
            <BookingModal
              open={showBookingModal}
              title={
                !!selectedReader
                  ? `Booking With ${selectedReader?.name}`
                  : "Please select a Reader or Healer"
              }
              onClose={() => {
                setShowBookingModal(false);
                setTimeout(() => setSelectedReader(undefined), 500);
              }}
            >
              {!!selectedReader ? (
                <BookingForm
                  services={selectedReader?.services}
                  onCancel={() => {
                    setShowBookingModal(false);
                    setTimeout(() => setSelectedReader(undefined), 500);
                  }}
                />
              ) : (
                <ul className="reader-list">
                  {[
                    ...readers,
                    ...readers,
                    ...readers,
                    ...readers,
                    ...readers,
                  ].map((reader) => (
                    <li className="reader-list_item" key={reader.name}>
                      <div className="reader-list__content">
                        <figure>
                          <StrapiImage
                            src={reader.profile?.url}
                            width={100}
                            height={100}
                            alt=""
                          />
                        </figure>
                        <div>
                          <p className="name">{reader.name}</p>
                          <p>{reader.oneliner}</p>
                        </div>
                      </div>
                      <div>
                        <button
                          className="button small"
                          onClick={() => setSelectedReader(reader)}
                        >
                          Book a Session
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </BookingModal>,
            document.getElementById("modal-container")
          )
        : null}
    </>
  );
}
