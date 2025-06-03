const { v4: uuidv4 } = require("uuid");
const { getDatabase } = require("../database");

class Recipe {
  constructor(
    name,
    ingredients,
    instructions,
    category = "Inne",
    author = "Anonimowy"
  ) {
    this.id = uuidv4();
    this.name = name;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.category = category;
    this.author = author;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.ratings = [];
    this.comments = [];
  }

  addRating(score, comment = "") {
    this.ratings.push({
      id: uuidv4(),
      score: parseInt(score),
      comment: comment,
      createdAt: new Date(),
    });
  }

  addComment(author, content) {
    this.comments.push({
      id: uuidv4(),
      author: author,
      content: content,
      createdAt: new Date(),
    });
  }

  getAverageRating() {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, rating) => acc + rating.score, 0);
    return (sum / this.ratings.length).toFixed(1);
  }
}

class RecipeModel {
  static addRatingMethod(recipe) {
    if (recipe) {
      recipe.getAverageRating = function () {
        if (!this.ratings || this.ratings.length === 0) return 0;
        const sum = this.ratings.reduce((acc, rating) => acc + rating.score, 0);
        return (sum / this.ratings.length).toFixed(1);
      };
    }
    return recipe;
  }

  static addRatingMethodToArray(recipes) {
    return recipes.map((recipe) => this.addRatingMethod({ ...recipe }));
  }
  static async getAllRecipes() {
    try {
      const db = getDatabase();
      const recipes = await db.collection("recipes").find({}).toArray();
      return this.addRatingMethodToArray(recipes);
    } catch (error) {
      console.error("Error fetching all recipes:", error);
      return [];
    }
  }

  static async getRecent(limit = 5) {
    try {
      const db = getDatabase();
      const recipes = await db
        .collection("recipes")
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      return this.addRatingMethodToArray(recipes);
    } catch (error) {
      console.error("Error fetching recent recipes:", error);
      return [];
    }
  }

  static async findById(id) {
    try {
      const db = getDatabase();
      const recipe = await db.collection("recipes").findOne({ id: id });
      return this.addRatingMethod(recipe);
    } catch (error) {
      console.error("Error finding recipe by ID:", error);
      return null;
    }
  }

  static async add(recipeData) {
    try {
      const recipe = new Recipe(
        recipeData.name,
        recipeData.ingredients,
        recipeData.instructions,
        recipeData.category,
        recipeData.author
      );

      const db = getDatabase();
      await db.collection("recipes").insertOne(recipe);
      console.log(`✅ Recipe "${recipe.name}" added successfully`);
      return recipe;
    } catch (error) {
      console.error("Error adding recipe:", error);
      throw error;
    }
  }

  static async updateRecipe(id, updateData) {
    try {
      const db = getDatabase();
      updateData.updatedAt = new Date();

      const result = await db
        .collection("recipes")
        .updateOne({ id: id }, { $set: updateData });

      if (result.modifiedCount > 0) {
        const updatedRecipe = await this.findById(id);
        return updatedRecipe;
      }
      return null;
    } catch (error) {
      console.error("Error updating recipe:", error);
      return null;
    }
  }

  static async deleteById(id) {
    try {
      const db = getDatabase();
      const result = await db.collection("recipes").deleteOne({ id: id });

      if (result.deletedCount > 0) {
        console.log(`✅ Recipe with ID "${id}" deleted successfully`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return false;
    }
  }

  static async search(query) {
    try {
      const db = getDatabase();
      const recipes = await db
        .collection("recipes")
        .find({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { author: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        })
        .toArray();
      return this.addRatingMethodToArray(recipes);
    } catch (error) {
      console.error("Error searching recipes:", error);
      return [];
    }
  }

  static async getRecipesByCategory(category) {
    try {
      const db = getDatabase();
      const recipes = await db
        .collection("recipes")
        .find({ category: category })
        .toArray();
      return this.addRatingMethodToArray(recipes);
    } catch (error) {
      console.error("Error fetching recipes by category:", error);
      return [];
    }
  }

  static async addRating(recipeId, rating) {
    try {
      const db = getDatabase();
      const result = await db
        .collection("recipes")
        .updateOne({ id: recipeId }, { $push: { ratings: rating } });

      if (result.modifiedCount > 0) {
        return await this.findById(recipeId);
      }
      return null;
    } catch (error) {
      console.error("Error adding rating:", error);
      return null;
    }
  }

  static async addCommentToRecipe(recipeId, author, content) {
    try {
      const comment = {
        id: uuidv4(),
        author: author,
        content: content,
        createdAt: new Date(),
      };

      const db = getDatabase();
      const result = await db
        .collection("recipes")
        .updateOne({ id: recipeId }, { $push: { comments: comment } });

      if (result.modifiedCount > 0) {
        return await this.findById(recipeId);
      }
      return null;
    } catch (error) {
      console.error("Error adding comment:", error);
      return null;
    }
  }

  static getCategories() {
    return [
      "Przystawki",
      "Zupy",
      "Dania główne",
      "Desery",
      "Napoje",
      "Przekąski",
      "Inne",
    ];
  }

  static async initializeTestData() {
    try {
      const db = getDatabase();
      const existingRecipes = await db.collection("recipes").countDocuments();

      if (existingRecipes === 0) {
        const testRecipes = [
          {
            name: "Pierogi z kapustą i grzybami",
            ingredients: [
              "mąka - 500g",
              "woda - 250ml",
              "sól - 1 łyżeczka",
              "kapusta kiszona - 400g",
              "grzyby suszone - 50g",
              "cebula - 2 sztuki",
            ],
            instructions:
              "Przygotuj ciasto z mąki, wody i soli. Wymieszaj składniki na farsz. Rozwałkuj ciasto, wytnij kółka, nałóż farsz i sklejaj brzegi. Gotuj w osolonej wodzie.",
            category: "Dania główne",
            author: "Anna Kowalska",
          },
          {
            name: "Sernik nowojorski",
            ingredients: [
              "ser mascarpone - 500g",
              "jajka - 4 sztuki",
              "cukier - 150g",
              "biszkopty - 200g",
              "masło - 100g",
            ],
            instructions:
              "Rozdrobnij biszkopty i wymieszaj z masłem. Ubij ser z jajkami i cukrem. Połóż spód z biszkoptów, wlej masę serową. Piecz 45 min w 180°C.",
            category: "Desery",
            author: "Piotr Nowak",
          },
          {
            name: "Kotlet schabowy",
            ingredients: [
              "schab - 4 kotlety",
              "jajka - 2 sztuki",
              "bułka tarta - 200g",
              "mąka - 100g",
              "sól - szczypta",
              "pieprz - szczypta",
            ],
            instructions:
              "Rozbij kotlety tłuczkiem. Oprósz mąką, zanurz w jajku, obtocz w bułce tartej. Smaż na oleju z obu stron na złoto.",
            category: "Dania główne",
            author: "Maria Wiśniewska",
          },
        ];

        for (const recipeData of testRecipes) {
          await this.add(recipeData);
        }

        console.log("✅ Test recipes added successfully");
      }
    } catch (error) {
      console.error("Error initializing test data:", error);
    }
  }
}

module.exports = RecipeModel;
