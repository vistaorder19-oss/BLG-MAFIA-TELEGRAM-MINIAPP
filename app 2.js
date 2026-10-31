(() => {
  "use strict";

  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
    try {
      tg.setHeaderColor("#090909");
      tg.setBackgroundColor("#090909");
    } catch (_) {}
  }

  // Articles neutres de démonstration. Remplace-les par des articles autorisés.
  const products = [
    { id: 1, category: "COLLECTION 01", name: "T-shirt BLG", description: "Textile de démonstration, coupe classique.", price: 24.00, mark: "BLG" },
    { id: 2, category: "COLLECTION 01", name: "Hoodie Thunder", description: "Sweat à capuche de démonstration.", price: 54.00, mark: "⚡" },
    { id: 3, category: "COLLECTION 01", name: "Casquette noire", description: "Accessoire textile de démonstration.", price: 19.00, mark: "CAP" },
    { id: 4, category: "COLLECTION 02", name: "Sticker pack", description: "Lot de stickers de démonstration.", price: 6.00, mark: "★" },
    { id: 5, category: "COLLECTION 02", name: "Tote bag", description: "Sac en toile de démonstration.", price: 12.00, mark: "BAG" },
    { id: 6, category: "COLLECTION 03", name: "Poster Red Thunder", description: "Affiche décorative de démonstration.", price: 15.00, mark: "RED" }
  ];

  const categories = ["TOUT", "COLLECTION 01", "COLLECTION 02", "COLLECTION 03"];
  const cart = new Map();
  let activeCategory = "TOUT";
  const $ = (selector) => document.querySelector(selector);
  const money = (value) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

  function notify(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("show"), 1900);
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred("light");
  }

  function renderCategories() {
    $("#categoryTabs").innerHTML = categories.map(category =>
      `<button class="category-tab ${category === activeCategory ? "active" : ""}" data-category="${category}" role="tab" aria-selected="${category === activeCategory}">${category}</button>`
    ).join("");
  }

  function renderProducts() {
    const visible = activeCategory === "TOUT" ? products : products.filter(p => p.category === activeCategory);
    $("#productGrid").innerHTML = visible.map(p => `
      <article class="product-card">
        <div class="product-art" aria-hidden="true">${p.mark}</div>
        <span class="product-tag">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-bottom">
          <span class="product-price">${money(p.price)}</span>
          <button class="add-button" data-add="${p.id}">AJOUTER +</button>
        </div>
      </article>`).join("");
  }

  function renderCart() {
    const entries = [...cart.entries()];
    const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
    const total = entries.reduce((sum, [id, quantity]) => sum + products.find(p => p.id === id).price * quantity, 0);
    $("#cartCount").textContent = count;
    $("#cartTotal").textContent = money(total);
    $("#cartItems").innerHTML = entries.length ? entries.map(([id, quantity]) => {
      const p = products.find(item => item.id === id);
      return `<div class="cart-row">
        <div><strong>${p.name}</strong><small>${money(p.price)} / unité</small></div>
        <div class="quantity">
          <button data-minus="${id}" aria-label="Retirer une unité">−</button>
          <span>${quantity}</span>
          <button data-plus="${id}" aria-label="Ajouter une unité">+</button>
        </div>
        <button class="remove-button" data-remove="${id}" aria-label="Supprimer ${p.name}">×</button>
      </div>`;
    }).join("") : '<p class="empty-cart">Ton panier est encore vide.</p>';
  }

  $("#categoryTabs").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderCategories();
    renderProducts();
  });

  $("#productGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const id = Number(button.dataset.add);
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    notify("ARTICLE AJOUTÉ AU PANIER");
  });

  $("#cartItems").addEventListener("click", event => {
    const target = event.target;
    const id = Number(target.dataset.plus || target.dataset.minus || target.dataset.remove);
    if (!id) return;
    if (target.dataset.plus) cart.set(id, (cart.get(id) || 0) + 1);
    if (target.dataset.minus) {
      const next = (cart.get(id) || 0) - 1;
      if (next <= 0) cart.delete(id); else cart.set(id, next);
    }
    if (target.dataset.remove) cart.delete(id);
    renderCart();
  });

  $("#clearCart").addEventListener("click", () => {
    cart.clear();
    renderCart();
    notify("PANIER VIDÉ");
  });

  $("#cartShortcut").addEventListener("click", () => $("#panier").scrollIntoView({ behavior: "smooth" }));
  $("#year").textContent = new Date().getFullYear();

  renderCategories();
  renderProducts();
  renderCart();
})();