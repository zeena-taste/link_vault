import './CSS/links.css'
import { useState } from "react";

export default function AddLinkModal({ onClose, onAdd, collections, editingLink }) {
  // FIX: was using "title" — backend stores "name". Renamed throughout.
  const [name, setName] = useState(editingLink?.name || "");
  const [url, setUrl] = useState(editingLink?.url || "");
  const [collectionId, setCollectionId] = useState(editingLink?.collectionId || "");
  const [notes, setNotes] = useState(editingLink?.notes || "");

  const handleAdd = () => {
    if (!name || !url) return alert("Enter both a name and URL");
    onAdd(
      { name, url },  // FIX: was { title, url } — backend expects "name"
      collectionId ? parseInt(collectionId) : null,
      notes,
      editingLink?.id
    );
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editingLink ? "Edit Link" : "Add Link"}</h3>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Text label" />
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste link" />
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <select value={collectionId} onChange={e => setCollectionId(e.target.value)}>
          <option value="">No collection</option>
          {collections?.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>
        <button onClick={handleAdd}>{editingLink ? "Update" : "Add"}</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
