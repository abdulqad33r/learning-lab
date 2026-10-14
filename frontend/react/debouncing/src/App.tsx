import { useEffect, useRef, useState } from "react"

import "./App.css"
import useDebounce from "./hooks/useDebounce"

function App() {
  const [inputValue, setInputValue] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedValue = useDebounce(inputValue, 700)

  useEffect(() => {
    if (!debouncedValue.trim() || !inputRef.current) return

    console.log("Searching", debouncedValue)
    inputRef.current.classList.add("fetching")

    const cleanup = setTimeout(() => {
      inputRef.current!.classList.remove("fetching")
    }, 800)

    return () => clearTimeout(cleanup)
  }, [debouncedValue])

  return (
    <div>
      <p>
        When the input border turns blue it fetches the results otherwise it
        does nothing
      </p>

      <input
        type="text"
        ref={inputRef}
        value={inputValue}
        onChange={e => {
          setInputValue(e.target.value)
          e.target.classList.remove("fetching")
        }}
        placeholder="Search"
      />
    </div>
  )
}

export default App
