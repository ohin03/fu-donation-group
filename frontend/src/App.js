import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DonorForm from "./components/DonorForm";
import DonorList from "./components/DonorList";
import AdminPanel from "./components/AdminPanel";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { 
  LayoutDashboard, Home, Heart, PlusCircle, Search, 
  Users, ShieldCheck, Mail, Globe, Sparkles 
} from "lucide-react";

function App() {
  const [query, setQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDonorAdded = () => {
    setQuery("");
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <div className="unified-app-wrapper min-vh-100 d-flex flex-column">
        

        <nav className="glass-nav sticky-top bg-primary-subtle">
          <div className="container d-flex justify-content-between align-items-center h-100">
            <Link className="brand-link" to="/">
              <div className="icon-badge shadow-red">
                <Heart size={20} fill="white" className="text-white" />
              </div>
              <div className="brand-meta">
                <span className="name">FENI UNIVERSITY</span>
                <span className="tagline">BLOOD GROUP</span>
              </div>
            </Link>

            <div className="nav-actions d-none d-lg-flex gap-3">
              <Link to="/" className="nav-pill active"><Home size={18} /> Home</Link>
              <Link to="/admin" className="nav-pill admin bg-warning"><LayoutDashboard size={18} /> Admin</Link>
            </div>

     
            <div className="d-lg-none">
              <Link to="/admin" className="text-dark"><LayoutDashboard size={24} /></Link>
            </div>
          </div>
        </nav>


        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={
              <div className="container py-lg-5 py-4">
                

                <div className="d-lg-none mb-4 px-2">
                   <h4 className="fw-black mb-1">রক্তদাতা নিবন্ধন</h4>
                   <p className="small text-muted">আপনার তথ্য দিয়ে অন্যকে সাহায্য করুন।</p>
                </div>

                <div className="row g-4">

                  <div className="col-lg-4 order-1">
                    <div className="sticky-pro-form">
                       <div className="form-caption d-none d-lg-block">
                          <Sparkles className="text-danger mb-2" />
                          <h5>নতুন রক্তদাতা যুক্ত করুন</h5>
                          <p className="small text-muted">আপনার তথ্য নিরাপদভাবে সংরক্ষিত থাকবে।</p>
                       </div>
                       <DonorForm onAdded={handleDonorAdded} />
                    </div>
                  </div>

             
                  <div className="col-lg-8 order-2 mt-5 mt-lg-0">
                    <div className="list-wrapper">
                      <div className="list-header mb-4 d-flex justify-content-between align-items-center">
                        <h3 className="fw-black mb-0">Verified <span className="text-danger">Donors</span></h3>
                        <div className="badge bg-light text-dark border px-3 py-2 rounded-pill small fw-bold d-none d-sm-block">
                           Active Database: 2026
                        </div>
                      </div>
                      <DonorList query={query} setQuery={setQuery} refreshTrigger={refreshTrigger} />
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>


        <footer className="glass-footer bg-info-subtle">
          <div className="container">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
              <div className="academic-info text-center text-lg-start">
                <p className="mb-0 fw-bold text-success">Feni University Blood Group</p>
                <p className="text-muted small mb-0">ISAD  Project • Dept. of CSE</p>
              </div>
              <div className="footer-btns d-flex gap-2">
                <a href="https://feniuniversity.ac.bd/" className="f-btn "><Globe size={14} /> Official Site</a>
                <a href="/admin" className="f-btn"><ShieldCheck size={14} /> Admin Access</a>
              </div>
            </div>
            <div className="copyright text-center mt-3 pt-3 border-top small text-muted">
              © 2026 all rights reserved.
            </div>
          </div>
        </footer>


        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          :root { --danger: #e03131; --dark: #1a1a1a; --glass: rgba(255, 255, 255, 0.9); }
          body { font-family: 'Outfit', sans-serif; background: #f8fafc; color: var(--dark); }
          .fw-black { font-weight: 800; letter-spacing: -1.5px; }

          /* Glass Nav */
          .glass-nav { 
            height: 80px; background: var(--glass); 
            backdrop-filter: blur(15px); border-bottom: 1px solid rgba(0,0,0,0.05); z-index: 1000;
          }
          .brand-link { text-decoration: none; display: flex; align-items: center; gap: 12px; }
          .icon-badge { 
            background: var(--danger); width: 42px; height: 42px; 
            border-radius: 12px; display: flex; align-items: center; justify-content: center;
          }
          .shadow-red { box-shadow: 0 8px 16px rgba(224, 49, 49, 0.25); }
          .brand-meta .name { display: block; font-weight: 800; color: #1a1a1a; line-height: 1; font-size: 1.1rem; }
          .brand-meta .tagline { font-size: 0.65rem; color: var(--danger); font-weight: 700; letter-spacing: 2px; }

          .nav-pill { 
            text-decoration: none; color: #64748b; font-weight: 600; 
            padding: 10px 20px; border-radius: 12px; transition: 0.3s;
            display: flex; align-items: center; gap: 8px;
          }
          .nav-pill:hover, .nav-pill.active { background: #fff1f2; color: var(--danger); }
          .nav-pill.admin { background: var(--dark); color: white; }

          /* Sticky Sidebar */
          @media (min-width: 992px) {
            .sticky-pro-form { position: sticky; top: 100px; }
          }
          .form-caption { margin-bottom: 20px; padding-left: 10px; border-left: 3px solid var(--danger); }

          /* Footer */
          .glass-footer { background: white; padding: 40px 0 20px; border-top: 1px solid #eee; margin-top: 50px; }
          .f-btn { 
            text-decoration: none; font-size: 12px; color: #64748b; font-weight: 700;
            background: yellow ; padding: 8px 16px; border-radius: 100px; display: flex; align-items: center; gap: 6px;
          }
          .f-btn:hover { background: red; color: white; }

          @media (max-width: 991px) {
            .glass-nav { height: 70px; }
            .brand-meta .name { font-size: 0.95rem; }
            .list-wrapper { background: white; padding: 15px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
            /* Mobile spacing */
            .order-1 { margin-bottom: 40px; }
          }
        `}} />
      </div>
    </Router>
  );
}

export default App;