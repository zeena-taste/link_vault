import './CSS/collectionpage.css';

const COLLECTION_COLORS = [
  { bg: '#fef3c7', icon: '#f59e0b' },
  { bg: '#dbeafe', icon: '#3b82f6' },
  { bg: '#dcfce7', icon: '#22c55e' },
  { bg: '#fce7f3', icon: '#ec4899' },
  { bg: '#ede9fe', icon: '#8b5cf6' },
  { bg: '#e0f2fe', icon: '#0ea5e9' },
];

function getColor(id) {
  return COLLECTION_COLORS[Number(id) % COLLECTION_COLORS.length];
}

export default function CollectionsPage({ collections, links = [], onSelectCollection, onDeleteCollection }) {

  function getLinkCount(collectionId) {
    return links.filter(l => l.collectionId === collectionId).length;
  }

  return (
    <div className="collections-page">
      <div className="collections-page-header">
        <h2 className="collections-page-title">Collections</h2>
      </div>

      {collections.length === 0 ? (
        <div className="collections-empty">
          <p>No collections yet — create one from the sidebar.</p>
        </div>
      ) : (
        <div className="collections-grid">
          {collections.map(col => {
            const color = getColor(col.id);
            const count = getLinkCount(col.id);
            return (
              <div
                key={col.id}
                className="collection-card"
                onClick={() => onSelectCollection(col.id)}
              >
                <div className="collection-card-top">
                  <div className="collection-card-icon" style={{ background: color.bg }}>
                    <svg fill="none" viewBox="0 0 24 24" stroke={color.icon}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <button
                    className="collection-card-delete"
                    onClick={e => { e.stopPropagation(); onDeleteCollection(col.id); }}
                    title="Delete collection"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="collection-card-name">{col.name}</div>
                <div className="collection-card-count">{count} link{count !== 1 ? 's' : ''}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
