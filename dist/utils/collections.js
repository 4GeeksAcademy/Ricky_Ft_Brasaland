export function filterSalesByLocation(sales, locationId) {
    return sales.filter((sale) => sale.locationId === locationId);
}
export function filterSalesByDateRange(sales, startDate, endDate) {
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();
    return sales.filter((sale) => {
        const saleMs = sale.timestamp.getTime();
        return saleMs >= startMs && saleMs <= endMs;
    });
}
export function filterMenuItemsByCategory(items, category) {
    return items.filter((item) => item.category === category);
}
export function filterActiveLocations(locations) {
    return locations.filter((location) => location.status === "Active");
}
export function sortLocationsByCapacity(locations, order) {
    const sorted = [...locations].sort((a, b) => a.seatingCapacity - b.seatingCapacity);
    return order === "asc" ? sorted : sorted.reverse();
}
export function sortMenuItemsByPrice(items, currency, order) {
    const sorted = [...items].sort((a, b) => a.basePrice[currency] - b.basePrice[currency]);
    return order === "asc" ? sorted : sorted.reverse();
}
