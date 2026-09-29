import type { Coordinates } from "@/api/types"

export const getLocationId = ({ lat, lon }: Coordinates) => `${lat}-${lon}`
