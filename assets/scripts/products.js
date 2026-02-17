/* ──────────────────────────────────────────────
   products.js — All-products page logic
   • Fetch products & categories from FakeStore API
   • Category filter buttons
   • Render product cards
   • Product detail modal
   ────────────────────────────────────────────── */
(function () {
  "use strict";

  const API = "https://fakestoreapi.com";
  const grid = document.getElementById("products-grid");
  const filtersWrap = document.getElementById("category-filters");
  const modalOverlay = document.getElementById("product-modal-overlay");
  const modalClose = document.getElementById("modal-close");

  let allProducts = [];
  let activeCategory = "all";

  /* ── Bootstrap ── */
  Promise.all([
    fetch(`${API}/products`).then((r) => r.json()),
    fetch(`${API}/products/categories`).then((r) => r.json()),
  ])
    .then(([products, categories]) => {
      allProducts = products;
      renderCategoryButtons(categories);
      renderProducts(allProducts);
    })
    .catch((err) => {
      console.error("Failed to load products:", err);
      grid.innerHTML =
        '<p class="col-span-full text-center text-error py-12">Failed to load products. Please try again later.</p>';
    });

  /* ── Category buttons ── */
  function renderCategoryButtons(categories) {
    // Remove skeleton buttons
    filtersWrap
      .querySelectorAll(".skeleton-cat")
      .forEach((el) => el.remove());

    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline btn-sm rounded-full capitalize";
      btn.textContent = cat;
      btn.dataset.category = cat;
      filtersWrap.appendChild(btn);
    });

    // Delegate click
    filtersWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-category]");
      if (!btn) return;

      activeCategory = btn.dataset.category;

      // Update active styles
      filtersWrap.querySelectorAll("[data-category]").forEach((b) => {
        if (b.dataset.category === activeCategory) {
          b.classList.remove("btn-outline");
          b.classList.add("btn-primary");
        } else {
          b.classList.remove("btn-primary");
          b.classList.add("btn-outline");
        }
      });

      // Filter & render
      if (activeCategory === "all") {
        renderProducts(allProducts);
      } else {
        renderProducts(
          allProducts.filter((p) => p.category === activeCategory)
        );
      }
    });
  }

  /* ── Render product cards ── */
  function renderProducts(products) {
    // Remove skeletons
    grid
      .querySelectorAll(".skeleton-product")
      .forEach((el) => el.remove());

    // Clear previous real cards
    grid
      .querySelectorAll(".product-card")
      .forEach((el) => el.remove());

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className =
        "product-card group flex flex-col rounded-xl border border-base-200 bg-base-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden";

      // Star SVG helper
      const starFilled = `<svg class="h-3.5 w-3.5 fill-amber-400 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

      card.innerHTML = `
        <div class="relative aspect-square bg-white p-6 flex items-center justify-center overflow-hidden">
          <img
            src="${product.image}"
            alt="${product.title}"
            class="h-full w-full object-contain transition-transform group-hover:scale-105"
            loading="lazy"
          />
          <span class="badge badge-primary badge-sm absolute top-3 left-3 text-[10px] capitalize">
            ${product.category}
          </span>
        </div>
        <div class="flex flex-1 flex-col p-4 gap-2">
          <h3 class="text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
            ${product.title}
          </h3>
          <div class="flex items-center gap-1 text-xs text-base-content/60">
            ${starFilled}
            <span class="font-medium text-base-content">${product.rating.rate}</span>
            <span>(${product.rating.count})</span>
          </div>
          <p class="text-lg font-bold text-primary mt-auto">$${product.price.toFixed(2)}</p>
          <div class="flex gap-2 mt-2">
            <button class="btn btn-outline btn-sm flex-1 text-xs details-btn">Details</button>
            <button class="btn btn-primary btn-sm flex-1 text-xs add-cart-btn">Add to Cart</button>
          </div>
        </div>
      `;

      // Details button
      card.querySelector(".details-btn").addEventListener("click", () => {
        openModal(product);
      });

      // Add to cart button
      card.querySelector(".add-cart-btn").addEventListener("click", () => {
        if (window.SwiftCart) {
          window.SwiftCart.addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
          });
        }
      });

      grid.appendChild(card);
    });
  }

  /* ── Product Modal ── */
  function openModal(product) {
    document.getElementById("modal-title").textContent = product.title;
    document.getElementById("modal-category").textContent = product.category;
    document.getElementById("modal-image").src = product.image;
    document.getElementById("modal-image").alt = product.title;
    document.getElementById("modal-price").textContent = `$${product.price.toFixed(2)}`;
    document.getElementById("modal-description").textContent = product.description;

    // Rating stars
    const starsWrap = document.getElementById("modal-stars");
    starsWrap.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.classList.add("h-4", "w-4");

      if (i <= Math.round(product.rating.rate)) {
        svg.classList.add("fill-amber-400", "text-amber-400");
      } else {
        svg.classList.add("fill-none", "text-base-content/20");
      }

      svg.innerHTML = `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`;
      starsWrap.appendChild(svg);
    }

    document.getElementById("modal-rating-text").textContent =
      `${product.rating.rate} (${product.rating.count} reviews)`;

    // Wire buttons
    const addBtn = document.getElementById("modal-add-to-cart");
    const buyBtn = document.getElementById("modal-buy-now");

    // Clone to remove old listeners
    const newAdd = addBtn.cloneNode(true);
    const newBuy = buyBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newAdd, addBtn);
    buyBtn.parentNode.replaceChild(newBuy, buyBtn);

    newAdd.addEventListener("click", () => {
      if (window.SwiftCart) {
        window.SwiftCart.addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        });
      }
      closeModal();
    });

    newBuy.addEventListener("click", () => {
      if (window.SwiftCart) {
        window.SwiftCart.addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        });
      }
      closeModal();
    });

    // Show
    modalOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
      closeModal();
    }
  });
})();
