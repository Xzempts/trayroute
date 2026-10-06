"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const SLIDES = [
  { id: "cover", kicker: "Pharmacy technology" },
  { id: "problem", kicker: "The problem" },
  { id: "solves", kicker: "What it solves" },
  { id: "tray", kicker: "The counting tray" },
  { id: "route", kicker: "The Route app" },
  { id: "day", kicker: "From the bench to the door" },
  { id: "market", kicker: "The store" },
  { id: "reach", kicker: "Go to market" },
  { id: "years", kicker: "Three years" },
  { id: "model", kicker: "How Trayroute is paid" },
  { id: "path", kicker: "The other options" },
  { id: "close", kicker: "Trayroute" },
] as const

export function PitchDeck() {
  const [index, setIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const startX = useRef<number | null>(null)
  const skipFocus = useRef(true)
  const last = SLIDES.length - 1

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduceMotion(media.matches)
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (skipFocus.current) {
      skipFocus.current = false
      return
    }
    document.getElementById(`pitch-title-${index}`)?.focus()
  }, [index])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && target.closest("input, textarea, select")) return
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault()
        setIndex((current) => Math.min(last, current + 1))
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault()
        setIndex((current) => Math.max(0, current - 1))
      } else if (event.key === "Home") {
        event.preventDefault()
        setIndex(0)
      } else if (event.key === "End") {
        event.preventDefault()
        setIndex(last)
      } else if (event.key === " " && target === document.body) {
        event.preventDefault()
        setIndex((current) => Math.min(last, current + 1))
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [last])

  const go = (next: number) => setIndex(Math.max(0, Math.min(last, next)))

  return (
    <div
      className="pitch-shell fixed inset-0 z-[80] flex flex-col overflow-hidden bg-[#10141b] text-[#f4efe6]"
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return
        startX.current = event.clientX
      }}
      onPointerUp={(event) => {
        if (startX.current == null) return
        const delta = event.clientX - startX.current
        startX.current = null
        if (Math.abs(delta) < 56) return
        go(index + (delta < 0 ? 1 : -1))
      }}
    >
      <header className="pitch-top flex items-center justify-between gap-4 px-4 py-3 md:px-8">
        <p className="font-serif text-2xl leading-none tracking-tight">Trayroute</p>
        <p className="hidden font-mono text-[11px] tracking-[0.2em] text-[#9aa6b5] uppercase sm:block">{SLIDES[index].kicker}</p>
        <p className="font-mono text-xs text-[#9aa6b5]">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </p>
      </header>

      <div className="pitch-stage min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {SLIDES.map((slide, slideIndex) => (
          <section
            key={slide.id}
            id={`slide-${slide.id}`}
            data-active={slideIndex === index ? "true" : "false"}
            aria-hidden={slideIndex !== index}
            className={
              reduceMotion
                ? "pitch-slide mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 py-4 md:px-8 md:py-6"
                : "pitch-slide pitch-in mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 py-4 md:px-8 md:py-6"
            }
          >
            <div className="my-auto w-full">
              <SlideBody id={slide.id} titleId={`pitch-title-${slideIndex}`} />
            </div>
          </section>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {SLIDES.length}. {SLIDES[index].kicker}.
      </p>

      <footer className="pitch-controls border-t border-white/10 px-4 py-3 md:px-8">
        <div className="mb-3 flex gap-1.5" aria-hidden="true">
          {SLIDES.map((slide, slideIndex) => (
            <span
              key={slide.id}
              className={slideIndex <= index ? "h-1 flex-1 rounded-full bg-[#7ea2e8]" : "h-1 flex-1 rounded-full bg-white/15"}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {SLIDES.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Slide ${slideIndex + 1}: ${slide.kicker}`}
                aria-current={slideIndex === index ? "true" : undefined}
                onClick={() => go(slideIndex)}
                className={
                  slideIndex === index
                    ? "size-2.5 rounded-full bg-[#f4efe6]"
                    : "size-2.5 rounded-full bg-white/25 hover:bg-white/50"
                }
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="border-white/20 bg-transparent text-[#f4efe6] hover:bg-white/10 hover:text-[#f4efe6]"
            >
              <a href="/trayroute-pitch.pdf" download="Trayroute-pitch-deck.pdf">
                Download
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/20 bg-transparent text-[#f4efe6] hover:bg-white/10 hover:text-[#f4efe6]"
              disabled={index === 0}
              onClick={() => go(index - 1)}
            >
              Back
            </Button>
            <Button
              type="button"
              className="bg-[#1d4e9f] text-white hover:bg-[#1d4e9f]/90"
              disabled={index === last}
              onClick={() => go(index + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SlideBody({ id, titleId }: { id: (typeof SLIDES)[number]["id"]; titleId: string }) {
  if (id === "cover") return <Cover titleId={titleId} />
  if (id === "problem") return <Problem titleId={titleId} />
  if (id === "solves") return <Solves titleId={titleId} />
  if (id === "tray") return <Tray titleId={titleId} />
  if (id === "route") return <Route titleId={titleId} />
  if (id === "day") return <Day titleId={titleId} />
  if (id === "market") return <Market titleId={titleId} />
  if (id === "reach") return <Reach titleId={titleId} />
  if (id === "years") return <Years titleId={titleId} />
  if (id === "model") return <Model titleId={titleId} />
  if (id === "path") return <Path titleId={titleId} />
  return <Close titleId={titleId} />
}

function Cover({ titleId }: { titleId: string }) {
  return (
    <div className="print-2 grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] text-[#9bb4e4] uppercase">Pharmacy technology</p>
        <h1 id={titleId} tabIndex={-1} className="mt-3 font-serif text-[clamp(3.4rem,8vw,6.4rem)] leading-[0.88] tracking-[-0.045em] outline-none">
          The count and the route.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-snug text-[#d5dbe4]">
          Trayroute makes the tools technicians use at the bench and on the road. One product keeps a lost count. The other turns a shelf of bags into a shorter round.
        </p>
      </div>
      <div className="grid gap-3">
        <div className="rounded-3xl bg-[#f4efe6] p-5 text-[#172033]">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#5d6b80] uppercase">Bench</p>
          <p className="mt-2 font-serif text-3xl leading-none">Smart counting tray</p>
          <p className="mt-3 text-sm leading-snug text-[#3d4a5e]">A running total while the technician counts. No restart. No full machine.</p>
        </div>
        <div className="rounded-3xl bg-[#1d4e9f] p-5 text-[#f4efe6]">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#c5d6f5] uppercase">Road</p>
          <p className="mt-2 font-serif text-3xl leading-none">Route app</p>
          <p className="mt-3 text-sm leading-snug text-[#d6e4ff]">Scan the address on the bag. Leave with the doors in order.</p>
        </div>
      </div>
    </div>
  )
}

function Problem({ titleId }: { titleId: string }) {
  return (
    <div>
      <h2 id={titleId} tabIndex={-1} className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-tight outline-none">
        The count gets lost. The bags leave in the wrong order.
      </h2>
      <div className="print-2 mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl bg-[#f4efe6] p-5 text-[#172033] md:p-6">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#8a4a32] uppercase">Problem at the bench</p>
          <p className="mt-4 font-mono text-5xl tracking-tight text-[#1d4e9f]">00??</p>
          <p className="mt-4 text-lg leading-snug">
            A hand count is easy to lose. Starting over wastes the fill. A fully automatic machine takes the count away from the person who is supposed to check it.
          </p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-[#182232] p-5 md:p-6">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#9bb4e4] uppercase">Problem on the road</p>
          <ol className="mt-4 flex flex-wrap gap-2">
            {["4", "1", "6", "2", "5", "3"].map((stop) => (
              <li key={stop} className="grid size-11 place-items-center rounded-full border border-white/15 font-mono text-lg">
                {stop}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-lg leading-snug text-[#d5dbe4]">
            Bags sit in the order they were filled. The driver sorts doors from printed labels and spends the miles.
          </p>
        </article>
      </div>
    </div>
  )
}

function Solves({ titleId }: { titleId: string }) {
  return (
    <div>
      <h2 id={titleId} tabIndex={-1} className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-tight outline-none">
        Keep the number. Scan the bag.
      </h2>
      <div className="print-2 mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl bg-[#f4efe6] p-5 text-[#172033] md:p-6">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#5d6b80] uppercase">What the tray solves</p>
          <h3 className="mt-3 font-serif text-3xl leading-none">The lost count</h3>
          <p className="mt-4 leading-snug">
            The smart pill counting tray is a traditional blue pharmacy tray with a spatula, an acrylic channel, and a digital display. Tablets are pushed into the tube in groups of five, and the counter keeps the running total so the technician can finish the count.
          </p>
        </article>
        <article className="rounded-3xl bg-[#1d4e9f] p-5 text-[#f4efe6] md:p-6">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#c5d6f5] uppercase">What the Route app solves</p>
          <h3 className="mt-3 font-serif text-3xl leading-none">The shelf order</h3>
          <p className="mt-4 leading-snug text-[#e4edff]">
            The Route app scans the address printed on each prescription bag, keeps signature, refrigeration, and counseling with that stop, and builds a shorter multi-stop round from the pharmacy and back.
          </p>
        </article>
      </div>
    </div>
  )
}

function Tray({ titleId }: { titleId: string }) {
  return (
    <div className="print-2 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <TrayMark />
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-[#9bb4e4] uppercase">Product</p>
        <h2 id={titleId} tabIndex={-1} className="mt-2 font-serif text-[clamp(2.5rem,5vw,4.4rem)] leading-[0.95] tracking-tight outline-none">
          The tray counts.
        </h2>
        <ul className="mt-5 grid gap-3 text-[#d5dbe4]">
          <li className="rounded-2xl border border-white/10 px-4 py-3">The spatula pushes tablets left, into the acrylic tube.</li>
          <li className="rounded-2xl border border-white/10 px-4 py-3">The display climbs by fives and holds the total.</li>
          <li className="rounded-2xl border border-white/10 px-4 py-3">The red button clears the display and returns the tablets to 0000.</li>
          <li className="rounded-2xl border border-white/10 px-4 py-3">The technician still makes the count. The tray remembers it.</li>
        </ul>
      </div>
    </div>
  )
}

function Route({ titleId }: { titleId: string }) {
  return (
    <div className="print-2 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p className="font-mono text-[11px] tracking-[0.18em] text-[#9bb4e4] uppercase">Product</p>
        <h2 id={titleId} tabIndex={-1} className="mt-2 font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-tight outline-none">
          The address is already on the bag.
        </h2>
        <ol className="mt-5 grid gap-3">
          {[
            ["1", "Scan", "Read the label. Signature, refrigerated, and counseling stay with that stop."],
            ["2", "Optimize", "Build the round from the pharmacy, door to door, and back."],
            ["3", "Drive", "The driver leaves with the order of doors already set."],
          ].map(([n, title, body]) => (
            <li key={n} className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl bg-[#182232] px-4 py-3">
              <span className="font-mono text-[#9bb4e4]">{n}</span>
              <span>
                <span className="font-serif text-2xl">{title}</span>
                <span className="mt-1 block text-sm leading-snug text-[#c5ceda]">{body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <RouteMark />
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            ["Free", "$0", "/month"],
            ["Shift", "$12", "/month"],
            ["Year", "$96", "/year"],
          ].map(([name, price, period]) => (
            <div key={name} className={name === "Year" ? "rounded-2xl bg-[#f4efe6] px-2 py-3 text-[#172033]" : "rounded-2xl border border-white/10 px-2 py-3"}>
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase">{name}</p>
              <p className="mt-1 font-serif text-2xl leading-none">{price}</p>
              <p className="text-xs text-current/70">{period}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center font-mono text-[10px] tracking-[0.16em] text-[#9aa6b5] uppercase">Year is the plan most pharmacies keep</p>
      </div>
    </div>
  )
}

function Day({ titleId }: { titleId: string }) {
  const steps = [
    ["Bench", "Count on the tray. The display holds the number."],
    ["Reset", "Press red only when that count should start over."],
    ["Bag", "The finished prescription gets a labeled bag."],
    ["Scan", "The Route app reads the address on the bag."],
    ["Round", "Stops line up from the pharmacy and back."],
    ["Door", "The driver runs the short route, then returns the van."],
  ]
  return (
    <div>
      <h2 id={titleId} tabIndex={-1} className="font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-tight outline-none">
        From the bench to the door.
      </h2>
      <ol className="print-3 mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map(([title, body], step) => (
          <li key={title} className="rounded-3xl bg-[#f4efe6] p-4 text-[#172033]">
            <p className="font-mono text-[11px] tracking-[0.16em] text-[#1d4e9f] uppercase">0{step + 1}</p>
            <p className="mt-2 font-serif text-2xl">{title}</p>
            <p className="mt-2 text-sm leading-snug text-[#3d4a5e]">{body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Market({ titleId }: { titleId: string }) {
  const stats = [
    ["18,988", "Independent pharmacies in the U.S."],
    ["37%", "Share of U.S. retail pharmacies"],
    ["65,795", "Average prescriptions per store, 2025"],
    ["$103B", "Independent pharmacy marketplace, 2025"],
  ]
  return (
    <div>
      <h2 id={titleId} tabIndex={-1} className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-tight outline-none">
        18,988 independent pharmacies in the U.S.
      </h2>
      <div className="print-4 mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <article key={value} className="rounded-3xl border border-white/10 bg-[#182232] p-4">
            <p className="font-serif text-4xl tracking-tight text-[#f4efe6]">{value}</p>
            <p className="mt-2 text-sm leading-snug text-[#c5ceda]">{label}</p>
          </article>
        ))}
      </div>
      <p className="mt-5 max-w-3xl text-[#d5dbe4]">
        Those stores already count and already deliver. Trayroute sells a tray for the bench and a route app for the driver. The marketplace figure is pharmacy sales, not software spending.
      </p>
      <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-[#9aa6b5] uppercase">Source: NCPA 2026 Digest, sponsored by Cardinal Health</p>
    </div>
  )
}

function Reach({ titleId }: { titleId: string }) {
  const channels = [
    ["Email", "A note to the owner and the technician who counts."],
    ["Meta ads", "The tray and the route in front of pharmacy people."],
    ["Brochures", "A printed piece sent to each building."],
    ["Phone calls", "A call to the store, then a time to see the tray."],
    ["Door to door", "Walk in, set the tray on the bench, leave the route on the phone."],
  ]
  return (
    <div>
      <h2 id={titleId} tabIndex={-1} className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-tight outline-none">
        Reach each building.
      </h2>
      <ul className="print-5 mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {channels.map(([title, body], channel) => (
          <li key={title} className="rounded-3xl bg-[#f4efe6] p-4 text-[#172033]">
            <p className="font-mono text-[11px] tracking-[0.16em] text-[#1d4e9f] uppercase">0{channel + 1}</p>
            <p className="mt-2 font-serif text-2xl leading-none">{title}</p>
            <p className="mt-2 text-sm leading-snug text-[#3d4a5e]">{body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Years({ titleId }: { titleId: string }) {
  const years = [
    ["Year 1", "Manufacture", "Manufacture the tray and sell it to the first few hundred stores."],
    ["Year 2", "5,000 stores", "About 1 in 4 independents, or about 1 in 10 retail pharmacies."],
    ["Year 3", "Wider", "More retail stores, and more target areas."],
  ]
  return (
    <div>
      <h2 id={titleId} tabIndex={-1} className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-tight outline-none">
        A few hundred, then five thousand.
      </h2>
      <ol className="print-3 mt-6 grid gap-3 lg:grid-cols-3">
        {years.map(([year, title, body]) => (
          <li key={year} className="rounded-3xl border border-white/10 bg-[#182232] p-5">
            <p className="font-mono text-[11px] tracking-[0.16em] text-[#9bb4e4] uppercase">{year}</p>
            <p className="mt-2 font-serif text-3xl leading-none">{title}</p>
            <p className="mt-3 leading-snug text-[#d5dbe4]">{body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Model({ titleId }: { titleId: string }) {
  return (
    <div>
      <h2 id={titleId} tabIndex={-1} className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-tight outline-none">
        Hardware on the bench. Software on the road.
      </h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3">
          <article className="rounded-3xl bg-[#f4efe6] p-5 text-[#172033]">
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#5d6b80] uppercase">Counting tray</p>
            <p className="mt-2 text-lg leading-snug">Sold once, to the pharmacy. The reset button is part of the tool. It is not a meter.</p>
          </article>
          <article className="rounded-3xl bg-[#1d4e9f] p-5">
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#c5d6f5] uppercase">Route app</p>
            <p className="mt-2 text-lg leading-snug">Free at $0, Shift at $12 a month, Year at $96 a year. Year is the plan marked most used.</p>
          </article>
        </div>
        <aside className="rounded-3xl border border-dashed border-white/25 p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-[#e7c98a] uppercase">Illustration, not a result</p>
          <p className="mt-3 font-serif text-5xl leading-none">$2.25M</p>
          <p className="mt-3 leading-snug text-[#d5dbe4]">
            15,000 trays × $150 profit each. That is the profit if each tray leaves $150. It is not revenue, a price list, or a forecast.
          </p>
        </aside>
      </div>
    </div>
  )
}

function Path({ titleId }: { titleId: string }) {
  const rows = [
    ["Hand tray", "Cheap and familiar. The number lives in the technician’s head, and a lost count starts over."],
    ["Automatic counter", "Fast. The machine owns the count, so the person at the bench is no longer the check."],
    ["Generic route app", "The driver types every address. The bag already has the address printed on it."],
    ["Trayroute", "The tray keeps the running total. The Route app reads the bag and sets the doors."],
  ]
  return (
    <div>
      <h2 id={titleId} tabIndex={-1} className="font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] tracking-tight outline-none">
        The middle path.
      </h2>
      <ul className="mt-6 grid gap-3">
        {rows.map(([title, body], row) => (
          <li
            key={title}
            className={
              row === rows.length - 1
                ? "grid gap-1 rounded-3xl bg-[#f4efe6] px-5 py-4 text-[#172033] md:grid-cols-[12rem_1fr] md:items-center"
                : "grid gap-1 rounded-3xl border border-white/10 px-5 py-4 md:grid-cols-[12rem_1fr] md:items-center"
            }
          >
            <p className="font-serif text-2xl">{title}</p>
            <p className={row === rows.length - 1 ? "leading-snug" : "leading-snug text-[#d5dbe4]"}>{body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Close({ titleId }: { titleId: string }) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[11px] tracking-[0.22em] text-[#9bb4e4] uppercase">Trayroute</p>
      <h2 id={titleId} tabIndex={-1} className="mt-3 font-serif text-[clamp(3rem,7vw,5.6rem)] leading-[0.9] tracking-[-0.045em] outline-none">
        The tray counts. The route is the short one.
      </h2>
      <p className="mt-5 text-lg leading-snug text-[#d5dbe4]">
        Built for the people who fill and the people who drive. Pharmacy owners keep the count and the route in one company.
      </p>
    </div>
  )
}

function TrayMark() {
  return (
    <svg viewBox="0 0 420 280" role="img" aria-label="Blue counting tray with a display reading 0030 and a red reset button" className="w-full">
      <rect x="18" y="28" width="384" height="224" rx="28" fill="#1d4e9f" />
      <rect x="36" y="48" width="250" height="150" rx="16" fill="#2f6fe0" />
      <rect x="248" y="78" width="28" height="92" rx="8" fill="#d7ecff" opacity="0.9" />
      <rect x="300" y="56" width="82" height="54" rx="8" fill="#cfd6df" />
      <text x="341" y="92" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="22" fill="#1a1f27">
        0030
      </text>
      <circle cx="341" cy="136" r="14" fill="#d2342a" />
      <rect x="78" y="118" width="120" height="10" rx="5" fill="#0d2f78" />
      <g fill="#f7f4ee">
        <rect x="70" y="96" width="28" height="12" rx="6" />
        <rect x="104" y="108" width="28" height="12" rx="6" />
        <rect x="138" y="92" width="28" height="12" rx="6" />
        <rect x="168" y="112" width="28" height="12" rx="6" />
      </g>
      <text x="210" y="228" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fill="#f4efe6">
        Trayroute
      </text>
    </svg>
  )
}

function RouteMark() {
  return (
    <svg viewBox="0 0 360 220" role="img" aria-label="A delivery round from the pharmacy through six stops and back" className="w-full rounded-3xl bg-[#182232]">
      <path d="M70 150 L110 70 L190 96 L250 48 L300 110 L230 160 L140 176 Z" fill="none" stroke="#7ea2e8" strokeWidth="3" />
      {[
        [70, 150],
        [110, 70],
        [190, 96],
        [250, 48],
        [300, 110],
        [230, 160],
        [140, 176],
      ].map(([x, y], stop) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={stop === 0 ? 16 : 12} fill={stop === 0 ? "#f4efe6" : "#1d4e9f"} stroke="#f4efe6" />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fill={stop === 0 ? "#172033" : "#f4efe6"} fontFamily="ui-monospace, monospace">
            {stop === 0 ? "Rx" : stop}
          </text>
        </g>
      ))}
    </svg>
  )
}
