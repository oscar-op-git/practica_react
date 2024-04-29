import React, { Children } from "react";
import { useState } from "react";
import "./App.css"

//lo X y los O de los jugadores
const TURNS = {
  X: "x",
  O: "o",
};  


const Square = ({children, isSelected,updateBoard,index})=>{
  const className =`square ${isSelected ?"is-selected":""}`;
  const handleClick =()=>{
    updateBoard(index);
  };
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

//los casos en donde se gana el juego.
const WINNER_COMBOS = [
[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8],
[0, 4, 8],
[2, 4, 6],
];


const App = () =>{
  //creacion del tablero
  const [board,setBoard] = useState(Array(9).fill(null));
  //inicia el X
  const [turn,setTurn] = useState(TURNS.X);
  //null no hay ganador por el momento
  const[winner,setWinner] = useState(null);
  const checkWinner = (boardToCheck) =>{
    //revisamos todas las combinacineos ganadores, para ver si X u O
    for (const combo of WINNER_COMBOS){
      const [a, b, c] = combo; 
      if(
        boardToCheck[a] &&//x --->x u o
        boardToCheck[a] === boardToCheck[b] && //o y 3 -x- x u o -o
        boardToCheck[a] === boardToCheck[c]
      ){
        return boardToCheck[a];
      }
    }
    return null;
  };
  //resetear el juego
  const resetGame = () =>{
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
  }
  //verifica si el juego a acabado
  const checkEndGame =(newBoard)=>{
    return newBoard.every((square)=>square!=null)
  }
  //nunca actualizamos las props o estados son inmutables problemas de render.
  const updateBoard =(index)=>{
    //no actualizamos si ya tiene posicion
    if(board[index] || winner) return;
    //actualizamos el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    //cambiamos el turno
    const newTurn = turn === TURNS.X ? TURNS.O:TURNS.X;
    setTurn(newTurn);
    //revisamos si hay ganador
    const newWinner = checkWinner(newBoard);
    if(newWinner){
      //ver si el juego acabo
      setWinner(newWinner);
    }else if (checkEndGame(newBoard)){
      setWinner(false);
    }
  };
  return (
    <>
      <main className="board">
        <h1>Tres En Raya</h1>
        {/*llamamo a la funcion restegame*/}
        <button onClick={resetGame}>Restea el juego</button>
        <section className="game">
          {board.map((square, index)=>{
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {square}
              </Square>
            )
          })}
        </section>
        <section className="turn">
          <Square isSelected={turn===TURNS.X} >{TURNS.X}</Square>
          <Square isSelected={turn===TURNS.O} >{TURNS.O}</Square>
        </section>
        <section>
          {winner != null && (
            <section className="winner">
              <div className="text">
                <h2>{winner==false ? "Empate":"Gano:"}</h2>
                <header className="win">
                  {winner && <Square>{winner}</Square>}
                </header>
                <footer>
                  <button onClick={resetGame} >Empezar de nuevo</button>
                </footer>
              </div>
            </section>
          )}
        </section>
      </main>
    </>
  )



};

export default App;