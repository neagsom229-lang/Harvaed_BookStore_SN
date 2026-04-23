let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================= SAVE CART ================= */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= UPDATE CART COUNT ================= */
function updateCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.innerText = totalQty;
}

/* ================= ADD TO CART ================= */
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    const name = this.dataset.name;
    const price = Number(this.dataset.price);

    if (!name || isNaN(price)) return;

    const item = cart.find(i => i.name === name);

    if (item) {
      item.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    saveCart();
    renderCart();
    updateCount();
  });
});

/* ================= TOGGLE CART ================= */
function toggleCart(forceClose = false) {
  const box = document.getElementById("cartBox");
  if (!box) return;

  // 👉 force close (used in checkout)
  if (forceClose) {
    box.style.right = "-350px";
    return;
  }

  const isOpen = box.style.right === "0px";
  box.style.right = isOpen ? "-350px" : "0px";

  renderCart();
}

/* ================= RENDER CART ================= */
function renderCart() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (!container || !totalEl) return;

  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-muted">Cart is empty</p>`;
    totalEl.innerText = "0.00";
    return;
  }

  container.innerHTML = cart.map((item, i) => {
    total += item.price * item.qty;

    return `
      <div style="border-bottom:1px solid #eee; padding:8px 0;">
        <b>${item.name}</b><br>
        $${item.price} × ${item.qty}

        <button class="remove-btn" data-index="${i}"
          style="float:right; background:red; color:white; border:none; padding:2px 8px;">
          ×
        </button>
      </div>
    `;
  }).join("");

  totalEl.innerText = total.toFixed(2);

  /* attach remove events */
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const i = Number(this.dataset.index);
      removeItem(i);
    });
  });
}

/* ================= REMOVE ITEM ================= */
function removeItem(i) {
  if (i < 0 || i >= cart.length) return;

  cart.splice(i, 1);
  saveCart();
  renderCart();
  updateCount();
}

/* ================= CHECKOUT ================= */
function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // set total in modal
  const finalAmount = document.getElementById("finalAmount");
  if (finalAmount) {
    finalAmount.innerText = total.toFixed(2);
  }

  // 👉 CLOSE CART
  toggleCart(true);

  // 👉 OPEN MODAL
  setTimeout(() => {
    const modalEl = document.getElementById("qrModal");

    if (modalEl && window.bootstrap) {
      new bootstrap.Modal(modalEl).show();
    } else {
      alert("Checkout Total: $" + total.toFixed(2));
    }
  }, 300);
}
function handleBuyNow() {
  toggleCart();   // close first
  checkout();     // then go to checkout
}
/* ================= PAYMENT CHECK ================= */
function checkPaymentStatus() {
  const status = document.getElementById("paymentStatus");

  if (status) {
    status.innerText = "✅ Payment Confirmed!";
    status.style.color = "green";
  }

  setTimeout(() => {
    cart = [];
    saveCart();
    renderCart();
    updateCount();

    alert("Order completed!");
    location.reload();
  }, 1000);
}

/* ================= INIT ================= */
renderCart();
updateCount();

/* ================= FILTER ================= */
function filterBooks(category, event) {
  let books = document.querySelectorAll(".book-item");
  let buttons = document.querySelectorAll(".btn-outline-primary");

  buttons.forEach(btn => btn.classList.remove("active"));

  if (event) {
    event.target.classList.add("active");
  }

  books.forEach(book => {
    let bookCategory = book.getAttribute("data-category");

    if (category === "all" || bookCategory === category) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}