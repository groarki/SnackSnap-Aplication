const RecipeModel = require("../models/Recipe");
const { MENU_LINKS } = require("../constants/navigation");

class RecipeController {
  static async getAllRecipes(req, res) {
    try {
      const { search, category } = req.query;
      let recipes;

      if (search) {
        recipes = await RecipeModel.search(search);
      } else if (category) {
        recipes = await RecipeModel.getRecipesByCategory(category);
      } else {
        recipes = await RecipeModel.getAllRecipes();
      }

      const categories = RecipeModel.getCategories();

      res.render("recipes", {
        headTitle: "SnackSnap - Wszystkie przepisy",
        menuLinks: MENU_LINKS,
        activeLinkPath: "/recipes",
        recipes: recipes,
        categories: categories,
        searchQuery: search || "",
        selectedCategory: category || "",
      });
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).render("404", {
        headTitle: "500 - Błąd serwera",
        menuLinks: MENU_LINKS,
        activeLinkPath: "",
      });
    }
  }

  static async getRecipeById(req, res) {
    try {
      const recipe = await RecipeModel.findById(req.params.id);

      if (!recipe) {
        return res.status(404).render("404", {
          headTitle: "404 - Przepis nie znaleziony",
          menuLinks: MENU_LINKS,
          activeLinkPath: "",
        });
      }

      res.render("recipe-details", {
        headTitle: `SnackSnap - ${recipe.name}`,
        menuLinks: MENU_LINKS,
        activeLinkPath: `/recipes/${recipe.id}`,
        recipe: recipe,
      });
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).render("404", {
        headTitle: "500 - Błąd serwera",
        menuLinks: MENU_LINKS,
        activeLinkPath: "",
      });
    }
  }

  static async getAddRecipeForm(req, res) {
    try {
      const categories = RecipeModel.getCategories();

      res.render("add-recipe", {
        headTitle: "SnackSnap - Dodaj przepis",
        menuLinks: MENU_LINKS,
        activeLinkPath: "/recipes/add",
        categories: categories,
      });
    } catch (error) {
      console.error("Error showing add recipe form:", error);
      res.status(500).render("404", {
        headTitle: "500 - Błąd serwera",
        menuLinks: MENU_LINKS,
        activeLinkPath: "",
      });
    }
  }

  static async addRecipe(req, res) {
    try {
      const { name, ingredients, instructions, category, author } = req.body;

      if (!name || !ingredients || !instructions) {
        const categories = RecipeModel.getCategories();
        return res.status(400).render("add-recipe", {
          headTitle: "SnackSnap - Dodaj przepis",
          menuLinks: MENU_LINKS,
          activeLinkPath: "/recipes/add",
          categories: categories,
          error: "Wszystkie pola są wymagane",
          formData: req.body,
        });
      }

      const ingredientsArray = ingredients
        .split("\n")
        .filter((ing) => ing.trim() !== "")
        .map((ing) => ing.trim());

      const newRecipe = {
        name: name.trim(),
        ingredients: ingredientsArray,
        instructions: instructions.trim(),
        category: category?.trim() || "Inne",
        author: author?.trim() || "Anonimowy",
      };

      await RecipeModel.add(newRecipe);
      res.redirect("/recipes?success=Przepis+dodany");
    } catch (error) {
      console.error("Error adding recipe:", error);
      const categories = RecipeModel.getCategories();
      res.redirect("/recipes?error=Nie+udało+się+dodać+przepisu");
    }
  }

  static async getEditRecipeForm(req, res) {
    try {
      const recipe = await RecipeModel.findById(req.params.id);

      if (!recipe) {
        return res.status(404).render("404", {
          headTitle: "404 - Przepis nie znaleziony",
          menuLinks: MENU_LINKS,
          activeLinkPath: "",
        });
      }

      const categories = RecipeModel.getCategories();

      res.render("edit-recipe", {
        headTitle: `SnackSnap - Edytuj ${recipe.name}`,
        menuLinks: MENU_LINKS,
        activeLinkPath: `/recipes/${recipe.id}/edit`,
        recipe: recipe,
        categories: categories,
      });
    } catch (error) {
      console.error("Error fetching recipe for edit:", error);
      res.status(500).render("404", {
        headTitle: "500 - Błąd serwera",
        menuLinks: MENU_LINKS,
        activeLinkPath: "",
      });
    }
  }

  static async updateRecipe(req, res) {
    try {
      const { name, ingredients, instructions, category, author } = req.body;

      if (!name || !ingredients || !instructions) {
        const recipe = await RecipeModel.findById(req.params.id);
        const categories = RecipeModel.getCategories();
        return res.status(400).render("edit-recipe", {
          headTitle: `SnackSnap - Edytuj ${recipe?.name || "przepis"}`,
          menuLinks: MENU_LINKS,
          activeLinkPath: `/recipes/${req.params.id}/edit`,
          recipe: recipe,
          categories: categories,
          error: "Wszystkie pola są wymagane",
        });
      }

      const ingredientsArray = ingredients
        .split("\n")
        .filter((ing) => ing.trim() !== "")
        .map((ing) => ing.trim());

      const updateData = {
        name: name.trim(),
        ingredients: ingredientsArray,
        instructions: instructions.trim(),
        category: category?.trim() || "Inne",
        author: author?.trim() || "Anonimowy",
      };

      const updated = await RecipeModel.updateRecipe(req.params.id, updateData);

      if (!updated) {
        return res.status(404).render("404", {
          headTitle: "404 - Przepis nie znaleziony",
          menuLinks: MENU_LINKS,
          activeLinkPath: "",
        });
      }

      res.redirect("/recipes?success=Przepis+zaktualizowany");
    } catch (error) {
      console.error("Error updating recipe:", error);
      try {
        const recipe = await RecipeModel.findById(req.params.id);
        const categories = RecipeModel.getCategories();
        res.status(500).render("edit-recipe", {
          headTitle: `SnackSnap - Edytuj ${recipe?.name || "przepis"}`,
          menuLinks: MENU_LINKS,
          activeLinkPath: `/recipes/${req.params.id}/edit`,
          recipe: recipe,
          categories: categories,
          error: "Wystąpił błąd podczas aktualizacji przepisu",
        });
      } catch (innerError) {
        res.redirect("/recipes?error=Aktualizacja+nie+powiodła+się");
      }
    }
  }

  static async deleteRecipe(req, res) {
    try {
      const deleted = await RecipeModel.deleteById(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: "Przepis nie znaleziony" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res
        .status(500)
        .json({ error: "Wystąpił błąd podczas usuwania przepisu" });
    }
  }

  static async addRating(req, res) {
    try {
      const { score, comment } = req.body;

      if (!score || score < 1 || score > 5) {
        return res
          .status(400)
          .redirect(`/recipes/${req.params.id}?error=invalid_rating`);
      }

      const rating = {
        score: parseInt(score),
        comment: comment?.trim() || "",
        createdAt: new Date(),
      };

      const updated = await RecipeModel.addRating(req.params.id, rating);

      if (!updated) {
        return res.status(404).render("404", {
          headTitle: "404 - Przepis nie znaleziony",
          menuLinks: MENU_LINKS,
          activeLinkPath: "",
        });
      }

      res.redirect(`/recipes/${req.params.id}`);
    } catch (error) {
      console.error("Error adding rating:", error);
      res.redirect(`/recipes/${req.params.id}?error=rating_failed`);
    }
  }

  static async searchRecipes(req, res) {
    try {
      const { query } = req.query;

      if (!query || query.trim() === "") {
        return res.redirect("/recipes");
      }

      const recipes = await RecipeModel.search(query.trim());
      const categories = RecipeModel.getCategories();

      res.render("recipes", {
        headTitle: `SnackSnap - Wyniki wyszukiwania: ${query}`,
        menuLinks: MENU_LINKS,
        activeLinkPath: "/recipes",
        recipes: recipes,
        categories: categories,
        searchQuery: query,
        selectedCategory: "",
      });
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(500).render("404", {
        headTitle: "500 - Błąd serwera",
        menuLinks: MENU_LINKS,
        activeLinkPath: "",
      });
    }
  }
}

module.exports = RecipeController;
