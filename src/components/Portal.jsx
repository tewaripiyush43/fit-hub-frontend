import React from "react";
import ReactDom from "react-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import ForgotPassword from "./ForgotPassword";
import { useSelector } from "react-redux";

const Portal = () => {
  const portalStates = useSelector((state) => state.portal);

  return ReactDom.createPortal(
    <div>
      <div className="overlay-style" />
      <div className="model">
        {portalStates.portalType === "Login" ? (
          <LoginModal />
        ) : portalStates.portalType === "Signup" ? (
          <SignupModal />
        ) : (
          <ForgotPassword />
        )}
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default Portal;
