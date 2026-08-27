import React from "react";
import { portalActions } from "../store/index";
import { useDispatch } from "react-redux";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  return (
    <div className="modal-style">
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <InfoOutlinedIcon style={{ fontSize: "2.4rem", color: "#00e5ff" }} />
      </div>
      <h3 style={{ color: "#fff", marginBottom: "12px", textAlign: "center" }}>
        Password Recovery
      </h3>
      <p className="forgot-password-text" style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#b0b0c0", textAlign: "center" }}>
        Self-service email password reset is currently not configured in this environment. If you require password assistance or credential recovery, please reach out to the support team or your administrator.
      </p>
      <div className="return-back-container" style={{ marginTop: "24px", textAlign: "center" }}>
        <button
          type="button"
          className="forgot-password-button"
          onClick={() => {
            dispatch(portalActions.setPortalTypeLogin());
          }}
          style={{ width: "100%", padding: "12px" }}
        >
          &larr; Return to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
