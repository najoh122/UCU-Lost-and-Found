import { useState, useEffect } from "react";

function Admin() {
  const [reports, setReports] = useState([]);

  // 1. Fetch all reports when page opens
  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.log(err));
  }, []);

  // 2. Delete a report
  const deleteReport = (id) => {
    fetch(`http://localhost:5000/api/reports/${id}`, { method: "DELETE" })
      .then(() => setReports(reports.filter(r => r._id !== id)));
  };

  return (
    <div>
      <section>
        <h2>All Reports</h2>
        {reports.map(r => (
          <div key={r._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <b>{r.name}</b> - Found at {r.location} - {r.status}
            <br />
            <button onClick={() => deleteReport(r._id)}>Delete</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Admin;ss