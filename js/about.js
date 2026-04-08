document.addEventListener("DOMContentLoaded", function () {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    document.querySelectorAll(".about-overview-card, .about-mandate-card, .about-function-card").forEach(function (el) {
      el.classList.remove("transition-all", "duration-500", "ease-out");
    });
  }

  document.querySelectorAll("[data-personnel-directory-img]").forEach(function (img) {
    img.addEventListener("load", function () {
      if (img.naturalWidth > 0) {
        img.classList.add("is-loaded");
        img.classList.remove("opacity-0");
        img.classList.add("opacity-100");
      }
    });
    img.addEventListener("error", function () {
      img.removeAttribute("src");
      img.classList.add("hidden");
    });
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("is-loaded");
      img.classList.remove("opacity-0");
      img.classList.add("opacity-100");
    }
  });

  var personnelDir = document.getElementById("personnel-directory");
  if (personnelDir && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    personnelDir.querySelectorAll(".personnel-directory-photo").forEach(function (el) {
      el.classList.remove("transition-opacity", "duration-300");
    });
  }
});
