/* ============================================================
   EUNOIA — Wear your own universe
   Site logic: js/main.js
   ============================================================ */

/* ORDER FORM — WHATSAPP */
const orderProducts = [
  { name: "Full Sleeve Shirt", price: "৳ 1,850" },
  { name: "Half Sleeve Shirt", price: "৳ 1,650" },
  { name: "Full Sleeve T-Shirt", price: "৳ 1,250" },
  { name: "Half Sleeve T-Shirt", price: "৳ 990" },
  { name: "Hoodie", price: "৳ 2,200" }
];

const orderProductEl = document.getElementById("orderProduct");
if(orderProductEl){
  orderProducts.forEach(p=>{
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = `${p.name} — ${p.price}`;
    orderProductEl.appendChild(opt);
  });
}

const orderForm = document.getElementById("whatsappOrderForm");
if(orderForm){
  orderForm.onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById("orderName").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const address = document.getElementById("orderAddress").value.trim();
    const product = document.getElementById("orderProduct").value;
    const size = document.getElementById("orderSize").value;

    if(!name || !phone || !address || !product || !size){
      alert("Please fill in all required fields.");
      return;
    }

    const msg = `*New Order — EUNOIA*\n\nCustomer: ${name}\nPhone: ${phone}\nAddress: ${address}\nProduct: ${product}\nSize: ${size}\n\nPlease confirm price and availability.`;
    const url = "https://wa.me/8801708331114?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
  };
}

/* GREETING — time of day */
const greetingMsg = document.getElementById("greeting-msg");
if(greetingMsg){
  const h = new Date().getHours();
  let g = "Good Morning";
  if(h >= 12 && h < 17) g = "Good Afternoon";
  else if(h >= 17) g = "Good Evening";
  greetingMsg.textContent = g + "!";
}

"use strict";

/* ---------- Data ---------- */
const products = [
  { name: "Full Sleeve Shirt",   img: "assets/longshirt.jpg",  price: "৳ 1,850" },
  { name: "Half Sleeve Shirt",   img: "assets/shortshirt.jpg", price: "৳ 1,650" },
  { name: "Full Sleeve T-Shirt", img: "assets/longtee.jpg",    price: "৳ 1,250" },
  { name: "Half Sleeve T-Shirt", img: "assets/tshirt.jpg",     price: "৳ 990"   },
  { name: "Hoodie",              img: "assets/hoodie.jpg",     price: "৳ 2,200" }
];

let current = 0;
let size = "M";
let color = "Black";

/* ---------- Elements ---------- */
const track = document.getElementById("track");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
const moon = document.querySelector(".moon");

/* ============================================================
   1. PRODUCT CARDS
   ============================================================ */
function card(p, i) {
  return `
    <article class="card" tabindex="0" role="button" data-id="${i}" aria-label="View ${p.name}">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name} on a hanger" loading="lazy">
        <span class="card-plus">↗</span>
      </div>
      <div class="card-label">${p.name}</div>
      <div class="card-price">${p.price} · Example price</div>
    </article>`;
}

track.innerHTML = products.map(card).join("");
document.getElementById("new1").innerHTML = card(products[4], 4);
document.getElementById("new2").innerHTML = card(products[2], 2);

/* ============================================================
   2. MODAL — SIZE / COLOR / WHATSAPP ORDER LINK
   ============================================================ */
function draw() {
  document.getElementById("sizes").innerHTML = ["S", "M", "L", "XL"]
    .map(x => `<button class="choice ${size === x ? "active" : ""}" data-size="${x}">${x}</button>`)
    .join("");

  document.getElementById("colors").innerHTML = ["Black", "White", "Olive"]
    .map(x => `<button class="choice ${color === x ? "active" : ""}" data-color="${x}">${x}</button>`)
    .join("");

  update();
}

function update() {
  const p = products[current];
  const phone = document.getElementById("phone").value;
  document.getElementById("order").href =
    "https://wa.me/" + phone + "?text=" +
    encodeURIComponent(
      `Hello! I'd like to order the ${p.name} (${p.price}, example price). ` +
      `Size: ${size}. Color: ${color}. Please confirm price, availability, fabric and payment details.`
    );
}

/* ============================================================
   3. REVIEWS (stored locally on the visitor's device)
   ============================================================ */
function reviews() {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem("eunoia-review-" + current) || "[]");
  } catch (e) {
    list = [];
  }

  const box = document.getElementById("reviews");
  box.replaceChildren();

  if (!list.length) {
    box.textContent = "No reviews yet. Be the first!";
    box.className = "note";
    return;
  }

  box.className = "";
  list.forEach(r => {
    const div = document.createElement("div");
    div.className = "review";

    const s = document.createElement("div");
    s.className = "stars";
    s.textContent = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

    const t = document.createElement("div");
    t.textContent = r.name + " — " + r.comment;

    div.append(s, t);
    box.append(div);
  });
}

/* ============================================================
   4. OPEN / CLOSE MODAL
   ============================================================ */
function open(i) {
  current = i;
  size = "M";
  color = "Black";

  const p = products[i];
  document.getElementById("title").textContent = p.name;
  document.getElementById("price").textContent = p.price + " (example)";
  document.getElementById("image").src = p.img;
  document.getElementById("image").alt = p.name + " on a hanger";

  draw();
  reviews();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ============================================================
   5. EVENT WIRING
   ============================================================ */
document.querySelectorAll(".card").forEach(c => {
  c.onclick = () => open(+c.dataset.id);
  c.onkeydown = e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open(+c.dataset.id);
    }
  };
});

closeBtn.onclick = closeModal;
modal.onclick = e => { if (e.target === modal) closeModal(); };
document.onkeydown = e => { if (e.key === "Escape") closeModal(); };

document.getElementById("sizes").onclick = e => {
  if (e.target.dataset.size) {
    size = e.target.dataset.size;
    draw();
  }
};

document.getElementById("colors").onclick = e => {
  if (e.target.dataset.color) {
    color = e.target.dataset.color;
    draw();
  }
};

document.getElementById("phone").onchange = update;

document.getElementById("reviewform").onsubmit = e => {
  e.preventDefault();
  try {
    const key = "eunoia-review-" + current;
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.unshift({
      name: document.getElementById("name").value.trim(),
      rating: +document.getElementById("rating").value,
      comment: document.getElementById("comment").value.trim()
    });
    localStorage.setItem(key, JSON.stringify(list));
    e.target.reset();
    reviews();
  } catch (err) {
    alert("Could not save review on this device.");
  }
};

/* ============================================================
   6. SLIDER ARROWS, MOON PARALLAX, AUTOPLAY
   ============================================================ */
document.getElementById("prev").onclick = () => track.scrollBy({ left: -240, behavior: "smooth" });
document.getElementById("next").onclick = () => track.scrollBy({ left: 240, behavior: "smooth" });

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

track.addEventListener("scroll", () => {
  if (!reducedMotion()) {
    moon.style.transform = `rotate(${track.scrollLeft * 0.16}deg)`;
  }
}, { passive: true });

setInterval(() => {
  if (modal.classList.contains("open") || reducedMotion()) return;
  if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
    track.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    track.scrollBy({ left: 240, behavior: "smooth" });
  }
}, 3500);
