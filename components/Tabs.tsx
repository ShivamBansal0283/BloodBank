'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
export default function Tabs(){
  const pathname = usePathname()
  const tabs = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/inventory', label: 'Inventory' },
    { href: '/dashboard/appointments', label: 'Appointments' },
    { href: '/dashboard/donations', label: 'Donations' },
    { href: '/dashboard/requests', label: 'Requests' },
    { href: '/dashboard/users', label: 'Users' },
  ]
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {tabs.map(t => (
        <Link key={t.href} href={t.href} className={`btn ${pathname===t.href ? 'btn-primary' : ''}`}>{t.label}</Link>
      ))}
    </div>
  )
}
