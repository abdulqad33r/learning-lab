import type { RefObject } from "react"
import { useEffect, useRef } from "react"

export type MousePoint = { x: number; y: number }

const useMouseMove = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  onMove: (point: MousePoint) => void
) => {
  const handlerRef = useRef(onMove)

  useEffect(() => {
    handlerRef.current = onMove
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const listener = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      handlerRef.current({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    el.addEventListener("mousemove", listener)

    return () => el.removeEventListener("mousemove", listener)
  }, [ref])
}

export default useMouseMove
