import { ForecastData } from "@/api/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { formatWeatherTime, getWeatherDateKey } from "@/lib/weather-time";
import { formatTemperature, formatWindSpeed } from "@/lib/weather-format";

interface WeatherForecastProps {
  data: ForecastData
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string
  }
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  const dailyForecast = data.list.reduce((acc, forecast) => {
    const date = getWeatherDateKey(forecast.dt, data.city.timezone)

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      }
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min)
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max)

    }

    return acc
  }, {} as Record<string, DailyForecast>)

  const nextDays = Object.values(dailyForecast).slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Прогноз на 5 дней</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => {
            return (
              <div
                key={day.date}
                className="grid gap-4 rounded-lg border p-4 sm:grid-cols-3 sm:items-center"
              >
                <div>
                  <p className="font-medium">
                    {formatWeatherTime(day.date, data.city.timezone, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">{day.weather.description}</p>
                </div>

                <div className="flex gap-4 sm:justify-center">
                  <span className="flex items-center text-blue-500">
                    <ArrowDown className="mr-1 h-4 w-4" />
                    {formatTemperature(day.temp_min)}
                  </span>
                  <span className="flex items-center text-red-500">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    {formatTemperature(day.temp_max)}
                  </span>
                </div>
                <div className="flex gap-4 sm:justify-end">
                  <span className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{day.humidity}%</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{formatWindSpeed(day.wind)}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherForecast
