import React from "react";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const ResetPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="reset-password-container">
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <InfoOutlinedIcon style={{ fontSize: "2.5rem", color: "#00e5ff" }} />
      </div>
      <h2 className="reset-password-header">Reset Password</h2>
      <p className="reset-password-text" style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#b0b0c0", textAlign: "center" }}>
        Self-service password token recovery is currently not active in this environment. To update your password, log into your account and navigate to Profile Settings or contact your administrator.
      </p>
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <button
          type="button"
          className="reset-password-button"
          onClick={() => navigate("/")}
          style={{ width: "100%", padding: "12px" }}
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
