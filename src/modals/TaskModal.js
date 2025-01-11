import React, { useState } from "react";
    import { useDispatch, useSelector } from "react-redux";
    import "../styles/TaskModals.css";
    import Subtask from "../components/Subtask";
    import ElipsisMenu from "../components/ElipsisMenu";
    import DeleteModal from "./DeleteModal";
    import elipsis from "../assets/icon-vertical-ellipsis.svg";
    import boardsSlice from "../redux/boardsSlice";
    import AddEditTaskModal from "./AddEditTaskModal";
    import {getFileIcon} from "../utils/getFileIcon";

    export default function TaskModal({ taskIndex, colIndex, setIsTaskModalOpen}) {
      const dispatch = useDispatch();
      const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
      const boards = useSelector((state) => state.boards.boards);
      const board = boards.find((board) => board.isActive === true);
      const columns = board.columns;
      const col = columns.find((col, i) => i === colIndex);
      const task = col.tasks.find((task, i) => i === taskIndex);
      const subtasks = task.subtasks;
      const attachments = task.attachments || [];
      const comments = task.comments || "";
      const history = task.history || [];
      const [modalOpacity, setModalOpacity] = useState(0);

      let completed = 0;
      subtasks.forEach((subtask) => {
        if (subtask.isCompleted) {
          completed++;
        }
      });

      const [status, setStatus] = useState(task.status);
      const [newColIndex, setNewColIndex] = useState(columns.indexOf(col));
      const onChange = (e) => {
        setStatus(e.target.value);
        setNewColIndex(e.target.selectedIndex);
      };

      const onClose = (e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        dispatch(
          boardsSlice.actions.setTaskStatus({
            taskIndex,
            colIndex,
            newColIndex,
            status,
          })
        );
        setIsTaskModalOpen(false)
      };

      const onDeleteBtnClick = (e) => {
        if (e.target.textContent === "Delete") {
          dispatch(boardsSlice.actions.deleteTask({ taskIndex, colIndex }));
          setIsTaskModalOpen(false)
          setIsDeleteModalOpen(false)
        } else {
          setIsDeleteModalOpen(false)
        }
      };

      const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

      const setOpenEditModal = () => {
        setIsAddTaskModalOpen(true);
        setIsElipsisMenuOpen(false)
      };

      const setOpenDeleteModal = () => {
        setIsElipsisMenuOpen(false)
        setIsDeleteModalOpen(true)
      };

      React.useEffect(() => {
        setTimeout(() => {
          setModalOpacity(1);
        }, 10);
      }, []);

      return (
        <div
          className={`modal-container ${!isDeleteModalOpen && "dimmed"}`}
          onClick={onClose}
        >
          <div className={`task-modal ${isDeleteModalOpen && "none"}`} style={{opacity: modalOpacity, transition: 'opacity 0.2s ease-in-out'}}>
            <div className="task-modal-title-container">
              <p className="heading-L">{task.title}</p>
              <img
                className="task-modal-elipsis"
                src={elipsis}
                alt="task options btn"
                onClick={() =>
                  setIsElipsisMenuOpen((prevState) => !prevState)
                }
              />
              {isElipsisMenuOpen && (
                <ElipsisMenu
                  setOpenEditModal={setOpenEditModal}
                  setOpenDeleteModal={setOpenDeleteModal}
                  type="Task"
                />
              )}
            </div>
            <p className="task-description text-L">{task.description}</p>
            {comments && (
              <div className="task-comments">
                <p className="heading-S">Commentaires</p>
                <p className="text-L">{comments}</p>
              </div>
            )}

            <p className="subtasks-completed heading-S">
              Subtasks ({completed} of {subtasks.length})
            </p>
            {subtasks.map((subtask, index) => {
              return (
                <Subtask
                  index={index}
                  taskIndex={taskIndex}
                  colIndex={colIndex}
                  key={index}
                />
              );
            })}
            {attachments.length > 0 && (
              <div className="attachments-container">
                <p className="heading-S">Pièces jointes</p>
                <ul className="attachments-list">
                  {attachments.map((attachment) => (
                    <li key={attachment.id} className="attachment-item">
                      <button onClick={(e) => e.preventDefault()} className="attachment-link">
                        <span className="attachment-icon">{getFileIcon(attachment.type)}</span>
                        {attachment.name} ({attachment.size} bytes)
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {history.length > 0 && (
              <div className="history-container">
                <p className="heading-S">Historique des modifications</p>
                <ul className="history-list">
                  {history.map((item, index) => (
                    <li key={index} className="history-item">
                      <p className="text-M">{item.message}</p>
                      <p className="text-S">{item.timestamp}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="select-column-container">
              <label className="text-M">Current Status</label>
              <select
                className="select-status text-L"
                value={status}
                onChange={onChange}
              >
                {columns.map((col, index) => (
                  <option className="status-options" key={index}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          {isDeleteModalOpen && (
            <DeleteModal
              onDeleteBtnClick={onDeleteBtnClick}
              type="task"
              title={task.title}
            />
          )}

          {isAddTaskModalOpen && (
            <AddEditTaskModal
              setIsAddTaskModalOpen={setIsAddTaskModalOpen}
              setIsTaskModalOpen={setIsTaskModalOpen}
              type="edit"
              taskIndex={taskIndex}
              prevColIndex={colIndex}
            />
          )}
        </div>
      );
    }
