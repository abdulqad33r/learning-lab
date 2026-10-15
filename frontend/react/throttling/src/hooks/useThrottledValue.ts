import { useEffect, useState } from "react"

import useThrottle from "./useThrottle"

export function useThrottledValue<T>(value: T, delay: number): T {
  const [throttled, setThrottled] = useState(value)
  const update = useThrottle((v: T) => setThrottled(v), delay)

  useEffect(() => {
    update(value)
  }, [update, value])

  return throttled
}
