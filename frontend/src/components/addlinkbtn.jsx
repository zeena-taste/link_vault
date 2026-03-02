import './CSS/links.css';
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
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

  const handleAdd = () => {
    if (!name || !url) return alert("Enter both a name and URL");
    onAdd({ name, url }, collectionId ? parseInt(collectionId) : null, notes, tags, editingLink?.id);
    onClose();
  };

  const suggestions = allTags.filter(t => !tags.includes(t) && !t.includes('.'));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="modal-title">{editingLink ? "Edit Link" : "Add New Link"}</h3>
          <p className="modal-subtitle">Organise your favourite resources easily.</p>
        </div>

        {/* Body */}
        <div className="modal-body">
          <input
            className="modal-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Text label"
          />
          <input
            className="modal-input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Paste link (URL)"
          />
          <textarea
            className="modal-textarea"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes (optional)"
          />

          {/* Tag input */}
          <div className="tag-input-row">
            <input
              className="tag-input"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add a tag..."
            />
            <button onClick={() => addTag()} className="tag-add-btn">+</button>
          </div>

          {/* Suggestions */}
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

          {/* Selected pills */}
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

          <select
            className="modal-select"
            value={collectionId}
            onChange={e => setCollectionId(e.target.value)}
          >
            <option value="">No collection</option>
            {collections?.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-primary" onClick={handleAdd}>
            {editingLink ? "Update Link" : "Add Link"}
          </button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
}
