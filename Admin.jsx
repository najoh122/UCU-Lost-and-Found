import './App.css'
function Admin() {
  return (
    <div className="container">
      <h1 className="fade-in">👮 Admin Dashboard - UCU</h1>
      <p className="fade-in">Approve claims, manage reports, help students get their things back.</p>
      <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" alt="Students" className="hero-img float" />
      <section className="cards">
        <div className="card slide-up"><img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" alt="Reports" /><h3>Total Reports</h3><h1>24</h1><p>🎒 Lost & Found</p></div>
        <div className="card slide-up"><img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400" alt="Pending" /><h3>Pending Claims</h3><h1>5</h1><p>⏳ Waiting Approval</p></div>
        <div className="card slide-up"><img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" alt="Returned" /><h3>Returned</h3><h1>19</h1><p>✅ Happy Students</p></div>
      </section>
      <br />
      <button className="btn-primary bounce">Approve All Claims</button>
      <button className="btn-secondary">View All Reports</button>
    </div>
  )
}
export default Admin