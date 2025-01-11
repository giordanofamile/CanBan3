import React, { useState } from "react";
    import "../styles/Sidebar.css";
    import showSidebarIcon from "../assets/icon-show-sidebar.svg";
    import hideSidebarIcon from "../assets/icon-hide-sidebar.svg";
    import HeaderDropdown from "./HeaderDropdown";
    import AddEditBoardModal from "../modals/AddEditBoardModal";
    import { useSelector, useDispatch } from 'react-redux';
    import boardsSlice from "../redux/boardsSlice";
    import boardIcon from "../assets/icon-board.svg";

    export default function Sidebar({ isSideBarOpen, setIsSideBarOpen }) {
      const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
      const dispatch = useDispatch();
      const boards = useSelector((state) => state.boards.boards);

      const toggleSidebar = () => {
        setIsSideBarOpen((curr) => !curr);
      };

      const handleBoardClick = (index) => {
        dispatch(boardsSlice.actions.setBoardActive({ index }));
      };

      return (
        <div className={`sidebar  ${!isSideBarOpen && "sidebar-closed"} ${isBoardModalOpen && 'sidebar-infront'}`}>
          {isSideBarOpen && <HeaderDropdown setIsBoardModalOpen={setIsBoardModalOpen} />}
          <div className="sidebar-content">
            <div className="sidebar-boards">
              {boards.map((board, index) => (
                <div
                  key={index}
                  className={`sidebar-board ${board.isActive ? 'board-active' : ''}`}
                  onClick={() => handleBoardClick(index)}
                >
                  <img src={boardIcon} alt="board icon" />
                  {board.name}
                </div>
              ))}
              <div
                className="sidebar-board create-board-btn"
                onClick={() => setIsBoardModalOpen(true)}
              >
                <img src={boardIcon} alt="board icon" />
                + Create New Board
              </div>
            </div>
          </div>
          <div
            className={`toggle-sidebar-container  ${
              !isSideBarOpen && "toggle-closed"
            }`}
            onClick={toggleSidebar}
          >
            <img
              src={isSideBarOpen ? hideSidebarIcon : showSidebarIcon}
              alt="show/hide sidebar icon"
            />
            {isSideBarOpen && <p className="heading-M">Hide Sidebar</p>}
          </div>
          {isBoardModalOpen && (
            <AddEditBoardModal
              type="add"
              setIsBoardModalOpen={setIsBoardModalOpen}
            />
          )}
        </div>
      );
    }
