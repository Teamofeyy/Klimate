import WeatherSkeleton from "@/components/loading-skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useGeolocation } from "@/hooks/use-geolocation"
import { AlertCircle, MapPin, RefreshCw } from "lucide-react"

const WetherDashboard = () => {
  const {coordinates, error: locationError, getLocation, isLoading: locationLoading} = useGeolocation()

  console.log(coordinates)

  const handleRefresh = () => {
    getLocation()
    if(coordinates){
      //reload weather data
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

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Моё Местоположение</h1>
        <Button variant={'outline'} size={'icon'} onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default WetherDashboard 