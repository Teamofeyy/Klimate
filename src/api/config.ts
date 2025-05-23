export const API_CONFIG = {
   BASE_URL: "https://api.openweathermap.org/data/2.5",
   GEOCODING_API: "https://api.openweathermap.org/geo/1.0",
   API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
   DEFAULT_PARAMS: {
      units: "metric",
      app_id: import.meta.env.VITE_OPENWEATHER_API_KEY
   },
}