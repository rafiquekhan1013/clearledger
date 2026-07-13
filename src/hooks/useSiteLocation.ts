/**
 * Reusable hook for site/location detection.
 * Centralizes hostname and LOCATION vs USLOCATION logic.
 */
const CANADA_HOSTNAMES: string[] = ["clearledger.tech","localhost"];

function isCanadaDomain(hostname: string): boolean {
  return CANADA_HOSTNAMES.includes(hostname)
}

export type LocationFilter = "LOCATION" | "USLOCATION";

export function useSiteLocation() {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isUsLocation = !isCanadaDomain(hostname);
  const locationFilter: LocationFilter = isUsLocation ? "USLOCATION" : "LOCATION";
  return {
    hostname,
    isUsLocation,
    locationFilter,
    isLocationDomain: isCanadaDomain(hostname),
  };
}
