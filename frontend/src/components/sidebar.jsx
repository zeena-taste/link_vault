import './CSS/sidebar.css';

export default function Sidebar({
  onGoHome, onGoCollections, onAddCollection
}) {
  return (
    <div className="sidebar">

      {/* Home */}
      <div className="dock-item" onClick={onGoHome}>
        <span className="icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
          </svg>
        </span>
        <span className="label">Home</span>
      </div>

      {/* Collections — FIX: was calling onAddCollection instead of onGoCollections */}
      <div className="dock-item" onClick={onGoCollections}>
        <span className="icon">
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </span>
        <span className="label">Collections</span>
      </div>

      {/* Add Collection */}
      <div className="dock-item add" onClick={onAddCollection}>
        <span className="icon">+</span>
        <span className="label">Add Collection</span>
      </div>

    </div>
  );
}
