import { Coordinates } from "@/api/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface GeolocationState {
    coordinates: Coordinates | null,
    error: string | null,
    isLoading: boolean,
}

export function useGeolocation() {
    const isMounted = useRef(true)
    const requestId = useRef(0)
    const [locationData, setlocationData] = useState<GeolocationState>({
        coordinates: null,
        error: null,
        isLoading: true
    });

    const getLocation = useCallback(() => new Promise<Coordinates | null>((resolve) => {
        const currentRequest = ++requestId.current
        setlocationData((prev)=> ({...prev, isLoading: true, error: null}))

        if(!navigator.geolocation){
            setlocationData({
                coordinates: null,
                error: "Геолокация не доступна в вашем браузере",
                isLoading: false
            })
            resolve(null)
            return
        }
        navigator.geolocation.getCurrentPosition((position)=> {
            const coordinates = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            }

            if (isMounted.current && currentRequest === requestId.current) {
                setlocationData({
                    coordinates,
                    error: null,
                    isLoading: false
                })
                resolve(coordinates)
                return
            }
            resolve(null)
        }, (error)=>{
            if (!isMounted.current || currentRequest !== requestId.current) {
                resolve(null)
                return
            }

            let errorMessage: string;

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage =
                    "Геолокация выключена. Пожалуйста, разрешите доступ к геолокации."
                    break

                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Информация о данной локации недоступна."
                    break

                case error.TIMEOUT:
                    errorMessage = "Превышено время ожидания."
                    break

                default:
                    errorMessage = "Возникла неизвестная ошибка."
                    break
            }

            setlocationData({
                coordinates: null,
                error: errorMessage,
                isLoading: false
            })
            resolve(null)
        }, {
            enableHighAccuracy: false,
            timeout: 10_000,
            maximumAge: 5 * 60 * 1000,
        })
    }), [])

    useEffect(() => {
        isMounted.current = true
        void getLocation()

        return () => {
            isMounted.current = false
            requestId.current += 1
        }
    }, [getLocation])

    return {
        ...locationData,
        getLocation
    }
}
