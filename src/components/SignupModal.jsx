import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";

import logo from "../assets/images/image-removebg-preview.png";
import {
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const SignupMoal = ({ open, onClose, changeType }) => {
  if (!open) return null;

  return ReactDom.createPortal(
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
              type="text"
              placeholder="What should we call you?"
            />
            <UserOutlined className="login-page-icon" />
          </div>

          <div className="login-form-textfield">
            <input
              className="login-form-input"
              type="email"
              placeholder="Email "
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
          <div className="terms-and-condition">
            <input type="checkbox" />
            <Link to={"/"}> &nbsp; I agree to terms & conditions </Link>
          </div>
          <button className="login-submit-btn" type="submit">
            CREATE ACCOUNT
          </button>
          <div className="partition">
            <p>OR</p>
          </div>
          <p className="login-create-account-link">
            Already have an account? <span onClick={changeType}>LOGIN</span>
          </p>
        </form>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default SignupMoal;
