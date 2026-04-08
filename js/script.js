document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const siteHeader = document.getElementById("site-header");

  if (menuToggle && mobileMenu) {
    const openMenu = () => {
      menuToggle.setAttribute("aria-expanded", "true");
      mobileMenu.classList.remove("pointer-events-none", "max-h-0", "opacity-0", "border-transparent");
      mobileMenu.classList.add("max-h-80", "opacity-100", "border-slate-200");
    };

    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("pointer-events-none", "max-h-0", "opacity-0", "border-transparent");
      mobileMenu.classList.remove("max-h-80", "opacity-100", "border-slate-200");
    };

    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });
  }

  if (siteHeader) {
    const syncScrollHeaderState = () => {
      if (window.scrollY > 12) {
        siteHeader.classList.add("bg-white/95", "shadow-soft");
        siteHeader.classList.remove("bg-white/90");
      } else {
        siteHeader.classList.remove("bg-white/95", "shadow-soft");
        siteHeader.classList.add("bg-white/90");
      }
    };

    syncScrollHeaderState();
    window.addEventListener("scroll", syncScrollHeaderState, { passive: true });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  if (slides.length > 1) {
    let currentIndex = 0;
    const intervalMs = 5000;

    setInterval(() => {
      slides[currentIndex].classList.add("opacity-0");
      slides[currentIndex].classList.remove("opacity-100");
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.remove("opacity-0");
      slides[currentIndex].classList.add("opacity-100");
    }, intervalMs);
  }

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  if (revealItems.length) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => {
        item.classList.remove("opacity-0", "translate-y-4");
      });
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove("opacity-0", "translate-y-4");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );

      revealItems.forEach((item, index) => {
        const customDelay = item.getAttribute("data-reveal-delay");
        item.style.transitionDelay =
          customDelay !== null && customDelay !== "" ? customDelay : `${Math.min(index * 70, 350)}ms`;
        revealObserver.observe(item);
      });
    }
  }

  const paTrack = document.getElementById("pa-showcase-track");
  const paPrev = document.getElementById("pa-showcase-prev");
  const paNext = document.getElementById("pa-showcase-next");
  const paDots = document.getElementById("pa-showcase-dots");

  if (paTrack && paPrev && paNext && paDots) {
    const slides = Array.from(paTrack.querySelectorAll("article"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollOpts = () => ({ behavior: prefersReducedMotion ? "auto" : "smooth" });

    const slideStep = () => {
      if (slides.length < 2) return paTrack.clientWidth;
      return slides[1].offsetLeft - slides[0].offsetLeft;
    };

    const scrollToIndex = (index) => {
      const i = Math.max(0, Math.min(index, slides.length - 1));
      paTrack.scrollTo({ left: slides[i].offsetLeft, ...scrollOpts() });
    };

    const activeIndex = () => {
      const step = slideStep();
      if (step <= 0) return 0;
      return Math.min(slides.length - 1, Math.round(paTrack.scrollLeft / step));
    };

    const syncDots = () => {
      const idx = activeIndex();
      paDots.querySelectorAll("button").forEach((btn, i) => {
        const on = i === idx;
        btn.setAttribute("aria-current", on ? "true" : "false");
        btn.classList.toggle("bg-tealsoft", on);
        btn.classList.toggle("bg-white/35", !on);
        btn.classList.toggle("w-7", on);
        btn.classList.toggle("w-2.5", !on);
      });
    };

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show protected area ${i + 1} of ${slides.length}`);
      dot.className =
        "h-2.5 w-2.5 shrink-0 rounded-full bg-white/35 transition-all duration-300 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest";
      dot.addEventListener("click", () => scrollToIndex(i));
      paDots.appendChild(dot);
    });

    syncDots();

    paPrev.addEventListener("click", () => {
      paTrack.scrollBy({ left: -slideStep(), ...scrollOpts() });
    });

    paNext.addEventListener("click", () => {
      paTrack.scrollBy({ left: slideStep(), ...scrollOpts() });
    });

    let scrollTick = false;
    paTrack.addEventListener(
      "scroll",
      () => {
        if (!scrollTick) {
          window.requestAnimationFrame(() => {
            syncDots();
            scrollTick = false;
          });
          scrollTick = true;
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", syncDots);

    paTrack.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        paTrack.scrollBy({ left: -slideStep(), ...scrollOpts() });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        paTrack.scrollBy({ left: slideStep(), ...scrollOpts() });
      }
    });
  }
});
