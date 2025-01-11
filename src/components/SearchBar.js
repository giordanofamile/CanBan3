import React, { useState, useRef, useEffect } from 'react';
    import '../styles/SearchBar.css';
    import { useDispatch, useSelector } from 'react-redux';
    import boardsSlice from '../redux/boardsSlice';

    export default function SearchBar() {
      const [searchTerm, setSearchTerm] = useState('');
      const dispatch = useDispatch();
      const searchInputRef = useRef(null);
      const searchTermFromState = useSelector((state) => state.boards.searchTerm);
      const [searchTimeout, setSearchTimeout] = useState(null);

      useEffect(() => {
        setSearchTerm(searchTermFromState);
      }, [searchTermFromState]);

      const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
          dispatch(boardsSlice.actions.setSearchTerm(value));
        }, 300);

        setSearchTimeout(timeout);
      };

      const handleClearSearch = () => {
        setSearchTerm('');
        dispatch(boardsSlice.actions.setSearchTerm(''));
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      };

      return (
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            ref={searchInputRef}
          />
          {searchTerm && (
            <button onClick={handleClearSearch} className="clear-search-btn">
              X
            </button>
          )}
        </div>
      );
    }
