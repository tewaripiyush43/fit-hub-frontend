import { useNavigate } from "react-router-dom";

const Navbar = () => {
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
        </div>
      </nav>
    </>
  );
};

export default Navbar;
