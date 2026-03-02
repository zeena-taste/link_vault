import './CSS/links.css';
import { useState } from 'react';

export default function AddCollectionModal({ onClose, onAdd }) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return alert("Enter a collection name");
    onAdd({ name });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">

        <div className="modal-header">
          <div className="modal-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="modal-title">Create New Collection</h3>
          <p className="modal-subtitle">Collections help you organise your links by topic or project.</p>
        </div>

        <div className="modal-body">
          <input
            className="modal-input"
            type="text"
            placeholder="e.g. Project Inspiration"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            autoFocus
          />
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={handleAdd}>Create Collection</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
}
