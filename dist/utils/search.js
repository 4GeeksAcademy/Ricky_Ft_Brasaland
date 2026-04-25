export function findLocationById(locations, id) {
    for (const location of locations) {
        if (location.id === id) {
            return location;
        }
    }
    return null;
}
export function findMenuItemByName(items, name) {
    const normalizedName = name.trim().toLowerCase();
    for (const item of items) {
        if (item.name.trim().toLowerCase() === normalizedName) {
            return item;
        }
    }
    return null;
}
export function binarySearchLocationByCapacity(sortedLocations, targetCapacity) {
    let left = 0;
    let right = sortedLocations.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const capacity = sortedLocations[mid].seatingCapacity;
        if (capacity === targetCapacity) {
            return mid;
        }
        if (capacity < targetCapacity) {
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    return -1;
}
