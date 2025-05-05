import CurrentWeather from "@/components/current-weather"
import HourlyTemperature from "@/components/hourly-temperature"
import WeatherSkeleton from "@/components/loading-skeleton"
import WeatherDetails from "@/components/weather-details"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather"
import { AlertCircle, MapPin, RefreshCw } from "lucide-react"

const WetherDashboard = () => {
  const {coordinates, error: locationError, getLocation, isLoading: locationLoading} = useGeolocation()

  const locationQuery = useReverseGeocodeQuery(coordinates)
  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)

  const handleRefresh = () => {
    getLocation()
    if(coordinates){
      weatherQuery.refetch()
      forecastQuery.refetch()
      locationQuery.refetch()
    }
  }

  if(locationLoading){
    return <WeatherSkeleton />
  }

  if(locationError){
    return (
      <Alert variant={'destructive'}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ошибка геолокации</AlertTitle>
        <AlertDescription>
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={'outline'} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Включить геолокацию
          </Button>
        </AlertDescription>
    </Alert>
    )
  }

  if(!coordinates){
    return (
      <Alert variant={'destructive'}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Требуется местоположение</AlertTitle>
        <AlertDescription>
          <p>Пожалуйста, включите доступ к местоположению, чтобы увидеть местную погоду</p>
          <Button onClick={getLocation} variant={'outline'} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Включить геолокацию
          </Button>
        </AlertDescription>
    </Alert>
    )
  }

  const locationName = locationQuery.data?.[0]

  if(weatherQuery.error || forecastQuery.error){
    return (
      <Alert variant={'destructive'}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>
          <p>Не удалось получить данные о погоде. Попробуйте еще раз.</p>
          <Button onClick={getLocation} variant={'outline'} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Повторить
          </Button>
        </AlertDescription>
    </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data){
    return <WeatherSkeleton />
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Моё Местоположение</h1>
        <Button variant={'outline'} size={'icon'} onClick={handleRefresh} disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
          <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching?"animate-spin":""}`} />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />
          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div>
          <WeatherDetails data={weatherQuery.data} />
        </div>
      </div>
    </div>
  )
}

export default WetherDashboard 