import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const PDF = "/trayroute-pitch.pdf"

export const metadata: Metadata = {
  title: "Pitch deck",
  description:
    "The Trayroute pitch deck. A smart pill counting tray keeps the running total on the bench. The Route app scans prescription bags and builds the short delivery round.",
}

export default function DeckPage() {
  return (
    <main className="px-5 pt-14 pb-20 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.22em] text-[#6b6358] uppercase">Pitch deck</p>
          <h1 className="mt-3 font-serif text-[clamp(3rem,6.5vw,5rem)] leading-[0.9] tracking-[-0.045em] text-[#1c1916]">
            The count and the route.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-snug text-[#3c342c]">
            The Trayroute pitch deck. The counting tray keeps the running total on the bench. The Route app scans
            prescription bags and builds the short delivery round. Read it below, or take the PDF with you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="h-10 bg-[#173f90] px-4 text-white hover:bg-[#173f90]/90">
              <a href={PDF} download="Trayroute-pitch-deck.pdf">
                Download PDF
              </a>
            </Button>
            <Button asChild variant="outline" className="h-10 px-4">
              <a href={PDF} target="_blank" rel="noopener noreferrer">
                Open in new tab
              </a>
            </Button>
            <Button asChild variant="outline" className="h-10 px-4">
              <Link href="/pitch">View as slides</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[20px] border border-[#ddd4c4] bg-[#f7f3ea] shadow-sm">
          <object
            data={PDF}
            type="application/pdf"
            aria-label="Trayroute pitch deck PDF"
            className="h-[85vh] min-h-[540px] w-full"
          >
            <iframe src={PDF} title="Trayroute pitch deck" className="h-[85vh] min-h-[540px] w-full" />
            <div className="p-10 text-center">
              <p className="text-lg text-[#3c342c]">This browser can’t show the PDF inline.</p>
              <p className="mt-3">
                <a
                  href={PDF}
                  download="Trayroute-pitch-deck.pdf"
                  className="underline decoration-[#c45e10] underline-offset-4 hover:text-[#1c1916]"
                >
                  Download the pitch deck
                </a>
              </p>
            </div>
          </object>
        </div>

        <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-[#8a8275] uppercase">
          Trayroute — pharmacy technology for the bench and the road
        </p>
      </div>
    </main>
  )
}
