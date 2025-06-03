const iziToast = require("izitoast");

const toast = (type, message) => {
  const titles = {
    success: "Sukces",
    error: "Błąd",
    warning: "Uwaga",
    info: "Informacja",
  };

  iziToast[type]({
    title: titles[type] || "Info",
    message,
    position: "topRight",
    timeout: 3000,
    progressBar: true,
    theme: "light",
  });
};

["success", "error", "warning", "info"].forEach((type) => {
  toast[type] = (msg) => toast(type, msg);
});

module.exports = toast;
