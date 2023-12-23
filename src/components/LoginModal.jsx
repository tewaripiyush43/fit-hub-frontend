import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions, portalActions } from "../store";

import { errorPopUp } from "../helpers/errorPopUp";

import logo from "../assets/images/blue-theme-Logo-removebg-preview.png";
import {
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const LoginModal = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    await axios
      .post(`${REACT_APP_BASE_URL}/auth/login`, {
        emailOrUsername: inputs.emailOrUsername.toLocaleLowerCase(),
        password: inputs.password,
      })
      .then((res) => {
        console.log(res);
        if (res.data?.error) {
          throw res.data.error;
        } else {
          localStorage.setItem("accessToken", res.data.accessToken);
          dispatch(authActions.login());
          dispatch(authActions.setUser(res.data.user));
          dispatch(portalActions.setPortalClose());
          navigate("/");
        }
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
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
      >
        X
      </button>
      <img className="login-logo" src={logo} alt="404" />
      <h2 className="login-welcome">Welcome to Fithub</h2>
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
          />
          {showPassword ? (
            <EyeOutlined
              onClick={() => setShowPassword(false)}
              className="login-page-icon"
            />
          ) : (
            <EyeInvisibleOutlined
              onClick={() => setShowPassword(true)}
              className="login-page-icon"
            />
          )}
        </div>
        <div className="remember-me">
          <span>Remember me</span>
          <Switch className="login-switch" />
        </div>
        <button className="login-submit-btn" type="submit">
          Login
        </button>
        {/* <div className="partition">
          <p>OR</p>
        </div> */}
        <p className="login-create-account-link">
          Don't have an account?{" "}
          <span onClick={() => dispatch(portalActions.setPortalTypeSignup())}>
            SIGNUP
          </span>
        </p>
        {/* <div className="login-forgot-pass-container">
          <Link to="/">RESET PASSWORD</Link> <Link to="/">SETTINGS</Link>
        </div> */}
      </form>
    </div>
  );
};

export default LoginModal;
