import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { errorPopUp } from "../helpers/errorPopUp";
import { portalActions } from "../store/index";
import logo from "../assets/images/blue-theme-Logo-removebg-preview.png";
import { getUser } from "../api/authAPI";

axios.defaults.withCredentials = true;
const SignupModal = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
    await axios
      .post(`${REACT_APP_BASE_URL}/auth/register`, {
        username: inputs.username.toLocaleLowerCase(),
        email: inputs.email.toLowerCase(),
        password: inputs.password,
      })
      .then((res) => {
        console.log(res);
        if (res.data?.error) {
          throw res.data?.error;
        } else {
          // console.log("User registered Successfully");
          localStorage.setItem("accessToken", res.data.accessToken);
          getUser(dispatch, REACT_APP_BASE_URL);
          return;
        }
      })
      .catch((err) => {
        console.log(err.message);
        setErrorMessage(err.message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRegisterRequest();
  };

  return (
    <div>
      <div className="modal-style">
        <button
          className="login-close-btn"
          onClick={() => {
            dispatch(portalActions.setPortalClose());
          }}
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
              onChange={handleChange}
              name="username"
              className="login-form-input"
              type="text"
              value={inputs.username}
              placeholder="Username"
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
          <div className="terms-and-condition">
            <input type="checkbox" />
            <Link to={"/"}> &nbsp; I agree to terms & conditions </Link>
          </div>
          <button className="login-submit-btn" type="submit">
            CREATE ACCOUNT
          </button>
          {/* <div className="partition">
            <p>OR</p>
          </div> */}
          <p className="login-create-account-link">
            Already have an account?
            <span onClick={() => dispatch(portalActions.setPortalTypeLogin())}>
              LOGIN
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
