const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const { mongoConnect } = require("./database");
const RecipeModel = require("./models/Recipe");

const homeRoutes = require("./routing/home");
const recipeRoutes = require("./routing/recipes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/recipes", recipeRoutes);
app.use("/", homeRoutes);

app.use((req, res) => {
  res.status(404).render("404", {
    headTitle: "404 - Strona nie znaleziona",
    menuLinks: [
      { label: "Home", path: "/" },
      { label: "Wszystkie przepisy", path: "/recipes" },
      { label: "Dodaj przepis", path: "/recipes/add" },
    ],
    activeLinkPath: "",
  });
});

mongoConnect(async () => {
  await RecipeModel.initializeTestData();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Connected to MongoDB database`);
  });
});
