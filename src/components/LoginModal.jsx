import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";

import logo from "../assets/images/image-removebg-preview.png";
import {
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const LoginModal = ({ open, onClose, changeType }) => {
  if (!open) return null;

  return (
    <>
      <div className="modal-style">
        <button className="login-close-btn" onClick={onClose}>
          X
        </button>
        <img className="login-logo" src={logo} alt="404" />
        <h2 className="login-welcome">Welcome to Fithub</h2>
        <form className="login-form" encType="multipart/form-data">
          <div className="login-form-textfield">
            <input
              className="login-form-input"
              type="email"
              placeholder="Email or username"
            />
            <MailOutlined className="login-page-icon" />
          </div>
          <div className="login-form-textfield">
            <input
              className="login-form-input"
              type="password"
              placeholder="Password"
            />
            <EyeInvisibleOutlined className="login-page-icon" />
          </div>
          <div className="remember-me">
            <span>Remember me</span>
            <Switch className="login-switch" />
          </div>
          <button className="login-submit-btn" type="submit">
            Login
          </button>
          <div className="partition">
            <p>OR</p>
          </div>
          <p className="login-create-account-link">
            Don't have an account? <span onClick={changeType}>SIGNUP</span>
          </p>
          <div className="login-forgot-pass-container">
            <Link to="/">RESET PASSWORD</Link> <Link to="/">SETTINGS</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginModal;
