export const API_CONFIG = {
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  GEOCODING_API: "https://api.openweathermap.org/geo/1.0",
  UNITS: "metric",
} as const

export function getWeatherIconUrl(iconCode: string, scale?: 2 | 4) {
  const suffix = scale ? `@${scale}x` : ""
  return `https://openweathermap.org/img/wn/${iconCode}${suffix}.png`
}

export function getOpenWeatherApiKey() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim()

  if (!apiKey) {
    throw new Error(
      "VITE_OPENWEATHER_API_KEY is not configured. See README.md for setup instructions.",
    )
  }

  return apiKey
}
