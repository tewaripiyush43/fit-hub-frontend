import React from "react";
import { createPortal } from "react-dom";

const ConfirmationPopup = ({ onClose, onDelete, textContent }) => {
  const portalRoot = document.getElementById("portal") || document.body;

  return createPortal(
    <div className="popup-overlay">
      <div className="popup-modal">
        <p>Are you sure you want to delete this {textContent}?</p>
        <div className="popup-button-container">
          <button className="popup-delete" onClick={onDelete}>
            Delete
          </button>
          <button className="popup-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default ConfirmationPopup;
