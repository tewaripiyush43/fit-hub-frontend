import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/index";

import logo from "../assets/images/image-removebg-preview.png";
import {
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined,
} from "@ant-design/icons";

axios.defaults.withCredentials = true;
const SignupMoal = ({ open, onClose, changeType }) => {
  const navigate = useNavigate();
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  // const isLoggedIn = useSelector((state) => state.isLoggedIn);

  if (!open) return null;

  const handleChange = (e) => {
    // console.log(e.target.name + " " + e.target.value);
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequestToGetUser = async () => {
    await axios
      .get(`${REACT_APP_BASE_URL}/auth/private`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        console.log(res);
        dispatch(authActions.setUser(res.data.user));
        dispatch(authActions.login());
        onClose();
        changeType(!changeType);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const sendRegisterRequest = async () => {
    await axios
      .post(`${REACT_APP_BASE_URL}/auth/register`, {
        // name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      })
      .then((res) => {
        console.log(res.data);
        console.log("User registered Successfully");
        localStorage.setItem("accessToken", res.data.accessToken);
        sendRequestToGetUser();
      })
      .catch((err) => console.log(err, { message: "User already exists" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log();
    sendRegisterRequest();
    // .then(() => console.log("User registered Successfully"))
    // .catch((err) => console.log({ message: "User already exists" }));
  };

  return ReactDom.createPortal(
    <div>
      <div className="modal-style">
        <button
          className="login-close-btn"
          onClick={() => {
            onClose();
            changeType(!changeType);
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
              name="name"
              className="login-form-input"
              type="text"
              value={inputs.name}
              placeholder="What should we call you?"
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
          <div className="partition">
            <p>OR</p>
          </div>
          <p className="login-create-account-link">
            Already have an account? <span onClick={changeType}>LOGIN</span>
          </p>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
};

export default SignupMoal;
