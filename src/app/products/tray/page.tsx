import type { Metadata } from "next"
import { PillScene } from "@/components/pill-scene"

export const metadata: Metadata = {
  title: "Counting tray",
  description:
    "Trayroute's pharmacy counting tray. The spatula slides tablets into the acrylic tube, the display keeps the number, and the tray tips them into an orange bottle.",
}

export default function TrayProductPage() {
  return <PillScene />
}
