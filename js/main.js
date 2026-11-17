/*
Template Name: Medistore
File Name: main.js (v2.0 — no jQuery required)
Author Name: ThemeVault
Author URI: https://www.themevault.net/
License URI: https://www.themevault.net/license/
*/

// Back to top
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  window.addEventListener(
    "scroll",
    () => backToTop.classList.toggle("is-visible", window.scrollY > 100),
    { passive: true }
  );
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Scroll-snap product strips: arrow buttons page the track by its visible width
document.querySelectorAll(".ms-strip").forEach((strip) => {
  const track = strip.querySelector(".ms-strip-track");
  if (!track) return;
  strip.querySelectorAll(".ms-strip-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = btn.dataset.dir === "prev" ? -1 : 1;
      track.scrollBy({ left: dir * track.clientWidth, behavior: "smooth" });
    });
  });
});

// --- 2.1: checkout steps, order confirmation, review form ---
// Checkout: each Continue checks the required fields in its step, closes it and opens the next one.
// Confirm Order shows a confirmation with an order number. A static page cannot take payment:
// connect your payment provider here (see the template's CHANGELOG).
(function () {
  var steps = ["collapse-checkout-option", "collapse-payment-address", "collapse-shipping-address",
    "collapse-shipping-method", "collapse-payment-method", "collapse-checkout-confirm"];
  var buttons = { "button-account": 0, "button-register": 1, "button-guest-shipping": 2,
    "button-shipping-method": 3, "button-payment-method": 4 };
  var show = function (id) {
    var el = document.getElementById(id);
    if (!el || !window.bootstrap) return;
    window.bootstrap.Collapse.getOrCreateInstance(el, { toggle: false }).show();
  };
  var hide = function (id) {
    var el = document.getElementById(id);
    if (!el || !window.bootstrap) return;
    window.bootstrap.Collapse.getOrCreateInstance(el, { toggle: false }).hide();
  };
  var valid = function (step) {
    var ok = true;
    step.querySelectorAll("input[required], select[required], textarea[required]").forEach(function (f) {
      var good = f.type === "checkbox" ? f.checked : f.value.trim() !== "" && f.checkValidity();
      f.classList.toggle("is-invalid", !good);
      if (!good && ok) { f.focus(); ok = false; }
    });
    return ok;
  };
  Object.keys(buttons).forEach(function (id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", function () {
      var i = buttons[id], step = document.getElementById(steps[i]);
      if (step && !valid(step)) return;
      hide(steps[i]);
      show(steps[i + 1]);
      var next = document.getElementById(steps[i + 1]);
      if (next) next.closest(".ms-panel, .card, section, div").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  var confirm = document.getElementById("button-confirm");
  if (confirm) confirm.addEventListener("click", function () {
    // every step must be complete: open the first one that is not
    for (var s = 1; s <= 4; s++) {
      var step = document.getElementById(steps[s]);
      if (step && !valid(step)) { show(steps[s]); step.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    }
    var no = "MS-" + String(Date.now()).slice(-6);
    var note = document.createElement("div");
    note.className = "alert alert-success mt-3";
    note.setAttribute("role", "status");
    note.innerHTML = "<strong>Thank you, your order is placed.</strong> Your order number is " + no +
      ". We will send a confirmation to your email address shortly.";
    confirm.closest("div").after(note);
    confirm.disabled = true;
    confirm.textContent = "Order placed";
  });
  var review = document.getElementById("form-review");
  if (review) review.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!valid(review)) return;
    var note = review.querySelector(".ms-form-note") || document.createElement("div");
    note.className = "alert alert-success mt-3 ms-form-note";
    note.setAttribute("role", "status");
    note.textContent = "Thank you, your review has been sent. It will appear once it has been checked.";
    review.appendChild(note);
    review.reset();
  });
})();
