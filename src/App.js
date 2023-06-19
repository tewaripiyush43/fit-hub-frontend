import React, { useState, useEffect } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";

import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

import "./styles/styles.scss";
// import Test from "./pages/Test";
import ExercisePage from "./pages/ExercisePage";
import ExercisesPage from "./pages/Exercises";

import axios from "axios";
import UserProfile from "./components/UserProfile";

axios.defaults.withCredentials = true;

function App() {
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="App">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exercises/:search" element={<ExercisesPage />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/exercise/:id" element={<ExercisePage />} />
            <Route path="/:username" element={<UserProfile />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
