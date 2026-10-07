import type { Metadata } from "next"
import Link from "next/link"
import { RoutePlanner } from "@/components/route-planner"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Route",
  description:
    "Route scans the address on each pharmacy bag and builds an efficient delivery route.",
}

const steps = [
  {
    n: "1",
    title: "Scan the bags",
    body: "The address is printed on the bag. The scanner reads it, and signature, refrigerated, and counseling stay with that stop.",
    detail: "Bag label scan",
  },
  {
    n: "2",
    title: "Optimize the round",
    body: "One tap builds a reliable multi-stop route from the pharmacy, with the map drawn in seconds.",
    detail: "One-tap optimization",
  },
  {
    n: "3",
    title: "Drive",
    body: "Turn-by-turn voice directions stay in the app, so the driver watches the road and the next door.",
    detail: "In-app voice navigation",
  },
]

const notes = [
  {
    quote: "I scan the bags on the counter and the route is ready before I start the van.",
    role: "Delivery tech, independent pharmacy",
  },
  {
    quote: "Refrigerated stops stay marked, and I can lock the last door when a patient has to be home at a set time.",
    role: "Driver, regional pharmacy group",
  },
  {
    quote: "It is the route planner I hand a new courier. The stops, the order, and the way back to the store are all in one place.",
    role: "Pharmacy manager",
  },
]

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    featured: false,
    items: ["Scan addresses on the bags", "Rounds kept for 7 days", "Up to 10 stops", "Voice directions in the app"],
  },
  {
    name: "Shift",
    price: "$12",
    period: "/month",
    featured: false,
    items: ["7-day trial", "Unlimited stops", "Signature and cold-chain flags", "Voice directions in the app"],
  },
  {
    name: "Year",
    price: "$96",
    period: "/year",
    featured: true,
    items: ["7-day trial", "Unlimited stops", "Flags, voice, and a year of rounds", "Two months included"],
  },
]

export default function RouteProductPage() {
  return (
    <main>
      <section className="px-5 pt-12 pb-6 md:pt-16 lg:px-10 xl:px-16">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold text-[#0066ff]">Route</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight text-[#18181b]">
              The pharmacy route planner.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#636367]">
              Point it at the bags. Route reads the address on each label and builds the efficient route.
            </p>
          </div>
          <RoutePlanner />
        </div>
      </section>

      <section className="bg-[#f9f9fc] px-5 py-16 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-[#18181b]">
            The route planner is as direct as one, two, three.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.n} className="rounded-2xl border border-[#e5e5eb] bg-white p-5">
                <p className="text-sm font-semibold text-[#0066ff]">{step.n}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#18181b]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#636367]">{step.body}</p>
                <p className="mt-4 text-xs font-medium text-[#aeaeb3]">{step.detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-[#636367]">
            A pharmacy round changes. A patient calls, a refrigerator stop has to move up, a door does not answer. Route rebuilds the rest of the day from where the driver is standing, then points the van home.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#18181b]">Used on pharmacy rounds.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {notes.map((note) => (
              <figure key={note.role} className="rounded-2xl border border-[#e5e5eb] bg-white p-5">
                <blockquote className="leading-7 text-[#18181b]">“{note.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-[#636367]">{note.role}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f9f9fc] px-5 py-16 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#18181b]">Plans for a delivery shift.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={
                  plan.featured
                    ? "rounded-2xl border-2 border-[#0066ff] bg-white p-5 shadow-[0_12px_24px_rgb(0_102_255/0.18)]"
                    : "rounded-2xl border border-[#e5e5eb] bg-white p-5"
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#18181b]">{plan.name}</h3>
                  {plan.featured && (
                    <span className="rounded-full bg-[#e6f0ff] px-2 py-1 text-xs font-medium text-[#0066ff]">Most used</span>
                  )}
                </div>
                <p className="mt-4">
                  <span className="text-4xl font-semibold tracking-tight text-[#18181b]">{plan.price}</span>
                  <span className="text-[#636367]">{plan.period}</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[#636367]">
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pt-4 pb-16 lg:px-10 xl:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 rounded-2xl border border-[#e5e5eb] bg-[#f9f9fc] p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#18181b]">The tray is the other half of the company.</h2>
            <p className="mt-2 max-w-xl text-[#636367]">Count on the bench, then hand the bag to the route. Both products live under Trayroute.</p>
          </div>
          <Button asChild className="h-11 rounded-lg px-4">
            <Link href="/products/tray">See the counting tray</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
