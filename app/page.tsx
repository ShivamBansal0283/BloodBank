import Link from 'next/link';
export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">What is this?</h2>
        <p>Full-featured Blood Bank Management System built with Next.js + Prisma (PostgreSQL). Deploy-ready for Render.</p>
        <ul className="list-disc ml-6 mt-2 text-sm">
          <li>Appointments → Donations → Inventory (increase)</li>
          <li>Requests (fulfil/reject) → Inventory (decrease)</li>
          <li>Role-based: Admin, Hospital, Patient</li>
        </ul>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Quick start</h2>
        <ol className="list-decimal ml-6 text-sm space-y-1">
          <li>Set <code>DATABASE_URL</code> & <code>JWT_SECRET</code> in dashboard</li>
          <li>Run database migration and seed</li>
        </ol>
        <div className="mt-4">
          <Link className="btn btn-primary" href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
