import Header from "./components/Header";
    import Board from "./components/Board";
    import { useDispatch, useSelector } from "react-redux";
    import boardsSlice from "./redux/boardsSlice";
    import EmptyBoard from "./components/EmptyBoard";

    function App() {
      const dispatch = useDispatch();
      const boards = useSelector((state) => state.boards?.boards);
      const theme = useSelector((state) => state.theme);
      const activeBoard = boards && boards.find((board) => board.isActive);
      if (boards && !activeBoard && boards.length > 0)
        dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));

      return (
        <div className={`app ${theme}`}>
          {boards && boards.length > 0 ? (
            <>
              <Header />
              <Board />
            </>
          ) : (
            <EmptyBoard type="add" />
          )}
        </div>
      );
    }

    export default App;
