const toast = {
  success: (message) => {
    iziToast.success({
      title: "Sukces",
      message: message,
      position: "topRight",
      timeout: 3000,
      progressBar: true,
      theme: "light",
    });
  },

  error: (message) => {
    iziToast.error({
      title: "Błąd",
      message: message,
      position: "topRight",
      timeout: 4000,
      progressBar: true,
      theme: "light",
    });
  },

  warning: (message) => {
    iziToast.warning({
      title: "Uwaga",
      message: message,
      position: "topRight",
      timeout: 3000,
      progressBar: true,
      theme: "light",
    });
  },

  info: (message) => {
    iziToast.info({
      title: "Informacja",
      message: message,
      position: "topRight",
      timeout: 3000,
      progressBar: true,
      theme: "light",
    });
  },
};

function openRecipe(recipeId) {
  if (!recipeId) {
    console.error("Recipe ID is required");
    return;
  }

  const card = document.querySelector(`[data-recipe-id="${recipeId}"]`);

  if (card) {
    const loader = card.querySelector(".recipe-loading");
    if (loader) {
      loader.classList.remove("d-none");
      loader.classList.add("d-flex");
    }

    card.classList.add("recipe-card-loading");
  }

  setTimeout(() => {
    window.location.href = `/recipes/${recipeId}`;
  }, 200);
}

function deleteRecipe(recipeId, recipeName) {
  iziToast.question({
    timeout: false,
    close: false,
    overlay: true,
    displayMode: "once",
    id: "question",
    zindex: 999,
    title: "Potwierdzenie",
    message: `Czy na pewno chcesz usunąć przepis "${recipeName}"?`,
    position: "center",
    buttons: [
      [
        "<button><b>TAK</b></button>",
        function (instance, toast) {
          instance.hide({ transitionOut: "fadeOut" }, toast, "button");

          iziToast.info({
            title: "Usuwanie...",
            message: "Proszę czekać",
            timeout: false,
            progressBar: false,
            close: false,
          });

          fetch(`/recipes/${recipeId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              iziToast.destroy();

              if (data.success) {
                toast.success("Przepis został usunięty pomyślnie");
                setTimeout(() => {
                  window.location.href = "/recipes";
                }, 1500);
              } else {
                toast.error("Błąd podczas usuwania przepisu");
              }
            })
            .catch((error) => {
              iziToast.destroy();
              console.error("Error:", error);
              toast.error("Błąd podczas usuwania przepisu");
            });
        },
        true,
      ],
      [
        "<button>Anuluj</button>",
        function (instance, toast) {
          instance.hide({ transitionOut: "fadeOut" }, toast, "button");
        },
      ],
    ],
  });
}

document.addEventListener("DOMContentLoaded", function () {
  clearAllLoadingStates();

  initializeRecipeCards();

  const searchForms = document.querySelectorAll('form[action="/recipes"]');
  searchForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const searchInput = this.querySelector('input[name="search"]');

      if (searchInput) {
        const searchValue = searchInput.value.trim();

        if (!searchValue) {
          e.preventDefault();
          toast.warning("Proszę wprowadzić zapytanie wyszukiwania");
          searchInput.focus();
          return false;
        }

        if (searchValue.length < 2) {
          e.preventDefault();
          toast.warning("Zapytanie wyszukiwania musi mieć co najmniej 2 znaki");
          searchInput.focus();
          return false;
        }
      }
    });
  });

  const forms = document.querySelectorAll("form:not([action='/recipes'])");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const requiredFields = form.querySelectorAll("[required]");
      let isValid = true;
      let firstInvalidField = null;

      requiredFields.forEach((field) => {
        const value = field.value.trim();

        if (!value) {
          field.classList.add("is-invalid");
          isValid = false;

          if (!firstInvalidField) {
            firstInvalidField = field;
          }

          field.addEventListener(
            "input",
            function () {
              if (this.value.trim()) {
                this.classList.remove("is-invalid");
              }
            },
            { once: true }
          );
        } else {
          field.classList.remove("is-invalid");
        }
      });

      if (!isValid) {
        e.preventDefault();
        toast.error("Proszę wypełnić wszystkie wymagane pola");
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      }
    });
  });

  initializeIngredientCounter();
  initializeBackToTop();
  initializeSmoothScroll();
});

function initializeRecipeCards() {
  const recipeCards = document.querySelectorAll(".recipe-card");

  recipeCards.forEach((card) => {
    clearLoadingState(card);

    card.removeEventListener("click", handleRecipeCardClick);

    card.addEventListener("click", handleRecipeCardClick);

    card.addEventListener("mouseenter", function () {
      if (!this.classList.contains("recipe-card-loading")) {
        this.style.transform = "translateY(-4px) scale(1.01)";
        this.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      }
    });

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("recipe-card-loading")) {
        this.style.transform = "translateY(0) scale(1)";
      }
    });

    card.addEventListener("mousedown", function () {
      if (!this.classList.contains("recipe-card-loading")) {
        this.style.transform = "translateY(-2px) scale(0.99)";
      }
    });

    card.addEventListener("mouseup", function () {
      if (!this.classList.contains("recipe-card-loading")) {
        this.style.transform = "translateY(-4px) scale(1.01)";
      }
    });
  });
}

function clearLoadingState(card) {
  const loader = card.querySelector(".recipe-loading");
  if (loader) {
    loader.classList.add("d-none");
    loader.classList.remove("d-flex");
  }
  card.classList.remove("recipe-card-loading");
  card.style.transform = "";
}

function clearAllLoadingStates() {
  const recipeCards = document.querySelectorAll(".recipe-card");
  recipeCards.forEach(clearLoadingState);
}

function handleRecipeCardClick(event) {
  if (event.target.closest("button") || event.target.closest("a")) {
    return;
  }

  const recipeId = this.getAttribute("data-recipe-id");
  if (recipeId) {
    openRecipe(recipeId);
  }
}

function initializeIngredientCounter() {
  const ingredientsTextarea = document.getElementById("ingredients");
  if (ingredientsTextarea) {
    const counter = document.createElement("div");
    counter.className = "form-text mt-2 fw-bold";
    counter.id = "ingredient-counter";
    ingredientsTextarea.parentNode.appendChild(counter);

    function updateCounter() {
      const lines = ingredientsTextarea.value
        .split("\n")
        .filter((line) => line.trim() !== "");

      counter.textContent = `Składników: ${lines.length}`;
      counter.className = `form-text mt-2 fw-bold ${
        lines.length > 0 ? "text-success" : "text-muted"
      }`;
    }

    ingredientsTextarea.addEventListener("input", updateCounter);
    updateCounter();
  }
}

function initializeBackToTop() {
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.className =
    "btn btn-primary position-fixed rounded-circle shadow";
  backToTopButton.style.cssText = `
    bottom: 30px;
    right: 30px;
    z-index: 1000;
    width: 50px;
    height: 50px;
    display: none;
    transition: all 0.3s ease;
  `;

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.body.appendChild(backToTopButton);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = "flex";
      backToTopButton.style.alignItems = "center";
      backToTopButton.style.justifyContent = "center";
    } else {
      backToTopButton.style.display = "none";
    }
  });
}

function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function showServerMessage(type, message) {
  if (message) {
    toast[type](message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("success")) {
    toast.success(urlParams.get("success"));
  }

  if (urlParams.has("error")) {
    toast.error(urlParams.get("error"));
  }

  if (urlParams.has("warning")) {
    toast.warning(urlParams.get("warning"));
  }

  if (urlParams.has("info")) {
    toast.info(urlParams.get("info"));
  }
});

window.addEventListener("pageshow", function () {
  clearAllLoadingStates();
});

window.toast = toast;
window.openRecipe = openRecipe;
window.deleteRecipe = deleteRecipe;
