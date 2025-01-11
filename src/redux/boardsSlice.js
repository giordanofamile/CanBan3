import { createSlice } from "@reduxjs/toolkit";
    import data from "../data.json";

    const boardsSlice = createSlice({
      name: "boards",
      initialState: {
        boards: data.boards,
        searchTerm: '',
      },
      reducers: {
        addBoard: (state, action) => {
          const isActive = state.boards.length > 0 ? false : true;
          const payload = action.payload;
          const board = {
            name: payload.name,
            isActive,
            columns: [],
          };
          board.columns = payload.newColumns;
          state.boards.push(board);
        },
        editBoard: (state, action) => {
          const payload = action.payload;
          const board = state.boards.find((board) => board.isActive);
          board.name = payload.name;
          board.columns = payload.newColumns;
        },
        deleteBoard: (state) => {
          const board = state.boards.find((board) => board.isActive);
          state.boards.splice(state.boards.indexOf(board), 1);
        },
        setBoardActive: (state, action) => {
          state.boards.map((board, index) => {
            index === action.payload.index
              ? (board.isActive = true)
              : (board.isActive = false);
            return board;
          });
        },
        addTask: (state, action) => {
          const { title, status, description, subtasks, newColIndex, priority, project, category, tags, comments, dueDate, assignee, attachments, history } =
            action.payload;
          const task = { title, description, subtasks, status, priority, project, category, tags, comments, dueDate, assignee, attachments, history };
          const board = state.boards.find((board) => board.isActive);
          const column = board.columns.find((col, index) => index === newColIndex);
          column.tasks.push(task);
        },
        editTask: (state, action) => {
          const {
            title,
            status,
            description,
            subtasks,
            prevColIndex,
            newColIndex,
            taskIndex,
            priority,
            project,
            category,
            tags,
            comments,
            dueDate,
            assignee,
            attachments,
            history
          } = action.payload;
          const board = state.boards.find((board) => board.isActive);
          const column = board.columns.find((col, index) => index === prevColIndex);
          const task = column.tasks.find((task, index) => index === taskIndex);
          task.title = title;
          task.status = status;
          task.description = description;
          task.subtasks = subtasks;
          task.priority = priority;
          task.project = project;
          task.category = category;
          task.tags = tags;
          task.comments = comments;
          task.dueDate = dueDate;
          task.assignee = assignee;
          task.attachments = attachments;
          task.history = history;
          if (prevColIndex === newColIndex) return;
          column.tasks = column.tasks.filter((task, index) => index !== taskIndex);
          const newCol = board.columns.find((col, index) => index === newColIndex);
          newCol.tasks.push(task);
        },
        editTaskTitle: (state, action) => {
          const { taskIndex, colIndex, newTitle } = action.payload;
          const board = state.boards.find((board) => board.isActive);
          const column = board.columns.find((col, index) => index === colIndex);
          const task = column.tasks.find((task, index) => index === taskIndex);
          task.title = newTitle;
        },
        dragTask: (state, action) => {
          const { colIndex, prevColIndex, taskIndex } = action.payload;
          const board = state.boards.find((board) => board.isActive);
          const prevCol = board.columns.find((col, i) => i === prevColIndex);
          const task = prevCol.tasks.splice(taskIndex, 1)[0];
          board.columns.find((col, i) => i === colIndex).tasks.push(task);
        },
        setSubtaskCompleted: (state, action) => {
          const payload = action.payload;
          const board = state.boards.find((board) => board.isActive);
          const col = board.columns.find((col, i) => i === payload.colIndex);
          const task = col.tasks.find((task, i) => i === payload.taskIndex);
          const subtask = task.subtasks.find((subtask, i) => i === payload.index);
          subtask.isCompleted = !subtask.isCompleted;
        },
        setTaskStatus: (state, action) => {
          const payload = action.payload;
          const board = state.boards.find((board) => board.isActive);
          const columns = board.columns;
          const col = columns.find((col, i) => i === payload.colIndex);
          if (payload.colIndex === payload.newColIndex) return;
          const task = col.tasks.find((task, i) => i === payload.taskIndex);
          task.status = payload.status;
          col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
          const newCol = columns.find((col, i) => i === payload.newColIndex);
          newCol.tasks.push(task);
        },
        deleteTask: (state, action) => {
          const payload = action.payload;
          const board = state.boards.find((board) => board.isActive);
          const col = board.columns.find((col, i) => i === payload.colIndex);
          col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
        },
        setSearchTerm: (state, action) => {
          state.searchTerm = action.payload;
        },
        dragColumn: (state, action) => {
          const { colIndex, prevColIndex } = action.payload;
          const board = state.boards.find((board) => board.isActive);
          const column = board.columns.splice(prevColIndex, 1)[0];
          board.columns.splice(colIndex, 0, column);
        },
      },
    });

    export default boardsSlice;
