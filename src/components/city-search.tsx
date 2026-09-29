import type { LocationSummary } from "@/api/types"
import { useEffect, useState, type ReactNode } from "react"
import { Button } from "./ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Clock, Loader, Search, XCircle } from "lucide-react"
import { useLocationSearch } from "@/hooks/use-weather"
import { CommandSeparator } from "./ui/command"
import { useNavigate } from "react-router-dom"
import { useSearchHistory } from "@/hooks/use-search-history"
import { getLocationId } from "@/lib/location"

const historyDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

interface LocationSearchItemProps {
  location: LocationSummary
  icon: ReactNode
  onSelect: () => void
  trailing?: ReactNode
}

function LocationSearchItem({
  location,
  icon,
  onSelect,
  trailing,
}: LocationSearchItemProps) {
  return (
    <CommandItem
      value={`${location.name} ${location.state ?? ""} ${location.country}`}
      onSelect={onSelect}
    >
      {icon}
      <span>{location.name}</span>
      {location.state && (
        <span className="text-sm text-muted-foreground">
          , {location.state}
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        , {location.country}
      </span>
      {trailing}
    </CommandItem>
  )
}

const CitySearch = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const {
    data: locations,
    error: searchError,
    isFetching,
  } = useLocationSearch(debouncedQuery)
  const { history, clearHistory, addToHistory } = useSearchHistory()
  const navigate = useNavigate()

  useEffect(() => {
    const normalizedQuery = query.trim()
    if (normalizedQuery.length < 3) {
      setDebouncedQuery("")
      return
    }

    const timeout = window.setTimeout(() => setDebouncedQuery(normalizedQuery), 350)
    return () => window.clearTimeout(timeout)
  }, [query])

  const handleSelect = (location: LocationSummary) => {
    addToHistory(location)

    setOpen(false)
    setQuery("")
    const search = new URLSearchParams({
      lat: String(location.lat),
      lon: String(location.lon),
    })
    navigate(`/city/${encodeURIComponent(location.name)}?${search.toString()}`)
  }

  return (
    <>
      <Button
        variant={"outline"}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
        aria-label="Поиск города"
      >
        <Search className="mr-2 w-4 h-4" />
        Поиск городов...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Поиск городов..." value={query} onValueChange={setQuery} />
        <CommandList>
          {debouncedQuery.length >= 3 && !isFetching && !searchError && (
            <CommandEmpty>Города не найдены.</CommandEmpty>
          )}

          {isFetching && (
            <div className="flex items-center justify-center p-4" role="status">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="sr-only">Поиск городов</span>
            </div>
          )}

          {searchError && (
            <p className="p-4 text-center text-sm text-destructive" role="alert">
              Не удалось выполнить поиск. Попробуйте ещё раз.
            </p>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup >
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">Недавнее</p>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={clearHistory}
                  >
                    <XCircle className="h4- w-4" />
                    Очистить
                  </Button>
                </div>

                {history.map((location) => {
                  return (
                    <LocationSearchItem
                      key={location.id}
                      location={location}
                      onSelect={() => handleSelect(location)}
                      icon={<Clock className="mr-2 h-4 w-4 text-muted-foreground" />}
                      trailing={
                        <span className="ml-auto text-xs text-muted-foreground">
                          {historyDateFormatter.format(location.searchedAt)}
                        </span>
                      }
                    />
                  )
                })}

              </CommandGroup>
            </>
          )}


          {(history.length > 0 || Boolean(locations?.length)) && <CommandSeparator />}

          {locations && locations.length > 0 && (
            <CommandGroup heading="Предложения">
              {locations.map((location) => {
                return (
                  <LocationSearchItem
                    key={getLocationId(location)}
                    location={location}
                    onSelect={() => handleSelect(location)}
                    icon={<Search className="mr-2 h-4 w-4" />}
                  />
                )
              })}
            </CommandGroup>
          )}

        </CommandList>
      </CommandDialog>
    </>

  )
}

export default CitySearch
