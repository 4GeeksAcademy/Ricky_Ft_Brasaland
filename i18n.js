(function () {
  const STORAGE_KEY = "brasaland-language";

  const dict = {
    en: {
      pageTitleHome: "Brasaland | The taste of the grill, in every bite",
      pageTitleApplication: "Join Brasa Points | Brasaland",
      metaHome:
        "Brasaland is a grilled food restaurant chain founded in Medellin in 2008, now serving Colombia and the United States with 14 locations and warm, fast service.",
      metaApplication:
        "Register for Brasaland Brasa Points and start earning rewards across 14 locations in Colombia and the United States.",
      skipMain: "Skip to main content",
      homeAria: "Brasaland home page",
      navAria: "Primary navigation",
      languageSelectorAria: "Language selector",
      langButtonEsAria: "Switch language to Spanish",
      langButtonEnAria: "Switch language to English",
      orderNoticeAria: "Order notice",
      navHome: "Home",
      navLocations: "Locations",
      navMenu: "Menu",
      navPoints: "Brasa Points",
      navContact: "Contact",
      heroTag: "Since 2008 | 14 Locations",
      heroTitle: "The taste of the grill, in every bite",
      heroSubtitle:
        "Since 2008 serving the best grilled meats in Colombia and the United States. 14 locations, one passion for quality and flavor.",
      heroCta: "Join Brasa Points",
      heroSecondary: "See locations",
      heroImageAlt:
        "Brasaland grilled meat platter served with sides in a warm family restaurant atmosphere",
      storyTitle: "Our Story",
      storyImageAlt:
        "Restaurant team preparing grilled dishes in a professional kitchen",
      storyText:
        "Founded in Medellin in 2008, Brasaland began as a family dream: sharing the authentic taste of grilled meat with consistent quality and warm service. Today we are 14 restaurants in two countries, but we maintain the same recipe for success: fresh products, traditional techniques, and passion for every dish we serve.",
      uniqueTitle: "What Makes Us Unique",
      u1Title: "Consistent Quality",
      u1Point1: "Same recipes and standards in all locations",
      u1Point2: "Fresh ingredients selected daily",
      u2Title: "Warm Experience",
      u2Point1: "Friendly and attentive service",
      u2Point2: "Family atmosphere on every visit",
      u3Title: "Speed",
      u3Point1: "Your food ready in minutes",
      u3Point2: "Without sacrificing flavor or quality",
      locationsTitle: "Our Locations",
      colombiaTitle: "Colombia",
      colombiaText: "10 restaurants in Medellin, Bogota and Cali",
      usaTitle: "United States (Florida)",
      usaText: "4 restaurants in Miami and Orlando",
      hoursText: "Hours: Mon-Sun 11:00 AM - 10:00 PM",
      pointsTitle: "Earn points with every visit",
      points1: "Accumulate 1 point for every $10,000 COP or $5 USD",
      points2: "Redeem your points for discounts and free dishes",
      points3: "Exclusive offers for members",
      points4: "100% digital registration - no more paper cards!",
      pointsCta: "Join Brasa Points",
      noticeTitle: "Important notice",
      noticeText:
        "Want to place an order? Call your favorite location or visit us directly. Online ordering coming soon!",
      contactTitle: "Contact",
      emailLabel: "Email",
      colombiaLabel: "Colombia",
      floridaLabel: "Florida",
      footerRights: "© 2025 Brasaland. All rights reserved.",
      instagram: "Instagram",
      facebook: "Facebook",
      appSkipForm: "Skip to form",
      appBrandAria: "Back to Brasaland home",
      appBackHome: "Back to Home",
      appTitle: "Join Brasa Points",
      appSubtitle:
        "Complete your registration and start earning points at any Brasaland location in Colombia and the United States.",
      appRequired: "Fields marked with * are required.",
      appLegendPersonal: "Personal details",
      appFullName: "Full name *",
      appEmail: "Email *",
      appPhone: "Phone *",
      appPhonePlaceholder: "+57 300 123 4567",
      appDob: "Date of birth *",
      appLegendLocation: "Location preferences",
      appCountry: "Country *",
      appSelectCountry: "Select your country",
      appSelectCity: "Select your city",
      appSelectLocation: "Select a location",
      countryColombia: "Colombia",
      countryUs: "United States",
      appCity: "City *",
      appFavoriteLocation: "Favorite Brasaland location",
      appFavoriteHelp: "Optional. Choose country and city first.",
      appLegendPreferences: "Preferences",
      appDietary: "Dietary preferences",
      dietNoRestrictions: "No restrictions",
      dietVegetarian: "Vegetarian",
      dietGlutenFree: "Gluten-free",
      dietOther: "Other",
      appFoundUs: "How did you find us? *",
      appSelectOption: "Select an option",
      foundSocial: "Social media",
      foundRecommendation: "Recommendation",
      foundWalkedBy: "Walked by",
      foundInternet: "Internet search",
      foundOther: "Other",
      appLegendConsent: "Program consent",
      appAcceptTerms: "I accept program terms *",
      appReceiveOffers: "I want to receive offers via email",
      appSubmit: "Submit application",
      appClear: "Clear form"
    },
    es: {
      pageTitleHome: "Brasaland | El sabor de la parrilla en cada bocado",
      pageTitleApplication: "Unete a Brasa Points | Brasaland",
      metaHome:
        "Brasaland es una cadena de restaurantes de comida a la parrilla fundada en Medellin en 2008, con presencia en Colombia y Estados Unidos, 14 sedes y un servicio calido y rapido.",
      metaApplication:
        "Registrate en Brasa Points de Brasaland y empieza a acumular recompensas en 14 sedes de Colombia y Estados Unidos.",
      skipMain: "Saltar al contenido principal",
      homeAria: "Pagina principal de Brasaland",
      navAria: "Navegacion principal",
      languageSelectorAria: "Selector de idioma",
      langButtonEsAria: "Cambiar idioma a espanol",
      langButtonEnAria: "Cambiar idioma a ingles",
      orderNoticeAria: "Aviso de pedidos",
      navHome: "Inicio",
      navLocations: "Sedes",
      navMenu: "Menu",
      navPoints: "Brasa Points",
      navContact: "Contacto",
      heroTag: "Desde 2008 | 14 Sedes",
      heroTitle: "El sabor de la parrilla, en cada bocado",
      heroSubtitle:
        "Desde 2008 sirviendo las mejores carnes a la parrilla en Colombia y Estados Unidos. 14 sedes, una sola pasion por la calidad y el sabor.",
      heroCta: "Unete a Brasa Points",
      heroSecondary: "Ver sedes",
      heroImageAlt:
        "Parrillada de Brasaland servida con acompanamientos en un ambiente familiar y calido",
      storyTitle: "Nuestra Historia",
      storyImageAlt:
        "Equipo del restaurante preparando platos a la parrilla en una cocina profesional",
      storyText:
        "Fundada en Medellin en 2008, Brasaland nacio como un sueno familiar: compartir el sabor autentico de la parrilla con calidad consistente y servicio cercano. Hoy somos 14 restaurantes en dos paises, pero mantenemos la misma receta del exito: productos frescos, tecnicas tradicionales y pasion por cada plato.",
      uniqueTitle: "Lo Que Nos Hace Unicos",
      u1Title: "Calidad Consistente",
      u1Point1: "Mismas recetas y estandares en todas las sedes",
      u1Point2: "Ingredientes frescos seleccionados cada dia",
      u2Title: "Experiencia Cercana",
      u2Point1: "Servicio amable y atento",
      u2Point2: "Ambiente familiar en cada visita",
      u3Title: "Rapidez",
      u3Point1: "Tu comida lista en minutos",
      u3Point2: "Sin sacrificar sabor ni calidad",
      locationsTitle: "Nuestras Sedes",
      colombiaTitle: "Colombia",
      colombiaText: "10 restaurantes en Medellin, Bogota y Cali",
      usaTitle: "Estados Unidos (Florida)",
      usaText: "4 restaurantes en Miami y Orlando",
      hoursText: "Horario: Lun-Dom 11:00 AM - 10:00 PM",
      pointsTitle: "Acumula puntos en cada visita",
      points1: "Acumula 1 punto por cada $10.000 COP o $5 USD",
      points2: "Canjea tus puntos por descuentos y platos gratis",
      points3: "Ofertas exclusivas para miembros",
      points4: "Registro 100% digital: sin tarjetas de papel",
      pointsCta: "Unete a Brasa Points",
      noticeTitle: "Aviso importante",
      noticeText:
        "Quieres hacer un pedido? Llama a tu sede favorita o visitanos directamente. Pedidos en linea muy pronto!",
      contactTitle: "Contacto",
      emailLabel: "Correo",
      colombiaLabel: "Colombia",
      floridaLabel: "Florida",
      footerRights: "© 2025 Brasaland. Todos los derechos reservados.",
      instagram: "Instagram",
      facebook: "Facebook",
      appSkipForm: "Saltar al formulario",
      appBrandAria: "Volver a la pagina principal de Brasaland",
      appBackHome: "Volver al Inicio",
      appTitle: "Unete a Brasa Points",
      appSubtitle:
        "Completa tu registro y empieza a acumular puntos en cualquier sede de Brasaland en Colombia y Estados Unidos.",
      appRequired: "Los campos marcados con * son obligatorios.",
      appLegendPersonal: "Datos personales",
      appFullName: "Nombre completo *",
      appEmail: "Correo electronico *",
      appPhone: "Telefono *",
      appPhonePlaceholder: "+57 300 123 4567",
      appDob: "Fecha de nacimiento *",
      appLegendLocation: "Preferencias de sede",
      appCountry: "Pais *",
      appSelectCountry: "Selecciona tu pais",
      appSelectCity: "Selecciona tu ciudad",
      appSelectLocation: "Selecciona una sede",
      countryColombia: "Colombia",
      countryUs: "Estados Unidos",
      appCity: "Ciudad *",
      appFavoriteLocation: "Sede Brasaland favorita",
      appFavoriteHelp: "Opcional. Elige primero pais y ciudad.",
      appLegendPreferences: "Preferencias",
      appDietary: "Preferencias alimentarias",
      dietNoRestrictions: "Sin restricciones",
      dietVegetarian: "Vegetariano",
      dietGlutenFree: "Sin gluten",
      dietOther: "Otro",
      appFoundUs: "Como nos conociste? *",
      appSelectOption: "Selecciona una opcion",
      foundSocial: "Redes sociales",
      foundRecommendation: "Recomendacion",
      foundWalkedBy: "Pase por delante",
      foundInternet: "Busqueda en internet",
      foundOther: "Otro",
      appLegendConsent: "Consentimiento del programa",
      appAcceptTerms: "Acepto los terminos del programa *",
      appReceiveOffers: "Quiero recibir ofertas por correo",
      appSubmit: "Enviar registro",
      appClear: "Limpiar formulario"
    }
  };

  function getLang() {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (fromStorage === "es" || fromStorage === "en") {
      return fromStorage;
    }

    const browserLanguage =
      (window.navigator.language || window.navigator.userLanguage || "").toLowerCase();

    if (browserLanguage.indexOf("es") === 0) {
      return "es";
    }

    return "en";
  }

  function setLang(lang) {
    window.localStorage.setItem(STORAGE_KEY, lang);

    runLanguageTransition(function () {
      applyTranslations();
    });

    window.dispatchEvent(
      new CustomEvent("brasaland-language-change", { detail: { lang: lang } })
    );
  }

  function runLanguageTransition(callback) {
    const body = document.body;
    if (!body) {
      callback();
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      callback();
      return;
    }

    body.style.transition = "opacity 140ms ease";
    body.style.opacity = "0.88";

    window.requestAnimationFrame(function () {
      callback();

      window.requestAnimationFrame(function () {
        body.style.opacity = "1";
        window.setTimeout(function () {
          body.style.transition = "";
        }, 180);
      });
    });
  }

  function applyTranslations() {
    const lang = getLang();
    const strings = dict[lang];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (strings[key]) {
        el.textContent = strings[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-placeholder");
      if (strings[key]) {
        el.setAttribute("placeholder", strings[key]);
      }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-aria-label");
      if (strings[key]) {
        el.setAttribute("aria-label", strings[key]);
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      const key = el.getAttribute("data-i18n-alt");
      if (strings[key]) {
        el.setAttribute("alt", strings[key]);
      }
    });

    if (document.querySelector("#main-content")) {
      document.title = strings.pageTitleHome;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", strings.metaHome);
      }
    }

    if (document.querySelector("#application-form")) {
      document.title = strings.pageTitleApplication;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", strings.metaApplication);
      }
    }

    document.querySelectorAll("[data-lang-switch]").forEach(function (btn) {
      const active = btn.getAttribute("data-lang-switch") === lang;
      btn.classList.toggle("bg-stone-800", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("text-stone-700", !active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const badge = document.getElementById("language-badge");
    if (badge) {
      badge.textContent = lang.toUpperCase();
    }
  }

  document.querySelectorAll("[data-lang-switch]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const lang = btn.getAttribute("data-lang-switch");
      setLang(lang);
    });
  });

  applyTranslations();

  window.BrasalandI18n = {
    getLang: getLang
  };
})();
