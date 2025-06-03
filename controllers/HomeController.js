const { MENU_LINKS } = require("../constants/navigation");
const RecipeModel = require("../models/Recipe");

class HomeController {
  static async getHomeView(request, response) {
    try {
      console.log("HomeController.getHomeView called");

      const recentRecipes = await RecipeModel.getRecent(3);
      const allRecipes = await RecipeModel.getAllRecipes();
      const categories = RecipeModel.getCategories();

      response.render("home", {
        headTitle: "SnackSnap - Kolekcja Przepisów Kulinarnych",
        menuLinks: MENU_LINKS,
        activeLinkPath: "/",
        recentRecipes: recentRecipes,
        categories: categories,
        totalRecipes: allRecipes.length,
      });
    } catch (error) {
      console.error("Error rendering home view:", error);
      response
        .status(500)
        .send("Błąd serwera - nie można załadować strony głównej");
    }
  }
}

module.exports = HomeController;
