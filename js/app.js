(function () {
  "use strict";
  var W = window.WELL;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- Header: tema del logo según la sección debajo + velo al hacer scroll ---------- */
  var header = $(".header"), temas = $$("[data-tema]").filter(function (n) { return n !== header; }), ticking = false;
  function updateHeader() {
    ticking = false;
    var y = header.offsetHeight / 2, tema = "claro"; /* huecos entre secciones: fondo hueso */
    for (var i = 0; i < temas.length; i++) {
      var r = temas[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { tema = temas[i].getAttribute("data-tema"); break; }
    }
    if (header.getAttribute("data-tema") !== tema) header.setAttribute("data-tema", tema);
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateHeader();

  /* ---------- Menú overlay ---------- */
  var menu = $("#menu"), burger = $(".burger"), closeBtn = $(".overlay__close");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $$(".overlay__nav a", menu).forEach(function (a, i) { a.style.setProperty("--i", i); });
  function isOpen() { return menu.classList.contains("is-open"); }
  function menuFocusables() { return $$("a[href], button", menu); }
  function openMenu() {
    menu.removeAttribute("inert"); menu.setAttribute("aria-hidden", "false");
    void menu.offsetWidth; menu.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; closeBtn.focus();
  }
  function closeMenu(restore) {
    menu.classList.remove("is-open"); menu.setAttribute("inert", ""); menu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
    if (restore !== false) burger.focus();
  }
  burger.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", function () { closeMenu(); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { closeMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (!isOpen()) return;
    if (e.key === "Escape") { closeMenu(); return; }
    if (e.key === "Tab") {
      var f = menuFocusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Amenidades ---------- */
  ["wellness", "enjoyment"].forEach(function (k) {
    var ol = $("#amen-" + k);
    W.amenidades[k].forEach(function (a, i) {
      var li = el("li");
      li.appendChild(el("span", "amen__n", pad(i + 1)));
      li.appendChild(el("span", "amen__nombre", a.nombre));
      if (a.detalle) li.appendChild(el("span", "amen__d", a.detalle));
      ol.appendChild(li);
    });
  });

  /* ---------- Selector de residencias ---------- */
  var lista = $("#res-lista"), desc = $("#res-desc"), pillTipo = $("#res-pill-tipo");
  var items = {}, current = null;

  W.residencias.forEach(function (r, i) {
    var li = el("li", "res__item");
    var btn = el("button"); btn.type = "button"; btn.setAttribute("aria-pressed", "false");
    btn.appendChild(el("span", "res__num", pad(i + 1)));
    btn.appendChild(el("span", "res__tipo", r.nombre));
    var datos = el("div", "res__datos"), dl = el("dl");
    function row(t, v) { dl.appendChild(el("dt", null, t)); dl.appendChild(el("dd", null, v)); }
    row("Superficie", r.m2 + " m² / " + r.sqft + " sq ft");
    row("Distribución", r.distribucion);
    if (r.vista) row("Vista", r.vista);
    datos.appendChild(dl);
    li.appendChild(btn); li.appendChild(datos); lista.appendChild(li);
    btn.addEventListener("click", function () { select(r.tipo); });
    items[r.tipo] = { li: li, btn: btn, data: r };
  });

  function select(tipo) {
    if (!items[tipo]) return;
    current = tipo;
    Object.keys(items).forEach(function (k) {
      var on = k === tipo;
      items[k].li.classList.toggle("is-on", on);
      items[k].btn.setAttribute("aria-pressed", on);
    });
    $$(".plano .unidad").forEach(function (u) {
      var on = u.getAttribute("data-tipo") === tipo;
      u.classList.toggle("is-on", on); u.setAttribute("aria-pressed", on);
    });
    var r = items[tipo].data;
    var txt = r.nombre + ": " + r.m2 + " m² (" + r.sqft + " sq ft), " + r.distribucion + ".";
    if (r.vista) txt += " Vista: " + r.vista + ".";
    txt += " " + W.residenciasApoyo;
    swapText([[desc, txt], [pillTipo, r.nombre]]);
  }
  var swapTimer = null, firstSelect = true;
  function swapText(pairs) {
    function apply() { pairs.forEach(function (p) { p[0].textContent = p[1]; p[0].classList.remove("is-out"); }); }
    if (firstSelect || reduce) { firstSelect = false; apply(); return; }
    clearTimeout(swapTimer);
    pairs.forEach(function (p) { p[0].classList.add("swap", "is-out"); });
    swapTimer = setTimeout(apply, 280);
  }

  $$(".plano .unidad").forEach(function (u) {
    u.addEventListener("click", function () { select(u.getAttribute("data-tipo")); });
    u.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); select(u.getAttribute("data-tipo")); }
    });
  });
  select("A");

  /* ---------- Formulario ---------- */
  var F = W.formulario;
  function fill(id, placeholder, opts) {
    var s = $(id); s.appendChild(new Option(placeholder, ""));
    opts.forEach(function (o) { s.appendChild(new Option(o, o)); });
  }
  fill("#f-pais", "Selecciona", F.paises);
  fill("#f-tipo", "Selecciona", W.residencias.map(function (r) { return r.nombre; }).concat(["Penthouse", "Aún no lo sé"]));
  fill("#f-contacto", "Selecciona", F.contacto);
  fill("#f-origen", "Selecciona", F.origen);

  $("#res-contacto").addEventListener("click", function () {
    if (current) $("#f-tipo").value = items[current].data.nombre;
  });

  var form = $("#form"), msg = $("#form-msg"), wa = $("#form-wa");
  var rules = {
    correo: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
    telefono: function (v) { return /^\+?[\d\s().-]{7,}$/.test(v); }
  };
  function validate(input) {
    var v = input.value.trim(), ok = v !== "" && (!rules[input.name] || rules[input.name](v));
    input.closest(".field").classList.toggle("has-error", !ok);
    input.setAttribute("aria-invalid", !ok);
    return ok;
  }
  $$("input, select", form).forEach(function (i) {
    i.addEventListener("blur", function () { if (i.value !== "") validate(i); });
    i.addEventListener("input", function () { if (i.closest(".field").classList.contains("has-error")) validate(i); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fields = $$("input, select", form), bad = fields.filter(function (i) { return !validate(i); });
    if (bad.length) { msg.textContent = "Revisa los campos marcados."; bad[0].focus(); return; }
    var data = {};
    fields.forEach(function (i) { data[i.name] = i.value.trim(); });
    if (W.config.formAction) {
      msg.textContent = "Enviando…";
      fetch(W.config.formAction, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); msg.textContent = "Gracias. Te contactaremos muy pronto."; form.reset(); })
        .catch(function () { msg.textContent = "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp."; });
    } else {
      // [PENDIENTE] Sin destino configurado: no se envía a ningún servidor; se ofrece WhatsApp con los datos.
      var t = "Hola, soy " + data.nombre + " " + data.apellido + ". Me interesa " + data.tipo + " en The Well Panamá. " +
              "Contacto: " + data.correo + ", " + data.telefono + " (" + data.preferencia + "). País: " + data.pais + ". Nos conocí por: " + data.origen + ".";
      wa.href = W.config.whatsapp + "?text=" + encodeURIComponent(t);
      msg.textContent = "Tus datos están listos. Para enviarlos, continúa por WhatsApp.";
      wa.focus();
    }
  });

  /* ---------- Movimiento: hero y revelado al scroll ---------- */
  var hero = $(".hero"), heroImg = $(".hero__media img.bg");
  var h1 = $(".hero h1"), sub = $(".hero__sub");
  function heroReady() { hero.classList.add("is-ready"); h1.classList.add("is-in"); sub.classList.add("is-in"); setTimeout(function () { settle(h1); settle(sub); }, 3200); }
  [h1, sub].forEach(function (n, i) { n.classList.add("reveal"); n.style.setProperty("--d", (250 + i * 350) + "ms"); });
  function startHero() { requestAnimationFrame(function () { requestAnimationFrame(heroReady); }); }
  if (heroImg.decode) heroImg.decode().then(startHero, startHero); else startHero();

  var GROUPS = [
    ["reveal", ".intro__text .eyebrow, .intro__text h2, .intro__body > *, .res > .eyebrow, .res > h2, .amen__text .eyebrow, .amen__text h2, .amen__text .lead, .amen__cols > div, .cita, .ubi h2, .contacto h2, .contacto__sub, .form .field, .form__actions, .footer__logo, .footer__info, .footer__legal, .footer__copy, .hero__nav"],
    ["reveal reveal--soft", ".res__plano, .res__lista"],
    ["reveal-img", ".intro__img img, .amen__img img"],
    ["reveal-fade", ".ubi iframe"]
  ];
  var targets = [];
  GROUPS.forEach(function (g) {
    $$(g[1]).forEach(function (n) { if (targets.indexOf(n) < 0) { g[0].split(" ").forEach(function (c) { n.classList.add(c); }); targets.push(n); } });
  });
  function settle(n) {
    ["reveal", "reveal--soft", "reveal-img", "reveal-fade", "is-in"].forEach(function (c) { n.classList.remove(c); });
    n.style.removeProperty("--d");
  }
  function show(n, delay) {
    n.style.setProperty("--d", delay + "ms");
    n.classList.add("is-in");
    var done = false, finish = function () { if (!done) { done = true; settle(n); } };
    n.addEventListener("transitionend", function (e) { if (e.target === n && e.propertyName === "opacity") finish(); });
    setTimeout(finish, delay + 2200);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (e) { return e.isIntersecting; }).map(function (e) { return e.target; });
      vis.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
      vis.forEach(function (n, i) { io.unobserve(n); show(n, reduce ? 0 : i * 100); });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (n) { io.observe(n); });
  } else { targets.forEach(function (n) { settle(n); }); }
})();
