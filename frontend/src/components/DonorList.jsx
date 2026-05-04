import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Phone, MapPin, Droplets, Heart, MessageCircle, Share2, ShieldCheck, Zap, PhoneCall } from "lucide-react";
import api, { API_BASE_URL } from "../utils/api";

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/api/donors")
      .then(res => setDonors(res.data))
      .catch(err => console.log(err));
  }, []);

  const filteredDonors = donors.filter(donor => {
    const q = query.toLowerCase();
    return (
      donor.name.toLowerCase().includes(q) ||
      donor.bloodGroup.toLowerCase().includes(q) ||
      donor.location.toLowerCase().includes(q) ||
      donor.phone.includes(q)
    );
  });

  return (
    <div className="premium-bg">
      {/* 🌌 Floating Background Decorations */}
      <div className="gradient-circle circle-1"></div>
      <div className="gradient-circle circle-2"></div>

      <div className="container py-5 px-4 position-relative z-3">
        
        {/* 🌟 Professional Header */}
        <div className="text-center mb-5">
          <div className="badge-premium mb-3 text-info">
            <Zap size={14} className="me-2 text-warning animate-flash" /> 
            Feni University Blood donor list
          </div>
          <h1 className="main-title mb-3">
            Connect with <span className="text-danger-glow">Donors</span>
          </h1>
          
          {/* 🇧🇩 Emotional Bangla Quote Section */}
          <div className="quote-box mx-auto mb-5 shadow-sm">
            <p className="bangla-text mb-0">
              "রক্তদান একটি মহৎ মানবিক সেবা—আপনার দেওয়া একটি ব্যাগ রক্ত কারো জীবনে নতুন আশার আলো হতে পারে। 
              <span className="d-block mt-2 fw-bold text-dark">
                আপনার কয়েক মিনিটের সদিচ্ছা একজন মানুষের পুরো ভবিষ্যৎ বদলে দিতে পারে।
              </span> 
              তাই আজই রক্তদানে এগিয়ে আসুন।"
            </p>
          </div>

          <div className="search-wrapper mx-auto">
            <SearchBar query={query} setQuery={setQuery} />
          </div>
        </div>

        {/* 🎴 Elite Donor Grid */}
        <div className="row g-4 justify-content-center">
          {filteredDonors.map((donor, index) => (
            <div key={donor._id} className="col-12 col-sm-6 col-lg-4 col-xl-3 reveal-animation" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="elite-card">
                
                {/* Image Section with Overlay */}
                <div className="card-media">
                  <img
                    src={donor.image.startsWith('http') ? donor.image : `${API_BASE_URL}/uploads/${donor.image}`}
                    alt={donor.name}
                    className="donor-img-pro"
                  />
                  <div className="blood-group-float shadow-lg">{donor.bloodGroup}</div>
                  <div className="verified-tag">
                    <ShieldCheck size={12} className="me-1" /> VERIFIED
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-4">
                  <h5 className="donor-name fw-bold mb-1 text-dark text-truncate">{donor.name}</h5>
                  
                  {/* Location Section */}
                  <div className="d-flex align-items-center text-muted small mb-1">
                    <MapPin size={14} className="text-danger me-1" />
                    <span>{donor.location}</span>
                  </div>

                  {/* 📞 Phone Number Section */}
                  <div className="d-flex align-items-center text-primary small mb-1 fw-bold">
                    <Phone size={14} className="me-1" />
                    <span>{donor.phone}</span>
                  </div>

                  {/* 🩸 Bottom Blood Group Section (নতুন যোগ করা হয়েছে) */}
                  <div className="d-flex align-items-center text-danger small mb-4 fw-bold">
                    <Droplets size={14} className="me-1" />
                    <span>Blood: {donor.bloodGroup}</span>
                  </div>

                  <div className="action-stack">
                    <a href={`tel:${donor.phone}`} className="btn-action call ">
                      <PhoneCall size={18} className="me-2" /> কল করুন
                    </a>
                    <div className="d-flex gap-2 mt-2">
                      <a href={`https://wa.me/${donor.phone}`} target="_blank" rel="noreferrer" className="btn-sub-action whatsapp">
                        <MessageCircle size={18} />
                      </a>
                      <button className="btn-sub-action share" onClick={() => navigator.share({title: donor.name, text: `Donor Group: ${donor.bloodGroup}`, url: window.location.href})}>
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Result State */}
        {filteredDonors.length === 0 && (
          <div className="text-center py-5 mt-5">
             <Heart size={60} className="text-danger opacity-25 mb-3" />
             <h4 className="text-muted fw-light">এই মুহূর্তে কোনো রক্তদাতা খুঁজে পাওয়া যায়নি।</h4>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        .premium-bg {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #fdfdfd;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .gradient-circle {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 1;
          opacity: 0.15;
        }
        .circle-1 { width: 500px; height: 500px; background: #ff3b30; top: -100px; right: -100px; }
        .circle-2 { width: 400px; height: 400px; background: #ff9500; bottom: -50px; left: -50px; }

        .main-title {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -2px;
          color: #1a1a1a;
        }

        .text-danger-glow {
          color: #e03131;
          text-shadow: 0 0 20px rgba(224, 49, 49, 0.2);
        }

        .bangla-text {
          font-family: 'Hind Siliguri', sans-serif;
          font-size: 1.1rem;
          color: #4b5563;
          line-height: 1.8;
        }

        .quote-box {
          max-width: 800px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(15px);
          border-left: 5px solid #e03131;
          border-radius: 166px; /* Optimized rounding */
          border-radius: 16px;
          border-top: 1px solid white;
          border-right: 1px solid white;
        }

        .badge-premium {
          display: inline-flex;
          align-items: center;
          background: #fff;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          color: #1a1a1a;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          border: 1px solid #f1f1f1;
        }

        .search-wrapper {
          max-width: 650px;
          background: white;
          padding: 10px;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        }

        .elite-card {
          background: white;
          border-radius: 30px;
          border: 1px solid #f1f1f1;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          position: relative;
          z-index: 2;
        }

        .elite-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 30px 60px rgba(224, 49, 49, 0.15);
          border-color: #ffc9c9;
        }

        .card-media {
          height: 230px;
          margin: 12px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
        }

        .donor-img-pro {
          width: 100%; height: 100%; object-fit: cover;
          transition: 0.6s ease;
        }

        .elite-card:hover .donor-img-pro { transform: scale(1.1); }

        .blood-group-float {
          position: absolute;
          top: 15px; right: 15px;
          width: 50px; height: 50px;
          background: #e03131;
          color: white;
          border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.2rem;
          z-index: 5;
        }

        .verified-tag {
          position: absolute;
          bottom: 12px; left: 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #087f5b; padding: 4px 10px;
          border-radius: 8px; font-size: 10px; font-weight: 800;
        }

        .btn-action.call {
          background: #a1c13a;
          color: white;
          width: 100%;
          padding: 12px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; font-weight: 700;
          transition: 0.3s;
        }

        .btn-action.call:hover { background: #e03131; box-shadow: 0 10px 20px rgba(224, 49, 49, 0.3); }

        .btn-sub-action {
          flex: 1; height: 50px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 16px; border: none; transition: 0.3s;
          text-decoration: none;
        }

        .whatsapp { background: #e6fffa; color: #087f5b; }
        .whatsapp:hover { background: #087f5b; color: white; }

        .share { background: #f8f9fa; color: #4b5563; }
        .share:hover { background: #1a1a1a; color: white; }

        .reveal-animation {
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-flash { animation: flash 2s infinite; }

        @media (max-width: 768px) {
          .main-title { font-size: 2.2rem; }
          .bangla-text { font-size: 1rem; }
        }
      `}} />
    </div>
  );
};

export default DonorList;