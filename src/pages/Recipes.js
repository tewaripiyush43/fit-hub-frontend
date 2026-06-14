import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CloseIcon from "@mui/icons-material/Close";

const RECIPES_DATA = [
  {
    id: 1,
    name: "Classic High-Protein Oatmeal",
    category: "High Protein",
    calories: 420,
    protein: "32g",
    carbs: "45g",
    fat: "8g",
    prepTime: "10 mins",
    difficulty: "Easy",
    image: "🥣",
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup unsweetened almond milk",
      "1 scoop vanilla whey protein powder",
      "1/2 banana, sliced",
      "1 tbsp chia seeds",
      "A pinch of cinnamon"
    ],
    instructions: [
      "In a saucepan, combine oats and almond milk. Bring to a boil, then simmer for 5 minutes.",
      "Remove from heat and let cool for 2 minutes (to prevent protein powder from clumping).",
      "Stir in the protein powder and cinnamon until smooth.",
      "Top with sliced banana and chia seeds. Serve warm."
    ]
  },
  {
    id: 2,
    name: "Avocado Chicken Salad",
    category: "Low Carb",
    calories: 380,
    protein: "38g",
    carbs: "10g",
    fat: "22g",
    prepTime: "15 mins",
    difficulty: "Easy",
    image: "🥗",
    ingredients: [
      "150g grilled chicken breast, shredded",
      "1/2 ripe avocado, mashed",
      "2 tbsp Greek yogurt (plain, 0% fat)",
      "1 cup mixed salad greens",
      "1 tbsp lime juice",
      "Salt and black pepper to taste"
    ],
    instructions: [
      "In a medium bowl, mix mashed avocado, Greek yogurt, and lime juice until creamy.",
      "Add shredded chicken breast and fold until evenly coated.",
      "Season with salt and pepper to taste.",
      "Serve over a bed of mixed salad greens or wrap in lettuce leaves."
    ]
  },
  {
    id: 3,
    name: "Keto Grilled Salmon Bowl",
    category: "Keto",
    calories: 520,
    protein: "40g",
    carbs: "8g",
    fat: "36g",
    prepTime: "20 mins",
    difficulty: "Medium",
    image: "🐟",
    ingredients: [
      "180g salmon fillet",
      "1 cup cauliflower rice",
      "1 cup fresh baby spinach",
      "1 tbsp olive oil",
      "1/2 avocado, sliced",
      "Lemon wedges for serving"
    ],
    instructions: [
      "Season salmon with salt, pepper, and a squeeze of lemon.",
      "Heat olive oil in a pan and sear salmon for 4-5 minutes on each side.",
      "Sauté cauliflower rice and baby spinach in the same pan until tender.",
      "Assemble the bowl with cauliflower rice, sautéed spinach, grilled salmon, and sliced avocado."
    ]
  },
  {
    id: 4,
    name: "Tofu Quinoa Stir-Fry",
    category: "Vegan",
    calories: 390,
    protein: "22g",
    carbs: "52g",
    fat: "12g",
    prepTime: "25 mins",
    difficulty: "Medium",
    image: "🥦",
    ingredients: [
      "150g firm tofu, cubed",
      "1/2 cup uncooked quinoa",
      "1 cup broccoli florets",
      "1/2 red bell pepper, sliced",
      "1 tbsp low-sodium soy sauce",
      "1 tsp sesame oil"
    ],
    instructions: [
      "Cook quinoa according to package instructions.",
      "Heat sesame oil in a wok or large skillet over medium-high heat.",
      "Add cubed tofu and stir-fry until golden brown on all sides. Remove from pan.",
      "Stir-fry broccoli and bell pepper for 4-5 minutes until tender-crisp.",
      "Toss quinoa, tofu, and soy sauce back into the skillet. Mix well and serve."
    ]
  },
  {
    id: 5,
    name: "Oatmeal Protein Pancakes",
    category: "High Protein",
    calories: 350,
    protein: "28g",
    carbs: "38g",
    fat: "6g",
    prepTime: "15 mins",
    difficulty: "Easy",
    image: "🥞",
    ingredients: [
      "1/2 cup oat flour (blended oats)",
      "1 scoop vanilla protein powder",
      "2 egg whites",
      "1/4 cup unsweetened almond milk",
      "1/2 tsp baking powder",
      "1/4 cup fresh blueberries"
    ],
    instructions: [
      "Blend oat flour, protein powder, egg whites, almond milk, and baking powder until smooth.",
      "Heat a non-stick skillet over medium heat.",
      "Pour batter to form small pancakes, drop blueberries on top.",
      "Flip when bubbles form (about 2 mins) and cook the other side until golden."
    ]
  },
  {
    id: 6,
    name: "Low-Carb Turkey & Hummus Wrap",
    category: "Low Carb",
    calories: 290,
    protein: "24g",
    carbs: "12g",
    fat: "14g",
    prepTime: "5 mins",
    difficulty: "Easy",
    image: "🌯",
    ingredients: [
      "4 large romaine lettuce leaves (used as wraps)",
      "120g sliced deli turkey breast",
      "2 tbsp roasted red pepper hummus",
      "1/2 cucumber, sliced into matchsticks",
      "1/4 red onion, thinly sliced"
    ],
    instructions: [
      "Lay out lettuce leaves flat.",
      "Spread hummus evenly across the center of each leaf.",
      "Layer turkey slices, cucumber sticks, and red onion over the hummus.",
      "Roll up carefully and secure with toothpicks if needed. Serve chilled."
    ]
  }
];

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const categories = ["All", "High Protein", "Low Carb", "Keto", "Vegan"];

  const filteredRecipes = RECIPES_DATA.filter((recipe) => {
    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((ing) =>
        ing.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="recipes-dashboard-container">
      <div className="recipes-hero-header">
        <h1 className="recipes-title">Nutritious <span>Recipes</span></h1>
        <p className="recipes-subtitle">
          Fuel your workouts and support your recovery with simple, wholesome, and macro-friendly meals.
        </p>
      </div>

      <div className="recipes-search-filter-section">
        {/* Search Input */}
        <div className="recipes-search-bar">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search by meal name or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="recipes-filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="recipes-grid">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card" onClick={() => setSelectedRecipe(recipe)}>
            <div className="recipe-card-media">
              <span className="recipe-emoji">{recipe.image}</span>
              <span className="recipe-category-badge">{recipe.category}</span>
            </div>
            <div className="recipe-card-content">
              <h3 className="recipe-card-title">{recipe.name}</h3>
              
              <div className="recipe-stats-row">
                <div className="stat-pill">
                  <LocalFireDepartmentIcon className="stat-icon" />
                  <span>{recipe.calories} kcal</span>
                </div>
                <div className="stat-pill">
                  <FitnessCenterIcon className="stat-icon" />
                  <span>{recipe.protein} Protein</span>
                </div>
              </div>

              <div className="recipe-footer-row">
                <div className="recipe-time">
                  <AccessTimeIcon className="time-icon" />
                  <span>{recipe.prepTime}</span>
                </div>
                <span className={`difficulty-badge ${recipe.difficulty.toLowerCase()}`}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredRecipes.length === 0 && (
          <div className="no-recipes-found">
            <RestaurantIcon className="no-recipes-icon" />
            <p>No recipes match your criteria. Try searching for something else!</p>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="recipe-detail-modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="recipe-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedRecipe(null)} aria-label="Close recipe details modal">
              <CloseIcon />
            </button>

            <div className="modal-header-section">
              <span className="modal-emoji">{selectedRecipe.image}</span>
              <span className="modal-category">{selectedRecipe.category}</span>
              <h2 className="modal-title">{selectedRecipe.name}</h2>
            </div>

            {/* Nutrition breakdown cards */}
            <div className="modal-nutrition-grid">
              <div className="nutrition-card calories">
                <span className="nutrition-label">Calories</span>
                <span className="nutrition-val">{selectedRecipe.calories} kcal</span>
              </div>
              <div className="nutrition-card protein">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-val">{selectedRecipe.protein}</span>
              </div>
              <div className="nutrition-card carbs">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-val">{selectedRecipe.carbs}</span>
              </div>
              <div className="nutrition-card fat">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-val">{selectedRecipe.fat}</span>
              </div>
            </div>

            <div className="modal-split-content">
              {/* Ingredients */}
              <div className="ingredients-block">
                <h4 className="block-title">Ingredients</h4>
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="instructions-block">
                <h4 className="block-title">Instructions</h4>
                <ol className="instructions-list">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
