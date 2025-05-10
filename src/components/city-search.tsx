import { useState } from "react"
import { Button } from "./ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Clock, Loader, Search, XCircle } from "lucide-react"
import { useLocationSeacrh } from "@/hooks/use-weather"
import { CommandSeparator } from "cmdk"
import { useNavigate } from "react-router-dom"
import { useSearchHistory } from "@/hooks/use-search-history"
import { format } from "date-fns"

const CitySearch = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { data: locations, isLoading } = useLocationSeacrh(query)
  const { history, clearHistory, addToHistory } = useSearchHistory()
  const navigate = useNavigate()

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|")

    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    })

    setOpen(false)
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
  }

  return (
    <>
      <Button
        variant={"outline"}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 w-4 h-4" />
        Поиск городов...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Поиск городов..." value={query} onValueChange={setQuery} />
        <CommandList>
          {query.length > 2 && !isLoading && (<CommandEmpty>Города не найдены.</CommandEmpty>)}
          <CommandGroup heading="Избранное">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup>

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup >
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">Недавнее</p>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h4- w-4" />
                    Очистить
                  </Button>
                </div>

                {history.map((location) => {
                  return (
                    <CommandItem
                      key={`${location.lat}-${location.lon}`}
                      value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                      onSelect={handleSelect}
                    >
                      <Clock className="mr-2 w-4 h-4 text-muted-foreground" />
                      <span>{location.name}</span>
                      {location.state && (
                        <span className="text-sm text-muted-foreground">
                          , {location.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        , {location.country}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {format(location.seacrhedAt, "MMM d, HH:mm")}
                      </span>
                    </CommandItem>
                  )
                })}

              </CommandGroup>
            </>
          )}


          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup heading="Предложения">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((location) => {
                return (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 w-4 h-4" />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {location.country}
                    </span>
                  </CommandItem>
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