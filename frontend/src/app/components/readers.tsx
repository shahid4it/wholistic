"use client";

import Image from "next/image";
import Link from "next/link";

import Reader from "./reader";
import { useState } from "react";
import { ReaderModalContext } from "@/contexts/readerModal";
import { BookingModal } from "./BookingModal";
import { BookingForm } from "./BookingForm";

export default function Readers({ readers = [] }) {
  const [reader, setReader] = useState();
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);

  return (
    <>
      <section className="readers-list">
        <div className="container">
          <ReaderModalContext.Provider value={reader}>
            <div className="row">
              {readers.map((preacher) => (
                <div className="col-4" key={preacher.name}>
                  <Reader
                    {...preacher}
                    onBooking={() => {
                      setReader(preacher);
                      setIsReaderModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </ReaderModalContext.Provider>
        </div>
      </section>

      <BookingModal
        open={isReaderModalOpen}
        title={`Booking With ${reader?.name}`}
        onClose={() => {
          setIsReaderModalOpen(false);
          setTimeout(() => setReader(undefined), 500);
        }}
      >
        <BookingForm
          services={reader?.services}
          onCancel={() => {
            setIsReaderModalOpen(false);
            setTimeout(() => setReader(undefined), 500);
          }}
        />
      </BookingModal>
    </>
  );
}
