import type { ForecastData, LocationSummary, WeatherData } from "@/api/types"
import { cn } from "@/lib/utils"
import CurrentWeather from "./current-weather"
import HourlyTemperature from "./hourly-temperature"
import WeatherDetails from "./weather-details"
import WeatherForecast from "./weather-forecast"

interface WeatherOverviewProps {
  weather: WeatherData
  forecast: ForecastData
  locationName?: LocationSummary
  currentLayout?: "stacked" | "split"
}

export function WeatherOverview({
  weather,
  forecast,
  locationName,
  currentLayout = "stacked",
}: WeatherOverviewProps) {
  return (
    <div className="grid gap-6">
      <div
        className={cn(
          "flex flex-col gap-4",
          currentLayout === "split" && "lg:flex-row",
        )}
      >
        <CurrentWeather data={weather} locationName={locationName} />
        <HourlyTemperature data={forecast} />
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <WeatherDetails data={weather} />
        <WeatherForecast data={forecast} />
      </div>
    </div>
  )
}
