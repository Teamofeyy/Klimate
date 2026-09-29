import {
  isLocationSummary,
  type LocationSummary,
} from "@/api/types";
import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import { isFiniteNumber } from "@/lib/type-guards";
import { getLocationId } from "@/lib/location";

interface SearchHistoryItem extends LocationSummary {
  id: string;
  searchedAt: number;
}

function parseSearchHistory(value: unknown): SearchHistoryItem[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item) => {
    if (!isLocationSummary(item)) return []

    const searchedAt = item.searchedAt ?? item.seacrhedAt
    if (!isFiniteNumber(searchedAt)) return []

    return [{
      id: getLocationId(item),
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
      searchedAt,
    }]
  })
}

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>(
    "search-history",
    [],
    parseSearchHistory,
  )

  const addToHistory = useCallback(
    (search: LocationSummary) => {
      const searchedAt = Date.now()
      const id = getLocationId(search)
      const newSearch: SearchHistoryItem = {
        id,
        name: search.name,
        lat: search.lat,
        lon: search.lon,
        country: search.country,
        state: search.state,
        searchedAt,
      }

      setHistory((currentHistory) => [
        newSearch,
        ...currentHistory.filter((item) => item.id !== id),
      ].slice(0, 10))
    },
    [setHistory],
  )

  const clearHistory = useCallback(() => setHistory([]), [setHistory])

  return {
    history,
    addToHistory,
    clearHistory
  }
}
