import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "./IconButton";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md", // 'md' | 'lg' | 'xl'
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fh-modal-overlay"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "fh-modal-title" : undefined}
    >
      <div
        className={`fh-modal fh-modal--${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fh-modal__sheet-handle" aria-hidden="true" />
        {(title || showCloseButton) && (
          <div className="fh-modal__header">
            {title ? (
              <h3 id="fh-modal-title" className="fh-modal__title">
                {title}
              </h3>
            ) : (
              <div />
            )}
            {showCloseButton && (
              <IconButton
                icon={<CloseIcon />}
                ariaLabel="Close modal"
                onClick={onClose}
                subtle
              />
            )}
          </div>
        )}
        <div className="fh-modal__body">{children}</div>
        {footer && <div className="fh-modal__footer">{footer}</div>}
      </div>
    </div>
  );

  const portalRoot = document.getElementById("portal") || document.body;
  return ReactDOM.createPortal(modalContent, portalRoot);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(["md", "lg", "xl"]),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;
