import './CSS/linklist.css';

export default function LinkList({ links, onEditLink, onDeleteLink }) {

  if (links.length === 0) {
    return (
      <div className="ls-empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h5ZM3 2.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5H3Z"/>
        </svg>
        <h3 className="ls-empty-title">No links yet</h3>
        <p className="ls-empty-text">Add your first link to get started</p>
      </div>
    );
  }

  return (
    <div className="link-list">
      {links.map(link => (
        <div key={link.id} className="link-item">
          <a href={link.url} target="_blank" rel="noreferrer" className="link-title">
            {link.name /* FIX: was "link.title" but backend stores "name" */}
          </a>
          {link.notes && <p className="link-notes">{link.notes}</p>}

          {link.tags?.length > 0 && (
            <div className="link-tags">
              {link.tags.map(tag => (
                <span key={tag} className="link-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="link-actions">
            <button
              className="edit-btn"
              onClick={() => onEditLink(link)}
              title="Edit link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.416 7.82 4.15-4.15L8 8l-6.207 6.207a.5.5 0 0 0 .707.707l.5-.5z"/>
              </svg>
            </button>
            <button
              className="delete-btn"
              onClick={() => onDeleteLink(link)}  // passes full link object — App.jsx extracts .id
              title="Delete link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H13a1 1 0 0 1 1 1v1Zm-3 0H5a.5.5 0 0 0-.5.5V4h7V3.5a.5.5 0 0 0-.5-.5Z"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
