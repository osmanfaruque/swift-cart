/**
 * Cart Drawer – open/close, add/remove/update items, persist to localStorage
 */
(function () {
  "use strict";

  /* ---- DOM refs ---- */
  const cartBtn = document.getElementById("cart-btn");
  const cartBadge = document.getElementById("cart-badge");
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  const closeBtn = document.getElementById("cart-close");
  const continueBtn = document.getElementById("cart-continue-shopping");
  const clearBtn = document.getElementById("cart-clear");

  const cartEmpty = document.getElementById("cart-empty");
  const cartItems = document.getElementById("cart-items");
  const cartFooter = document.getElementById("cart-footer");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const cartCheckoutTotal = document.getElementById("cart-checkout-total");
  const itemTemplate = document.getElementById("cart-item-template");

  /* ---- State ---- */
  let cart = JSON.parse(localStorage.getItem("swiftcart") || "[]");

  /* ---- Open / Close drawer ---- */
  function openDrawer() {
    overlay.classList.remove("hidden");
    // Small delay so the transition actually plays
    requestAnimationFrame(function () {
      drawer.classList.remove("translate-x-full");
      drawer.classList.add("translate-x-0");
    });
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("translate-x-0");
    drawer.classList.add("translate-x-full");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  cartBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  if (continueBtn) continueBtn.addEventListener("click", closeDrawer);

  /* ---- Persist ---- */
  function save() {
    localStorage.setItem("swiftcart", JSON.stringify(cart));
  }

  /* ---- Render ---- */
  function render() {
    const totalItems = cart.reduce(function (sum, i) { return sum + i.quantity; }, 0);
    const totalPrice = cart.reduce(function (sum, i) { return sum + i.price * i.quantity; }, 0);

    /* Badge */
    cartBadge.textContent = totalItems;
    if (totalItems > 0) {
      cartBadge.classList.remove("hidden");
    } else {
      cartBadge.classList.add("hidden");
    }

    /* Count in header */
    cartCount.textContent = cart.length;

    /* Empty vs filled */
    if (cart.length === 0) {
      cartEmpty.classList.remove("hidden");
      cartItems.classList.add("hidden");
      cartFooter.classList.add("hidden");
    } else {
      cartEmpty.classList.add("hidden");
      cartItems.classList.remove("hidden");
      cartFooter.classList.remove("hidden");
    }

    /* Total */
    cartTotal.textContent = "$" + totalPrice.toFixed(2);
    cartCheckoutTotal.textContent = "$" + totalPrice.toFixed(2);

    /* Render items */
    cartItems.innerHTML = "";
    cart.forEach(function (item) {
      var clone = itemTemplate.content.cloneNode(true);
      var root = clone.querySelector(".cart-item");
      root.setAttribute("data-id", item.id);
      clone.querySelector(".cart-item-img").src = item.image;
      clone.querySelector(".cart-item-img").alt = item.title;
      clone.querySelector(".cart-item-title").textContent = item.title;
      clone.querySelector(".cart-item-price").textContent = "$" + (item.price * item.quantity).toFixed(2);
      clone.querySelector(".cart-item-qty").textContent = item.quantity;

      /* Minus */
      clone.querySelector(".cart-qty-minus").addEventListener("click", function () {
        updateQuantity(item.id, item.quantity - 1);
      });
      /* Plus */
      clone.querySelector(".cart-qty-plus").addEventListener("click", function () {
        updateQuantity(item.id, item.quantity + 1);
      });
      /* Remove */
      clone.querySelector(".cart-item-remove").addEventListener("click", function () {
        removeFromCart(item.id);
      });

      cartItems.appendChild(clone);
    });
  }

  /* ---- Cart actions ---- */
  function addToCart(product) {
    var existing = cart.find(function (i) { return i.id === product.id; });
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }
    save();
    render();
    openDrawer();
  }

  function removeFromCart(id) {
    cart = cart.filter(function (i) { return i.id !== id; });
    save();
    render();
  }

  function updateQuantity(id, newQty) {
    if (newQty < 1) {
      removeFromCart(id);
      return;
    }
    var item = cart.find(function (i) { return i.id === id; });
    if (item) {
      item.quantity = newQty;
      save();
      render();
    }
  }

  function clearCart() {
    cart = [];
    save();
    render();
  }

  clearBtn.addEventListener("click", clearCart);

  /* ---- Expose addToCart globally so product pages can call it ---- */
  window.SwiftCart = {
    addToCart: addToCart,
    getCart: function () { return cart; },
  };

  /* Initial render */
  render();
})();
