import MicroModal from "micromodal";
import { useEffect, useRef, useState } from "react";
import styles from "./Sebas-Modal.module.css";

export default function SebasModal({
  id,
  prompt,
  title = "Sebas modal",
  cancelButton = true,
  confirmButton = true,
  confirmText = "Continuar",
  cancelText = "Cancelar",
  disabled = false,
  onConfirm,
  children,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    MicroModal.init({});
  }, []);

  const openModal = () => {
    MicroModal.show(id);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    MicroModal.close(id);
  };

  return (
    <div>
      {prompt && (
        <button type="button" data-micromodal-trigger={id} onClick={openModal}>
          {prompt}
        </button>
      )}

      <div
        className="micromodal_slide"
        id={id}
        aria-hidden="true"
        ref={modalRef}
      >
        <div
          className={styles.modal__overlay}
          tabIndex="-1"
          data-micromodal-close
        >
          <div
            className={styles.modal__container}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
          >
            <header className={styles.modal__header}>
              <h2 className={styles.modal__title} id={`${id}-title`}>
                {title}
              </h2>
              <button
                className={styles.modal__close}
                aria-label="Close modal"
                data-micromodal-close
              ></button>
            </header>
            <main className={styles.modal__content} id={`${id}-content`}>
              {children}
            </main>
            <footer className={styles.modal__footer}>
              {confirmButton && (
                <button
                  onClick={handleConfirm}
                  disabled={disabled}
                  className={`${styles.modal__btn} ${styles.modal__btn_primary}`}
                  aria-label="Confirm the action this dialog window"
                >
                  {confirmText}
                </button>
              )}

              {cancelButton && (
                <button
                  className={styles.modal__btn}
                  disabled={disabled}
                  data-micromodal-close
                  aria-label="Close this dialog window"
                >
                  {cancelText}
                </button>
              )}
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
