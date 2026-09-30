(function () {
  "use strict";
  var W = window.WELL;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- Menú overlay ---------- */
  var menu = $("#menu"), burger = $(".burger"), closeBtn = $(".overlay__close");
  function menuFocusables() { return $$("a[href], button", menu); }
  function openMenu() {
    menu.hidden = false; burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; closeBtn.focus();
  }
  function closeMenu(restore) {
    menu.hidden = true; burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = ""; if (restore !== false) burger.focus();
  }
  burger.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", function () { closeMenu(); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { closeMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (menu.hidden) return;
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
    desc.textContent = txt + " " + W.residenciasApoyo;
    pillTipo.textContent = r.nombre;
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
})();
