import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/");
  };

  return (
    <div className="recipes-page-container">
      <div className="recipe-text">
        I TOLD YOU NOT TO CLICK...😡
        <p> NOW GO BACK. </p>
        <button onClick={handleOnClick}>Please take me back 🙏</button>
      </div>
    </div>
  );
};

export default Recipes;
