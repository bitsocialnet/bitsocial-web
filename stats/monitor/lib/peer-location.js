const normalizePlaceName = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : "";

const normalizeCoordinate = (value, min, max) => {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) && coordinate >= min && coordinate <= max
    ? coordinate
    : undefined;
};

const parsePeerLocation = (data) => {
  const country = normalizePlaceName(data?.countryCode).toUpperCase();
  const latitude = normalizeCoordinate(data?.latitude, -85, 85);
  const longitude = normalizeCoordinate(data?.longitude, -180, 180);
  if (!/^[A-Z]{2}$/.test(country) || latitude === undefined || longitude === undefined) {
    return;
  }

  return {
    country,
    city: normalizePlaceName(data?.cityName),
    region: normalizePlaceName(data?.regionName),
    latitude,
    longitude,
  };
};

const countPeerLocations = (locations) => {
  const counts = new Map();
  for (const location of locations) {
    if (!location) {
      continue;
    }
    const key = [
      location.country,
      location.city,
      location.region,
      location.latitude,
      location.longitude,
    ].join("\u0000");
    const entry = counts.get(key) || { ...location, count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  }
  return [...counts.values()];
};

export { countPeerLocations, parsePeerLocation };
