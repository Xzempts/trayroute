"use client"

import { useEffect, useLayoutEffect, useRef } from "react"

const STAGE_W = 1000
const STAGE_H = 680
const TABLETS = 30
const GROUP = 5
const SWEEPS = 6
const SWEEP_MS = 1650
const CAP_W = 34
const CAP_H = 16
const SPOUT = { x: -48, y: 530 }
const TABLET = "linear-gradient(180deg, #ffffff 0%, #f7f4ee 62%, #e4ddd0 100%)"

const FILL_SPOTS = [
  [6, 64, -12],
  [34, 58, 8],
  [62, 70, -4],
  [92, 60, 14],
  [122, 72, -10],
  [16, 36, 6],
  [46, 30, -16],
  [76, 40, 4],
  [108, 32, 11],
  [138, 42, -6],
  [28, 8, 9],
  [60, 4, -8],
  [92, 12, 3],
  [124, 6, -14],
] as const

type LayerName = "back" | "mid" | "front"

type Spill = {
  el: HTMLElement
  birth: number
  speed: number
  xOff: number
  side: number
  land: number
  phase: number
  wobble: number
  beside: boolean
  right: boolean
  layer: LayerName
  rot: number
  spin: number
  size: number
  height: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function smooth(t: number) {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

function fromPos(index: number) {
  const sweep = Math.floor(index / GROUP)
  const slot = index % GROUP
  const jx = ((index * 17) % 13) - 6
  const jy = ((index * 13) % 11) - 5
  const column = 2 - (sweep % 3)
  return {
    x: 200 + column * 130 + slot * 14 + jx,
    y: 52 + Math.floor(sweep / 3) * 176 + slot * 18 + jy,
    rot: ((index * 53) % 110) - 55,
  }
}

function toPos(sweep: number, slot: number) {
  const index = sweep * GROUP + slot
  return {
    x: -72,
    y: 14 + index * 13.5,
    rot: ((index % 3) - 1) * 3,
  }
}

function mouthPos(sweep: number, slot: number) {
  const from = fromPos(sweep * GROUP + slot)
  const to = toPos(sweep, slot)
  return {
    x: 18 + slot * 2,
    y: lerp(from.y, to.y, 0.7),
    rot: lerp(from.rot, 0, 0.7),
  }
}

function pillPose(index: number, sweepNow: number, u: number, done: boolean) {
  const s = Math.floor(index / GROUP)
  const slot = index % GROUP
  const from = fromPos(index)
  const to = toPos(s, slot)
  if (done || s < sweepNow) return to
  if (s > sweepNow) return from
  const push = smooth((u - 0.04) / 0.48)
  const enter = smooth((u - 0.5) / 0.26)
  const mouth = mouthPos(s, slot)
  if (enter > 0) {
    return {
      x: lerp(mouth.x, to.x, enter),
      y: lerp(mouth.y, to.y, enter),
      rot: lerp(mouth.rot, to.rot, enter),
    }
  }
  return {
    x: lerp(from.x, mouth.x, push),
    y: lerp(from.y, mouth.y, push),
    rot: lerp(from.rot, mouth.rot, push),
  }
}

function spatulaFor(sweep: number, u: number, done: boolean) {
  if (done) return { x: 500, y: 270, rot: 14 }
  const back = smooth((u - 0.8) / 0.18)
  const holdU = Math.min(u, 0.5)
  const leader = pillPose(sweep * GROUP + 4, sweep, holdU, false)
  let x = leader.x + CAP_W - 6
  let y = leader.y - 3
  let rot = lerp(10, 3, smooth(holdU / 0.5))
  if (back > 0 && sweep < SWEEPS - 1) {
    const next = fromPos((sweep + 1) * GROUP + 4)
    x = lerp(x, next.x + CAP_W - 6, back)
    y = lerp(y, next.y - 3, back)
    rot = lerp(rot, 10, back)
  }
  return { x, y, rot }
}

function pad(n: number) {
  return String(n).padStart(4, "0")
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeSpill(host: HTMLElement, layer: LayerName, count: number, rand: () => number) {
  const pills: Spill[] = []
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span")
    const height =
      layer === "front" ? 14 + rand() * 8 : layer === "mid" ? 11 + rand() * 6 : 8 + rand() * 4
    const width = height * 2.05
    el.className = "pill pill-capsule"
    el.style.width = `${width}px`
    el.style.height = `${height}px`
    el.style.background = TABLET
    el.style.opacity = "0"
    const gloss = document.createElement("span")
    gloss.className = "pill-gloss"
    el.appendChild(gloss)
    if (rand() > 0.28) {
      const score = document.createElement("span")
      score.className = "pill-score"
      el.appendChild(score)
    }
    host.appendChild(el)
    const beside = layer === "mid" && rand() < 0.22
    const right = rand() > 0.5
    pills.push({
      el,
      birth: 0.02 + rand() * 0.58,
      speed: layer === "front" ? 1.15 + rand() * 0.35 : layer === "mid" ? 0.72 + rand() * 0.4 : 0.38 + rand() * 0.22,
      xOff: (rand() - 0.5) * 26,
      side: beside ? (right ? 1 : -1) * (168 + rand() * 36) : (rand() - 0.5) * 14,
      land: beside ? 390 + rand() * 30 : rand() * 6,
      phase: rand() * Math.PI * 2,
      wobble: 10 + rand() * 26,
      beside,
      right,
      layer,
      rot: rand() * 180 - 90,
      spin: (rand() - 0.5) * 120,
      size: width,
      height,
    })
  }
  return pills
}

export function PillScene() {
  const rootRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const resetRef = useRef<() => void>(() => {})

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    if (!wrap || !stage) return
    const fit = () => {
      const scale = Math.min(1, wrap.clientWidth / STAGE_W)
      stage.style.transform = `scale(${scale})`
      wrap.style.height = `${STAGE_H * scale}px`
    }
    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const trayPills = Array.from(root.querySelectorAll<HTMLElement>("[data-tray-pill]"))
    const rig = root.querySelector<HTMLElement>("[data-rig]")
    const spatula = root.querySelector<HTMLElement>("[data-spatula]")
    const countEl = root.querySelector<HTMLElement>("[data-count]")
    const stateEl = root.querySelector<HTMLElement>("[data-count-state]")
    const liveEl = root.querySelector<HTMLElement>("[data-live]")
    const tubeMouth = root.querySelector<HTMLElement>("[data-tube-mouth]")
    const tubeStack = root.querySelector<HTMLElement>("[data-tube-stack]")
    const bottleMouth = root.querySelector<HTMLElement>("[data-bottle-mouth]")
    const bottleFill = root.querySelector<HTMLElement>("[data-bottle-fill]")
    const backHost = root.querySelector<HTMLElement>('[data-spill-layer="back"]')
    const midHost = root.querySelector<HTMLElement>('[data-spill-layer="mid"]')
    const frontHost = root.querySelector<HTMLElement>('[data-spill-layer="front"]')
    if (!spatula || !countEl || !stateEl || !liveEl || !tubeMouth || !bottleMouth || !bottleFill) return
    if (!backHost || !midHost || !frontHost) return

    const rand = mulberry32(1112)
    const spill = [
      ...makeSpill(backHost, "back", 16, rand),
      ...makeSpill(midHost, "mid", 28, rand),
      ...makeSpill(frontHost, "front", 12, rand),
    ]

    let raf = 0
    let lastShown = -1
    let started = performance.now()
    let userReset = false

    const placeTray = (now: number, progress: number) => {
      const elapsed = reduce ? (userReset ? 0 : SWEEPS * SWEEP_MS) : now - started
      const done = elapsed >= SWEEPS * SWEEP_MS
      const sweep = done ? SWEEPS - 1 : Math.floor(elapsed / SWEEP_MS)
      const u = done ? 1 : (elapsed % SWEEP_MS) / SWEEP_MS
      const shown = done ? TABLETS : sweep * GROUP + (u > 0.7 ? GROUP : 0)
      const tip = reduce ? 0 : smooth(clamp(progress / 0.12, 0, 1))
      const pour = tip

      if (shown !== lastShown) {
        const previous = lastShown
        lastShown = shown
        countEl.textContent = pad(shown)
        stateEl.textContent = shown >= TABLETS ? "COUNTED" : "COUNTING"
        if (!reduce && (shown > 0 || previous > 0)) {
          liveEl.textContent = shown === 0 ? "Count reset. 0 tablets" : `${shown} tablets`
          countEl.classList.remove("count-pop")
          void countEl.offsetWidth
          countEl.classList.add("count-pop")
        } else if (reduce && !userReset) {
          liveEl.textContent = "30 tablets"
        } else if (reduce && userReset) {
          liveEl.textContent = "Count reset. 0 tablets"
        }
      }

      for (let i = 0; i < trayPills.length; i++) {
        const node = trayPills[i]
        const s = Math.floor(i / GROUP)
        const pose = pillPose(i, sweep, u, done)
        let x = pose.x
        let y = pose.y
        let rot = pose.rot
        let opacity = 1
        const counted = done || s < sweep || (s === sweep && u > 0.7)
        if (counted && pour > 0) {
          x = lerp(x, SPOUT.x, pour)
          y = lerp(y, SPOUT.y, pour)
          opacity = 1 - pour
        }
        node.style.opacity = String(opacity)
        node.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`
      }

      const blade = spatulaFor(sweep, u, done)
      spatula.style.opacity = "1"
      spatula.style.transform = `translate3d(${blade.x}px, ${blade.y}px, 0) rotate(${blade.rot}deg)`
      if (rig) rig.style.transform = `rotate(${-tip * 32}deg)`

      if (tubeStack) {
        tubeStack.style.transform = `translateY(${tip * 120}px)`
        tubeStack.style.opacity = "0"
      }
    }

    const placeSpill = (progress: number) => {
      if (reduce) return
      const tube = tubeMouth.getBoundingClientRect()
      const bottle = bottleMouth.getBoundingClientRect()
      if (tube.width < 2 || bottle.width < 2) return
      const scrollX = window.scrollX
      const scrollY = window.scrollY
      const viewW = window.innerWidth
      const tubeX = tube.left + scrollX + tube.width / 2
      const tubeY = tube.top + scrollY + tube.height / 2
      const bottleX = bottle.left + scrollX + bottle.width / 2
      const bottleY = bottle.top + scrollY + bottle.height / 2

      for (const pill of spill) {
        if (progress < pill.birth) {
          pill.el.style.opacity = "0"
          continue
        }
        const span = Math.max(0.08, 1 - pill.birth)
        const life = clamp((progress - pill.birth) / span, 0, 1)
        const gamma = 1.48 - pill.speed * 0.52
        const fall = Math.pow(life, gamma)
        let docX = tubeX + pill.xOff
        let docY = lerp(tubeY, bottleY + pill.land, fall)
        if (pill.layer === "front") {
          const gutter = scrollX + (pill.right ? viewW * 0.935 : viewW * 0.04)
          docX = lerp(tubeX + pill.xOff, gutter, smooth(clamp(fall / 0.16, 0, 1)))
          docX += Math.sin(life * 5 + pill.phase) * 8
          docY = lerp(tubeY, bottleY + 280, fall)
        } else if (fall < 0.16) {
          docX = tubeX + pill.xOff * (1 + (fall / 0.16) * 2.4)
        } else if (fall < 0.64) {
          const t = smooth((fall - 0.16) / 0.48)
          const lane = scrollX + (pill.right ? viewW * 0.8 : viewW * 0.16)
          docX = lerp(tubeX + pill.xOff * 3.4, lane, t)
        } else {
          const t = smooth((fall - 0.64) / 0.36)
          const lane = scrollX + (pill.right ? viewW * 0.8 : viewW * 0.16)
          docX = lerp(lane, bottleX + pill.side, t)
        }
        if (pill.layer !== "front") {
          docX += Math.sin(life * 4.5 + pill.phase) * pill.wobble * (1 - fall)
          docY += Math.cos(life * 3 + pill.phase) * 8 * (1 - fall)
        }
        let opacity = life < 0.02 ? life / 0.02 : 1
        if (pill.layer === "back") opacity *= 0.55
        if (!pill.beside && fall > 0.92) opacity *= clamp(1 - (fall - 0.92) / 0.08, 0, 1)
        const rot = pill.rot + pill.spin * life
        pill.el.style.opacity = String(clamp(opacity, 0, 1))
        pill.el.style.transform = `translate3d(${docX - scrollX - pill.size / 2}px, ${docY - scrollY - pill.height / 2}px, 0) rotate(${rot}deg)`
      }

      const fill = clamp((progress - 0.58) / 0.42, 0, 1)
      bottleFill.style.opacity = String(fill)
      bottleFill.style.transform = `translateY(${(1 - fill) * 42}px)`
    }

    const frame = (now: number) => {
      const max = Math.max(1, root.offsetHeight - window.innerHeight)
      const progress = clamp(window.scrollY / max, 0, 1)
      root.dataset.progress = progress.toFixed(3)
      placeTray(now, progress)
      placeSpill(progress)
      if (!reduce) raf = requestAnimationFrame(frame)
    }

    const resetCount = () => {
      started = performance.now()
      userReset = true
      const max = Math.max(1, root.offsetHeight - window.innerHeight)
      const progress = clamp(window.scrollY / max, 0, 1)
      placeTray(performance.now(), progress)
    }
    resetRef.current = resetCount

    if (reduce) {
      placeTray(started + SWEEPS * SWEEP_MS, 1)
      bottleFill.style.opacity = "1"
      bottleFill.style.transform = "none"
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      resetRef.current = () => {}
      cancelAnimationFrame(raf)
      backHost.replaceChildren()
      midHost.replaceChildren()
      frontHost.replaceChildren()
    }
  }, [])

  return (
    <div ref={rootRef} className="relative">
      <div data-spill-layer="back" className="spill-layer pointer-events-none fixed inset-0 z-[3]" />
      <div data-spill-layer="mid" className="spill-layer pointer-events-none fixed inset-0 z-[12]" />
      <div data-spill-layer="front" className="spill-layer spill-front pointer-events-none fixed inset-0 z-40" />
      <p data-live className="sr-only" aria-live="polite" />

      <main>
        <section className="px-5 pt-6 pb-2 md:px-8 md:pt-8">
          <div className="prose-wash relative z-30 mx-auto max-w-3xl">
            <p className="text-sm font-semibold text-[#0066ff]">Pharmacy counting tray</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight text-[#18181b]">
              The tray counts.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-[#636367]">
              Thirty tablets sit on the blue tray. The spatula slides them into the acrylic tube, five at a time, and the display holds the number.
            </p>
            <p className="mt-3 max-w-xl text-lg leading-8 text-[#636367]">
              The red button resets the count. Scroll, and the tray tips them out.
            </p>
          </div>

          <div ref={wrapRef} className="relative mx-auto mt-3 w-full max-w-[1000px]" style={{ height: STAGE_H }}>
            <div
              ref={stageRef}
              className="absolute top-0 left-0 origin-top-left"
              style={{ width: STAGE_W, height: STAGE_H }}
            >
              <div
                className="pointer-events-none absolute top-[72%] left-[10%] h-14 w-[78%] rounded-full bg-[#0a2a6e]/15 blur-2xl"
                aria-hidden
              />
              <div data-rig className="tray-rig absolute top-0 left-0" style={{ width: STAGE_W, height: 640 }}>
                <div className="counter-head absolute" style={{ left: 372, top: 0, width: 248, height: 118 }}>
                  <div className="counter-screen relative mx-auto mt-3.5 h-[52px] w-[196px]">
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-[40px] leading-none tracking-[0.14em] text-[#c5c8cc] tabular-nums">
                      8888
                    </span>
                    <span
                      data-count
                      className="counter-digits absolute inset-0 flex items-center justify-center font-mono text-[40px] leading-none tracking-[0.14em] tabular-nums"
                    >
                      0000
                    </span>
                  </div>
                  <button
                    type="button"
                    className="counter-btn mx-auto mt-2 h-8 w-8"
                    aria-label="Reset count"
                    onClick={() => resetRef.current()}
                  />
                  <span data-count-state className="sr-only">
                    COUNTING
                  </span>
                </div>

                <div className="blue-tray absolute" style={{ left: 36, top: 102, width: 880, height: 470 }}>
                  <div className="clear-channel absolute" style={{ left: 6, top: 12, width: 112, height: 452 }}>
                    <span className="channel-hinge top-10" />
                    <span className="channel-hinge bottom-24" />
                  </div>
                  <div className="clear-spout absolute" style={{ right: -18, top: 10, width: 108, height: 78 }} />
                  <div data-floor className="blue-floor absolute" style={{ left: 112, top: 16, width: 742, height: 438 }}>
                    {Array.from({ length: TABLETS }, (_, i) => {
                      const at = fromPos(i)
                      return (
                        <span
                          key={i}
                          data-tray-pill={i}
                          className="pill pill-capsule"
                          style={{
                            width: CAP_W,
                            height: CAP_H,
                            background: TABLET,
                            transform: `translate3d(${at.x}px, ${at.y}px, 0) rotate(${at.rot}deg)`,
                          }}
                        >
                          <span className="pill-gloss" />
                        </span>
                      )
                    })}
                    <div
                      data-spatula
                      className="blue-spatula"
                      style={{
                        transform: `translate3d(${spatulaFor(0, 0, false).x}px, ${spatulaFor(0, 0, false).y}px, 0) rotate(${spatulaFor(0, 0, false).rot}deg)`,
                      }}
                    />
                  </div>
                  <div className="channel-glass absolute" style={{ left: 6, top: 12, width: 112, height: 452 }} />
                </div>

                <div className="pour-tube clear-tube absolute" style={{ left: 58, top: 522, width: 70, height: 124 }}>
                  <div data-tube-stack className="absolute inset-x-0 top-3 flex flex-col items-center gap-1 opacity-0">
                    {Array.from({ length: 6 }, (_, i) => (
                      <span
                        key={i}
                        className="pill pill-capsule"
                        style={{ width: 26, height: 12, background: TABLET, transform: "rotate(78deg)" }}
                      >
                        <span className="pill-gloss" />
                      </span>
                    ))}
                  </div>
                  <div className="tube-lip" />
                  <div data-tube-mouth className="absolute bottom-1 left-1/2 h-2.5 w-7 -translate-x-1/2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[78vh] items-center px-5">
          <div className="prose-wash relative z-30 mx-auto max-w-xl px-2 py-2">
            <h2 className="text-4xl font-semibold tracking-tight text-[#18181b] md:text-5xl">
              The tray tips.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-snug text-[#3c342c]">
              The whole tray bends over the tube. The tablets lined up in the acrylic channel leave together and start the fall.
            </p>
            <p className="mt-3 max-w-md text-lg leading-snug text-[#3c342c]">
              You watched them go in. The same thirty come out, and the display still shows the count.
            </p>
          </div>
        </section>

        <section className="flex min-h-[88vh] items-end px-5 pb-16 md:items-center md:pb-0">
          <div className="prose-wash relative z-30 mx-auto max-w-xl px-2 py-2">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#6b6358] uppercase">On the bench</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#18181b] md:text-5xl">
              Five at a time.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-snug text-[#3c342c]">
              The spatula does the sliding. Each sweep pushes a group left, into the tube, and the counter steps with it.
            </p>
            <p className="mt-3 max-w-md text-lg leading-snug text-[#3c342c]">
              It is the tray from the bench, with a number you can match to the script before the pour.
            </p>
          </div>
        </section>

        <section className="flex min-h-[72vh] items-center px-5">
          <div className="prose-wash relative z-30 mx-auto max-w-xl px-2 py-2">
            <h2 className="text-4xl font-semibold tracking-tight text-[#18181b] md:text-5xl">
              All the way down.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-snug text-[#3c342c]">
              Each tablet takes its own path. Some run ahead, some follow, and the length of the page is the fall.
            </p>
            <p className="mt-3 max-w-md text-lg leading-snug text-[#3c342c]">
              Stay with them. The orange bottle is waiting at the bottom.
            </p>
          </div>
        </section>

        <section className="flex min-h-[70vh] items-center px-5">
          <div className="prose-wash relative z-30 mx-auto max-w-xl px-2 py-2">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#6b6358] uppercase">Before the label</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[#18181b] md:text-5xl">
              Check the number.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-snug text-[#3c342c]">
              When the display matches the script, the pour is ready. The red button clears the tray, and the spatula begins the count again.
            </p>
            <p className="mt-3 max-w-md text-lg leading-snug text-[#3c342c]">
              A double-check stays on the same tray, with the total still in front of you.
            </p>
          </div>
        </section>

        <section className="flex min-h-[100svh] flex-col items-center justify-center px-5 pt-10 pb-20">
          <div className="prose-wash relative z-30 mb-12 max-w-xl px-2 py-2 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-[#18181b] md:text-5xl">
              Into the bottle.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-snug text-[#3c342c]">
              An ordinary amber vial, white cap, the bottle that leaves with the patient. Thirty tablets, counted on the tray, poured from the tube.
            </p>
          </div>
          <div className="relative z-30">
            <div
              className="absolute -bottom-3 left-1/2 h-7 w-[78%] -translate-x-1/2 rounded-full bg-[#6a3410]/20 blur-md"
              aria-hidden
            />
            <div className="rx">
              <div className="rx-cap" />
              <div className="rx-neck">
                <div data-bottle-mouth className="absolute top-1/2 left-1/2 h-3 w-14 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="rx-body">
                <div className="rx-sheen" aria-hidden />
                <div data-bottle-fill className="rx-fill" aria-hidden>
                  {FILL_SPOTS.map(([x, y, rot], i) => (
                    <span
                      key={i}
                      className="pill pill-capsule absolute"
                      style={{
                        left: x,
                        top: y,
                        width: 30,
                        height: 14,
                        background: TABLET,
                        transform: `rotate(${rot + 40}deg)`,
                      }}
                    >
                      <span className="pill-gloss" />
                    </span>
                  ))}
                </div>
                <div className="rx-label">
                  <p className="font-serif text-[11px] tracking-[0.28em] text-[#8a5a32]">Rx</p>
                  <p className="mt-1 font-serif text-2xl leading-none tracking-tight text-[#1c1916]">Trayroute</p>
                  <p className="mt-1 font-serif text-5xl leading-none tracking-[-0.04em] text-[#c45e10]">30</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.22em] text-[#6b6358]">TABLETS</p>
                </div>
              </div>
            </div>
          </div>
          <p className="prose-wash relative z-30 mt-10 px-4 py-2 text-center text-2xl font-semibold tracking-tight text-[#18181b]">
            The tray counts.
          </p>
        </section>
      </main>
    </div>
  )
}
