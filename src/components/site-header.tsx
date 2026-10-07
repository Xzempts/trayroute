"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/#products", label: "Products" },
  { href: "/products/tray", label: "Counting tray" },
  { href: "/products/route", label: "Route" },
  { href: "/deck", label: "Pitch deck" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-[60] border-b border-[#ddd4c4]/80 bg-[#e4e1da]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/" className="font-serif text-[1.65rem] leading-none tracking-tight text-[#1c1916]">
          Trayroute
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#3c342c]">
          {links.map((link) => {
            const active = link.href === pathname
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "text-[#1c1916] underline decoration-[#c45e10] underline-offset-4" : "hover:text-[#1c1916]"}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
