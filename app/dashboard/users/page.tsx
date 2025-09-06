'use client'
import useSWR from 'swr'
import Tabs from '@/components/Tabs'
import { useState } from 'react'

const fetcher = (u:string)=> fetch(u).then(r=>r.json())

export default function UsersPage(){
  const { data, mutate } = useSWR('/api/users', fetcher)
  const [form, setForm] = useState({ email:'', name:'', role:'PATIENT', password:'' })
  async function createUser(e:any){ e.preventDefault(); await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({ email:'', name:'', role:'PATIENT', password:'' }); mutate(); }
  return (
    <div className="grid gap-4">
      <Tabs/>
      <div className="card">
        <h2 className="font-semibold mb-2">New User</h2>
        <form onSubmit={createUser} className="grid md:grid-cols-5 gap-2">
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <select className="select" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            {['ADMIN','HOSPITAL','PATIENT'].map(r=> <option key={r} value={r}>{r}</option>)}
          </select>
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
          <button className="btn btn-primary">Create</button>
        </form>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Users</h2>
        <table className="table">
          <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Created</th></tr></thead>
          <tbody>
            {(data?.items||[]).map((x:any)=>(
              <tr key={x.id}>
                <td>{x.email}</td>
                <td>{x.name}</td>
                <td>{x.role}</td>
                <td>{new Date(x.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
