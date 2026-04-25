import { Location, MenuCategory, MenuItem, SaleTransaction } from "../types/index.js";

export function filterSalesByLocation(
  sales: SaleTransaction[],
  locationId: string,
): SaleTransaction[] {
  return sales.filter((sale) => sale.locationId === locationId);
}

export function filterSalesByDateRange(
  sales: SaleTransaction[],
  startDate: Date,
  endDate: Date,
): SaleTransaction[] {
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();

  return sales.filter((sale) => {
    const saleMs = sale.timestamp.getTime();
    return saleMs >= startMs && saleMs <= endMs;
  });
}

export function filterMenuItemsByCategory(
  items: MenuItem[],
  category: MenuCategory,
): MenuItem[] {
  return items.filter((item) => item.category === category);
}

export function filterActiveLocations(locations: Location[]): Location[] {
  return locations.filter((location) => location.status === "Active");
}

export function sortLocationsByCapacity(
  locations: Location[],
  order: "asc" | "desc",
): Location[] {
  const sorted = [...locations].sort(
    (a, b) => a.seatingCapacity - b.seatingCapacity,
  );

  return order === "asc" ? sorted : sorted.reverse();
}

export function sortMenuItemsByPrice(
  items: MenuItem[],
  currency: "USD" | "COP",
  order: "asc" | "desc",
): MenuItem[] {
  const sorted = [...items].sort(
    (a, b) => a.basePrice[currency] - b.basePrice[currency],
  );

  return order === "asc" ? sorted : sorted.reverse();
}
