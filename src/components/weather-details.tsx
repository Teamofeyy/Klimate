import { WeatherData } from "@/api/types"
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ru } from "date-fns/locale";

interface WeatherDetailsProps {
  data: WeatherData;
}

const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  const { wind, main, sys } = data

  const getWindDirection = (degree: number) => {
    const directions = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"]

    const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8
    return directions[index]
  }

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 100), "HH:mm", { locale: ru })
  }

  const details = [
    {
      title: "Рассвет",
      value: formatTime(sys.sunrise),
      icon: Sunrise,
      color: "text-orange-500",
    },
    {
      title: "Закат",
      value: formatTime(sys.sunset),
      icon: Sunset,
      color: "text-blue-500",
    },
    {
      title: "Направление ветра",
      value: `${getWindDirection(wind.deg)} (${wind.deg}°)`,
      icon: Compass,
      color: "text-green-500",
    },
    {
      title: "Давление",
      value: `${Math.round(main.pressure / 1.33322)} mm Hg`,
      icon: Gauge,
      color: "text-purple-500"
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Детали</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          {details.map((detail) => {
            return (
              <div
                key={detail.title}
                className="flex items-center gap-3 rounded-lg border p-4"
              >
                <detail.icon className={`h-5 w-5 ${detail.color}`} />
                <div>
                  <p className="text-sm font-medium leading-none">{detail.title}</p>
                  <p className="text-sm text-muted-foreground">{detail.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherDetails