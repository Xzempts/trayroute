import type { Metadata } from "next"
import { PitchDeck } from "@/components/pitch-deck"

export const metadata: Metadata = {
  title: { absolute: "Trayroute — The count and the route" },
  description:
    "Trayroute pitch deck. A smart pill counting tray keeps the running total on the bench. The Route app scans prescription bags and builds the short delivery round.",
}

export default function PitchPage() {
  return <PitchDeck />
}
