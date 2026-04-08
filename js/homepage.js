document.addEventListener("DOMContentLoaded", function () {
  const showcaseSection = document.getElementById("pa-showcase-section");
  const modal = document.getElementById("pa-image-modal");
  const modalImage = document.getElementById("pa-modal-image");
  const closeButton = document.getElementById("pa-modal-close-btn");

  if (showcaseSection && modal && modalImage) {
    const cards = Array.from(showcaseSection.querySelectorAll("#pa-showcase-track article"));
    if (cards.length) {
      let activeCard = null;

      const closeModal = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("overflow-hidden");

        if (activeCard) {
          activeCard.focus();
          activeCard = null;
        }
      };

      const openModal = (card) => {
        const image = card.querySelector("img");
        if (!image) {
          return;
        }

        const title = card.querySelector("h3")?.textContent?.trim() || image.alt || "Protected area";
        modalImage.src = image.currentSrc || image.src;
        modalImage.alt = image.alt || title;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("overflow-hidden");
        if (closeButton) {
          closeButton.focus();
        }
      };

      cards.forEach((card) => {
        card.classList.add("pa-showcase-clickable");
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-haspopup", "dialog");

        const cardTitle = card.querySelector("h3")?.textContent?.trim() || "Protected area image";
        card.setAttribute("aria-label", `View larger image: ${cardTitle}`);

        card.addEventListener("click", () => {
          activeCard = card;
          openModal(card);
        });

        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activeCard = card;
            openModal(card);
          }
        });
      });

      if (closeButton) {
        closeButton.addEventListener("click", closeModal);
      }

      modal.addEventListener("click", (event) => {
        if (event.target instanceof HTMLElement && event.target.dataset.paModalClose === "overlay") {
          closeModal();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
          closeModal();
        }
      });
    }
  }

  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }

  document.querySelectorAll("[data-personnel-preview-img]").forEach(function (img) {
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
});
