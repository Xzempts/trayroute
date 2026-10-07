import Link from "next/link"
import { HeroStage } from "@/components/hero-stage"

const products = [
  {
    href: "/products/tray",
    kicker: "Bench",
    title: "Counting tray",
    body: "A blue pharmacy tray with a spatula, an acrylic tube, and a display. Tablets slide in five at a time. The red button resets the count.",
    action: "Watch the tray count",
  },
  {
    href: "/products/route",
    kicker: "Road",
    title: "Route",
    body: "Scan the address on each delivery bag. Route reads the label and builds the shorter round back to the pharmacy.",
    action: "Plan a round",
  },
]

const features = [
  ["Bench", "Techs count on the tray and keep the number on the display."],
  ["Road", "Drivers run the route the pharmacy built, stop by stop."],
  ["Store", "Owners keep the count and the delivery round in one company."],
]

const metrics = [
  ["18,988", "Independent pharmacies in the U.S."],
  ["37%", "Share of retail pharmacies"],
  ["65,795", "Average prescriptions per store"],
]

export default function Home() {
  return (
    <main className="bg-white">
      <HeroStage />

      <section className="px-5 pb-8 lg:px-10 xl:px-16">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-2xl border border-[#e5e5eb] bg-[#e5e5eb] sm:grid-cols-3">
          {metrics.map(([value, label]) => (
            <div key={value} className="bg-white px-6 py-6">
              <p className="text-3xl font-semibold tracking-tight text-[#18181b]">{value}</p>
              <p className="mt-1 text-sm text-[#636367]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="px-5 py-20 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold tracking-tight text-[#18181b]">Two products. One pharmacy.</h2>
          <p className="mt-2 max-w-2xl text-[#636367]">The tray holds the count. Route turns the bags into the short round.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <article key={product.href} className="flex flex-col rounded-2xl border border-[#e5e5eb] bg-white p-6 shadow-[0_12px_32px_rgb(0_102_255/0.06)]">
                <p className="text-sm font-semibold text-[#0066ff]">{product.kicker}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#18181b]">{product.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-[#636367]">{product.body}</p>
                <Link href={product.href} className="mt-6 text-sm font-semibold text-[#0066ff] hover:underline">
                  {product.action}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f9f9fc] px-5 py-20 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-[#18181b]">Built for the people who fill and the people who drive.</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {features.map(([title, body]) => (
              <article key={title} className="rounded-2xl border border-[#e5e5eb] bg-white p-5">
                <div className="grid size-10 place-items-center rounded-xl bg-[#0066ff]/10 text-sm font-semibold text-[#0066ff]">
                  {title.slice(0, 1)}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#18181b]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#636367]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
