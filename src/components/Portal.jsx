import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import LoginModal from "./LoginModal";
import SignupMoal from "./SignupModal";

const Portal = ({ open, children, onClose }) => {
  const [isTypeLogin, setIsTypeLogin] = useState(true);
  if (!open) return null;

  return ReactDom.createPortal(
    <div>
      <div className="overlay-style" />
      <div className="portal-type">
        <div
          onClick={() => setIsTypeLogin(true)}
          className={!isTypeLogin ? "login-selected" : ""}
        >
          <span>LOGIN</span>
        </div>
        <div
          onClick={() => setIsTypeLogin(false)}
          className={isTypeLogin ? "signup-selected" : ""}
        >
          <span>SIGNUP</span>
        </div>
      </div>
      {isTypeLogin ? (
        <LoginModal
          open={open}
          onClose={onClose}
          changeType={() => setIsTypeLogin(false)}
        />
      ) : (
        <SignupMoal
          open={open}
          onClose={onClose}
          changeType={() => setIsTypeLogin(true)}
        />
      )}
    </div>,
    document.getElementById("portal")
  );
};

export default Portal;
