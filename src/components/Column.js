import React, { useState, useRef, useEffect } from "react";
    import Task from "./Task";
    import "../styles/Column&Task.css";
    import boardsSlice from "../redux/boardsSlice";
    import { useDispatch, useSelector } from "react-redux";

    export default function Column({ colIndex }) {
      const dispatch = useDispatch();
      const boards = useSelector((state) => state.boards.boards);
      const board = boards.find((board) => board.isActive === true);
      const col = board.columns.find((col, i) => i === colIndex);
      const [searchTerm, setSearchTerm] = useState('');
      const searchInputRef = useRef(null);
      const [searchTimeout, setSearchTimeout] = useState(null);
      const [columnOpacity, setColumnOpacity] = useState(0);

      const handleOnDrop = (e) => {
        const { prevColIndex, taskIndex } = JSON.parse(e.dataTransfer.getData("text"));

        if (colIndex !== prevColIndex) {
          dispatch(boardsSlice.actions.dragTask({ colIndex, prevColIndex, taskIndex }));
        }
      }

      const handleOnDragOver = (e) => {
        e.preventDefault()
      }

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

      const filteredTasks = col.tasks.filter((task) => {
        const searchTermMatch = searchTerm === '' ||
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.tags && task.tags.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (task.comments && task.comments.toLowerCase().includes(searchTerm.toLowerCase()));
        return searchTermMatch;
      });

      const handleOnDragStart = (e) => {
        e.dataTransfer.setData("text", JSON.stringify({ colIndex }));
      };

      useEffect(() => {
        setTimeout(() => {
          setColumnOpacity(1);
        }, 10);
      }, []);

      return (
        <div className="column" onDrop={handleOnDrop} onDragOver={handleOnDragOver} draggable onDragStart={handleOnDragStart} style={{opacity: columnOpacity, transition: 'opacity 0.2s ease-in-out'}}>
          <div className="column-header">
            <p className="col-name heading-S">
              {col.name} ({col.tasks.length})
            </p>
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
          </div>
          {filteredTasks.map((task, index) => {
            return (
              <Task key={index} taskIndex={index} colIndex={colIndex} />
            );
          })}
        </div>
      );
    }
