/* Contenido editable de THE WELL Panamá.
   Los textos fijos viven en index.html (marcados con data-i18n para el futuro toggle ES/EN);
   aquí están los datos estructurados que se renderizan por JS. */
window.WELL = {
  config: {
    // Destino del formulario: URL de un endpoint (CRM, Formspree, etc.) que reciba POST JSON.
    // [PENDIENTE] Vacío = no se envía a ningún servidor; se ofrece el respaldo de WhatsApp.
    formAction: "",
    whatsapp: "https://wa.me/50763152222"
  },

  // Residencias (sin precios). vista: null = dato pendiente, no se muestra.
  residencias: [
    { tipo: "A",   nombre: "Tipo A",   m2: "88.40", sqft: "951.53", distribucion: "2 recámaras / 2 baños", vista: "Obarrio Skyline" },
    { tipo: "B",   nombre: "Tipo B",   m2: "87.00", sqft: "936.46", distribucion: "2 recámaras / 2 baños", vista: "Obarrio Skyline" },
    { tipo: "C",   nombre: "Tipo C",   m2: "82.90", sqft: "892.33", distribucion: "2 recámaras / 2 baños", vista: null /* [PENDIENTE] */ },
    { tipo: "D-E", nombre: "Tipo D-E", m2: "86.50", sqft: "931.08", distribucion: "2 recámaras / 2 baños", vista: "Av. Ricardo Arango y Calle 50" },
    { tipo: "F-G", nombre: "Tipo F-G", m2: "87.00", sqft: "936.46", distribucion: "2 recámaras / 2 baños", vista: "F: Av. Ricardo Arango y Calle 50; G: Obarrio Skyline" }
  ],
  residenciasApoyo: "Cocina con desayunador, sala, lavandería y balcón.",

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

  // Opciones de los selects del formulario
  formulario: {
    paises: ["Panamá", "Colombia", "Costa Rica", "Ecuador", "España", "Estados Unidos", "México", "Perú", "Venezuela", "Otro"],
    contacto: ["WhatsApp", "Llamada", "Correo electrónico"],
    origen: ["Instagram", "Google", "Referido", "Publicidad en línea", "Evento", "Otro"]
  }
};
