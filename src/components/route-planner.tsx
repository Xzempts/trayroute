"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type Stop = {
  id: string
  label: string
  note: string
  x: number
  y: number
}

const STORE: Stop = {
  id: "store",
  label: "Harbor Pharmacy",
  note: "Start and return",
  x: 92,
  y: 214,
}

const BAGS: Stop[] = [
  { id: "maple", label: "1840 Maple", note: "2 scripts · signature", x: 250, y: 86 },
  { id: "cedar", label: "90 Cedar", note: "Counseling", x: 430, y: 120 },
  { id: "oak", label: "411 Oak", note: "Refrigerated", x: 520, y: 230 },
  { id: "birch", label: "22 Birch", note: "1 script", x: 360, y: 310 },
  { id: "elm", label: "708 Elm", note: "Caregiver pickup", x: 190, y: 330 },
  { id: "dock", label: "15 Dock", note: "3 scripts", x: 150, y: 140 },
]

function distance(a: Stop, b: Stop) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function optimize(stops: Stop[]) {
  const left = [...stops]
  const path: Stop[] = [STORE]
  let current = STORE
  while (left.length) {
    let best = 0
    let bestDistance = Number.POSITIVE_INFINITY
    left.forEach((stop, index) => {
      const span = distance(current, stop)
      if (span < bestDistance) {
        bestDistance = span
        best = index
      }
    })
    current = left.splice(best, 1)[0]
    path.push(current)
  }
  path.push(STORE)
  return path
}

function milesOf(path: Stop[]) {
  let pixels = 0
  for (let i = 1; i < path.length; i++) pixels += distance(path[i - 1], path[i])
  return pixels / 42
}

export function RoutePlanner() {
  const [scanned, setScanned] = useState<Stop[]>([])
  const [ordered, setOrdered] = useState(false)
  const [scanningId, setScanningId] = useState<string | null>(null)
  const timers = useRef<number[]>([])
  const busy = useRef(false)

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  const path = useMemo(() => (ordered ? optimize(scanned) : [STORE, ...scanned]), [ordered, scanned])
  const miles = ordered ? milesOf(path) : 0
  const shelfMiles = scanned.length > 1 ? milesOf([STORE, ...scanned, STORE]) : miles
  const saved = Math.max(0, shelfMiles - miles)
  const driveMinutes = ordered ? Math.round(miles * 3.2 + scanned.length * 4) : 0
  const scanning = BAGS.find((bag) => bag.id === scanningId)
  const remaining = BAGS.filter((bag) => !scanned.some((stop) => stop.id === bag.id))

  function finishScan(bag: Stop, buildAfter: boolean) {
    setScanned((current) => (current.some((stop) => stop.id === bag.id) ? current : [...current, bag]))
    setScanningId(null)
    if (buildAfter) setOrdered(true)
    else setOrdered(false)
  }

  function scanBag(bag: Stop, buildAfter = false) {
    if (busy.current || scanned.some((stop) => stop.id === bag.id)) return
    busy.current = true
    setScanningId(bag.id)
    const timer = window.setTimeout(() => {
      busy.current = false
      finishScan(bag, buildAfter)
    }, 620)
    timers.current.push(timer)
  }

  function scanAll() {
    if (busy.current) return
    const left = BAGS.filter((bag) => !scanned.some((stop) => stop.id === bag.id))
    if (left.length === 0) {
      setOrdered(true)
      return
    }
    busy.current = true
    const step = (index: number) => {
      const bag = left[index]
      setScanningId(bag.id)
      const timer = window.setTimeout(() => {
        const last = index === left.length - 1
        setScanned((current) => (current.some((stop) => stop.id === bag.id) ? current : [...current, bag]))
        if (last) {
          busy.current = false
          setScanningId(null)
          setOrdered(true)
          return
        }
        step(index + 1)
      }, 620)
      timers.current.push(timer)
    }
    step(0)
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#ddd4c4] bg-[#f7f3ea] shadow-[0_24px_50px_rgba(40,36,28,0.12)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#ddd4c4] px-4 py-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-[#6b6358] uppercase">Trayroute</p>
          <p className="font-serif text-xl leading-none">Scan the bags</p>
        </div>
        <p className="text-right font-mono text-xs text-[#5c564c]">
          {ordered ? `${miles.toFixed(1)} mi · ${driveMinutes} min` : `${scanned.length} scanned`}
        </p>
      </div>

      <div className="border-b border-[#ddd4c4] px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {BAGS.map((bag) => {
            const read = scanned.some((stop) => stop.id === bag.id)
            const active = scanningId === bag.id
            return (
              <button
                key={bag.id}
                type="button"
                onClick={() => scanBag(bag)}
                disabled={read || busy.current}
                aria-label={read ? `${bag.label} already scanned` : `Scan bag for ${bag.label}`}
                className="w-[92px] shrink-0 text-left disabled:cursor-default"
              >
                <span className="relative block h-[118px] rounded-t-md rounded-b-xl border border-[#e4d3b0] bg-[#fbf7ef] shadow-[0_8px_16px_rgba(40,36,28,0.08)]">
                  <span className="absolute top-2 right-3 left-3 h-3 rounded-sm bg-[#f3e2c4]" />
                  <span className="absolute top-7 right-2 left-2 rounded-sm border border-[#e7d7b8] bg-white px-1.5 py-1">
                    <span className="block font-mono text-[8px] tracking-[0.14em] text-[#8a5a32] uppercase">Deliver to</span>
                    <span className="block text-[11px] leading-tight font-medium text-[#1c1916]">{bag.label}</span>
                    <span className="block text-[9px] leading-tight text-[#6b6358]">{bag.note}</span>
                  </span>
                  {active && <span className="bag-laser absolute right-1 left-1 h-0.5 bg-[#1564dc] shadow-[0_0_8px_#1564dc]" />}
                  {read && (
                    <span className="absolute right-1.5 bottom-1.5 rounded-full bg-[#173f90] px-1.5 py-0.5 font-mono text-[8px] tracking-wide text-white uppercase">
                      Read
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 min-h-5 text-sm text-[#3c342c]" aria-live="polite">
          {scanning
            ? `Reading ${scanning.label} on the bag.`
            : ordered
              ? saved > 0.4
                ? `Efficient route. ${saved.toFixed(1)} miles shorter than the order the bags were sitting in.`
                : "Efficient route. This is the short way around the stops."
              : scanned.length
                ? `${scanned.length} ${scanned.length === 1 ? "address" : "addresses"} read from the bags.`
                : "Point the scanner at a bag. The address on the label becomes a stop."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" className="h-10 bg-[#173f90] text-white hover:bg-[#173f90]/90" onClick={scanAll} disabled={busy.current || remaining.length === 0}>
            {busy.current ? "Scanning…" : remaining.length === 0 ? "Bags scanned" : "Scan the bags"}
          </Button>
          <Button type="button" variant="outline" className="h-10" onClick={() => setOrdered(true)} disabled={busy.current || scanned.length === 0 || ordered}>
            Build route
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px]">
        <svg viewBox="0 0 640 420" className="h-auto w-full bg-[#efeae1]" role="img" aria-label="Map of the pharmacy round">
          {[80, 160, 240, 320, 400].map((y) => (
            <line key={`h-${y}`} x1="30" y1={y} x2="610" y2={y} stroke="#ddd4c4" strokeWidth="8" />
          ))}
          {[120, 220, 340, 470, 560].map((x) => (
            <line key={`v-${x}`} x1={x} y1="40" x2={x} y2="380" stroke="#e7e0d2" strokeWidth="8" />
          ))}
          {ordered && path.length > 1 && (
            <polyline
              points={path.map((stop) => `${stop.x},${stop.y}`).join(" ")}
              fill="none"
              stroke="#1564dc"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          {path.map((stop, index) => {
            const isStore = stop.id === "store"
            const marker = isStore ? "Rx" : ordered ? String(index) : "•"
            return (
              <g key={`${stop.id}-${index}`}>
                <circle cx={stop.x} cy={stop.y} r={isStore ? 16 : 13} fill={isStore ? "#c45e10" : "#173f90"} />
                <text x={stop.x} y={stop.y + 4} textAnchor="middle" fontSize="11" fill="#f7f3ea" fontFamily="ui-monospace, monospace">
                  {marker}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="border-t border-[#ddd4c4] p-4 lg:border-t-0 lg:border-l">
          {scanned.length === 0 ? (
            <p className="text-sm leading-snug text-[#5c564c]">No bags scanned yet. The pharmacy is the start of the round.</p>
          ) : (
            <ol className="space-y-2">
              {path
                .filter((stop, index) => !(stop.id === "store" && index === path.length - 1 && ordered))
                .map((stop, index) => (
                  <li key={`${stop.id}-${index}`} className="rounded-xl bg-[#e4e1da] px-3 py-2">
                    <p className="text-sm leading-tight text-[#1c1916]">
                      <span className="mr-2 font-mono text-[11px] text-[#6b6358]">{stop.id === "store" ? "Rx" : ordered ? index : "–"}</span>
                      {stop.label}
                    </p>
                    <p className="mt-0.5 pl-6 text-xs text-[#5c564c]">{stop.note}</p>
                  </li>
                ))}
            </ol>
          )}
          {ordered && <p className="mt-3 text-xs leading-snug text-[#5c564c]">Return to Harbor Pharmacy after the last handoff.</p>}
        </div>
      </div>
    </div>
  )
}
