import React, { useState } from "react";

const ResetPassword = () => {
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-header">Reset Password</h2>
      <p className="reset-password-text">
        Enter your new password and confirm your new password
      </p>

      {passwordUpdated ? (
        <p className="reset-password-text">
          Your password has been updated. Please close this tab and log in with
          your new password.
        </p>
      ) : (
        <form
          className="reset-password-form"
          onSubmit={() => {
            setPasswordUpdated(true);
          }}
        >
          <input
            className="reset-password-textfield"
            type="password"
            placeholder="New Password"
            required
          />
          <input
            className="reset-password-textfield"
            type="password"
            placeholder="Confirm New Password"
            required
          />
          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
