import Link from "next/link"

const columns = [
  {
    title: "Products",
    links: [
      ["/products/tray", "Counting tray"],
      ["/products/route", "Route"],
      ["/#products", "All products"],
    ],
  },
  {
    title: "Company",
    links: [
      ["/pitch", "Pitch deck"],
      ["/trayroute-pitch.pdf", "Download the deck"],
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e5e5eb] bg-[#f9f9fc] px-5 py-14 lg:px-10 xl:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold tracking-tight text-[#18181b]">Trayroute</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[#636367]">
            Pharmacy technology for the bench and the road. The tray counts. The bags get scanned. The route delivers.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title}>
            <p className="text-sm font-semibold text-[#18181b]">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#636367] hover:text-[#18181b]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  )
}
