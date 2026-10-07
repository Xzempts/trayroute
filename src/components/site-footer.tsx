import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ddd4c4] px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-2xl tracking-tight">Trayroute</p>
          <p className="mt-2 max-w-sm text-sm leading-snug text-[#5c564c]">
            Pharmacy technology for the bench and the road. The tray counts. The bags get scanned. The route delivers.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/products/tray" className="hover:text-[#1c1916]">
            Counting tray
          </Link>
          <Link href="/products/route" className="hover:text-[#1c1916]">
            Route
          </Link>
          <Link href="/#products" className="hover:text-[#1c1916]">
            Products
          </Link>
          <Link href="/deck" className="hover:text-[#1c1916]">
            Pitch deck
          </Link>
        </nav>
      </div>
    </footer>
  )
}
