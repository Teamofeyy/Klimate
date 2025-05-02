import { Coordinates } from "@/api/types";
import { useState, useEffect } from "react";

interface GeolocationState {
    coordinates: Coordinates | null,
    error: string | null,
    isLoading: boolean,
}

export function useGeolocation() {
    const [locationData, setlocationData] = useState<GeolocationState>({
        coordinates: null,
        error: null,
        isLoading: true
    });

    const getLocation=()=>{
        setlocationData((prev)=> ({...prev, isLoading: true, error: null}))

        if(!navigator.geolocation){
            setlocationData({
                coordinates: null,
                error: "Геолокация не доступна в вашем браузере",
                isLoading: false
            })
            return
        }
        navigator.geolocation.getCurrentPosition((position)=> {
            setlocationData({
                coordinates: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                },
                error: null,
                isLoading: false
            })
        }, (error)=>{
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
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        })
    }

    useEffect(() => {
        getLocation();
    }, [])
        
    return {
        ...locationData,
        getLocation
    }
}