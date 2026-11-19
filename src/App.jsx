import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import ReportForm from './pages/ReportForm.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import MyActivity from './pages/MyActivity.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Navbar />
      <main id="main" className="wrap" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/report" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
          <Route path="/report/:id/edit" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
          <Route path="/my" element={<ProtectedRoute><MyActivity /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
          <Route path="*" element={
            <section className="panel">
              <h1>Page not found</h1>
              <p>The page you opened does not exist. <Link to="/">Go back to the listings</Link>.</p>
            </section>
          } />
        </Routes>
      </main>
      <footer className="site-footer"><div className="wrap">Uganda Christian University · Campus Lost &amp; Found</div></footer>
    </>
  );
}
