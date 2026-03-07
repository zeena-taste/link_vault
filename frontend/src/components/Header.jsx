import './CSS/header.css';

export default function Header({ onAddLink, searchTerm, onSearchChange, showFilters, onToggleFilters, showFilterBtn }) {
  return (
    <div className="header">

      <input
        type="text"
        placeholder="Search links..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="search"
      />

      <div className="header-actions">
        {showFilterBtn && (
          <button
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={onToggleFilters}
            title="Toggle filters"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4h18M7 12h10M11 20h2" />
            </svg>
          </button>
        )}

        <button className="add-btn" onClick={onAddLink} title="Add link">+</button>
      </div>

    </div>
  );
}
