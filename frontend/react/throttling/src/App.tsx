import { useCallback, useRef, useState } from "react"
import "./App.css"
import type { MousePoint } from "./hooks/useMouseMove"
import useMouseMove from "./hooks/useMouseMove"
import useThrottle from "./hooks/useThrottle"

type Ripple = { id: number; x: number; y: number }

export default function App() {
  const stageRef = useRef<HTMLDivElement>(null)
  const rippleId = useRef(0)

  const [interval, setIntervalMs] = useState(300)
  const [raw, setRaw] = useState<MousePoint>({ x: -100, y: -100 })
  const [snap, setSnap] = useState<MousePoint>({ x: -100, y: -100 })
  const [rawCount, setRawCount] = useState(0)
  const [fireCount, setFireCount] = useState(0)
  const [ripples, setRipples] = useState<Ripple[]>([])

  // This runs ONLY when the throttle lets it through
  const onThrottledMove = useCallback((p: MousePoint) => {
    setSnap(p)
    setFireCount(c => c + 1)
    setRipples(r => [...r.slice(-19), { id: rippleId.current++, ...p }])
  }, [])
  const throttledMove = useThrottle(onThrottledMove, interval)

  // This runs on EVERY mousemove event
  useMouseMove(stageRef, p => {
    setRaw(p)
    setRawCount(c => c + 1)
    throttledMove(p)
  })

  const saved =
    rawCount === 0 ? 0 : Math.round((1 - fireCount / rawCount) * 100)

  const reset = () => {
    setRawCount(0)
    setFireCount(0)
    setRipples([])
  }

  return (
    <main className="tl">
      <header className="tl-head">
        <h1>Throttling with mousemove</h1>
        <p>
          Move your mouse across the field. The hollow ring reacts to every
          event. The amber orb only moves once per beat, and that's throttling.
        </p>
      </header>

      <div className="tl-stage" ref={stageRef}>
        {ripples.map(r => (
          <span
            key={r.id}
            className="tl-ripple"
            style={{ left: r.x, top: r.y }}
            onAnimationEnd={() =>
              setRipples(list => list.filter(x => x.id !== r.id))
            }
          />
        ))}

        <span
          className="tl-ring"
          style={{ transform: `translate(${raw.x}px, ${raw.y}px)` }}
        />
        <span
          className="tl-orb"
          style={{
            transform: `translate(${snap.x}px, ${snap.y}px)`,
            transitionDuration: `${Math.min(interval, 220)}ms`,
          }}
        />

        {rawCount === 0 && <p className="tl-hint">move your mouse in here</p>}
      </div>

      <section className="tl-panel">
        <div className="tl-stat">
          <span className="tl-num">{rawCount}</span>
          <span className="tl-label">mouse events</span>
        </div>
        <div className="tl-stat tl-stat--amber">
          <span className="tl-num">{fireCount}</span>
          <span className="tl-label">times the handler ran</span>
        </div>
        <div className="tl-stat tl-stat--rose">
          <span className="tl-num">{saved}%</span>
          <span className="tl-label">calls skipped</span>
        </div>

        <div className="tl-control">
          <label htmlFor="interval">
            Beat length <b>{interval} ms</b>
          </label>
          <input
            id="interval"
            type="range"
            min={50}
            max={1000}
            step={50}
            value={interval}
            onChange={e => setIntervalMs(Number(e.target.value))}
          />
          <div className="tl-beat" aria-hidden>
            {/* remounts on each fire, restarting the cooldown animation */}
            <i key={fireCount} style={{ animationDuration: `${interval}ms` }} />
          </div>
          <button type="button" onClick={reset}>
            Reset counters
          </button>
        </div>
      </section>
    </main>
  )
}
