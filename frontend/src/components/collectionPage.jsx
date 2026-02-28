import './CSS/sidebar.css';

// FIX: accepts "links" prop so we can count real links per collection
export default function CollectionsPage({ collections, links = [], onSelectCollection, onDeleteCollection }) {

  // Count how many links belong to each collection from the real links array
  function getLinkCount(collectionId) {
    return links.filter(l => l.collectionId === collectionId).length;
  }

  return (
    <div style={{ padding: "10px" }}>
      <h2>Collections</h2>

      {collections.length === 0 && <p>No collections yet</p>}

      {collections.map(col => (
        <div key={col.id} style={{
          padding: "12px",
          marginBottom: "10px",
          background: "#f2f3f5",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}>
          {/* Left: collection info */}
          <div
            style={{ display: "flex", alignItems: "center", flex: 1 }}
            onClick={() => onSelectCollection(col.id)}
          >
            <span style={{ marginRight: "8px" }}>{col.icon || "📁"}</span>
            <span>{col.name}</span>
            {/* FIX: was col.links?.length which is always 0 — backend doesn't send a links array.
                Now counts from the real links state passed down from App */}
            <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#555" }}>
              {getLinkCount(col.id)} links
            </span>
          </div>

          {/* Right: delete button */}
          <button
            style={{
              background: "none",
              border: "none",
              color: "#f44336",
              fontSize: "1.1rem",
              cursor: "pointer",
              marginLeft: "10px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCollection(col.id);
            }}
            title="Delete collection"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
