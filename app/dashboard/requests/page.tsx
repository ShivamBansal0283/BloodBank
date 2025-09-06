'use client'
import useSWR from 'swr'
import Tabs from '@/components/Tabs'
import { useState } from 'react'

const fetcher = (u:string)=> fetch(u).then(r=>r.json())

export default function RequestsPage(){
  const { data, mutate } = useSWR('/api/requests', fetcher)
  const [form, setForm] = useState({ requester:'', hospital:'', bloodGroup:'O_POS', units:1 })
  async function createReq(e:any){ e.preventDefault(); await fetch('/api/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); mutate(); }
  async function fulfil(id:string){ await fetch('/api/requests',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({ id, action:'FULFIL' })}); mutate(); }
  async function reject(id:string){ await fetch('/api/requests',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({ id, action:'REJECT' })}); mutate(); }
  return (
    <div className="grid gap-4">
      <Tabs/>
      <div className="card">
        <h2 className="font-semibold mb-2">New Request</h2>
        <form onSubmit={createReq} className="grid md:grid-cols-4 gap-2">
          <input className="input" placeholder="Requester" value={form.requester} onChange={e=>setForm({...form, requester:e.target.value})}/>
          <input className="input" placeholder="Hospital" value={form.hospital} onChange={e=>setForm({...form, hospital:e.target.value})}/>
          <select className="select" value={form.bloodGroup} onChange={e=>setForm({...form, bloodGroup:e.target.value})}>
            {['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'].map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
          <input className="input" type="number" min={1} value={form.units} onChange={e=>setForm({...form, units:Number(e.target.value)})}/>
          <button className="btn btn-primary">Create</button>
        </form>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Requests</h2>
        <table className="table">
          <thead><tr><th>Requester</th><th>Hospital</th><th>Group</th><th>Units</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {(data?.items||[]).map((x:any)=>(
              <tr key={x.id}>
                <td>{x.requester}</td>
                <td>{x.hospital}</td>
                <td>{x.bloodGroup}</td>
                <td>{x.units}</td>
                <td>
                  {x.status === 'PENDING' && <span className="badge badge-yellow">PENDING</span>}
                  {x.status === 'FULFILLED' && <span className="badge badge-green">FULFILLED</span>}
                  {x.status === 'REJECTED' && <span className="badge badge-red">REJECTED</span>}
                </td>
                <td className="space-x-2">
                  <button disabled={x.status!=='PENDING'} className="btn btn-primary" onClick={()=>fulfil(x.id)}>Fulfil</button>
                  <button disabled={x.status!=='PENDING'} className="btn btn-danger" onClick={()=>reject(x.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
