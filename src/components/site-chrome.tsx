"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const deck = pathname === "/pitch" || pathname.startsWith("/pitch/")

  if (deck) return children

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  )
}
