"use client"

import Link from "next/link"
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

const bags = [
  ["A. Rahman", "14 Maple Ave"],
  ["L. Chen", "8 Oak Street"],
  ["M. Ortiz", "22 Harbor Rd"],
]

function Card({
  children,
  delay,
  className = "",
}: {
  children: ReactNode
  delay: number
  className?: string
}) {
  return (
    <article
      className={`hero-card rounded-2xl border-2 border-white bg-white shadow-[0_0_0_0.5px_rgba(16,24,40,0.08),18px_26px_48px_-16px_rgb(0_102_255/0.16)] ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </article>
  )
}

function CountCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="p-4">
      <p className="text-xs font-semibold text-[#0066ff]">Counting tray</p>
      <p className="mt-3 rounded-md bg-[#2a2e33] px-3 py-4 text-right font-mono text-4xl tracking-[0.18em] text-[#d7f5c8]">
        0045
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-[#636367]">
        <span>Groups of five</span>
        <span className="size-7 rounded-full bg-[#c4452d]" aria-hidden />
      </div>
    </Card>
  )
}

function TrayCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="bg-[#f8fafc] p-4">
      <p className="text-xs font-semibold text-[#3a3a3b]">On the bench</p>
      <div className="relative mt-3 h-32 overflow-hidden rounded-xl bg-[#0066ff]">
        <div className="absolute top-3 bottom-3 left-3 w-3 rounded-full bg-white/80" />
        <div className="absolute top-12 right-6 left-8 flex gap-1">
          {Array.from({ length: 8 }, (_, index) => (
            <span key={index} className="h-4 w-3 rounded-full bg-white" />
          ))}
        </div>
        <div className="absolute right-4 bottom-4 h-2.5 w-16 rounded-sm bg-[#e4e7ec]" />
      </div>
      <p className="mt-3 text-sm leading-5 text-[#3a3a3b]">The spatula pushes the tablets into the tube.</p>
    </Card>
  )
}

function KeepCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="p-4">
      <p className="text-xs font-semibold text-[#0066ff]">The number</p>
      <p className="mt-3 text-lg font-semibold tracking-tight text-[#18181b]">The count stays on the display.</p>
      <p className="mt-2 text-sm leading-6 text-[#636367]">A lost hand count does not have to start over.</p>
    </Card>
  )
}

function BagCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="p-4">
      <p className="text-xs font-semibold text-[#0066ff]">Route</p>
      <p className="mt-1 text-sm font-semibold text-[#18181b]">Scan the bags</p>
      <ul className="mt-3 space-y-2">
        {bags.map(([name, street], index) => (
          <li
            key={street}
            className={`rounded-md border px-3 py-2 ${index === 0 ? "border-[#0066ff] bg-[#e6f0ff]" : "border-[#e5e5eb]"}`}
          >
            <p className="text-sm font-medium text-[#18181b]">{name}</p>
            <p className="text-xs text-[#636367]">{street}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function FlagCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="p-4">
      <p className="text-xs font-semibold text-[#3a3a3b]">On the label</p>
      <ul className="mt-3 space-y-2 text-sm text-[#18181b]">
        {["Signature", "Refrigerate", "Counsel"].map((flag) => (
          <li key={flag} className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#0066ff]" />
            {flag}
          </li>
        ))}
      </ul>
    </Card>
  )
}

function StopCard({ delay }: { delay: number }) {
  const stops = ["Harbor Pharmacy", "14 Maple Ave", "8 Oak Street"]
  return (
    <Card delay={delay} className="p-4">
      <p className="text-xs font-semibold text-[#0066ff]">The short round</p>
      <ol className="mt-3 space-y-2">
        {stops.map((stop, index) => (
          <li key={stop} className="flex items-center gap-3 text-sm text-[#18181b]">
            <span className="grid size-6 place-items-center rounded-full bg-[#e6f0ff] text-xs font-semibold text-[#0066ff]">
              {index + 1}
            </span>
            {stop}
          </li>
        ))}
      </ol>
    </Card>
  )
}

function MetricCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="p-4">
      <p className="text-xs font-semibold text-[#636367]">United States</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-[#18181b]">18,988</p>
      <p className="mt-1 text-sm text-[#636367]">Independent pharmacies</p>
    </Card>
  )
}

function PriceCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="border-[#0066ff] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#18181b]">Year</p>
        <span className="rounded-full bg-[#0066ff] px-2 py-0.5 text-[11px] font-semibold text-white">Most used</span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[#18181b]">$96</p>
      <p className="text-sm text-[#636367]">per year</p>
    </Card>
  )
}

function RoundCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="bg-[#f8fafc] p-4">
      <p className="text-xs font-semibold text-[#0066ff]">Driver</p>
      <p className="mt-3 text-lg font-semibold tracking-tight text-[#18181b]">14 stops, then back.</p>
      <p className="mt-2 text-sm leading-6 text-[#636367]">Route reads the address already printed on the bag.</p>
    </Card>
  )
}

function DoorCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="p-4">
      <p className="text-xs font-semibold text-[#0066ff]">At the door</p>
      <p className="mt-3 text-lg font-semibold tracking-tight text-[#18181b]">The bag leaves in route order.</p>
      <p className="mt-2 text-sm leading-6 text-[#636367]">Drivers stop sorting doors from the fill sequence.</p>
    </Card>
  )
}

function ResetCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="p-4">
      <p className="text-xs font-semibold text-[#3a3a3b]">Reset</p>
      <div className="mt-4 flex items-center gap-3">
        <span className="size-10 rounded-full bg-[#c4452d]" aria-hidden />
        <p className="text-sm leading-5 text-[#18181b]">The red button returns the display to 0000.</p>
      </div>
    </Card>
  )
}

function ShareCard({ delay }: { delay: number }) {
  return (
    <Card delay={delay} className="p-4">
      <p className="text-4xl font-semibold tracking-tight text-[#18181b]">37%</p>
      <p className="mt-2 text-sm leading-6 text-[#636367]">Share of U.S. retail pharmacies that are independent.</p>
    </Card>
  )
}

const columns = [
  {
    className: "hero-col hero-col-1",
    cards: [
      (delay: number) => <CountCard delay={delay} />,
      (delay: number) => <TrayCard delay={delay} />,
      (delay: number) => <KeepCard delay={delay} />,
    ],
  },
  {
    className: "hero-col hero-col-2",
    cards: [
      (delay: number) => <BagCard delay={delay} />,
      (delay: number) => <FlagCard delay={delay} />,
      (delay: number) => <StopCard delay={delay} />,
    ],
  },
  {
    className: "hero-col hero-col-3",
    cards: [
      (delay: number) => <MetricCard delay={delay} />,
      (delay: number) => <PriceCard delay={delay} />,
      (delay: number) => <RoundCard delay={delay} />,
    ],
  },
  {
    className: "hero-col hero-col-4",
    cards: [
      (delay: number) => <ShareCard delay={delay} />,
      (delay: number) => <DoorCard delay={delay} />,
      (delay: number) => <ResetCard delay={delay} />,
    ],
  },
]

export function HeroStage() {
  const stageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    let current = 0

    const stop = () => cancelAnimationFrame(frame)

    const tick = () => {
      const node = stageRef.current
      if (!node) return
      const total = node.offsetHeight - window.innerHeight
      const raw = total <= 0 ? 0 : Math.min(1, Math.max(0, -node.getBoundingClientRect().top / total))
      current += (raw - current) * 0.09
      if (Math.abs(raw - current) < 0.0004) current = raw
      node.style.setProperty("--p", current.toFixed(4))
      node.style.setProperty("--t", Math.min(1, current / 0.5).toFixed(4))
      frame = requestAnimationFrame(tick)
    }

    const sync = () => {
      stop()
      const node = stageRef.current
      if (wide.matches && !reduce.matches) {
        frame = requestAnimationFrame(tick)
        return
      }
      current = 0
      node?.style.setProperty("--p", "0")
      node?.style.setProperty("--t", "0")
    }

    sync()
    wide.addEventListener("change", sync)
    reduce.addEventListener("change", sync)
    return () => {
      stop()
      wide.removeEventListener("change", sync)
      reduce.removeEventListener("change", sync)
    }
  }, [])

  const scrollAhead = () => {
    const node = stageRef.current
    if (!node) return
    const top = node.getBoundingClientRect().top + window.scrollY
    const distance = Math.max(window.innerHeight * 0.7, (node.offsetHeight - window.innerHeight) * 0.45)
    window.scrollTo({ top: top + distance, behavior: "smooth" })
  }

  return (
    <section ref={stageRef} className="hero-theater" style={{ "--p": 0, "--t": 0 } as CSSProperties}>
      <div className="hero-pin">
        <div className="hero-stripes" aria-hidden />
        <div className="hero-copy">
          <div className="hero-copy-inner">
            <p className="hero-rise inline-flex rounded-full bg-[#0066ff]/10 px-3 py-1 text-sm font-medium text-[#0066ff]">
              Pharmacy technology
            </p>
            <h1 className="hero-rise mt-4 text-5xl font-semibold tracking-tight text-[#18181b] md:text-6xl" style={{ animationDelay: "80ms" }}>
              The count and the route.
            </h1>
            <p className="hero-rise mt-4 text-lg leading-8 text-[#636367]" style={{ animationDelay: "160ms" }}>
              Trayroute is a pharmacy technology company. The counting tray keeps the number on the bench. Route scans the bag and carries the prescriptions to the door.
            </p>
            <div className="hero-rise mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start" style={{ animationDelay: "240ms" }}>
              <Button asChild className="h-11 rounded-lg px-4">
                <Link href="/#products">See the products</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-lg border-[#d1d1d7] bg-white px-4 text-[#3a3a3b] shadow-none hover:bg-[#f9f9fc]">
                <Link href="/products/route">Open Route</Link>
              </Button>
            </div>
            <button type="button" className="hero-scrollcue" onClick={scrollAhead}>
              <span>Scroll</span>
              <svg className="hero-cue-icon" viewBox="0 0 16 16" aria-hidden width="16" height="16">
                <path d="M4 6.5 8 10.5 12 6.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="hero-scene">
          <div className="hero-wrap">
            <div className="hero-grid" aria-hidden="true">
              {columns.map((column, columnIndex) => (
                <div key={column.className} className={column.className}>
                  {column.cards.map((render, cardIndex) => (
                    <div key={`${column.className}-${cardIndex}`}>{render(columnIndex * 90 + cardIndex * 80)}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
