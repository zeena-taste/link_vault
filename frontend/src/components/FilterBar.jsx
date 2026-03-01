import './CSS/filterbar.css';

export default function FilterBar({
  links, filterTag, filterDomain, filterDate,
  onFilterTag, onFilterDomain, onFilterDate, onClear
}) {
  // collect all unique tags that aren't domains
  const domains = [...new Set(
    links.flatMap(l => l.tags || []).filter(t => t.includes('.'))
  )];

  const customTags = [...new Set(
    links.flatMap(l => l.tags || []).filter(t => !t.includes('.'))
  )];

  const hasActiveFilter = filterTag || filterDomain || filterDate;

  return (
    <div className="filter-bar">

      {/* Date filter */}
      <div className="filter-group">
        <span className="filter-label">Date</span>
        {["today", "week", "month"].map(d => (
          <button
            key={d}
            className={`filter-chip ${filterDate === d ? "active" : ""}`}
            onClick={() => onFilterDate(filterDate === d ? null : d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Domain filter */}
      {domains.length > 0 && (
        <div className="filter-group">
          <span className="filter-label">Domain</span>
          {domains.map(d => (
            <button
              key={d}
              className={`filter-chip ${filterDomain === d ? "active" : ""}`}
              onClick={() => onFilterDomain(filterDomain === d ? null : d)}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Tag filter */}
      {customTags.length > 0 && (
        <div className="filter-group">
          <span className="filter-label">Tags</span>
          {customTags.map(t => (
            <button
              key={t}
              className={`filter-chip ${filterTag === t ? "active" : ""}`}
              onClick={() => onFilterTag(filterTag === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Clear all */}
      {hasActiveFilter && (
        <button className="filter-clear" onClick={onClear}>
          clear filters ×
        </button>
      )}
    </div>
  );
}