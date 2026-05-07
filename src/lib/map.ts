/** Geographic centre for the chalet on Riederalp. */
export const MAP_COORDS = { lat: 46.3833, lng: 8.0333 } as const;

/** Google Maps "directions to" URL for the chalet's coordinates. */
export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${MAP_COORDS.lat}%2C${MAP_COORDS.lng}`;
