// import styles from "./BookingModal.module.sass";

export function BookingModal({ children, open, onClose, title }) {
  return (
    <article className={`modal ${open ? "show" : ""}`}>
      <button type="button" className="modal_backdrop" onClick={onClose} />

      <div className="modal_main">
        <div className="modal_title">
          <h3>{title}</h3>
          <button type="button" onClick={onClose}>
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="modal_content">{children}</div>
      </div>
    </article>
  );
}
