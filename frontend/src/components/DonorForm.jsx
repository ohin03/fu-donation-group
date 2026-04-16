import { useState } from "react";
import api from "../utils/api";
import { 
  Camera, User, Droplet, MapPin, Phone, 
  CheckCircle2, Activity, ArrowRight, ShieldCheck 
} from "lucide-react";

const DonorForm = ({ onAdded }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    setLoading(true);

    try {
      if (!image) throw new Error("Please upload a donor profile photo.");

      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", e.target.name.value);
      formData.append("bloodGroup", e.target.group.value);
      formData.append("location", e.target.location.value);
      formData.append("phone", e.target.phone.value);

      await api.post("/api/donors", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ type: "success", msg: "ডোনার প্রোফাইল সফলভাবে তৈরি হয়েছে!" });
      e.target.reset();
      setImage(null);
      setPreview(null);
      if (onAdded) setTimeout(() => onAdded(), 1000);
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5" style={{ background: "#f8fafc" }}>
      <div className="donor-card-pro mx-auto">
        
        {/* Top Header Section */}
        <div className="form-header text-center">
          <div className="live-status mb-3">
            <Activity size={16} className="pulse-icon" /> <span>SECURE REGISTRATION</span>
          </div>
          <h2 className="fw-black text-warning">Registry</h2>
          <p className="text-muted small">নিচের তথ্যগুলো দিয়ে রক্তদাতা হিসেবে নিবন্ধন করুন।</p>
        </div>

        {/* Status Alert */}
        {status.msg && (
          <div className={`status-alert ${status.type}`}>
            {status.type === "success" ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
            <span>{status.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 p-md-5 pt-0">
          {/* Avatar Uploader */}
          <div className="uploader-container mb-5">
            <div className="avatar-preview shadow-sm">
              {preview ? (
                <img src={preview} alt="Donor" className="avatar-img" />
              ) : (
                <User size={45} className="avatar-icon" />
              )}
              <label htmlFor="fileInput" className="camera-trigger">
                <Camera size={18} />
                <input id="fileInput" type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="row g-4">
            {/* Full Name */}
            <div className="col-12">
              <div className="input-group-pro">
                <label>নাম (Full Name)</label>
                <div className="field-wrapper">
                  <User size={18} className="field-icon" />
                  <input type="text" name="name" placeholder="উদা: মোহাম্মদ কামাল" required />
                </div>
              </div>
            </div>

            {/* Blood Group */}
            <div className="col-md-12">
              <div className="input-group-pro">
                <label>রক্তের গ্রুপ</label>
                <div className="field-wrapper">
                  <Droplet size={18} className="field-icon text-danger" />
                  <select name="group" required>
                    <option value="">সিলেক্ট করুন</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div> 

            {/* Phone Number - Fixed View */}
            <div className="col-md-12">
              <div className="input-group-pro">
                <label>ফোন নম্বর</label>
                <div className="field-wrapper">
                  <Phone size={18} className="field-icon" />
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="01712xxxxxx" 
                    required 
                    pattern="^(?:\+8801|01)[0-9]{9}$" 
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="col-12">
              <div className="input-group-pro">
                <label>বর্তমান ঠিকানা (City, Area)</label>
                <div className="field-wrapper">
                  <MapPin size={18} className="field-icon" />
                  <input type="text" name="location" placeholder="উদা: মহিপাল, ফেনী" required />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button type="submit" disabled={loading} className="submit-btn-pro mt-5 ">
            <span className="btn-text ">{loading ? "অপেক্ষা করুন..." : "রেজিস্ট্রেশন সম্পন্ন করুন"}</span>
            <div className="btn-icon-box">
              {loading ? <div className="loader"></div> : <ArrowRight size={20} />}
            </div>
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        .donor-card-pro {
          max-width: 520px;
          background: #ffffff;
          border-radius: 40px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.08);
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: fadeSlideUp 0.8s ease;
        }

        .form-header { padding: 50px 40px 30px; }
        .fw-black { font-weight: 800; letter-spacing: -1.5px; color: #1e293b; }

        .live-status {
          display: inline-flex; align-items: center;
          background: #fff1f2; color: #e11d48;
          padding: 6px 15px; border-radius: 100px;
          font-size: 11px; font-weight: 800; letter-spacing: 0.5px;
        }

        .pulse-icon { animation: pulse-red 2s infinite; margin-right: 6px; }

        /* Uploader Styling */
        .uploader-container { display: flex; justify-content: center; }
        .avatar-preview {
          width: 120px; height: 120px;
          border-radius: 42px; background: #f1f5f9;
          position: relative; border: 4px solid #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 38px; }
        .avatar-icon { color: #cbd5e1; }
        .camera-trigger {
          position: absolute; bottom: -5px; right: -5px;
          width: 42px; height: 42px; background: #ef4444;
          color: white; border-radius: 15px; border: 3px solid #fff;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: 0.3s;
        }

        /* Input Fixes */
        .input-group-pro label {
          display: block; font-size: 13px; font-weight: 700;
          color: #64748b; margin-bottom: 8px; margin-left: 12px;
        }
        .field-wrapper {
          position: relative; display: flex; align-items: center;
        }
        .field-icon { position: absolute; left: 20px; color: #94a3b8; }

        .input-group-pro input, .input-group-pro select {
          width: 100%;
          padding: 16px 20px 16px 55px; /* Increased side padding */
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 22px;
          font-size: 15px; font-weight: 600; color: #1e293b;
          transition: all 0.3s ease;
          outline: none;
        }

        .input-group-pro input:focus {
          background: #fff; border-color: #fca5a5;
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.05);
        }

        /* Submit Button */
        .submit-btn-pro {
          width: 100%; height: 65px;
          background: #1e293b; border: none;
          border-radius: 24px; color: white;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 10px 0 30px; transition: 0.4s;
        }
        .submit-btn-pro:hover { background: #000; transform: translateY(-3px); }
        .btn-text { font-weight: 700; font-size: 16px; }
        .btn-icon-box {
          width: 45px; height: 45px; background: #ef4444;
          border-radius: 18px; display: flex; align-items: center; justify-content: center;
        }

        /* Status Alert */
        .status-alert {
          margin: 0 40px 30px; padding: 15px 20px; border-radius: 18px;
          display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600;
        }
        .status-alert.success { background: #ecfdf5; color: #065f46; }
        .status-alert.error { background: #fef2f2; color: #991b1b; }

        .loader {
          width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-red {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      `}} />
    </div>
  );
};

export default DonorForm;