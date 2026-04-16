import React from "react";
import { Search, X, Filter } from "lucide-react";

function SearchBar({ query, setQuery }) {
  return (
    <div className="search-container mb-4">
      <div className="search-box-wrapper mx-auto">
        {/* সার্চ আইকন */}
        <div className="search-icon-box">
          <Search size={20} className="text-muted" />
        </div>

        {/* ইনপুট ফিল্ড */}
        <input
          type="text"
          className="pro-search-input"
          placeholder="রক্তদাতা খুঁজুন (যেমন: Name, Group, Location)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* ক্লিয়ার বাটন (যদি কিছু লেখা থাকে) */}
        {query && (
          <button 
            className="clear-btn" 
            onClick={() => setQuery("")}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {/* ফিল্টার ব্যাজ (সাজানোর জন্য) */}
        <div className="filter-badge d-none d-sm-flex">
          <Filter size={14} className="me-1" />
          <span>Smart Filter</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .search-box-wrapper {
          position: relative;
          max-width: 600px;
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 20px;
          padding: 6px 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid #f1f5f9;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        }

        .search-box-wrapper:focus-within {
          border-color: #e03131;
          box-shadow: 0 15px 30px -10px rgba(224, 49, 49, 0.15);
          transform: translateY(-2px);
        }

        .search-icon-box {
          padding: 0 12px;
          display: flex;
          align-items: center;
          color: #94a3b8;
        }

        .pro-search-input {
          flex: 1;
          border: none;
          padding: 12px 0;
          font-size: 1rem;
          font-weight: 500;
          color: #1e293b;
          background: transparent;
          outline: none;
        }

        .pro-search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .clear-btn {
          border: none;
          background: #f1f5f9;
          color: #64748b;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 10px;
          transition: 0.2s;
        }

        .clear-btn:hover {
          background: #e2e8f0;
          color: #e03131;
        }

        .filter-badge {
          background: #fff1f2;
          color: #e03131;
          padding: 6px 15px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          border: 1px solid #ffe4e6;
        }

        @media (max-width: 768px) {
          .search-box-wrapper {
            margin: 0 10px;
            border-radius: 16px;
          }
          .pro-search-input {
            font-size: 14px;
            padding: 10px 0;
          }
        }
      `}} />
    </div>
  );
}

export default SearchBar;