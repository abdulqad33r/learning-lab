import { useCallback, useEffect, useRef } from "react"

const useThrottle = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  const fnRef = useRef(fn) // always point to the latest fn
  const lastRun = useRef(0) // timestamp of the last real execution
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingArgs = useRef<T | null>(null)

  useEffect(() => {
    fnRef.current = fn
  })

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return useCallback(
    (...args: T) => {
      const now = Date.now()
      const remaining = delay - (now - lastRun.current)
      pendingArgs.current = args

      if (remaining <= 0) {
        // cooldown is over -> run right now
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = null
        }

        lastRun.current = now
        fnRef.current(...args)
      } else if (!timer.current) {
        // still cooling down -> schedule one trailing run
        timer.current = setTimeout(() => {
          timer.current = null
          lastRun.current = Date.now()

          if (pendingArgs.current) fnRef.current(...pendingArgs.current)
        }, remaining)
      }
    },
    [delay]
  )
}

export default useThrottle
