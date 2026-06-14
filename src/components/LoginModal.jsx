import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { portalActions } from "../store";
import { login } from "../api/authApi";

import { errorPopUp } from "../helpers/errorPopUp";

import logo from "../assets/images/blue-theme-Logo-removebg-preview.webp";
import {
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const LoginModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (errorMessage.length > 0) {
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  const sendRequest = async () => {
    setLoading(true);
    try {
      await login(dispatch, inputs);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || "Failed to log in";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
  };

  return (
    <div className="modal-style">
      <button
        className="login-close-btn"
        onClick={() => dispatch(portalActions.setPortalClose())}
        aria-label="Close login modal"
      >
        X
      </button>
      <img className="login-logo" src={logo} alt="404" />
      <h2 className="login-welcome">Welcome to Fithub</h2>
      <div className="portal-type">
        <div className="segmented-control">
          <div
            onClick={() => dispatch(portalActions.setPortalTypeLogin())}
            className="active-tab"
          >
            <span>LOGIN</span>
          </div>
          <div
            onClick={() => dispatch(portalActions.setPortalTypeSignup())}
            className="inactive-tab"
          >
            <span>SIGNUP</span>
          </div>
        </div>
      </div>
      <form
        className="login-form"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <div className="login-form-textfield">
          <input
            className="login-form-input"
            name="emailOrUsername"
            value={inputs.emailOrUsername}
            onChange={handleChange}
            type="text"
            placeholder="Email or Username"
            required
            disabled={loading}
          />
          <MailOutlined className="login-page-icon" />
        </div>
        <div className="login-form-textfield">
          <input
            className="login-form-input"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            disabled={loading}
          />
          {showPassword ? (
            <EyeOutlined
              onClick={() => !loading && setShowPassword(false)}
              className="login-page-icon"
            />
          ) : (
            <EyeInvisibleOutlined
              onClick={() => !loading && setShowPassword(true)}
              className="login-page-icon"
            />
          )}
        </div>
        <div className="row1">
          <div className="remember-me">
            <input type="checkbox" disabled={loading} />
            <span className="remember-me-text">Remember me</span>
          </div>
          <p
            onClick={() => {
              if (!loading) {
                dispatch(portalActions.setPortalTypeForgotPassword());
              }
            }}
            className="forgot-password"
          >
            Forgot Password?
          </p>
        </div>
        <button className="login-submit-btn" type="submit" disabled={loading}>
          {loading ? (
            <div className="login-spinner-container">
              <span className="login-spinner"></span>
              <span>Logging you in...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>
        {/* <div className="partition">
          <p>OR</p>
        </div> */}
        <p className="login-create-account-link">
          Don't have an account?&nbsp;
          <span onClick={() => dispatch(portalActions.setPortalTypeSignup())}>
            SIGNUP
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginModal;
