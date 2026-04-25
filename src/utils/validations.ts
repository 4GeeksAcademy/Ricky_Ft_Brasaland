import { Location, MenuItem, SaleTransaction, ValidationResult } from "../types/index.js";

function validatePositivePrice(usd: number, cop: number, label: string): string[] {
  const errors: string[] = [];

  if (usd <= 0) {
    errors.push(`${label} USD must be greater than 0`);
  }

  if (cop <= 0) {
    errors.push(`${label} COP must be greater than 0`);
  }

  return errors;
}

export function validateMenuItem(item: MenuItem): ValidationResult {
  const errors: string[] = [];

  if (!item.name || item.name.trim().length === 0) {
    errors.push("Menu item name must not be empty");
  }

  errors.push(
    ...validatePositivePrice(item.basePrice.USD, item.basePrice.COP, "Base price"),
  );
  errors.push(
    ...validatePositivePrice(
      item.ingredientCost.USD,
      item.ingredientCost.COP,
      "Ingredient cost",
    ),
  );

  if (item.prepTimeMinutes <= 0 || item.prepTimeMinutes > 60) {
    errors.push("Preparation time must be greater than 0 and at most 60 minutes");
  }

  if (!item.isAvailableInColombia && !item.isAvailableInUSA) {
    errors.push("Menu item must be available in at least one country");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSaleTransaction(sale: SaleTransaction): ValidationResult {
  const errors: string[] = [];

  if (sale.quantity <= 0) {
    errors.push("Sale quantity must be greater than 0");
  }

  errors.push(
    ...validatePositivePrice(sale.totalPrice.USD, sale.totalPrice.COP, "Total price"),
  );

  if (!sale.waiterName || sale.waiterName.trim().length === 0) {
    errors.push("Waiter name must not be empty");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateLocation(location: Location): ValidationResult {
  const errors: string[] = [];
  const currentYear = new Date().getFullYear();

  if (location.openingYear < 2008 || location.openingYear > currentYear) {
    errors.push(`Opening year must be between 2008 and ${currentYear}`);
  }

  if (location.seatingCapacity <= 0) {
    errors.push("Seating capacity must be greater than 0");
  }

  if (location.staffCount <= 0) {
    errors.push("Staff count must be greater than 0");
  }

  errors.push(
    ...validatePositivePrice(
      location.monthlyRentCost.USD,
      location.monthlyRentCost.COP,
      "Monthly rent cost",
    ),
  );
  errors.push(
    ...validatePositivePrice(
      location.averageMonthlyUtilities.USD,
      location.averageMonthlyUtilities.COP,
      "Average monthly utilities",
    ),
  );

  return {
    valid: errors.length === 0,
    errors,
  };
}
