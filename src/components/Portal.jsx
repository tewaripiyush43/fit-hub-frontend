import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import ForgotPassword from "./ForgotPassword";
import { useDispatch, useSelector } from "react-redux";
import { portalActions } from "../store/index.js";

const Portal = () => {
  const dispatch = useDispatch();
  const portalStates = useSelector((state) => state.portal);

  return ReactDom.createPortal(
    <div>
      <div className="overlay-style" />
      <div className="model">
        <div>
          {portalStates.portalType !== "ForgotPassword" && (
            <div className="portal-type">
              <div
                onClick={() => dispatch(portalActions.setPortalTypeLogin())}
                className={
                  portalStates.portalType !== "Login" ? "login-selected" : ""
                }
              >
                <span>LOGIN</span>
              </div>
              <div
                onClick={() => dispatch(portalActions.setPortalTypeSignup())}
                className={
                  portalStates.portalType !== "Signup" ? "signup-selected" : ""
                }
              >
                <span>SIGNUP</span>
              </div>
            </div>
          )}
          {portalStates.portalType === "Login" ? (
            <LoginModal />
          ) : portalStates.portalType === "Signup" ? (
            <SignupModal />
          ) : (
            <ForgotPassword />
          )}
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default Portal;
