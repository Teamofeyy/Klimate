const getDateAtLocation = (timestamp: number, timezoneOffset: number) =>
  new Date((timestamp + timezoneOffset) * 1000)

export function formatWeatherTime(
  timestamp: number,
  timezoneOffset: number,
  options: Intl.DateTimeFormatOptions,
) {
  const dateAtLocation = getDateAtLocation(timestamp, timezoneOffset)
  return new Intl.DateTimeFormat("ru-RU", {
    ...options,
    timeZone: "UTC",
  }).format(dateAtLocation)
}

export function getWeatherDateKey(timestamp: number, timezoneOffset: number) {
  return getDateAtLocation(timestamp, timezoneOffset)
    .toISOString()
    .slice(0, 10)
}
