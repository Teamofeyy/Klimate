import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorite";
import { toast } from "sonner";
import { getWeatherIconUrl } from "@/api/config";
import { formatTemperature } from "@/lib/weather-format";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading, isError } = useWeatherQuery({ lat, lon });

  const handleClick = () => {
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <div className="relative min-w-[250px] rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-center gap-3 p-4 pr-8 text-left"
        aria-label={`Открыть погоду: ${name}`}
      >
        {isLoading ? (
          <div className="flex h-8 items-center justify-center" role="status">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="sr-only">Загрузка погоды</span>
          </div>
        ) : weather ? (
          <>
            <div className="flex items-center gap-2">
              <img
                src={getWeatherIconUrl(weather.weather[0].icon)}
                alt={weather.weather[0].description}
                className="h-8 w-8"
              />
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {weather.sys.country}
                </p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xl font-bold">
                {formatTemperature(weather.main.temp)}
              </p>
              <p className="text-xs capitalize text-muted-foreground">
                {weather.weather[0].description}
              </p>
            </div>
          </>
        ) : isError ? (
          <p className="text-sm text-muted-foreground">Погода недоступна</p>
        ) : null}
      </button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0  hover:text-destructive-foreground group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`${name} удалён из избранного`);
        }}
        aria-label={`Удалить ${name} из избранного`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function FavoriteCities() {
  const { favorites, removeFavorite } = useFavorites();

  if (!favorites.length) {
    return null;
  }

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight">Избранное</h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4">
          {favorites.map((city) => (
            <FavoriteCityTablet
              key={city.id}
              {...city}
              onRemove={removeFavorite}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
}
