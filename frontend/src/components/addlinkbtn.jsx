import './CSS/links.css'
import { useState } from "react";

export default function AddLinkModal({ onClose, onAdd, collections, editingLink, allTags = [] }) {
  const [name, setName] = useState(editingLink?.name || "");
  const [url, setUrl] = useState(editingLink?.url || "");
  const [collectionId, setCollectionId] = useState(editingLink?.collectionId || "");
  const [notes, setNotes] = useState(editingLink?.notes || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(editingLink?.tags || []);

  const addTag = (tag) => {
    const trimmed = (tag || tagInput).trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

  const handleAdd = () => {
    if (!name || !url) return alert("Enter both a name and URL");
    onAdd(
      { name, url },
      collectionId ? parseInt(collectionId) : null,
      notes,
      tags,
      editingLink?.id
    );
    onClose();
  };

  // existing tags from other links that aren't already selected
  const suggestions = allTags.filter(t => !tags.includes(t) && !t.includes('.'));

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editingLink ? "Edit Link" : "Add Link"}</h3>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Text label" />
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste link" />
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />

        {/* Tag input */}
        <div className="tag-input-row">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Add a tag..."
            className="tag-input"
          />
          <button onClick={() => addTag()} className="tag-add-btn">+</button>
        </div>

        {/* Existing tag suggestions */}
        {suggestions.length > 0 && (
          <div className="tag-suggestions">
            <span className="tag-suggestions-label">Existing tags:</span>
            {suggestions.map(t => (
              <button key={t} className="tag-suggestion-chip" onClick={() => addTag(t)}>
                + {t}
              </button>
            ))}
          </div>
        )}

        {/* Selected tag pills */}
        {tags.length > 0 && (
          <div className="tag-pills">
            {tags.map(tag => (
              <span key={tag} className="tag-pill">
                {tag}
                <button onClick={() => removeTag(tag)} className="tag-remove">×</button>
              </span>
            ))}
          </div>
        )}

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
