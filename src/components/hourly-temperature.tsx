import { ForecastData } from "@/api/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatWeatherTime } from "@/lib/weather-time"
import { roundTemperature } from "@/lib/weather-format"

interface HourlyTemperatureProps {
    data: ForecastData;
}

const HourlyTemperature = ({ data }: HourlyTemperatureProps) => {
    const chartData = data.list.slice(0, 8).map((item) => ({
        time: formatWeatherTime(item.dt, data.city.timezone, {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }),
        temp: roundTemperature(item.main.temp),
        feels_like: roundTemperature(item.main.feels_like),
    }))

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Сегодняшняя температура</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart data={chartData}>
                            <XAxis
                                dataKey="time"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}°`}
                            />

                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Температура</span>
                                                        <span className="font-bold">
                                                            {payload.find((entry) => entry.dataKey === "temp")?.value}°
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col" >
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Ощущается как</span>
                                                        <span className="font-bold">
                                                            {payload.find((entry) => entry.dataKey === "feels_like")?.value}°
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="temp"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="feels_like"
                                stroke="#64748b"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default HourlyTemperature
