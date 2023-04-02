import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import LoginModal from "./LoginModal";
import Portal from "./Portal.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const takeToHomePage = () => {
    navigate(`/`);
  };

  const takeToExercisesPage = () => {
    navigate(`/exercises/all`);
  };

  const takeToRecipesPage = () => {
    navigate(`/recipes`);
  };

  function handleOpen() {
    setIsOpen(true);
    document.documentElement.classList.add("modal-open");
  }

  function handleClose() {
    console.log("yo");
    setIsOpen(false);
    document.documentElement.classList.remove("modal-open");
  }

  return (
    <>
      <nav id="nav">
        <h2 onClick={takeToHomePage} id="heading">
          FitHub
        </h2>

        <div className="links">
          <h3 onClick={takeToExercisesPage} className="link">
            Exercises
          </h3>
          <h3 onClick={takeToRecipesPage} className="link">
            Recipes
          </h3>
          <button
            onClick={() => {
              setIsOpen(true);
              handleOpen();
            }}
            className="login-btn"
          >
            Login
          </button>
          <Portal
            open={isOpen}
            onClose={() => {
              setIsOpen(false);
              handleClose();
            }}
          />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
