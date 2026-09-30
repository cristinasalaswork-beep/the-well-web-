/* Contenido editable de THE WELL Panamá.
   - Textos fijos: viven en index.html (Español) con data-i18n; el inglés está en WELL.en (abajo).
   - Datos estructurados (residencias, amenidades, formulario): aquí, con textos por idioma en WELL.t. */
window.WELL = {
  config: {
    // Destino del formulario:
    //  "whatsapp": al enviar, abre WhatsApp con los datos ya escritos (respaldo del BRIEF).
    //  "endpoint": hace POST JSON a formAction (CRM, Formspree, Make/Zapier, etc.).
    // [PENDIENTE] confirmar destino definitivo; cambiar solo estas dos líneas.
    formMode: "whatsapp",
    formAction: "",
    whatsapp: "https://wa.me/50763152222"
  },

  // Residencias (sin precios). vista: clave de WELL.t[lang].vistas, o null = dato pendiente (no se muestra).
  residencias: [
    { tipo: "A",   m2: "88.40", sqft: "951.53", vista: "sky" },
    { tipo: "B",   m2: "87.00", sqft: "936.46", vista: "sky" },
    { tipo: "C",   m2: "82.90", sqft: "892.33", vista: null /* [PENDIENTE] */ },
    { tipo: "D-E", m2: "86.50", sqft: "931.08", vista: "av" },
    { tipo: "F-G", m2: "87.00", sqft: "936.46", vista: "fg" }
  ],

  // [PENDIENTE] La ficha técnica y la presentación no coinciden; aquí va la versión de la presentación.
  amenidades: {
    wellness: [
      { nombre: "Vital Gym" },
      { nombre: "Spinning Studio" },
      { nombre: "Wellness Spa", detalle: "Sauna Ember, Steam Room, Cryo Room, Tanning Room, Touch Room" },
      { nombre: "Relaxation Lounge" },
      { nombre: "Recovery Room" }
    ],
    enjoyment: [
      { nombre: "Coworking Studio" },
      { nombre: "Garden Lounge" },
      { nombre: "The Central Garden" },
      { nombre: "Event Hall" },
      { nombre: "The Chef's Table" },
      { nombre: "Sky Terrace" },
      { nombre: "Summit Terrace" },
      { nombre: "Horizon Pool" },
      { nombre: "Rooftop Bar" }
    ]
  },

  // Textos generados por JS, por idioma
  t: {
    es: {
      tipo: "Tipo", unidad: "unidad",
      superficie: "Superficie", distribucion: "Distribución", vista: "Vista",
      dist: "2 recámaras / 2 baños",
      apoyo: "Cocina con desayunador, sala, lavandería y balcón.",
      vistas: { sky: "Obarrio Skyline", av: "Av. Ricardo Arango y Calle 50", fg: "F: Av. Ricardo Arango y Calle 50; G: Obarrio Skyline" },
      selecciona: "Selecciona",
      paises: ["Panamá", "Colombia", "Costa Rica", "Ecuador", "España", "Estados Unidos", "México", "Perú", "Venezuela", "Otro"],
      contacto: ["WhatsApp", "Llamada", "Correo electrónico"],
      origen: ["Instagram", "Google", "Referido", "Publicidad en línea", "Evento", "Otro"],
      extraTipos: ["Penthouse", "Aún no lo sé"],
      revisa: "Revisa los campos marcados.",
      enviando: "Enviando…",
      ok: "Gracias. Te contactaremos muy pronto.",
      error: "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.",
      waAbierto: "Abrimos WhatsApp con tu mensaje listo. Envíalo para completar tu solicitud.",
      waManual: "Tus datos están listos. Usa el enlace \"O escríbenos por WhatsApp\" para enviarlos.",
      waTexto: function (d) {
        return "Hola, soy " + d.nombre + " " + d.apellido + ". Me interesa " + d.tipo + " en The Well Panamá. Contacto: " + d.correo + ", " + d.telefono +
               " (preferencia: " + d.preferencia + "). País: " + d.pais + ". Nos conocí por: " + d.origen + ".";
      },
      menuAbrir: "Abrir menú", menuCerrar: "Cerrar menú"
    },
    en: {
      tipo: "Type", unidad: "unit",
      superficie: "Area", distribucion: "Layout", vista: "View",
      dist: "2 bedrooms / 2 bathrooms",
      apoyo: "Kitchen with breakfast area, living room, laundry and balcony.",
      vistas: { sky: "Obarrio Skyline", av: "Av. Ricardo Arango & Calle 50", fg: "F: Av. Ricardo Arango & Calle 50; G: Obarrio Skyline" },
      selecciona: "Select",
      paises: ["Panama", "Colombia", "Costa Rica", "Ecuador", "Spain", "United States", "Mexico", "Peru", "Venezuela", "Other"],
      contacto: ["WhatsApp", "Phone call", "Email"],
      origen: ["Instagram", "Google", "Referral", "Online ads", "Event", "Other"],
      extraTipos: ["Penthouse", "Not sure yet"],
      revisa: "Please review the highlighted fields.",
      enviando: "Sending…",
      ok: "Thank you. We will contact you very soon.",
      error: "We could not send your request. Please try again or write to us on WhatsApp.",
      waAbierto: "We opened WhatsApp with your message ready. Send it to complete your request.",
      waManual: "Your details are ready. Use the \"Or write to us on WhatsApp\" link to send them.",
      waTexto: function (d) {
        return "Hello, I'm " + d.nombre + " " + d.apellido + ". I'm interested in " + d.tipo + " at The Well Panama. Contact: " + d.correo + ", " + d.telefono +
               " (preference: " + d.preferencia + "). Country: " + d.pais + ". I found you through: " + d.origen + ".";
      },
      menuAbrir: "Open menu", menuCerrar: "Close menu"
    }
  },

  // Inglés de los textos fijos (las claves son los data-i18n de index.html; el español queda en el HTML).
  // Fuente del inglés: presentación bilingüe y ficha técnica; las líneas sin equivalente oficial están traducidas.
  en: {
    "meta.title": "The Well Panama · Wellness and longevity residences in Obarrio",
    "meta.desc": "The Well Panama: lifestyle, longevity and well-being residences in Obarrio, Panama City. Essence Tower and Forest Tower.",
    "skip": "Skip to content",
    "menu.cerrar": "Close",
    "nav.thewell": "The Well", "nav.residencias": "Residences", "nav.amenidades": "Amenities", "nav.ubicacion": "Location", "nav.contacto": "Contact",
    "hero.titulo.a": "Every day is a source of", "hero.titulo.b": "longevity",
    "hero.sub": "A new way to live fully and well",
    "intro.eyebrow": "The Well",
    "intro.titulo": "A new concept has arrived in Obarrio",
    "intro.p1": "The Well Panama is lifestyle, longevity, and well-being. For those who wish to live in a balanced environment of vitality, energy, and fulfillment.",
    "intro.p2": "Two towers, <strong>Essence Tower</strong> and <strong>Forest Tower</strong>, in the heart of Obarrio.",
    "intro.cta": "Learn more",
    "res.eyebrow": "The residences",
    "res.titulo.a": "Explore the", "res.titulo.b": "residences",
    "res.contacto": "Contact us",
    "res.nota": "Referential diagram. Final layouts may vary.",
    "amen.eyebrow": "The amenities",
    "amen.titulo.a": "Designing the art of", "amen.titulo.b": "living", "amen.titulo.c": "well",
    "amen.p": "The Well offers one of the most comprehensive amenity packages in Obarrio, distributed across different levels of the building to support its residents' well-being at every stage of the day.",
    "amen.wellness": "Wellness", "amen.enjoyment": "Enjoyment",
    "cita": "Live life to the fullest through exclusive amenities, health tech, and spaces designed for your daily wellbeing.",
    "ubi.titulo.a": "Located in the heart of", "ubi.titulo.b": "Obarrio",
    "form.titulo.a": "Welcome to your", "form.titulo.b": "new home",
    "form.sub": "Leave your details and we will contact you",
    "form.nombre": "First name *", "form.apellido": "Last name *", "form.correo": "Email *", "form.tel": "Phone *",
    "form.pais": "Country *", "form.tipo": "Desired residence type *", "form.contacto": "Contact preference *", "form.origen": "How did you hear about us? *",
    "form.err.req": "Required field", "form.err.correo": "Enter a valid email", "form.err.tel": "Enter a valid phone number", "form.err.sel": "Select an option",
    "form.enviar": "Send", "form.wa": "Or write to us on WhatsApp",
    "footer.dir": "Calle 56 and Calle 57, Obarrio, between Av. Ricardo Arango and Calle 50",
    "footer.legal": "All images, renderings, floor plans, dimensions, materials, finishes, and design concepts shown are illustrative and for reference purposes only. The final project may present variations and improvements in its finishes, concept, and architecture.",
    "a.logo": "The Well Panama, home", "a.logoalt": "The Well Panama",
    "a.menu": "Menu", "a.secciones": "Sections", "a.acceso": "Quick links",
    "a.heroalt": "The Well Panama façade seen from below at sunset",
    "a.introalt": "The Well Panama towers at sunset",
    "a.poolalt": "Horizon Pool at The Well Panama",
    "a.cita": "Philosophy", "a.tipos": "Residence types",
    "a.plano": "Referential diagram of the typical floor, floors 12 to 26: Essence Tower and Forest Tower",
    "a.mapa": "Location map", "a.iframe": "Map showing the location of The Well Panama, Obarrio, Panama City",
    "a.lang": "Language"
  }
};
