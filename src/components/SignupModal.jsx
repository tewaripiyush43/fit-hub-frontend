import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { errorPopUp } from "../helpers/errorPopUp";
import { portalActions } from "../store/index";
import logo from "../assets/images/blue-theme-Logo-removebg-preview.webp";
import { register } from "../api/authApi";
const SignupModal = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (errorMessage.length > 0) {
      // console.log(errorMessage);
      errorPopUp(errorMessage);
      setErrorMessage("");
    }
  }, [errorMessage]);

  const sendRegisterRequest = async () => {
    setLoading(true);
    try {
      await register(dispatch, inputs);
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || "Failed to register";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    if (!agreeToTerms) {
      setErrorMessage("Please agree to the terms and conditions");
      return;
    }
    sendRegisterRequest();
  };

  return (
    <div className="modal-style">
      <button
        className="login-close-btn"
        onClick={() => {
          if (!loading) dispatch(portalActions.setPortalClose());
        }}
        aria-label="Close signup modal"
      >
        X
      </button>
      <img className="login-logo" src={logo} alt="404" />
      <h2 className="login-welcome">Welcome to Fithub</h2>
      <div className="portal-type">
        <div className="segmented-control">
          <div
            onClick={() => dispatch(portalActions.setPortalTypeLogin())}
            className="inactive-tab"
          >
            <span>LOGIN</span>
          </div>
          <div
            onClick={() => dispatch(portalActions.setPortalTypeSignup())}
            className="active-tab"
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
              onChange={handleChange}
              name="username"
              className="login-form-input"
              type="text"
              value={inputs.username}
              placeholder="Username"
              disabled={loading}
              required
            />
            <UserOutlined className="login-page-icon" />
          </div>

          <div className="login-form-textfield">
            <input
              onChange={handleChange}
              name="email"
              className="login-form-input"
              type="email"
              value={inputs.email}
              placeholder="Email"
              required
              disabled={loading}
            />
            <MailOutlined className="login-page-icon" />
          </div>
          <div className="login-form-textfield">
            <input
              onChange={handleChange}
              name="password"
              className="login-form-input"
              value={inputs.password}
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
          <div className="terms-and-condition">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={agreeToTerms}
              disabled={loading}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />
            <label htmlFor="terms-checkbox" style={{ cursor: "pointer", userSelect: "none", color: "inherit" }}>
              &nbsp; I agree to terms & conditions
            </label>
          </div>
          <button className="login-submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <div className="login-spinner-container">
                <span className="login-spinner"></span>
                <span>Creating Account...</span>
              </div>
            ) : (
              "CREATE ACCOUNT"
            )}
          </button>
          {/* <div className="partition">
            <p>OR</p>
          </div> */}
          <p className="login-create-account-link">
            Already have an account?&nbsp;
            <span
              onClick={() => {
                if (!loading) dispatch(portalActions.setPortalTypeLogin());
              }}
            >
              LOGIN
            </span>
          </p>
        </form>
      </div>
  );
};

export default SignupModal;
