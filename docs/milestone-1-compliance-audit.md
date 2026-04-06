# Milestone 1 Compliance Audit (Brasaland)

Date: 2026-04-06
Base language: English

## Landing page requirements

- [x] Header includes brand name/logo, navigation (Home, Locations, Menu, Brasa Points, Contact), and language indicator for single-language site.
- [x] Hero includes exact required headline, subheadline, and CTA to Brasa Points form.
- [x] Our Story section includes required paragraph and supporting image.
- [x] What Makes Us Unique section includes 3 columns and required bullet points.
- [x] Our Locations section includes Colombia and United States (Florida) counts and hours.
- [x] Brasa Points featured section includes all required program bullet points.
- [x] Contact section includes required email and phone numbers.
- [x] Footer includes copyright and social links.
- [x] Restriction notice is visible: "Want to place an order? Call your favorite location or visit us directly. Online ordering coming soon!"

## Form fields and validations

- [x] Full name field present and validated for at least 2 words.
- [x] Email field present and validated for email format.
- [x] Phone field present and validated with `+` country code and country-specific prefix (+57 Colombia, +1 United States).
- [x] Country select present and required.
- [x] City select present, required, and dynamically filtered by country.
- [x] Favorite location select present, optional, and dynamically filtered by country + city.
- [x] Dietary preferences checkboxes present (No restrictions, Vegetarian, Gluten-free, Other).
- [x] How did you find us select present and required.
- [x] Date of birth field present and validated to 18+.
- [x] Program terms checkbox present and required.
- [x] Receive offers checkbox present and optional (unchecked by default).

## Required messages

- [x] All required field error messages are implemented with exact wording.
- [x] Success message matches required text and is shown after valid submit.

## Dependent logic

- [x] Country -> City mapping implemented:
  - Colombia -> Medellin, Bogota, Cali
  - United States -> Miami, Orlando
- [x] Country + City -> Favorite location mapping implemented for all 14 locations.

## SEO and structured data

- [x] Meta title and description implemented.
- [x] Canonical URL implemented.
- [x] Schema.org Restaurant JSON-LD implemented.
- [x] `availableLanguage` set to English only for single-language delivery.

## Accessibility and responsive basics

- [x] Landmark structure (`header`, `main`, `footer`) present.
- [x] Skip links present on both pages.
- [x] Labels and `aria-describedby` for validated fields are present.
- [x] Responsive layout classes present for mobile and desktop breakpoints.

## Files audited

- `index.html`
- `application.html`
- `validation.js`
- `CONTEXT.md`

## Residual risk / manual QA gaps

- No browser-run end-to-end interaction test was executed in this audit pass.
- Optional bilingual support (ES|EN selector and translations) is not implemented.
