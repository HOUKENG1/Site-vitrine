"use strict";

/* ==========================================================
   Octet – script.js
   Tout ce que vous devez modifier est dans les 3 blocs du haut :
   CONFIG, CATEGORIES et PRODUCTS.
   ========================================================== */

const CONFIG = {
  whatsapp: "237600000000", // numéro international, sans + ni espaces
  store: "Octet",
  currency: "FCFA"
};

const CATEGORIES = [
  { id: "portables",   label: "Portables",   icon: "i-laptop" },
  { id: "fixes",       label: "PC fixes",    icon: "i-desktop" },
  { id: "ecrans",      label: "Écrans",      icon: "i-monitor" },
  { id: "stockage",    label: "Stockage",    icon: "i-drive" },
  { id: "reseau",      label: "Réseau",      icon: "i-router" },
  { id: "accessoires", label: "Accessoires", icon: "i-keyboard" },
  { id: "telephones", label: "Téléphones", icon: "i-phone" }
];

// usages possibles : bureautique, etudes, gaming, creation
// stock : true = en stock, false = sur commande
const PRODUCTS = [
  { id: "p01", name: "Portable bureautique 15,6 pouces", cat: "portables", usages: ["bureautique", "etudes"], price: 325000, stock: true,
    specs: [["Processeur", "Core i5"], ["Mémoire", "8 Go"], ["Stockage", "SSD 256 Go"], ["Écran", "15,6 pouces Full HD"]] },
  { id: "p02", name: "Portable étudiant 14 pouces", cat: "portables", usages: ["etudes", "bureautique"], price: 420000, stock: true,
    specs: [["Processeur", "Ryzen 5"], ["Mémoire", "16 Go"], ["Stockage", "SSD 512 Go"], ["Autonomie", "Environ 9 h"]] },
  { id: "p03", name: "Portable création 16 pouces", cat: "portables", usages: ["creation", "gaming"], price: 1150000, stock: true,
    specs: [["Processeur", "Core i7"], ["Mémoire", "32 Go"], ["Stockage", "SSD 1 To"], ["Graphique", "RTX 4050"]] },
  { id: "p04", name: "Portable gaming 15,6 pouces 144 Hz", cat: "portables", usages: ["gaming"], price: 980000, stock: false,
    specs: [["Processeur", "Ryzen 7"], ["Mémoire", "16 Go"], ["Stockage", "SSD 512 Go"], ["Graphique", "RTX 4060"]] },
  { id: "p05", name: "Mini PC de bureau", cat: "fixes", usages: ["bureautique", "etudes"], price: 245000, stock: true,
    specs: [["Processeur", "Core i3"], ["Mémoire", "8 Go"], ["Stockage", "SSD 256 Go"], ["Format", "Très compact"]] },
  { id: "p06", name: "PC tour gaming", cat: "fixes", usages: ["gaming", "creation"], price: 890000, stock: true,
    specs: [["Processeur", "Core i5"], ["Mémoire", "16 Go"], ["Stockage", "SSD 1 To"], ["Graphique", "RTX 4060"]] },
  { id: "p07", name: "Écran 24 pouces Full HD", cat: "ecrans", usages: ["bureautique", "etudes"], price: 95000, stock: true,
    specs: [["Dalle", "IPS"], ["Définition", "1920 × 1080"], ["Fréquence", "75 Hz"], ["Connexions", "HDMI, VGA"]] },
  { id: "p08", name: "Écran 27 pouces 2K 165 Hz", cat: "ecrans", usages: ["gaming", "creation"], price: 210000, stock: true,
    specs: [["Dalle", "IPS"], ["Définition", "2560 × 1440"], ["Fréquence", "165 Hz"], ["Connexions", "HDMI, DisplayPort"]] },
  { id: "p09", name: "SSD NVMe 1 To", cat: "stockage", usages: ["bureautique", "gaming", "creation"], price: 65000, stock: true,
    specs: [["Capacité", "1 To"], ["Interface", "M.2 NVMe"], ["Lecture", "Jusqu'à 3 500 Mo/s"], ["Garantie", "12 mois"]] },
  { id: "p10", name: "Disque dur externe 2 To", cat: "stockage", usages: ["bureautique", "etudes", "creation"], price: 55000, stock: true,
    specs: [["Capacité", "2 To"], ["Interface", "USB 3.0"], ["Format", "2,5 pouces"], ["Garantie", "12 mois"]] },
  { id: "p11", name: "Routeur Wi-Fi 6 AX1800", cat: "reseau", usages: ["bureautique", "gaming", "etudes"], price: 48000, stock: true,
    specs: [["Norme", "Wi-Fi 6"], ["Débit", "1 800 Mb/s"], ["Ports", "4 × Gigabit"], ["Bandes", "2,4 et 5 GHz"]] },
  { id: "p12", name: "Onduleur 850 VA", cat: "reseau", usages: ["bureautique", "creation"], price: 58000, stock: true,
    specs: [["Puissance", "850 VA"], ["Prises", "4"], ["Protection", "Surtension"], ["Usage", "PC et box internet"]] },
  { id: "p13", name: "Clavier et souris sans fil", cat: "accessoires", usages: ["bureautique", "etudes"], price: 15000, stock: true,
    specs: [["Connexion", "USB sans fil 2,4 GHz"], ["Clavier", "AZERTY"], ["Piles", "Incluses"], ["Garantie", "6 mois"]] },
  { id: "p14", name: "Casque-micro USB", cat: "accessoires", usages: ["bureautique", "etudes", "gaming"], price: 22000, stock: true,
    specs: [["Connexion", "USB"], ["Micro", "Anti-bruit"], ["Câble", "2 m"], ["Garantie", "6 mois"]] },
  { id: "p15", name: "Smartphone 6,6 pouces 128 Go", cat: "telephones", usages: ["bureautique", "etudes"], price: 135000, stock: true, image: "images/p15.webp",
    specs: [["Écran", "6,6 pouces"], ["Mémoire", "6 Go + 128 Go"], ["Batterie", "5 000 mAh"], ["Appareil photo", "50 Mpx"]] },
];

/* ---------- Outils ---------- */
const $ = (sel) => document.querySelector(sel);
const money = (n) => ${new Intl.NumberFormat("fr-FR").format(n)} ${CONFIG.currency};
const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const STORAGE_KEY = "octet-selection";
const state = { cat: "all", usage: "all", q: "", sort: "default" };
let cart = loadCart();

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    // On ne garde que les produits qui existent encore dans le catalogue
    return Object.fromEntries(
      Object.entries(raw).filter(([id, qty]) => PRODUCTS.some((p) => p.id === id) && Number.isInteger(qty) && qty > 0)
    );
  } catch {
    return {};
  }
}
function saveCart() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* stockage indisponible */ }
}
function announce(message) {
  const el = $("#announce");
  el.textContent = "";
  // Petit délai pour que le lecteur d'écran relise le message
  setTimeout(() => { el.textContent = message; }, 50);
}

/* ---------- Catalogue ---------- */
function filteredProducts() {
  const q = normalize(state.q.trim());
  let list = PRODUCTS.filter((p) => {
    if (state.cat !== "all" && p.cat !== state.cat) return false;
    if (state.usage !== "all" && !p.usages.includes(state.usage)) return false;
    if (q) {
      const haystack = normalize([p.name, ...p.specs.flat()].join(" "));
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
  if (state.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  if (state.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return list;
}

function cardHTML(p) {
  const cat = CATEGORIES.find((c) => c.id === p.cat);
  const specs = p.specs.map(([k, v]) => <div><dt>${k}</dt><dd>${v}</dd></div>).join("");
  const badge = p.stock ? "" : <span class="badge">Sur commande</span>;
  const visual = p.image
  ? <img src="${p.image}" alt="${p.name}" width="400" height="300" loading="lazy" decoding="async" data-icon="${cat.icon}">
  : <svg class="icon icon-lg" aria-hidden="true"><use href="#${cat.icon}"/></svg>;
  return `
    <li class="card">
      <div class="card-visual">
        <svg class="icon icon-lg" aria-hidden="true"><use href="#${cat.icon}"/></svg>
        ${badge}
      </div>
      <h3>${p.name}</h3>
      <dl class="specs">${specs}</dl>
      <div class="card-foot">
        <p class="price">${money(p.price)}</p>
        <button class="btn btn-primary" type="button" data-add="${p.id}" aria-label="Ajouter ${p.name} à ma sélection">Ajouter</button>
      </div>
    </li>`;
}

function renderCatalogue() {
  const list = filteredProducts();
  const grid = $("#grid");
  if (list.length === 0) {
    grid.innerHTML = `
      <li class="empty">
        <p>Aucun produit ne correspond à votre recherche. Modifiez les mots-clés ou les filtres.</p>
        <button class="btn" type="button" data-reset>Réinitialiser les filtres</button>
      </li>`;
    $("#count").textContent = "Aucun produit trouvé.";
    return;
  }
  grid.innerHTML = list.map(cardHTML).join("");
  $("#count").textContent = ${list.length} produit${list.length > 1 ? "s" : ""} affiché${list.length > 1 ? "s" : ""}.;
}

function renderChips() {
  const items = [{ id: "all", label: "Tout" }, ...CATEGORIES];
  $("#chips").innerHTML = items
    .map((c) => <button class="chip" type="button" data-cat="${c.id}" aria-pressed="${state.cat === c.id}">${c.label}</button>)
    .join("");
}

function resetFilters() {
  state.cat = "all"; state.usage = "all"; state.q = ""; state.sort = "default";
  $("#q").value = ""; $("#usage").value = "all"; $("#sort").value = "default";
  renderChips();
  renderCatalogue();
}

/* ---------- Sélection (panier de devis) ---------- */
function cartLines() {
  return Object.entries(cart).map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id), qty }));
}

function whatsappURL(lines, total) {
  const rows = lines.map(({ product, qty }) => - ${qty} × ${product.name} (${money(product.price)})).join("\n");
  const message =
    Bonjour ${CONFIG.store}, je souhaite un devis pour :\n${rows}\n\n +
    Total indicatif : ${money(total)}\n +
    Merci de me confirmer la disponibilité et le prix.;
  return https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)};
}

function renderCart() {
  const lines = cartLines();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.qty * l.product.price, 0);

  $("#cart-count").textContent = count;
  $("#cart-empty").hidden = lines.length > 0;
  $("#cart-foot").hidden = lines.length === 0;
  $("#cart-total").textContent = money(total);

  $("#cart-list").innerHTML = lines
    .map(({ product, qty }) => `
      <li class="cart-item">
        <p class="cart-item-name">${product.name}</p>
        <div class="cart-item-row">
          <div class="qty" role="group" aria-label="Quantité de ${product.name}">
            <button type="button" data-act="dec" data-id="${product.id}" aria-label="Retirer une unité">−</button>
            <output>${qty}</output>
            <button type="button" data-act="inc" data-id="${product.id}" aria-label="Ajouter une unité">+</button>
          </div>
          <p class="price">${money(product.price * qty)}</p>
        </div>
        <button class="link-btn" type="button" data-act="del" data-id="${product.id}">Supprimer ${product.name}</button>
      </li>`)
    .join("");

  if (lines.length) $("#send").href = whatsappURL(lines, total);
  saveCart();
}

function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id];
  else cart[id] = Math.min(next, 99);
  renderCart();
}

/* ---------- Événements ---------- */
$("#q").addEventListener("input", (e) => { state.q = e.target.value; renderCatalogue(); });
$("#usage").addEventListener("change", (e) => { state.usage = e.target.value; renderCatalogue(); });
$("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderCatalogue(); });

$("#chips").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  state.cat = btn.dataset.cat;
  renderChips();
  renderCatalogue();
  // Le focus reste sur la catégorie choisie
  $(#chips [data-cat="${state.cat}"]).focus();
});

$("#grid").addEventListener("click", (e) => {
  if (e.target.closest("[data-reset]")) { resetFilters(); return; }
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const product = PRODUCTS.find((p) => p.id === btn.dataset.add);
  changeQty(product.id, 1);
  announce(${product.name} ajouté à votre sélection. ${$("#cart-count").textContent} article(s) au total.);
});

const cartDialog = $("#cart");
$("#open-cart").addEventListener("click", () => cartDialog.showModal());
$("#close-cart").addEventListener("click", () => cartDialog.close());
cartDialog.addEventListener("click", (e) => { if (e.target === cartDialog) cartDialog.close(); });

$("#cart-list").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const { act, id } = btn.dataset;
  if (act === "inc") changeQty(id, 1);
  if (act === "dec") changeQty(id, -1);
  if (act === "del") { delete cart[id]; renderCart(); }
});

$("#clear-cart").addEventListener("click", () => {
  cart = {};
  renderCart();
  announce("Sélection vidée.");
});

// Menu mobile
const menuBtn = $("#menu-toggle");
const nav = $("#site-nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

/* ---------- Démarrage ---------- */
$("#wa-link").href = https://wa.me/${CONFIG.whatsapp};
$("#year").textContent = new Date().getFullYear();
renderChips();
renderCatalogue();
renderCart();