import "./styles/styles.scss";
import React, { useState, useEffect } from "react";
import { Route, Routes, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import ExercisePage from "./pages/ExercisePage";
import ExercisesPage from "./pages/Exercises";
import UserProfile from "./pages/UserProfile";
import WorkoutPage from "./pages/WorkoutPage";
import SharedWorkoutPage from "./pages/SharedWorkoutPage";

import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import UserProfileSideBar from "./components/UserProfileSideBar";

import "react-toastify/dist/ReactToastify.css";
import { getUser } from "./api/authAPI";
import PageNotFound from "./components/PageNotFound";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  // console.log(REACT_APP_BASE_URL);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isRouteResetPassword =
    window.location.pathname.includes("/reset-password");

  const shouldRenderNavbar = isRouteResetPassword;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    getUser(dispatch, REACT_APP_BASE_URL);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getUser(dispatch, REACT_APP_BASE_URL);
    }
  }, [isLoggedIn]);

  return (
    <div className={`App ${isLoggedIn ? "has-sidebar" : ""}`}>
      <ToastContainer
        theme="dark"
        progressStyle={{
          background: "red",
        }}
      />
      {isLoggedIn && <UserProfileSideBar />}
      <div className="main-app-content">
        {!shouldRenderNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/exercises/:search" element={<ExercisesPage />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/exercise/:id" element={<ExercisePage />} />
          <Route path="/:username/:page" element={<UserProfile />} />

          <Route
            path="/:username/myworkouts/:workoutId"
            element={<WorkoutPage />}
          />
          <Route path="/share/workout/:workoutId" element={<SharedWorkoutPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
