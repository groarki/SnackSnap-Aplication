const express = require("express");
const RecipeController = require("../controllers/RecipeController");

const router = express.Router();

router.get("/", RecipeController.getAllRecipes);
router.get("/add", RecipeController.getAddRecipeForm);
router.post("/add", RecipeController.addRecipe);
router.get("/search", RecipeController.searchRecipes);
router.get("/:id/edit", RecipeController.getEditRecipeForm);
router.post("/:id", RecipeController.updateRecipe);
router.post("/:id/rating", RecipeController.addRating);
router.delete("/:id", RecipeController.deleteRecipe);
router.get("/:id", RecipeController.getRecipeById);

module.exports = router;
