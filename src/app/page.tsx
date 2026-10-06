import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main>
      <section className="px-5 pt-14 pb-8 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#6b6358] uppercase">Pharmacy technology</p>
          <h1 className="mt-3 font-serif text-[clamp(3.2rem,7vw,5.8rem)] leading-[0.9] tracking-[-0.045em] text-[#1c1916]">
            The count and the route.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-snug text-[#3c342c]">
            Trayroute is a pharmacy technology company. The counting tray keeps the number on the bench. Route scans the bag and carries the prescriptions to the door.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="h-10 bg-[#173f90] px-4 text-white hover:bg-[#173f90]/90">
              <Link href="/#products">See the products</Link>
            </Button>
            <Button asChild variant="outline" className="h-10 px-4">
              <Link href="/products/route">Open Route</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="px-5 py-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <article className="flex flex-col rounded-[28px] border border-[#ddd4c4] bg-[#f7f3ea] p-6 md:p-8">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#6b6358] uppercase">Product</p>
            <h2 className="mt-3 font-serif text-4xl leading-[0.95] tracking-tight">Counting tray</h2>
            <p className="mt-4 text-lg leading-snug text-[#3c342c]">
              A blue pharmacy tray with a spatula, an acrylic tube, and a display. Tablets slide in five at a time. The red button resets the count. Scroll, and the tray tips them into the bottle.
            </p>
            <p className="mt-3 text-[#5c564c]">For the tech at the bench who should not have to start a count over.</p>
            <Button asChild className="mt-6 h-10 w-fit bg-[#0d4cb5] px-4 text-white hover:bg-[#0d4cb5]/90">
              <Link href="/products/tray">Watch the tray count</Link>
            </Button>
          </article>
          <article className="flex flex-col rounded-[28px] border border-[#ddd4c4] bg-[#173f90] p-6 text-[#f7f3ea] md:p-8">
            <p className="font-mono text-[11px] tracking-[0.22em] text-[#c5d4f5] uppercase">Product</p>
            <h2 className="mt-3 font-serif text-4xl leading-[0.95] tracking-tight">Route</h2>
            <p className="mt-4 text-lg leading-snug text-[#e7eefc]">
              Scan the address on each delivery bag. Route reads the label and builds the efficient round.
            </p>
            <p className="mt-3 text-[#c5d4f5]">For the driver who should scan the bags and leave with the short route.</p>
            <Button asChild className="mt-6 h-10 w-fit bg-[#f7f3ea] px-4 text-[#173f90] hover:bg-white">
              <Link href="/products/route">Plan a round</Link>
            </Button>
          </article>
        </div>
      </section>

      <section className="px-5 py-8 pb-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <h2 className="font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] tracking-tight">Built for the people who fill and the people who drive.</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Bench", "Techs count on the tray and keep the number on the display."],
              ["Road", "Drivers run the route the pharmacy built, stop by stop."],
              ["Store", "Owners keep the count and the delivery round in one company."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl bg-[#f7f3ea] p-4">
                <p className="font-serif text-2xl">{title}</p>
                <p className="mt-2 text-sm leading-snug text-[#3c342c]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
