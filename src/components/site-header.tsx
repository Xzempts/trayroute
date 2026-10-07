"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const links = [
  { href: "/#products", label: "Products" },
  { href: "/products/tray", label: "Counting tray" },
  { href: "/products/route", label: "Route" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-[60] border-b border-[#e5e5eb] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 lg:px-10 xl:px-16">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-[#18181b]">
          <span className="grid size-7 place-items-center rounded-lg bg-[#0066ff] text-sm text-white shadow-[0_6px_16px_rgb(0_102_255/0.28)]">T</span>
          Trayroute
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-[#636367]">
          {links.map((link) => {
            const active = link.href === pathname
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "text-[#18181b]" : "hover:text-[#18181b]"}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <Button asChild className="hidden h-10 rounded-lg px-3.5 sm:inline-flex">
          <Link href="/products/tray">Watch the tray</Link>
        </Button>
      </div>
    </header>
  )
}
