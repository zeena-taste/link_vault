import './CSS/links.css';
import { useState } from 'react';

export default function AddCollectionModal({ onClose, onAdd }) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return alert("Enter a collection name");
    onAdd({ name });  // FIX: was passing { id: Date.now(), name, links: [] }
                      // Backend generates the id via Date.now() — don't duplicate it here
                      // "links" field doesn't exist on the backend model either
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>New Collection</h3>
        <input
          type="text"
          placeholder="Collection name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}  // bonus: press Enter to submit
        />
        <button onClick={handleAdd}>Add</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
