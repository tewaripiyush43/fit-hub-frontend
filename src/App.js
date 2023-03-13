import React, { useState, useEffect } from "react";
import { Route, Routes, useParams } from "react-router-dom";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";

import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import Loader from "./components/Loader";

import "./styles/_styles.scss";
// import Test from "./pages/Test";
import ExercisePage from "./pages/ExercisePage";
import ExercisesPage from "./pages/Exercises";

function App() {
  const [loading, setLoading] = useState(false);
  // let params = useParams();
  // console.log(params);

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
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
