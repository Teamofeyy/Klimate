import type { LocationSummary, WeatherData } from "@/api/types"
import { Card, CardContent, } from "./ui/card"
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react"
import { getWeatherIconUrl } from "@/api/config"
import { formatTemperature, formatWindSpeed } from "@/lib/weather-format"

interface CurrentWeatherProps {
  data: WeatherData,
  locationName?: LocationSummary,
}

const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    weather: [currentCondition],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data
  const displayedName = locationName?.name ?? data.name
  const displayedCountry = locationName?.country ?? data.sys.country

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-end gap-1">
                <h2 className="text-2xl font-bold tracking-tighter">{displayedName}</h2>
                {locationName?.state && (
                  <span className="text-muted-foreground">
                    , {locationName.state}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {displayedCountry}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-7xl font-bold tracking-tighter">{formatTemperature(temp)}</p>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Ощущается как {formatTemperature(feels_like)}
                </p>

                <div className="flex gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemperature(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemperature(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-3 w-3 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Влажность</p>
                  <p className="text-sm text-muted-foreground">{humidity}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wind className="h-3 w-3 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Скорость ветра</p>
                  <p className="text-sm text-muted-foreground">{formatWindSpeed(speed)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img
                src={getWeatherIconUrl(currentCondition.icon, 4)}
                alt={currentCondition.description}
                className="h-full w-full object-contain"
              />
              <div className="absolute bottom-0 text-center">
                <p className="text-sm font-medium capitalize">
                  {currentCondition.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrentWeather
