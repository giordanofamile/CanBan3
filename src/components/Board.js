import React, { useState } from "react";
    import { useSelector, useDispatch } from "react-redux";
    import { useMediaQuery } from "react-responsive";
    import AddEditBoardModal from "../modals/AddEditBoardModal";
    import "../styles/Board.css";
    import Column from "./Column";
    import EmptyBoard from "./EmptyBoard";
    import Sidebar from "./Sidebar";
    import SearchBar from "./SearchBar";
    import boardsSlice from "../redux/boardsSlice";

    export default function Board() {
      const isBigScreen = useMediaQuery({ query: "(min-width: 768px)" });
      const [isSideBarOpen, setIsSideBarOpen] = useState(true);
      const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
      const boards = useSelector((state) => state.boards.boards);
      const board = boards.find((board) => board.isActive === true);
      const searchTerm = useSelector((state) => state.boards.searchTerm);
      const columns = board.columns;
      const dispatch = useDispatch();

      const handleOnDragOver = (e) => {
        e.preventDefault();
      };

      const handleOnDrop = (e) => {
        const { colIndex: prevColIndex } = JSON.parse(e.dataTransfer.getData("text"));
        const colIndex = Number(e.currentTarget.dataset.index);
        if (colIndex !== prevColIndex) {
          dispatch(boardsSlice.actions.dragColumn({ colIndex, prevColIndex }));
        }
      };

      const filteredColumns = columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => {
          const searchTermMatch = searchTerm === '' ||
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.tags && task.tags.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (task.comments && task.comments.toLowerCase().includes(searchTerm.toLowerCase()));
          return searchTermMatch;
        }),
      }));

      const hasTasks = filteredColumns.some(column => column.tasks.length > 0);

      return (
        <div
          className={isBigScreen && isSideBarOpen ? "board open-sidebar" : "board"}
          onDragOver={handleOnDragOver}
        >
          {isBigScreen && (
            <Sidebar
              isSideBarOpen={isSideBarOpen}
              setIsSideBarOpen={setIsSideBarOpen}
            />
          )}
          <div className="board-header">
            <SearchBar />
          </div>

          {hasTasks ? (
            <>
              {filteredColumns.map((col, index) => {
                return (
                  <div key={index} data-index={index} onDrop={handleOnDrop} onDragOver={handleOnDragOver}>
                    <Column colIndex={index} />
                  </div>
                );
              })}
              <div
                className="add-column-column heading-XL"
                onClick={() => {
                  setIsBoardModalOpen(true);
                }}
              >
                + New Column
              </div>
            </>
          ) : (
            <EmptyBoard type="edit" message={searchTerm ? "Aucune tâche ne correspond à votre recherche." : "This board is empty. Create a new column to get started."} />
          )}
          {isBoardModalOpen && <AddEditBoardModal type="edit" setIsBoardModalOpen={setIsBoardModalOpen} />}
        </div>
      );
    }
