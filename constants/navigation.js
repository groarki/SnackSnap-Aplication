const HOME_LINK = {
  label: "Home",
  path: "/",
};

const MENU_LINKS = [
  HOME_LINK,
  { label: "Wszystkie przepisy", path: "/recipes" },
  { label: "Dodaj przepis", path: "/recipes/add" },
];

module.exports = {
  MENU_LINKS,
  HOME_LINK,
};
