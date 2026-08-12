/* =====================================================
   MENU DATA
   Each item belongs to a category and has a unique id,
   name, short description, and price in rupees.
   ===================================================== */
const menuData = [
  {
    id: "chai",
    title: "Chai & Beverages",
    items: [
      { id: "b1", name: "Cutting Chai", desc: "Strong, sweet, served in the small glass", price: 15 },
      { id: "b2", name: "Masala Chai", desc: "Whole spices, simmered slow", price: 20 },
      { id: "b3", name: "Cold Coffee", desc: "Whipped with ice, a little extra sugar", price: 40 },
      { id: "b4", name: "Nimbu Pani", desc: "Fresh lime, mint, black salt", price: 25 },
    ],
  },
  {
    id: "tiffin",
    title: "Morning Tiffin",
    items: [
      { id: "t1", name: "Masala Dosa", desc: "Crisp rice crepe, potato masala, sambar", price: 70 },
      { id: "t2", name: "Idli Sambar", desc: "Steamed rice cakes, coconut chutney", price: 50 },
      { id: "t3", name: "Poha", desc: "Flattened rice, peanuts, curry leaf", price: 40 },
      { id: "t4", name: "Aloo Paratha", desc: "Stuffed flatbread, curd, pickle", price: 60 },
    ],
  },
  {
    id: "mains",
    title: "Mains & Thalis",
    items: [
      { id: "m1", name: "Veg Thali", desc: "Dal, sabzi, rice, roti, salad", price: 90 },
      { id: "m2", name: "Chole Bhature", desc: "Spiced chickpeas, fried bread", price: 70 },
      { id: "m3", name: "Rajma Chawal", desc: "Kidney bean curry over steamed rice", price: 80 },
      { id: "m4", name: "Paneer Butter Masala + Rice", desc: "Cottage cheese in a rich tomato gravy", price: 100 },
    ],
  },
  {
    id: "snacks",
    title: "Short Eats",
    items: [
      { id: "s1", name: "Samosa", desc: "Spiced potato, crisp pastry, two pieces", price: 15 },
      { id: "s2", name: "Vada Pav", desc: "Spiced potato fritter, soft bun, chutney", price: 20 },
      { id: "s3", name: "Bread Pakora", desc: "Stuffed, batter-fried, served hot", price: 25 },
      { id: "s4", name: "Veg Sandwich", desc: "Grilled, mint chutney, three layers", price: 35 },
    ],
  },
  {
    id: "sweets",
    title: "Sweet Endings",
    items: [
      { id: "d1", name: "Gulab Jamun", desc: "Warm, syrup-soaked, two pieces", price: 30 },
      { id: "d2", name: "Kheer", desc: "Slow-cooked rice pudding, cardamom", price: 40 },
      { id: "d3", name: "Fruit Custard", desc: "Chilled, seasonal fruit", price: 35 },
    ],
  },
];

/* =====================================================
   CART STATE
   The cart is a plain object: { itemId: quantity }.
   We save it to localStorage so it survives a page refresh.
   ===================================================== */
let cart = JSON.parse(localStorage.getItem("canteenCart")) || {};

// Look up an item's full details (name, price, etc.) by its id
function findItemById(id) {
  for (const category of menuData) {
    const found = category.items.find((item) => item.id === id);
    if (found) return found;
  }
  return null;
}

function saveCart() {
  localStorage.setItem("canteenCart", JSON.stringify(cart));
}

/* =====================================================
   RENDER MENU
   Builds the menu list HTML from menuData.
   ===================================================== */
function renderMenu() {
  const menuList = document.getElementById("menuList");
  menuList.innerHTML = "";

  menuData.forEach((category) => {
    const section = document.createElement("div");
    section.id = category.id;

    const heading = document.createElement("h2");
    heading.className = "menu-category-title";
    heading.textContent = category.title;
    section.appendChild(heading);

    category.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "menu-item";
      row.innerHTML = `
        <div class="item-name-block">
          <span class="item-name">${item.name}</span>
          <span class="item-desc">${item.desc}</span>
        </div>
        <span class="item-leader"></span>
        <span class="item-price">₹${item.price}</span>
      `;

      const addBtn = document.createElement("button");
      addBtn.className = "add-btn";
      addBtn.textContent = "+";
      addBtn.setAttribute("aria-label", `Add ${item.name} to cart`);
      addBtn.addEventListener("click", () => addToCart(item.id));

      row.appendChild(addBtn);
      section.appendChild(row);
    });

    menuList.appendChild(section);
  });
}

/* =====================================================
   CART ACTIONS
   ===================================================== */
function addToCart(itemId) {
  cart[itemId] = (cart[itemId] || 0) + 1;
  saveCart();
  renderCart();
  openCart();
}

function changeQuantity(itemId, delta) {
  cart[itemId] = (cart[itemId] || 0) + delta;
  if (cart[itemId] <= 0) delete cart[itemId];
  saveCart();
  renderCart();
}

function cartItemCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartTotalPrice() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = findItemById(id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
}

/* =====================================================
   RENDER CART
   Redraws the cart drawer contents and the header badge.
   ===================================================== */
function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const entries = Object.entries(cart);
  cartCountEl.textContent = cartItemCount();

  if (entries.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-empty">Your tray is empty. Add something from the menu.</p>`;
    checkoutBtn.disabled = true;
  } else {
    cartItemsEl.innerHTML = "";
    entries.forEach(([id, qty]) => {
      const item = findItemById(id);
      if (!item) return;

      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <div>
          <div class="cart-row-name">${item.name}</div>
          <div class="cart-row-price">₹${item.price} each</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" data-action="decrease">−</button>
          <span>${qty}</span>
          <button class="qty-btn" data-action="increase">+</button>
        </div>
        <div class="cart-row-price">₹${item.price * qty}</div>
      `;

      row.querySelector('[data-action="decrease"]').addEventListener("click", () => changeQuantity(id, -1));
      row.querySelector('[data-action="increase"]').addEventListener("click", () => changeQuantity(id, 1));

      cartItemsEl.appendChild(row);
    });
    checkoutBtn.disabled = false;
  }

  cartTotalEl.textContent = `₹${cartTotalPrice()}`;
}

/* =====================================================
   CART DRAWER OPEN / CLOSE
   ===================================================== */
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("show");
}

/* =====================================================
   CHECKOUT
   This is a front-end-only demo: it doesn't send a real
   order anywhere, just shows a confirmation and clears the cart.
   ===================================================== */
function placeOrder() {
  const itemCount = cartItemCount();
  const total = cartTotalPrice(); // sum of (price × quantity) for every item in the cart

  document.getElementById("confirmMessage").textContent =
    `${itemCount} item${itemCount > 1 ? "s" : ""} — total ₹${total}. Your tray will be ready at the counter shortly.`;

  document.getElementById("confirmOverlay").classList.add("show");
  closeCart();

  cart = {};
  saveCart();
  renderCart();
}

/* =====================================================
   CATEGORY RAIL: highlight the active category on scroll
   ===================================================== */
function setupCategoryHighlighting() {
  const links = document.querySelectorAll(".category-link");
  const sections = menuData.map((c) => document.getElementById(c.id));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(`.category-link[href="#${entry.target.id}"]`);
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((section) => section && observer.observe(section));
}

/* =====================================================
   INITIALISE
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderCart();
  setupCategoryHighlighting();

  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("checkoutBtn").addEventListener("click", placeOrder);
  document.getElementById("confirmClose").addEventListener("click", () => {
    document.getElementById("confirmOverlay").classList.remove("show");
  });
});
