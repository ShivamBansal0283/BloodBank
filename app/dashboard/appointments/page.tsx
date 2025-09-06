'use client'
import useSWR from 'swr'
import Tabs from '@/components/Tabs'
import { useState } from 'react'

const fetcher = (u:string)=> fetch(u).then(r=>r.json())

export default function AppointmentsPage(){
  const { data, mutate } = useSWR('/api/appointments', fetcher)
  const [form, setForm] = useState({ donorName:'', donorEmail:'', bloodGroup:'O_POS', units:1, scheduledAt:'' })
  async function createAppt(e:any){ e.preventDefault(); await fetch('/api/appointments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); mutate(); }
  async function complete(id:string){
    await fetch('/api/donations',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ appointmentId: id }) });
    await fetch('/api/appointments',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status: 'COMPLETED' }) });
    mutate();
  }
  async function cancel(id:string){ await fetch('/api/appointments',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status: 'CANCELLED' }) }); mutate(); }
  return (
    <div className="grid gap-4">
      <Tabs/>
      <div className="card">
        <h2 className="font-semibold mb-2">New Appointment</h2>
        <form onSubmit={createAppt} className="grid md:grid-cols-5 gap-2">
          <input className="input" placeholder="Donor name" value={form.donorName} onChange={e=>setForm({...form, donorName:e.target.value})}/>
          <input className="input" placeholder="Donor email" value={form.donorEmail} onChange={e=>setForm({...form, donorEmail:e.target.value})}/>
          <select className="select" value={form.bloodGroup} onChange={e=>setForm({...form, bloodGroup:e.target.value})}>
            {['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'].map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
          <input className="input" type="number" min={1} value={form.units} onChange={e=>setForm({...form, units:Number(e.target.value)})}/>
          <input className="input" type="datetime-local" value={form.scheduledAt} onChange={e=>setForm({...form, scheduledAt:e.target.value})}/>
          <button className="btn btn-primary">Create</button>
        </form>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Appointments</h2>
        <table className="table">
          <thead><tr><th>Donor</th><th>Email</th><th>Group</th><th>Units</th><th>Scheduled</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {(data?.items||[]).map((x:any)=>(
              <tr key={x.id}>
                <td>{x.donorName}</td>
                <td>{x.donorEmail}</td>
                <td>{x.bloodGroup}</td>
                <td>{x.units}</td>
                <td>{new Date(x.scheduledAt).toLocaleString()}</td>
                <td>
                  {x.status === 'PENDING' && <span className="badge badge-yellow">PENDING</span>}
                  {x.status === 'COMPLETED' && <span className="badge badge-green">COMPLETED</span>}
                  {x.status === 'CANCELLED' && <span className="badge badge-red">CANCELLED</span>}
                </td>
                <td className="space-x-2">
                  <button disabled={x.status!=='PENDING'} className="btn btn-primary" onClick={()=>complete(x.id)}>Receive</button>
                  <button disabled={x.status!=='PENDING'} className="btn" onClick={()=>cancel(x.id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
