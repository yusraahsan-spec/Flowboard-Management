import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "../components/Navbar/Navbar";
import Board from "../components/Board/Board";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Editable from "../components/Editable/Editable";
import useLocalStorage from "use-local-storage";
function App() {
  const [data, setData] = useState(
    localStorage.getItem("flowboard")
      ? JSON.parse(localStorage.getItem("flowboard"))
      : []
  );

  // Check the OS-level dark mode preference to decide the default theme on first load
  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;

  // Persist theme in localStorage so it stays the same across reloads/visits
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  // Called from the Navbar toggle button — switches between light and dark
  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Rename a board (bid = board id)
  const setName = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
  };

  // Move a card from its source board to a different destination board (used on drag & drop)
  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };


  // Add a new card to a board — generates a fresh unique id with uuidv4
  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].card.push({
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
    });
    setData(tempData);
  };

  // Remove a card from a board by its id
  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
  };

  // Add a new board (column) — generates a fresh unique id with uuidv4
  const addBoard = (title) => {
    const tempData = [...data];
    tempData.push({
      id: uuidv4(),
      boardName: title,
      card: [],
    });
    setData(tempData);
  };

  // Remove a board (and all its cards) by id
  const removeBoard = (bid) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
  };

  // react-beautiful-dnd calls this when a drag ends
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // dropped outside any droppable area, do nothing

    if (source.droppableId === destination.droppableId) return; // same board, no move needed

    setData(dragCardInBoard(source, destination));
  };

  // Save the latest edited card (title, tags, tasks, date, etc.) back into the board data
  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    console.log(tempBoards);
    setData(tempBoards);
  };

  // Whenever board/card data changes, persist it to localStorage
  useEffect(() => {
    localStorage.setItem("flowboard", JSON.stringify(data));
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={theme}>
        <Navbar switchTheme={switchTheme} />
        <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.card}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                removeBoard={removeBoard}
                updateCard={updateCard}
              />
            ))}
            <Editable
              class={"add__board"}
              name={"Add Board"}
              btnName={"Add Board"}
              onSubmit={addBoard}
              placeholder={"Enter Board  Title"}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
