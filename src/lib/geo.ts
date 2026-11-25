/** Fonctions geographiques pures, portees de navigation.js */

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateBearing(startLat: number, startLng: number, destLat: number, destLng: number): number {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export function distanceToRoute(lat: number, lng: number, coordinates: [number, number][]): number {
  if (!coordinates || coordinates.length === 0) return 0;
  let minDist = Infinity;
  coordinates.forEach((pt) => {
    const d = haversineDistance(lat, lng, pt[0], pt[1]);
    if (d < minDist) minDist = d;
  });
  return minDist;
}

export function getPositionAlongRoute(
  fraction: number,
  coords: [number, number][]
): { lat: number; lng: number; heading: number } | null {
  if (!coords || coords.length < 2) return null;

  const totalSegments = coords.length - 1;
  const exactIndex = fraction * totalSegments;
  const segmentIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
  const segmentRatio = exactIndex - segmentIndex;

  const p1 = coords[segmentIndex];
  const p2 = coords[segmentIndex + 1];

  const lat = p1[0] + (p2[0] - p1[0]) * segmentRatio;
  const lng = p1[1] + (p2[1] - p1[1]) * segmentRatio;
  const heading = calculateBearing(p1[0], p1[1], p2[0], p2[1]);

  return { lat, lng, heading };
}
