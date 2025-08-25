"use client";

import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { BookingModal } from "./BookingModal";

export function BookingFormModal({ reader }) {
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="button small"
        onClick={() => setIsReaderModalOpen(true)}
      >
        Book a Session
      </button>
      <BookingModal
        open={isReaderModalOpen}
        title={`Booking With ${reader?.name}`}
        onClose={() => {
          setIsReaderModalOpen(false);
        }}
      >
        <BookingForm
          services={reader.services}
          onCancel={() => {
            setIsReaderModalOpen(false);
          }}
        />
      </BookingModal>
    </>
  );
}
