const USD_TO_COP_RATE = 4000;
function roundTo2(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
function isSameUtcDay(a, b) {
    return (a.getUTCFullYear() === b.getUTCFullYear() &&
        a.getUTCMonth() === b.getUTCMonth() &&
        a.getUTCDate() === b.getUTCDate());
}
function emptyPrice() {
    return { USD: 0, COP: 0 };
}
function addPrices(acc, value) {
    return {
        USD: acc.USD + value.USD,
        COP: acc.COP + value.COP,
    };
}
export function calculateDailyRevenue(sales, date, currency) {
    const total = sales
        .filter((sale) => isSameUtcDay(sale.timestamp, date))
        .reduce((sum, sale) => sum + sale.totalPrice[currency], 0);
    return roundTo2(total);
}
export function calculateLocationMargin(sales, menuItems, locationId, currency) {
    const menuItemById = new Map(menuItems.map((item) => [item.id, item]));
    const locationSales = sales.filter((sale) => sale.locationId === locationId);
    const totalRevenue = locationSales.reduce((sum, sale) => sum + sale.totalPrice[currency], 0);
    if (totalRevenue <= 0) {
        return 0;
    }
    const totalIngredientCost = locationSales.reduce((sum, sale) => {
        const item = menuItemById.get(sale.itemId);
        if (!item) {
            return sum;
        }
        return sum + item.ingredientCost[currency] * sale.quantity;
    }, 0);
    const margin = ((totalRevenue - totalIngredientCost) / totalRevenue) * 100;
    return roundTo2(Math.max(0, Math.min(100, margin)));
}
export function calculateWasteCost(wasteRecords, locationId, currency) {
    const total = wasteRecords
        .filter((record) => record.locationId === locationId)
        .reduce((sum, record) => sum + record.cost[currency], 0);
    return roundTo2(total);
}
export function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
        return amount;
    }
    const converted = fromCurrency === "USD" ? amount * USD_TO_COP_RATE : amount / USD_TO_COP_RATE;
    return roundTo2(converted);
}
export function scoreLocationPerformance(location, sales, wasteRecords, menuItems) {
    const locationSales = sales.filter((sale) => sale.locationId === location.id);
    const now = new Date();
    const estimatedOpeningDate = new Date(Date.UTC(location.openingYear, 0, 1));
    const msPerDay = 24 * 60 * 60 * 1000;
    const operatingDays = Math.max(1, Math.floor((now.getTime() - estimatedOpeningDate.getTime()) / msPerDay) + 1);
    const totalRevenueUsd = locationSales.reduce((sum, sale) => sum + sale.totalPrice.USD, 0);
    const avgDailyRevenueUsd = totalRevenueUsd / operatingDays;
    const revenueScore = Math.min((avgDailyRevenueUsd / 1000) * 40, 40);
    const seatsEfficiency = location.seatingCapacity > 0
        ? (locationSales.length / location.seatingCapacity) * 30
        : 0;
    const efficiencyScore = Math.min(seatsEfficiency, 30);
    const totalWasteUsd = calculateWasteCost(wasteRecords, location.id, "USD");
    let wasteScore = 20;
    if (totalRevenueUsd > 0) {
        const wastePercentage = (totalWasteUsd / totalRevenueUsd) * 100;
        wasteScore = Math.max(0, 20 - wastePercentage * 2);
    }
    else if (totalWasteUsd > 0) {
        wasteScore = 0;
    }
    const margin = calculateLocationMargin(sales, menuItems, location.id, "USD");
    const marginScore = Math.min(Math.max(margin / 10, 0), 10);
    const totalScore = revenueScore + efficiencyScore + wasteScore + marginScore;
    return roundTo2(Math.max(0, Math.min(100, totalScore)));
}
export function rankLocationsByPerformance(locations, sales, wasteRecords, menuItems) {
    return locations
        .map((location) => ({
        location,
        score: scoreLocationPerformance(location, sales, wasteRecords, menuItems),
    }))
        .sort((a, b) => b.score - a.score);
}
export function countSalesByPaymentMethod(sales) {
    const result = {
        Cash: 0,
        "Credit card": 0,
        "Debit card": 0,
        "Digital wallet": 0,
    };
    for (const sale of sales) {
        result[sale.paymentMethod] += 1;
    }
    return result;
}
export function calculateAverageTicket(sales, currency) {
    if (sales.length === 0) {
        return 0;
    }
    const total = sales.reduce((sum, sale) => sum + sale.totalPrice[currency], 0);
    return roundTo2(total / sales.length);
}
export function findTopSellingItems(sales, menuItems, topN) {
    if (topN <= 0) {
        return [];
    }
    const menuItemById = new Map(menuItems.map((item) => [item.id, item]));
    const quantityByItemId = new Map();
    for (const sale of sales) {
        const current = quantityByItemId.get(sale.itemId) ?? 0;
        quantityByItemId.set(sale.itemId, current + sale.quantity);
    }
    return [...quantityByItemId.entries()]
        .map(([itemId, totalSold]) => ({
        item: menuItemById.get(itemId),
        totalSold,
    }))
        .filter((entry) => entry.item !== undefined)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, topN);
}
export function groupWasteByReason(wasteRecords) {
    const grouped = {
        Expired: [],
        "Cooking error": [],
        "Customer return": [],
        Damage: [],
        Other: [],
    };
    for (const record of wasteRecords) {
        grouped[record.reason].push(record);
    }
    return grouped;
}
export function calculateCountryComparison(sales, locations, _menuItems) {
    const countryMetrics = {
        Colombia: {
            totalLocations: 0,
            totalRevenue: emptyPrice(),
            averageRevenuePerLocation: emptyPrice(),
            totalSales: 0,
        },
        USA: {
            totalLocations: 0,
            totalRevenue: emptyPrice(),
            averageRevenuePerLocation: emptyPrice(),
            totalSales: 0,
        },
    };
    const locationCountryMap = new Map();
    for (const location of locations) {
        locationCountryMap.set(location.id, location.country);
        countryMetrics[location.country].totalLocations += 1;
    }
    for (const sale of sales) {
        const country = locationCountryMap.get(sale.locationId);
        if (!country) {
            continue;
        }
        countryMetrics[country].totalRevenue = addPrices(countryMetrics[country].totalRevenue, sale.totalPrice);
        countryMetrics[country].totalSales += 1;
    }
    for (const country of Object.keys(countryMetrics)) {
        const metrics = countryMetrics[country];
        const divisor = metrics.totalLocations > 0 ? metrics.totalLocations : 1;
        metrics.averageRevenuePerLocation = {
            USD: roundTo2(metrics.totalRevenue.USD / divisor),
            COP: roundTo2(metrics.totalRevenue.COP / divisor),
        };
        metrics.totalRevenue = {
            USD: roundTo2(metrics.totalRevenue.USD),
            COP: roundTo2(metrics.totalRevenue.COP),
        };
    }
    return {
        Colombia: countryMetrics.Colombia,
        USA: countryMetrics.USA,
    };
}
