import { FavoriteButton } from "@/components/favorite-button"
import WeatherSkeleton from "@/components/loading-skeleton"
import { ErrorAlert } from "@/components/error-alert"
import { WeatherOverview } from "@/components/weather-overview"
import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather"
import { useParams, useSearchParams } from "react-router-dom"
import { isValidCoordinates } from "@/api/types"

const CityPage = () => {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const latParam = searchParams.get("lat")
  const lonParam = searchParams.get("lon")
  const lat = latParam === null ? Number.NaN : Number(latParam)
  const lon = lonParam === null ? Number.NaN : Number(lonParam)
  const parsedCoordinates = { lat, lon }
  const coordinates = isValidCoordinates(parsedCoordinates)
    ? parsedCoordinates
    : null

  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)

  if (!coordinates || !params.cityName) {
    return (
      <ErrorAlert
        title="Некорректный адрес"
        description="Выберите город через поиск, чтобы открыть прогноз."
      />
    )
  }

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <ErrorAlert
        title="Ошибка"
        description="Не удалось получить данные о погоде. Попробуйте еще раз."
      />
    )
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {weatherQuery.data.name}, {weatherQuery.data.sys.country}
        </h1>
        <div>
          <FavoriteButton data={weatherQuery.data} />
        </div>
      </div>

      <WeatherOverview
        weather={weatherQuery.data}
        forecast={forecastQuery.data}
      />
    </div>
  )
}

export default CityPage
