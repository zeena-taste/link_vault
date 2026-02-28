import './CSS/header.css';

export default function Header ({ onAddLink, searchTerm, onSearchChange}) {
    return (
        <div className="header">

            <input type="text"
            placeholder='Search links...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='search' />

            <button className="add-btn"
            onClick={onAddLink}
            title='Add link'>
                +
            </button>
        </div>
    )
}