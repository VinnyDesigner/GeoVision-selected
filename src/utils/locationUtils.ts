export const ABU_DHABI_DEFAULT_CENTER: [number, number] = [24.4539, 54.3773]; // Khalifa City / Abu Dhabi

// Abu Dhabi Emirate Geographical Bounding Box
export const ABU_DHABI_BOUNDS = {
  minLat: 22.5,
  maxLat: 25.2,
  minLng: 51.5,
  maxLng: 56.0,
};

/**
 * Ensures any coordinate (e.g. device GPS or search location) is strictly constrained
 * inside Abu Dhabi, UAE. If outside Abu Dhabi, it returns the Abu Dhabi center location.
 */
export function ensureAbuDhabiLocation(lat: number, lng: number): [number, number] {
  if (
    lat >= ABU_DHABI_BOUNDS.minLat &&
    lat <= ABU_DHABI_BOUNDS.maxLat &&
    lng >= ABU_DHABI_BOUNDS.minLng &&
    lng <= ABU_DHABI_BOUNDS.maxLng
  ) {
    return [lat, lng];
  }
  return ABU_DHABI_DEFAULT_CENTER;
}
