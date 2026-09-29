export const roundTemperature = (temperature: number) =>
  Math.round(temperature)

export const formatTemperature = (temperature: number) =>
  `${roundTemperature(temperature)}°`

export const formatWindSpeed = (speed: number) => `${speed} м/с`
