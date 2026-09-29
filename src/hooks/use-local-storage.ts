import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  parse: (value: unknown) => T,
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? parse(JSON.parse(item) as unknown) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // Storage can be unavailable in privacy modes; state still works in memory.
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}
