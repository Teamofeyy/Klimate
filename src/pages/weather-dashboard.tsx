import WeatherSkeleton from "@/components/loading-skeleton"
import { Button } from "@/components/ui/button"
import { ErrorAlert } from "@/components/error-alert"
import { WeatherOverview } from "@/components/weather-overview"
import { useGeolocation } from "@/hooks/use-geolocation"
import { WEATHER_KEYS, useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather"
import { MapPin, RefreshCw } from "lucide-react"
import { FavoriteCities } from "@/components/favorite-cities"
import { useQueryClient } from "@tanstack/react-query"

const WeatherDashboard = () => {
  const queryClient = useQueryClient()
  const { coordinates, error: locationError, getLocation, isLoading: locationLoading } = useGeolocation()

  const locationQuery = useReverseGeocodeQuery(coordinates)
  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)

  const handleRefresh = async () => {
    const refreshedCoordinates = await getLocation()
    if (!refreshedCoordinates) return

    await queryClient.invalidateQueries({
      queryKey: WEATHER_KEYS.coordinates(refreshedCoordinates),
    })
  }

  if (locationLoading) {
    return <WeatherSkeleton />
  }

  if (locationError) {
    return (
      <ErrorAlert
        title="Ошибка геолокации"
        description={locationError}
        action={
          <Button onClick={() => void handleRefresh()} variant={'outline'} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Включить геолокацию
          </Button>
        }
      />
    )
  }

  if (!coordinates) {
    return (
      <ErrorAlert
        title="Требуется местоположение"
        description="Пожалуйста, включите доступ к местоположению, чтобы увидеть местную погоду"
        action={
          <Button onClick={() => void getLocation()} variant={'outline'} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Включить геолокацию
          </Button>
        }
      />
    )
  }

  const locationName = locationQuery.data?.[0]

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <ErrorAlert
        title="Ошибка"
        description="Не удалось получить данные о погоде. Попробуйте еще раз."
        action={
          <Button onClick={() => void handleRefresh()} variant={'outline'} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Повторить
          </Button>
        }
      />
    )
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />
  }

  return (
    <div className="space-y-4">
      <FavoriteCities />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Моё Местоположение</h1>
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={() => void handleRefresh()}
          disabled={locationLoading || weatherQuery.isFetching || forecastQuery.isFetching}
          aria-label="Обновить погоду"
        >
          <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <WeatherOverview
        weather={weatherQuery.data}
        forecast={forecastQuery.data}
        locationName={locationName}
        currentLayout="split"
      />
    </div>
  )
}

export default WeatherDashboard
