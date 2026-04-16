import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { 
  ShieldAlert, 
  Trash2, 
  ArrowLeft, 
  Lock, 
  Database, 
  LayoutDashboard,
  AlertCircle,
  ShieldCheck,
  Phone
} from "lucide-react";

function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginAdmin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/admin/login", { password }, { timeout: 5000 });
      if (res.data.success) {
        setIsAdmin(true);
        setPassword("");
      } else {
        setError("❌ ভুল পাসওয়ার্ড! অননুমোদিত প্রবেশ নিষিদ্ধ।");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("❌ এক্সেস ডিনাইড! সঠিক মাস্টার কি প্রদান করুন।");
      } else {
        setError("❌ সার্ভার ত্রুটি: ব্যাকএন্ড সচল আছে কিনা নিশ্চিত করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = () => {
    api.get("/api/donors").then(res => setDonors(res.data));
  };

  const deleteDonor = async (id) => {
    if (window.confirm("⚠️ আপনি কি নিশ্চিতভাবে এই ডেটাটি মুছতে চান? এটি আর ফিরে পাওয়া যাবে না।")) {
      await api.delete(`/api/donors/${id}`);
      fetchDonors();
    }
  };

  useEffect(() => {
    if (isAdmin) fetchDonors();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="admin-auth-container d-flex align-items-center justify-content-center px-3">
        <div className="auth-card p-4 p-lg-5 shadow-lg text-center border-0">
          <div className="security-icon mb-3">
             <ShieldAlert size={50} className="text-danger animate-pulse" />
          </div>
          <h2 className="fw-black mb-1 text-danger">RESTRICTED AREA</h2>
          <p className="text-muted small mb-4">শুধুমাত্র অনুমোদিত অ্যাডমিনদের প্রবেশের অনুমতি রয়েছে।</p>
          
          {error && (
            <div className="alert alert-custom d-flex align-items-center justify-content-center gap-2 mb-4">
              <AlertCircle size={18} /> <span>{error}</span>
            </div>
          )}

          <div className="form-group text-start">
            <label className="small fw-bold text-secondary ms-2 mb-2 text-uppercase">সিকিউরিটি পাসওয়ার্ড</label>
            <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden border">
              <span className="input-group-text bg-white border-0 ps-3">
                <Lock size={18} className="text-muted" />
              </span>
              <input
                type="password"
                placeholder="গোপন পাসওয়ার্ড লিখুন"
                className="form-control border-0 py-3 shadow-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loginAdmin()}
              />
            </div>
          </div>

          <button 
            className="btn btn-primary w-100 py-3 rounded-4 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3  border-0" 
            onClick={loginAdmin} 
            disabled={loading}
          >
            {loading ? "ভেরিফাই হচ্ছে..." : "লগইন করুন"}
          </button>

          <Link to="/" className="text-decoration-none text-muted small fw-bold d-flex align-items-center justify-content-center gap-2 hover-red">
            <ArrowLeft size={16} /> হোম পেজে ফিরে যান
          </Link>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .admin-auth-container { min-height: 85vh; background: #f8fafc; }
          .auth-card { width: 100%; max-width: 420px; background: white; border-radius: 24px; }
          .alert-custom { background: #fff1f2; color: #e11d48; border: 1px solid #ffe4e6; border-radius: 12px; font-size: 13px; font-weight: 600; }
          .shadow-dark { background: #1e293b; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
          .hover-red:hover { color: #e11d48 !important; }
          @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.95); } }
          .animate-pulse { animation: pulse 2s infinite ease-in-out; }
        `}} />
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper min-vh-100 bg-light">
      <div className="container py-4">
        <div className="dashboard-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 px-2">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-danger text-white p-3 rounded-4 shadow-danger-sm">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h3 className="fw-black mb-0 text-dark">অ্যাডমিন প্যানেল</h3>
              <div className="d-flex align-items-center gap-2 text-success small fw-bold">
                <ShieldCheck size={16} /> 
                <span>সিস্টেম সচল রয়েছে</span>
              </div>
            </div>
          </div>
          <Link to="/" className="btn btn-white border rounded-4 px-4 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
            <ArrowLeft size={18} /> হোম পেজ
          </Link>
        </div>

        <div className="row g-3 mb-4 px-2">
          <div className="col-12 col-md-4">
            <div className="stat-card p-4 border-0 rounded-4 bg-white shadow-sm d-flex align-items-center gap-3">
               <div className="icon-circle bg-light-danger text-danger">
                  <Database size={24} />
               </div>
               <div>
                  <h6 className="text-muted small fw-bold mb-0">মোট রক্তদাতা</h6>
                  <h4 className="fw-black mb-0">{donors.length} জন</h4>
               </div>
            </div>
          </div>
        </div>

        <div className="table-card bg-white shadow-sm rounded-4 border-0 overflow-hidden mx-2">
          <div className="p-4 border-bottom d-none d-md-block">
             <h6 className="fw-bold mb-0">রক্তদাতাদের বিস্তারিত তথ্য</h6>
          </div>
          
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light d-none d-md-table-header-group">
                <tr className="small text-uppercase fw-bold text-muted">
                  <th className="py-3 px-4 border-0">নাম</th>
                  <th className="py-3 border-0 text-center">গ্রুপ</th>
                  <th className="py-3 border-0 text-center">লোকেশন</th>
                  <th className="py-3 border-0 text-center">ফোন</th>
                  <th className="py-3 border-0 text-end px-4">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((d) => (
                  <tr key={d._id} className="donor-row border-bottom">
                    <td className="py-3 py-md-4 px-4">
                      <div className="fw-bold text-dark">{d.name}</div>
                      {/* মোবাইল ভিউতে ফোন নম্বর সহ বিস্তারিত */}
                      <div className="d-md-none mt-1">
                        <span className="badge bg-light text-danger border me-2" style={{fontSize: '10px'}}>{d.bloodGroup}</span>
                        <span className="small text-muted">{d.location}</span>
                        <div className="small text-primary fw-bold mt-1 d-flex align-items-center gap-1">
                           <Phone size={12} /> {d.phone}
                        </div>
                      </div>
                    </td>
                    <td className="text-center d-none d-md-table-cell">
                      <span className="blood-badge">{d.bloodGroup}</span>
                    </td>
                    <td className="text-center d-none d-md-table-cell text-muted">{d.location}</td>
                    <td className="text-center d-none d-md-table-cell fw-bold">{d.phone}</td>
                    <td className="text-end px-4">
                      <button onClick={() => deleteDonor(d._id)} className="btn-action-delete" title="ডিলিট করুন">
                        <Trash2 size={18} className="d-none d-md-inline" /> 
                        <span className="ms-1">মুছুন</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {donors.length === 0 && (
              <div className="text-center py-5 text-muted">
                 <p>সিস্টেমে কোনো তথ্য পাওয়া যায়নি।</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .fw-black { font-weight: 800; letter-spacing: -0.5px; }
        .shadow-danger-sm { box-shadow: 0 8px 15px -3px rgba(220, 38, 38, 0.3); }
        .bg-light-danger { background: #fff1f2; padding: 12px; border-radius: 12px; }
        .blood-badge { 
          background: #fee2e2; color: #dc2626; 
          font-weight: 800; padding: 6px 12px; 
          border-radius: 8px; font-size: 14px;
        }
        .btn-action-delete {
          background: #fff1f2; border: 1px solid #fecaca;
          color: #ef4444; padding: 6px 12px; border-radius: 8px;
          font-size: 13px; font-weight: 700; transition: 0.2s;
        }
        .btn-action-delete:hover { background: #ef4444; color: white; }
        .btn-white { background: white; color: #1e293b; border: 1px solid #e2e8f0 !important; }
        .btn-white:hover { background: #f8fafc; }

        @media (max-width: 768px) {
          .dashboard-header { text-align: center; }
          .table-responsive { border: 0; }
          .donor-row td { border-bottom: 1px solid #f1f5f9; }
        }
      `}} />
    </div>
  );
}

export default AdminPanel;