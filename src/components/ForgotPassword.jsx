import React, { useState } from "react";
import { portalActions } from "../store/index";
import { useDispatch } from "react-redux";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [emailSent, setEmailSent] = useState(false);

  return (
    <div className="modal-style">
      {emailSent && (
        <p className="forgot-password-text sent">
          Please check your email for a link to reset your password and follow
          the instructions provided.
        </p>
      )}
      <p className="forgot-password-text">
        Enter your email address or username to reset your password
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setEmailSent(true);
        }}
        className="forgot-password-form"
      >
        <input
          className="forgot-password-textfield"
          type="email"
          placeholder="Email"
          required
        />
        <button type="submit" className="forgot-password-button">
          Send Reset Email
        </button>
      </form>
      <div className="return-back-container">
        <p
          onClick={() => {
            dispatch(portalActions.setPortalTypeLogin());
          }}
        >
          {" "}
          &larr; back to login
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
