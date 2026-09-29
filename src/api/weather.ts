import { API_CONFIG, getOpenWeatherApiKey } from "./config"
import {
  isLocationSummary,
  isValidCoordinates,
  type Coordinates,
  type ForecastData,
  type GeocodingResponse,
  type WeatherData,
} from "./types"
import { isFiniteNumber, isRecord } from "@/lib/type-guards"

export class WeatherApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = "WeatherApiError"
  }
}

const isWeatherCondition = (value: unknown) =>
  isRecord(value) &&
  isFiniteNumber(value.id) &&
  typeof value.main === "string" &&
  typeof value.description === "string" &&
  typeof value.icon === "string"

const isWeatherMain = (value: unknown) =>
  isRecord(value) &&
  [
    value.temp,
    value.feels_like,
    value.temp_min,
    value.temp_max,
    value.pressure,
    value.humidity,
  ].every(isFiniteNumber)

const isWind = (value: unknown) =>
  isRecord(value) && isFiniteNumber(value.speed) && isFiniteNumber(value.deg)

const hasWeatherItems = (value: unknown) =>
  Array.isArray(value) && value.length > 0 && value.every(isWeatherCondition)

const isWeatherData = (value: unknown): value is WeatherData =>
  isRecord(value) &&
  isRecord(value.coord) &&
  isFiniteNumber(value.coord.lat) &&
  isFiniteNumber(value.coord.lon) &&
  isValidCoordinates({ lat: value.coord.lat, lon: value.coord.lon }) &&
  hasWeatherItems(value.weather) &&
  isWeatherMain(value.main) &&
  isWind(value.wind) &&
  isRecord(value.sys) &&
  isFiniteNumber(value.sys.sunrise) &&
  isFiniteNumber(value.sys.sunset) &&
  typeof value.sys.country === "string" &&
  typeof value.name === "string" &&
  isFiniteNumber(value.dt) &&
  isFiniteNumber(value.timezone)

const isForecastData = (value: unknown): value is ForecastData =>
  isRecord(value) &&
  Array.isArray(value.list) &&
  value.list.length > 0 &&
  value.list.every(
    (item) =>
      isRecord(item) &&
      isFiniteNumber(item.dt) &&
      isWeatherMain(item.main) &&
      hasWeatherItems(item.weather) &&
      isWind(item.wind) &&
      typeof item.dt_txt === "string",
  ) &&
  isRecord(value.city) &&
  typeof value.city.name === "string" &&
  typeof value.city.country === "string" &&
  isFiniteNumber(value.city.sunrise) &&
  isFiniteNumber(value.city.sunset) &&
  isFiniteNumber(value.city.timezone)

const isGeocodingResponse = (value: unknown): value is GeocodingResponse =>
  isLocationSummary(value) &&
  (value.local_names === undefined ||
    (isRecord(value.local_names) &&
      Object.values(value.local_names).every(
        (localName) => typeof localName === "string",
      )))

const isGeocodingResponseList = (
  value: unknown,
): value is GeocodingResponse[] =>
  Array.isArray(value) && value.every(isGeocodingResponse)

class WeatherAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: getOpenWeatherApiKey(),
      ...params,
    })
    return `${endpoint}?${searchParams.toString()}`
  }

  private async fetchData<T>(
    url: string,
    signal: AbortSignal | undefined,
    validate: (value: unknown) => value is T,
  ): Promise<T> {
    const response = await fetch(url, { signal })
    let payload: unknown

    try {
      payload = await response.json()
    } catch {
      throw new WeatherApiError(
        `OpenWeather returned an invalid response (${response.status}).`,
        response.status,
      )
    }

    if (!response.ok) {
      const apiMessage =
        isRecord(payload) && typeof payload.message === "string"
          ? payload.message
          : response.statusText
      throw new WeatherApiError(
        `OpenWeather request failed: ${apiMessage || response.status}`,
        response.status,
      )
    }

    if (!validate(payload)) {
      throw new WeatherApiError("OpenWeather returned malformed data.")
    }

    return payload
  }

  async getCurrentWeather(
    { lat, lon }: Coordinates,
    signal?: AbortSignal,
  ): Promise<WeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.UNITS,
      lang: 'ru',
    })

    return this.fetchData(url, signal, isWeatherData)
  }

  async getForecast(
    { lat, lon }: Coordinates,
    signal?: AbortSignal,
  ): Promise<ForecastData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.UNITS,
      lang: 'ru',
    })

    return this.fetchData(url, signal, isForecastData)
  }

  async reverseGeocode(
    { lat, lon }: Coordinates,
    signal?: AbortSignal,
  ): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEOCODING_API}/reverse`, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: 1,
      lang: 'ru',
    })

    return this.fetchData(url, signal, isGeocodingResponseList)
  }

  async searchLocations(
    query: string,
    signal?: AbortSignal,
  ): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEOCODING_API}/direct`, {
      q: query,
      limit: 5,
    })

    return this.fetchData(url, signal, isGeocodingResponseList)
  }
}

export const weatherAPI = new WeatherAPI()
