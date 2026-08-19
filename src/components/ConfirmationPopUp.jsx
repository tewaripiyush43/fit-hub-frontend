import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const ConfirmationPopup = ({
  onClose,
  onDelete,
  onConfirm,
  textContent = "item",
  title = "Confirm Action",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = true,
}) => {
  const portalRoot = document.getElementById("portal") || document.body;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAction = onConfirm || onDelete;
  const displayMessage =
    message || `Are you sure you want to delete this ${textContent}? This action cannot be undone.`;

  return createPortal(
    <div
      className="popup-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="popup-modal">
        <div className="popup-icon-container">
          <WarningAmberRoundedIcon className="popup-warning-icon" />
        </div>
        <h3 className="popup-title">{title}</h3>
        <p className="popup-message">{displayMessage}</p>
        <div className="popup-button-container">
          <button className="popup-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className={isDanger ? "popup-delete" : "popup-confirm"}
            onClick={handleAction}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default ConfirmationPopup;
