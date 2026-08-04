"use client"

interface SidebarItem {
  id: string
  label: string
  icon: string
  href: string
}

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "ri-dashboard-line", href: "/procurement" },
  { id: "inbox", label: "Inbox", icon: "ri-inbox-archive-line", href: "/procurement/inbox" },
  { id: "reports", label: "Reports", icon: "ri-file-chart-line", href: "/procurement/reports" },
  { id: "rfps", label: "Request", icon: "ri-file-list-line", href: "/procurement/rfps" },
  {
    id: "purchase-orders",
    label: "Purchase\norders",
    icon: "ri-shopping-cart-line",
    href: "/procurement/purchase-orders",
  },
  { id: "cocs", label: "CoCs", icon: "ri-file-list-3-line", href: "/procurement/cocs" },
  { id: "vendor-directory", label: "Vendor\nDirectory", icon: "ri-folder-2-line", href: "/procurement/vendors" },
]

interface ProcSidebarProps {
  currentPage?: string
  onNavigate?: (page: string) => void
  onLogout?: () => void
}

export default function ProcSidebar({ currentPage = "dashboard", onNavigate, onLogout }: ProcSidebarProps) {
  return (
    <aside
      className="w-20 bg-green-700 text-white flex flex-col h-screen fixed left-0 top-0 z-50"
      style={{ backgroundColor: "#1B733D" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-center py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
          <img src="/images/design-mode/image.png" alt="KaarTech Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-4">
        <ul className="space-y-0">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate?.(item.id)}
                className="w-20 h-14 flex flex-col items-center justify-center gap-1 transition-all relative group"
                style={{
                  backgroundColor: currentPage === item.id ? "rgba(255,255,255,0.16)" : "transparent",
                  borderLeft: currentPage === item.id ? "3px solid #FFFFFF" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.id) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.16)"
                    e.currentTarget.style.borderLeft = "3px solid #FFFFFF"
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.id) {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.borderLeft = "3px solid transparent"
                  }
                }}
                aria-current={currentPage === item.id ? "page" : undefined}
              >
                <i className={`${item.icon} text-base`} style={{ width: "16px", height: "16px" }} />
                <span
                  className="text-center leading-tight text-white whitespace-pre-line"
                  style={{
                    fontSize: "10px",
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 500,
                    lineHeight: "1.2",
                  }}
                >
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section with notification and avatar */}
      <div className="border-t py-3 flex flex-col items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <button
          className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"
          }}
          aria-label="Notifications"
        >
          <i className="ri-notification-fill text-base text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "#DC2626" }} />
        </button>

        <button
          onClick={onLogout}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"
          }}
          aria-label="Logout and return to portal selection"
          title="Logout"
        >
          <i className="ri-logout-box-line text-base text-white" />
        </button>

        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color: "#1B733D" }}>
            MA
          </span>
        </div>
      </div>
    </aside>
  )
}
