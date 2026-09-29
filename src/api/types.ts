import { isFiniteNumber, isRecord } from "@/lib/type-guards"

export interface Coordinates {
  lat: number
  lon: number
}

export interface LocationSummary extends Coordinates {
  name: string
  country: string
  state?: string
}

export interface GeocodingResponse extends LocationSummary {
  local_names?: Record<string, string>
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface WeatherData {
  coord: Coordinates
  weather: WeatherCondition[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  wind: {
    speed: number
    deg: number
  }
  sys: {
    sunrise: number
    sunset: number
    country: string
  }
  name: string
  dt: number
  timezone: number
}

export interface ForecastData {
  list: Array<{
    dt: number
    main: WeatherData["main"]
    weather: WeatherData["weather"]
    wind: WeatherData["wind"]
    dt_txt: string
  }>
  city: {
    name: string
    country: string
    sunrise: number
    sunset: number
    timezone: number
  }
}

export function isValidCoordinates(
  coordinates: Coordinates | null,
): coordinates is Coordinates {
  return coordinates !== null &&
    isFiniteNumber(coordinates.lat) &&
    isFiniteNumber(coordinates.lon) &&
    coordinates.lat >= -90 &&
    coordinates.lat <= 90 &&
    coordinates.lon >= -180 &&
    coordinates.lon <= 180
}

export function isLocationSummary(
  value: unknown,
): value is LocationSummary & Record<string, unknown> {
  return isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.country === "string" &&
    (value.state === undefined || typeof value.state === "string") &&
    isFiniteNumber(value.lat) &&
    isFiniteNumber(value.lon) &&
    isValidCoordinates({ lat: value.lat, lon: value.lon })
}
