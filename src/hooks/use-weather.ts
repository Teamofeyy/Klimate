import { isValidCoordinates, type Coordinates } from "@/api/types";
import { weatherAPI } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
  all: ["weather"] as const,
  coordinates: (coords: Coordinates | null) =>
    [...WEATHER_KEYS.all, coords?.lat, coords?.lon] as const,
  current: (coords: Coordinates | null) =>
    [...WEATHER_KEYS.coordinates(coords), "current"] as const,
  forecast: (coords: Coordinates | null) =>
    [...WEATHER_KEYS.coordinates(coords), "forecast"] as const,
  location: (coords: Coordinates | null) =>
    [...WEATHER_KEYS.coordinates(coords), "location"] as const,
  search: (query: string) => ["location-search", query] as const,
} as const

function requireValidCoordinates(coordinates: Coordinates | null) {
  if (!isValidCoordinates(coordinates)) {
    throw new Error("Valid coordinates are required for this weather request.")
  }
  return coordinates
}

export function useWeatherQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.current(coordinates),
    queryFn: ({ signal }) =>
      weatherAPI.getCurrentWeather(requireValidCoordinates(coordinates), signal),
    enabled: isValidCoordinates(coordinates),
  })
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates),
    queryFn: ({ signal }) =>
      weatherAPI.getForecast(requireValidCoordinates(coordinates), signal),
    enabled: isValidCoordinates(coordinates),
  })
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates),
    queryFn: ({ signal }) =>
      weatherAPI.reverseGeocode(requireValidCoordinates(coordinates), signal),
    enabled: isValidCoordinates(coordinates),
  })
}

export function useLocationSearch(query: string) {
  const normalizedQuery = query.trim()

  return useQuery({
    queryKey: WEATHER_KEYS.search(normalizedQuery),
    queryFn: ({ signal }) =>
      weatherAPI.searchLocations(normalizedQuery, signal),
    enabled: normalizedQuery.length >= 3,
    staleTime: 30 * 60 * 1000,
  })
}
