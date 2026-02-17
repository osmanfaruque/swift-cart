/**
 * Navbar – Mobile menu toggle & smooth-scroll navigation
 */
(function () {
  "use strict";

  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const menuIcon = document.getElementById("icon-menu");
  const closeIcon = document.getElementById("icon-close");

  /* ---- Mobile menu open / close ---- */
  function toggleMobileMenu() {
    const isOpen = mobileNav.classList.toggle("open");
    menuIcon.style.display = isOpen ? "none" : "block";
    closeIcon.style.display = isOpen ? "block" : "none";
  }

  mobileToggle.addEventListener("click", toggleMobileMenu);

  /* ---- Navigation click handler ---- */
  function handleNavClick(e) {
    const target = e.target.closest("[data-nav]");
    if (!target) return;

    const href = target.getAttribute("data-nav");

    // Close mobile menu if open
    if (mobileNav.classList.contains("open")) {
      mobileNav.classList.remove("open");
      menuIcon.style.display = "block";
      closeIcon.style.display = "none";
    }

    // Route link → normal navigation
    if (href.startsWith("/") || href.endsWith(".html")) {
      window.location.href = href;
      return;
    }

    // Section link → smooth scroll
    e.preventDefault();
    const sectionId = href.replace("#", "");
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  document.querySelectorAll("[data-nav]").forEach(function (link) {
    link.addEventListener("click", handleNavClick);
  });

  /* ---- Highlight active link on route pages ---- */
  const currentPath = window.location.pathname;
  document.querySelectorAll("[data-nav]").forEach(function (link) {
    const href = link.getAttribute("data-nav");
    if (href.startsWith("/") || href.endsWith(".html")) {
      if (currentPath.includes(href)) {
        link.classList.remove("text-base-content/60");
        link.classList.add("bg-primary/10", "text-primary");
      }
    }
  });
})();
