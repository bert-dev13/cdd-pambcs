/**
 * Resource Portal — filter tabs, card visibility, optional stagger animation.
 */
(function () {
  "use strict";

  const FILTER_ALL = "all";
  const FILTER_ACTIVE = "active";
  const FILTER_COMING = "coming-soon";
  const FILTER_SYSTEMS = "systems";
  const FILTER_DOCUMENTS = "documents";

  function normalizeFilter(value) {
    const v = String(value || "").toLowerCase().trim();
    if (
      v === FILTER_ALL ||
      v === FILTER_ACTIVE ||
      v === FILTER_COMING ||
      v === FILTER_SYSTEMS ||
      v === FILTER_DOCUMENTS
    ) {
      return v;
    }
    return FILTER_ALL;
  }

  function cardMatchesFilter(card, filter) {
    const status = (card.getAttribute("data-status") || "").toLowerCase();
    const category = (card.getAttribute("data-category") || "").toLowerCase();

    switch (filter) {
      case FILTER_ALL:
        return true;
      case FILTER_ACTIVE:
        return status === "active";
      case FILTER_COMING:
        return status === "coming-soon";
      case FILTER_SYSTEMS:
        return category === "system";
      case FILTER_DOCUMENTS:
        return category === "document";
      default:
        return true;
    }
  }

  function applyFilter(filter) {
    const grid = document.getElementById("resource-grid");
    const tabs = document.querySelectorAll('[data-resource-filter][role="tab"]');
    const live = document.getElementById("resource-filter-live");

    if (!grid) return;

    const cards = grid.querySelectorAll("[data-resource-card]");
    let visibleCount = 0;

    cards.forEach((card) => {
      const show = cardMatchesFilter(card, filter);
      if (show) {
        card.removeAttribute("hidden");
        visibleCount += 1;
      } else {
        card.setAttribute("hidden", "");
      }
    });

    let activeTabEl = null;
    tabs.forEach((tab) => {
      const tabFilter = normalizeFilter(tab.getAttribute("data-resource-filter"));
      const selected = tabFilter === filter;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
      if (selected) activeTabEl = tab;
    });

    const panel = document.getElementById("resource-panel");
    if (panel && activeTabEl && activeTabEl.id) {
      panel.setAttribute("aria-labelledby", activeTabEl.id);
    }

    if (live) {
      let label;
      switch (filter) {
        case FILTER_ALL:
          label = `Showing all ${visibleCount} resources.`;
          break;
        case FILTER_ACTIVE:
          label = `Showing ${visibleCount} active resource${visibleCount === 1 ? "" : "s"}.`;
          break;
        case FILTER_COMING:
          label = `Showing ${visibleCount} resource${visibleCount === 1 ? "" : "s"} marked as coming soon.`;
          break;
        case FILTER_SYSTEMS:
          label = `Showing ${visibleCount} system${visibleCount === 1 ? "" : "s"}.`;
          break;
        case FILTER_DOCUMENTS:
          label = `Showing ${visibleCount} document${visibleCount === 1 ? "" : "s"}.`;
          break;
        default:
          label = `Showing ${visibleCount} resource${visibleCount === 1 ? "" : "s"}.`;
      }
      live.textContent = label;
    }
  }

  function initTabs() {
    const tablist = document.querySelector('[data-resource-tabs][role="tablist"]');
    if (!tablist) return;

    const tabs = Array.from(tablist.querySelectorAll('[data-resource-filter][role="tab"]'));
    if (!tabs.length) return;

    const getFilterFromTab = (tab) => normalizeFilter(tab.getAttribute("data-resource-filter"));

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        applyFilter(getFilterFromTab(tab));
      });

      tab.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          applyFilter(getFilterFromTab(tab));
          return;
        }
        let nextIndex = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          nextIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === "End") {
          e.preventDefault();
          nextIndex = tabs.length - 1;
        }
        if (nextIndex !== null) {
          tabs[nextIndex].focus();
          applyFilter(getFilterFromTab(tabs[nextIndex]));
        }
      });
    });

    const initial = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
    applyFilter(getFilterFromTab(initial));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
  });
})();
