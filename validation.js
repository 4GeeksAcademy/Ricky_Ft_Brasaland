(function () {
  const form = document.getElementById("application-form");

  if (!form) {
    return;
  }

  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    country: document.getElementById("country"),
    city: document.getElementById("city"),
    favoriteLocation: document.getElementById("favoriteLocation"),
    foundUs: document.getElementById("foundUs"),
    dateOfBirth: document.getElementById("dateOfBirth"),
    acceptTerms: document.getElementById("acceptTerms"),
    status: document.getElementById("form-status")
  };

  const errors = {
    fullName: document.getElementById("fullName-error"),
    email: document.getElementById("email-error"),
    phone: document.getElementById("phone-error"),
    country: document.getElementById("country-error"),
    city: document.getElementById("city-error"),
    foundUs: document.getElementById("foundUs-error"),
    dateOfBirth: document.getElementById("dateOfBirth-error"),
    acceptTerms: document.getElementById("acceptTerms-error")
  };

  const dataMap = {
    Colombia: {
      cities: ["Medellín", "Bogotá", "Cali"],
      locations: {
        "Medellín": [
          "Brasaland El Poblado",
          "Brasaland Laureles",
          "Brasaland Envigado",
          "Brasaland Sabaneta"
        ],
        "Bogotá": [
          "Brasaland Usaquén",
          "Brasaland Chapinero",
          "Brasaland Zona Rosa"
        ],
        Cali: [
          "Brasaland Granada",
          "Brasaland Ciudad Jardín",
          "Brasaland Unicentro"
        ]
      }
    },
    "United States": {
      cities: ["Miami", "Orlando"],
      locations: {
        Miami: ["Brasaland Brickell", "Brasaland Coral Gables"],
        Orlando: ["Brasaland Downtown", "Brasaland International Drive"]
      }
    }
  };

  const requiredMessages = {
    fullName: "Enter your full name (first and last name)",
    email: "Enter a valid email (example: <name@email.com>)",
    phone:
      "Phone must include country code (example: +57 300 123 4567 or +1 305 123 4567)",
    country: "Select your country",
    city: "Select your city",
    foundUs: "Tell us how you found Brasaland",
    dateOfBirth: "You must be 18 or older to register for Brasa Points",
    acceptTerms: "You must accept the Brasa Points program terms to continue"
  };

  const successMessage = {
    title: "Welcome to Brasa Points!",
    line1:
      "Your registration was successful. You will receive a confirmation email in the next few minutes with your account details and how to start earning points.",
    line2: "You can now enjoy your benefits at any of our 14 locations!"
  };

  function setFieldError(fieldName, message) {
    const field = fields[fieldName];
    const errorEl = errors[fieldName];

    if (!field || !errorEl) {
      return;
    }

    errorEl.textContent = message;
    const hasError = Boolean(message);
    field.setAttribute("aria-invalid", hasError ? "true" : "false");
    field.classList.toggle("border-red-600", hasError);
    field.classList.toggle("ring-2", hasError);
    field.classList.toggle("ring-red-100", hasError);
  }

  function setStatus(message, type) {
    fields.status.textContent = "";
    fields.status.classList.remove(
      "hidden",
      "border-red-200",
      "bg-red-50",
      "text-red-800",
      "border-emerald-200",
      "bg-emerald-50",
      "text-emerald-800"
    );

    if (type === "error") {
      fields.status.textContent = message;
      fields.status.classList.add("border-red-200", "bg-red-50", "text-red-800");
      return;
    }

    fields.status.innerHTML =
      '<p class="font-extrabold">' +
      successMessage.title +
      '</p><p class="mt-2">' +
      successMessage.line1 +
      '</p><p class="mt-2">' +
      successMessage.line2 +
      "</p>";

    fields.status.classList.add(
      "border-emerald-200",
      "bg-emerald-50",
      "text-emerald-800"
    );
  }

  function clearStatus() {
    fields.status.textContent = "";
    fields.status.classList.add("hidden");
  }

  function fillOptions(selectEl, options, placeholderText) {
    selectEl.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = placeholderText;
    selectEl.appendChild(placeholder);

    options.forEach(function (option) {
      const el = document.createElement("option");
      el.value = option;
      el.textContent = option;
      selectEl.appendChild(el);
    });
  }

  function syncCities() {
    const selectedCountry = fields.country.value;

    if (!selectedCountry || !dataMap[selectedCountry]) {
      fillOptions(fields.city, [], "Select your city");
      fields.city.value = "";
      fields.city.disabled = true;
      syncLocations();
      return;
    }

    fillOptions(fields.city, dataMap[selectedCountry].cities, "Select your city");
    fields.city.disabled = false;
    fields.city.value = "";
    syncLocations();
  }

  function syncLocations() {
    const selectedCountry = fields.country.value;
    const selectedCity = fields.city.value;

    if (
      !selectedCountry ||
      !selectedCity ||
      !dataMap[selectedCountry] ||
      !dataMap[selectedCountry].locations[selectedCity]
    ) {
      fillOptions(fields.favoriteLocation, [], "Select a location");
      fields.favoriteLocation.value = "";
      fields.favoriteLocation.disabled = true;
      return;
    }

    const locations = dataMap[selectedCountry].locations[selectedCity];
    fillOptions(fields.favoriteLocation, locations, "Select a location");
    fields.favoriteLocation.disabled = false;
    fields.favoriteLocation.value = "";
  }

  function validateFullName() {
    const value = fields.fullName.value.trim();
    const words = value.split(/\s+/).filter(Boolean);
    const isValid = words.length >= 2;

    setFieldError("fullName", isValid ? "" : requiredMessages.fullName);
    return isValid;
  }

  function validateEmail() {
    const value = fields.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const isValid = emailPattern.test(value);

    setFieldError("email", isValid ? "" : requiredMessages.email);
    return isValid;
  }

  function validatePhone() {
    const value = fields.phone.value.trim();
    const digitsPattern = /^\+[0-9][0-9\s-]{6,}$/;
    let isValid = digitsPattern.test(value);

    if (isValid && fields.country.value === "Colombia") {
      isValid = value.startsWith("+57");
    }

    if (isValid && fields.country.value === "United States") {
      isValid = value.startsWith("+1");
    }

    setFieldError("phone", isValid ? "" : requiredMessages.phone);
    return isValid;
  }

  function validateCountry() {
    const isValid = Boolean(fields.country.value);
    setFieldError("country", isValid ? "" : requiredMessages.country);
    return isValid;
  }

  function validateCity() {
    const isValid = Boolean(fields.city.value);
    setFieldError("city", isValid ? "" : requiredMessages.city);
    return isValid;
  }

  function validateFoundUs() {
    const isValid = Boolean(fields.foundUs.value);
    setFieldError("foundUs", isValid ? "" : requiredMessages.foundUs);
    return isValid;
  }

  function is18OrOlder(dateString) {
    const dob = new Date(dateString);

    if (Number.isNaN(dob.getTime())) {
      return false;
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDelta = today.getMonth() - dob.getMonth();

    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }

    return age >= 18;
  }

  function validateDateOfBirth() {
    const value = fields.dateOfBirth.value;
    const isValid = Boolean(value) && is18OrOlder(value);

    setFieldError("dateOfBirth", isValid ? "" : requiredMessages.dateOfBirth);
    return isValid;
  }

  function validateAcceptTerms() {
    const isValid = fields.acceptTerms.checked;
    setFieldError("acceptTerms", isValid ? "" : requiredMessages.acceptTerms);
    return isValid;
  }

  function validateAll() {
    const results = [
      validateFullName(),
      validateEmail(),
      validateCountry(),
      validateCity(),
      validatePhone(),
      validateFoundUs(),
      validateDateOfBirth(),
      validateAcceptTerms()
    ];

    return results.every(Boolean);
  }

  function attachValidationListeners() {
    fields.fullName.addEventListener("blur", validateFullName);
    fields.fullName.addEventListener("input", validateFullName);

    fields.email.addEventListener("blur", validateEmail);
    fields.email.addEventListener("input", validateEmail);

    fields.phone.addEventListener("blur", validatePhone);
    fields.phone.addEventListener("input", validatePhone);

    fields.country.addEventListener("change", function () {
      syncCities();
      validateCountry();
      validateCity();
      if (fields.phone.value.trim()) {
        validatePhone();
      }
    });

    fields.city.addEventListener("change", function () {
      syncLocations();
      validateCity();
    });

    fields.foundUs.addEventListener("change", validateFoundUs);

    fields.dateOfBirth.addEventListener("change", validateDateOfBirth);
    fields.dateOfBirth.addEventListener("blur", validateDateOfBirth);

    fields.acceptTerms.addEventListener("change", validateAcceptTerms);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();

    const isFormValid = validateAll();

    if (!isFormValid) {
      setStatus("Please correct the highlighted fields and try again.", "error");
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    setStatus("", "success");
    form.reset();
    syncCities();

    Object.keys(errors).forEach(function (fieldName) {
      setFieldError(fieldName, "");
    });
  });

  form.addEventListener("reset", function () {
    clearStatus();

    // Let the browser apply reset values before rebuilding dependent selects.
    window.setTimeout(function () {
      syncCities();
      Object.keys(errors).forEach(function (fieldName) {
        setFieldError(fieldName, "");
      });
    }, 0);
  });

  attachValidationListeners();
  syncCities();
})();
