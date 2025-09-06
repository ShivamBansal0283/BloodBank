'use client'
import useSWR from 'swr'
import Tabs from '@/components/Tabs'
import { useState } from 'react'

const fetcher = (u:string)=> fetch(u).then(r=>r.json())

export default function InventoryPage(){
  const { data, mutate } = useSWR('/api/inventory', fetcher)
  const [bloodGroup, setBloodGroup] = useState('O_POS')
  const [units, setUnits] = useState(1)
  async function addUnits(e:any){
    e.preventDefault()
    await fetch('/api/inventory', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ bloodGroup, units }) })
    mutate()
  }
  return (
    <div className="grid gap-4">
      <Tabs/>
      <div className="card">
        <h2 className="font-semibold mb-2">Inventory</h2>
        <table className="table">
          <thead><tr><th>Group</th><th>Units</th></tr></thead>
          <tbody>{(data?.items||[]).map((x:any)=>(<tr key={x.id}><td>{x.bloodGroup}</td><td>{x.units}</td></tr>))}</tbody>
        </table>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Add Units</h3>
        <form onSubmit={addUnits} className="grid md:grid-cols-3 gap-2">
          <select className="select" value={bloodGroup} onChange={(e)=>setBloodGroup(e.target.value)}>
            {['A_POS','A_NEG','B_POS','B_NEG','AB_POS','AB_NEG','O_POS','O_NEG'].map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
          <input className="input" type="number" min={1} value={units} onChange={e=>setUnits(Number(e.target.value))}/>
          <button className="btn btn-primary">Add</button>
        </form>
      </div>
    </div>
  )
}
