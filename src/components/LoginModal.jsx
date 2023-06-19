import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";

import logo from "../assets/images/image-removebg-preview.png";
import {
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const LoginModal = ({ open, onClose, changeType }) => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const history = useNavigate();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    await axios
      .post(`${REACT_APP_BASE_URL}/auth/login`, {
        email: inputs.email,
        password: inputs.password,
      })
      .then((res) => {
        console.log(res);
        if (res.data?.error?.status === 401) {
          alert("Invalid credentials");
          // return res.data.error;
        } else {
          localStorage.setItem("accessToken", res.data.accessToken);
          onClose();
          dispatch(authActions.setUser(res.data.user));
          dispatch(authActions.login());
          history("/");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log();
    sendRequest();
    //   dispatch(authActions.login());
  };

  return (
    <div className="modal-style">
      <button className="login-close-btn" onClick={onClose}>
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
            name="email"
            value={inputs.email}
            onChange={handleChange}
            type="email"
            placeholder="Email or username"
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
  );
};

export default LoginModal;
