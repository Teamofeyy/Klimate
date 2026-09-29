import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import {
  isLocationSummary,
  type LocationSummary,
} from "@/api/types";
import { isFiniteNumber } from "@/lib/type-guards";
import { getLocationId } from "@/lib/location";

export interface FavoriteCity extends LocationSummary {
  id: string;
  addedAt: number;
}

function parseFavorites(value: unknown): FavoriteCity[] {
  if (!Array.isArray(value)) return []

  return value.filter(
    (city): city is FavoriteCity =>
      isLocationSummary(city) &&
      city.id === getLocationId(city) &&
      isFiniteNumber(city.addedAt),
  )
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
    "favorites",
    [],
    parseFavorites,
  );

  const addFavorite = useCallback(
    (city: LocationSummary) => {
      const newFavorite: FavoriteCity = {
        ...city,
        id: getLocationId(city),
        addedAt: Date.now(),
      };

      setFavorites((currentFavorites) =>
        currentFavorites.some((favorite) => favorite.id === newFavorite.id)
          ? currentFavorites
          : [...currentFavorites, newFavorite],
      );
    },
    [setFavorites],
  );

  const removeFavorite = useCallback(
    (cityId: string) => {
      setFavorites((currentFavorites) =>
        currentFavorites.filter((city) => city.id !== cityId),
      );
    },
    [setFavorites],
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite: (lat: number, lon: number) =>
      favorites.some((city) => city.id === getLocationId({ lat, lon })),
  };
}
