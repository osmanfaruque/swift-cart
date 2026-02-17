/**
 * Trending Section – Fetch products from FakeStore API, sort by rating, render top 3
 */
(function () {
  "use strict";

  var grid = document.getElementById("trending-grid");
  var API_URL = "https://fakestoreapi.com/products";

  fetch(API_URL)
    .then(function (res) { return res.json(); })
    .then(function (products) {
      // Sort by rating (highest first) and take top 3
      var topRated = products
        .slice()
        .sort(function (a, b) { return b.rating.rate - a.rating.rate; })
        .slice(0, 3);

      // Remove skeleton loaders
      grid.innerHTML = "";

      topRated.forEach(function (product) {
        var card = document.createElement("div");
        card.className =
          "group rounded-xl border border-base-200 bg-base-100 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1";

        card.innerHTML =
          '<div class="relative aspect-[4/3] bg-white p-8 flex items-center justify-center">' +
            '<img src="' + product.image + '" alt="' + escapeHtml(product.title) + '" class="h-full w-full object-contain transition-transform group-hover:scale-105" loading="lazy" />' +
            '<span class="badge badge-warning absolute top-3 right-3 gap-1 text-white">' +
              '<svg class="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
              product.rating.rate +
            '</span>' +
          '</div>' +
          '<div class="p-6 space-y-3">' +
            '<h3 class="font-semibold leading-tight line-clamp-2">' + escapeHtml(product.title) + '</h3>' +
            '<p class="text-2xl font-bold text-primary">$' + product.price.toFixed(2) + '</p>' +
            '<button class="btn btn-primary w-full add-to-cart-btn">Add to Cart</button>' +
          '</div>';

        // Add to Cart click
        card.querySelector(".add-to-cart-btn").addEventListener("click", function () {
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
    })
    .catch(function (err) {
      console.error("Failed to load trending products:", err);
      grid.innerHTML =
        '<p class="col-span-3 text-center text-base-content/50">Failed to load products. Please try again later.</p>';
    });

  /* Simple HTML escaper */
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
