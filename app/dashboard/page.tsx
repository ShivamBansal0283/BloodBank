'use client'
import useSWR from 'swr'
import Tabs from '@/components/Tabs'

const fetcher = (url:string)=> fetch(url).then(r=>r.json())

export default function Dashboard() {
  const { data } = useSWR('/api/summary', fetcher)
  return (
    <div className="grid gap-6 mt-2">
      <Tabs />
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-slate-600">Total Units</div>
          <div className="text-3xl font-semibold">{data?.totalUnits ?? '-'}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-600">Appointments (pending)</div>
          <div className="text-3xl font-semibold">{data?.pendingAppointments ?? '-'}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-600">Requests (pending)</div>
          <div className="text-3xl font-semibold">{data?.pendingRequests ?? '-'}</div>
        </div>
      </div>
    </div>
  )
}
