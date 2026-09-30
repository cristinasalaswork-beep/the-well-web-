(function () {
  "use strict";
  var W = window.WELL;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = "es";
  function T() { return W.t[lang]; }

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
  $$(".overlay__nav a", menu).forEach(function (a, i) { a.style.setProperty("--i", i); });
  function isOpen() { return menu.classList.contains("is-open"); }
  function openMenu() {
    menu.removeAttribute("inert"); menu.setAttribute("aria-hidden", "false");
    void menu.offsetWidth; menu.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", T().menuCerrar);
    document.body.style.overflow = "hidden"; closeBtn.focus();
  }
  function closeMenu(restore) {
    menu.classList.remove("is-open"); menu.setAttribute("inert", ""); menu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", T().menuAbrir);
    document.body.style.overflow = ""; if (restore !== false) burger.focus();
  }
  burger.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", function () { closeMenu(); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { closeMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (!isOpen()) return;
    if (e.key === "Escape") { closeMenu(); return; }
    if (e.key === "Tab") {
      var f = $$("a[href], button", menu), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Idioma (ES / EN) ---------- */
  // El español vive en el HTML: se guarda al inicio para poder restaurarlo.
  var i18nEls = $$("[data-i18n]").map(function (n) { return { n: n, key: n.getAttribute("data-i18n"), es: n.innerHTML }; });
  var attrEls = [];
  $$("[data-i18n-attr]").forEach(function (n) {
    n.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
      var p = pair.split(":"); attrEls.push({ n: n, attr: p[0], key: p[1], es: n.getAttribute(p[0]) });
    });
  });
  var meta = { title: document.title, desc: $('meta[name="description"]').getAttribute("content") };

  function applyStatic() {
    var en = lang === "en";
    i18nEls.forEach(function (o) { o.n.innerHTML = en && W.en[o.key] != null ? W.en[o.key] : o.es; });
    attrEls.forEach(function (o) { o.n.setAttribute(o.attr, en && W.en[o.key] != null ? W.en[o.key] : o.es); });
    document.title = en ? W.en["meta.title"] : meta.title;
    $('meta[name="description"]').setAttribute("content", en ? W.en["meta.desc"] : meta.desc);
    document.documentElement.lang = lang;
    $$("[data-lang]").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.setAttribute("aria-pressed", on); if (on) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
    burger.setAttribute("aria-label", isOpen() ? T().menuCerrar : T().menuAbrir);
  }

  /* ---------- Amenidades (los nombres ya están en inglés) ---------- */
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
  var items = {}, current = "A", firstSelect = true, swapTimer = null;

  function nombre(r) { return T().tipo + " " + r.tipo; }
  function vista(r) { return r.vista ? T().vistas[r.vista] : null; }
  function renderLista() {
    lista.innerHTML = ""; items = {};
    W.residencias.forEach(function (r, i) {
      var li = el("li", "res__item");
      var btn = el("button"); btn.type = "button"; btn.setAttribute("aria-pressed", "false");
      btn.appendChild(el("span", "res__num", pad(i + 1)));
      btn.appendChild(el("span", "res__tipo", nombre(r)));
      var datos = el("div", "res__datos"), dl = el("dl");
      function row(t, v) { dl.appendChild(el("dt", null, t)); dl.appendChild(el("dd", null, v)); }
      row(T().superficie, r.m2 + " m² / " + r.sqft + " sq ft");
      row(T().distribucion, T().dist);
      if (vista(r)) row(T().vista, vista(r));
      datos.appendChild(dl);
      li.appendChild(btn); li.appendChild(datos); lista.appendChild(li);
      btn.addEventListener("click", function () { select(r.tipo); });
      items[r.tipo] = { li: li, btn: btn, data: r };
    });
    $$(".plano .unidad").forEach(function (u) {
      var r = items[u.getAttribute("data-tipo")].data, L = u.getAttribute("data-unidad");
      var torre = u.closest(".torre").getAttribute("data-torre") === "essence" ? "Essence Tower" : "Forest Tower";
      u.setAttribute("aria-label", nombre(r) + ", " + T().unidad + " " + L + ", " + torre);
      $("title", u).textContent = nombre(r) + " (" + L + ") · " + torre;
    });
  }
  function describe(r) {
    var txt = nombre(r) + ": " + r.m2 + " m² (" + r.sqft + " sq ft), " + T().dist + ".";
    if (vista(r)) txt += " " + T().vista + ": " + vista(r) + ".";
    return txt + " " + T().apoyo;
  }
  function swapText(pairs, instant) {
    function apply() { pairs.forEach(function (p) { p[0].textContent = p[1]; p[0].classList.remove("is-out"); }); }
    if (instant || firstSelect || reduce) { firstSelect = false; apply(); return; }
    clearTimeout(swapTimer);
    pairs.forEach(function (p) { p[0].classList.add("swap", "is-out"); });
    swapTimer = setTimeout(apply, 280);
  }
  function select(tipo, instant) {
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
    swapText([[desc, describe(r)], [pillTipo, nombre(r)]], instant);
  }
  $$(".plano .unidad").forEach(function (u) {
    u.addEventListener("click", function () { select(u.getAttribute("data-tipo")); });
    u.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); select(u.getAttribute("data-tipo")); }
    });
  });

  /* ---------- Formulario ---------- */
  var form = $("#form"), msg = $("#form-msg"), wa = $("#form-wa");
  function fill(id, opts, keep) {
    var s = $(id), prev = s.value; s.innerHTML = "";
    s.appendChild(new Option(T().selecciona, ""));
    opts.forEach(function (o) { s.appendChild(new Option(o, o)); });
    if (keep && prev) s.selectedIndex = keep.indexOf(prev) + 1;
  }
  function fillSelects() {
    var tipos = W.residencias.map(nombre).concat(T().extraTipos);
    // conserva la selección por posición al cambiar de idioma
    var idx = {};
    ["#f-pais", "#f-tipo", "#f-contacto", "#f-origen"].forEach(function (id) { idx[id] = $(id).selectedIndex; });
    fill("#f-pais", T().paises); fill("#f-tipo", tipos); fill("#f-contacto", T().contacto); fill("#f-origen", T().origen);
    Object.keys(idx).forEach(function (id) { if (idx[id] > 0) $(id).selectedIndex = idx[id]; });
  }
  $("#res-contacto").addEventListener("click", function () {
    if (current) $("#f-tipo").value = nombre(items[current].data);
  });

  var rules = {
    correo: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
    telefono: function (v) { return /^\+?[\d\s().-]{7,}$/.test(v); }
  };
  function fields() { return $$("input:not([name=website]), select", form); }
  function validate(input) {
    var v = input.value.trim(), ok = v !== "" && (!rules[input.name] || rules[input.name](v));
    input.closest(".field").classList.toggle("has-error", !ok);
    input.setAttribute("aria-invalid", !ok);
    return ok;
  }
  fields().forEach(function (i) {
    i.addEventListener("blur", function () { if (i.value !== "") validate(i); });
    i.addEventListener("input", function () { if (i.closest(".field").classList.contains("has-error")) validate(i); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = fields().filter(function (i) { return !validate(i); });
    if (bad.length) { msg.textContent = T().revisa; bad[0].focus(); return; }
    if ($("[name=website]", form).value) return; // trampa anti-bots
    var data = {};
    fields().forEach(function (i) { data[i.name] = i.value.trim(); });
    var cfg = W.config;
    if (cfg.formMode === "endpoint" && cfg.formAction) {
      data.idioma = lang;
      msg.textContent = T().enviando;
      fetch(cfg.formAction, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); msg.textContent = T().ok; form.reset(); fillSelects(); })
        .catch(function () { msg.textContent = T().error; });
    } else {
      var url = cfg.whatsapp + "?text=" + encodeURIComponent(T().waTexto(data));
      wa.href = url;
      window.open(url, "_blank", "noopener");
      msg.textContent = T().waAbierto;
    }
  });

  /* ---------- Idioma: aplicar y recordar ---------- */
  function setLang(l, persist) {
    lang = l;
    if (persist) { try { localStorage.setItem("well-lang", l); } catch (e) { /* sin almacenamiento */ } }
    applyStatic(); renderLista(); fillSelects(); select(current, true);
  }
  $$("[data-lang]").forEach(function (b) { b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); }); });
  var stored = null; try { stored = localStorage.getItem("well-lang"); } catch (e) { /* ignorar */ }
  setLang(stored === "en" ? "en" : "es", false);

  /* ---------- Movimiento: hero y revelado al scroll ---------- */
  var hero = $(".hero"), heroImg = $(".hero__media img.bg");
  var h1 = $(".hero h1"), sub = $(".hero__sub");
  function heroReady() { hero.classList.add("is-ready"); h1.classList.add("is-in"); sub.classList.add("is-in"); setTimeout(function () { settle(h1); settle(sub); }, 3200); }
  [h1, sub].forEach(function (n, i) { n.classList.add("reveal"); n.style.setProperty("--d", (250 + i * 350) + "ms"); });
  function startHero() { requestAnimationFrame(function () { requestAnimationFrame(heroReady); }); }
  if (heroImg.decode) heroImg.decode().then(startHero, startHero); else startHero();

  var GROUPS = [
    ["reveal", ".intro__text .eyebrow, .intro__text h2, .intro__body > *, .res > .eyebrow, .res > h2, .amen__text .eyebrow, .amen__text h2, .amen__text .lead, .amen__cols > div, .cita, .ubi h2, .contacto h2, .contacto__sub, .form .field, .form__actions, .footer__logo, .footer__info, .footer__legal, .hero__nav"],
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
