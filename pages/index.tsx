import React, { Fragment, useState } from 'react';
import { GiNuclearBomb, GiFlyingFlag } from "react-icons/gi";
import { FaQuestion, FaFontAwesomeFlag } from "react-icons/fa";
import './index.scss';


const Tile = ({ location, revealed, mined, flagged, adjacentMines, handleClick }) => {

  return (
    <div className={`tile${revealed ? " revealed" : ""}${flagged ? " /**/flagged" : ""}`}
         onMouseDown={(e) => handleClick(e, location, revealed, flagged, mined, adjacentMines)}
         onContextMenu={(e) => e.preventDefault()}>
      {revealed ?
        <Fragment>
          {mined ? <GiNuclearBomb className="icon" size={25} /> : null}
          {adjacentMines ? <div className="adjacent">{adjacentMines}</div> : null}
        </Fragment>
        : null}
      {
        flagged !== 0 ?
          flagged === 1 ? <FaFontAwesomeFlag size={15} className="icon" />
            : <FaQuestion size={15} className="icon" />
          : null
      }
    </div>
  );
};

export default function layout({ rows = 16, columns = 30 }) {

  function MakeTile(columnIndex: number, rowIndex: number) {
    this.location = [columnIndex, rowIndex];/**/
    this.revealed = false;
    this.mined = false;
    this.flagged = 0;
    this.adjacentMines = 0;
  }


  /*const array = [...new Array(columns)]
    .map((column, columnIndex) => [...new Array(rows)]
      .map((row, rowIndex) => new Tile(columnIndex, rowIndex)));*/

  let array = [];
  [...new Array(rows)].map((row, rowIndex) => {
    [...new Array(columns)].map((column, columnIndex) => {
      array.push(new MakeTile(rowIndex, columnIndex));
    });
  });



  function initBoard(board: any[], minesCount: number) {
    let bombedBoard = board;
    let bombLocations = [];
    for (let i = 0; i < minesCount; i++) {
      let random = Math.round(Math.random() * (bombedBoard.length - 1));

      if (bombLocations.find(num => num === bombedBoard[random].location)) {
        i--;
      } else {
        bombLocations.push(bombedBoard[random].location);
        bombedBoard.find(item => item.location === bombLocations[i]).mined = true;
      }
    }

    bombedBoard.forEach((item, index) => {
      bombLocations.forEach((location, i) => {
        if (!item.mined
          && item.location[0] >= location[0] - 1
          && item.location[0] <= location[0] + 1
          && item.location[1] >= location[1] - 1
          && item.location[1] <= location[1] + 1) {
          item.adjacentMines = item.adjacentMines + 1;

        }
      });
    });

    return bombedBoard;
  }

  const [board, setBoard] = useState(initBoard(array, 99));

  function bubbleMines(location) {
    console.log(`this is the location: ${location}`);
    board.forEach(item => {
      if (item.location[0] >= location[0] - 1
        && item.location[0] <= location[0] + 1
        && item.location[1] >= location[1] - 1
        && item.location[1] <= location[1] + 1
        && item.revealed === false) {
        console.log(item.location);
        item.revealed = true;
        if (item.adjacentMines === 0) {
          bubbleMines(item.location);
        }
      }
    });
  }


  const handleClick = (e, location, revealed, flagged, mined, adjacentMines) => {
    if (e.nativeEvent.which === 1) {
      if (adjacentMines === 0 && !mined) {
        bubbleMines(location);
      }

      if (flagged !== 0) {

      } else if (mined) {
        board.forEach(item => item.revealed = true);
      } else {
        board.find(item => item.location === location).revealed = true;
        board.find(item => item.location === location).flagged = 0;
      }

    } else if (e.nativeEvent.which === 3) {
      if (!revealed) {
        if (flagged === 2) {
          board.find(item => item.location === location).flagged = 0;
        } else {
          board.find(item => item.location === location).flagged = board.find(item => item.location === location).flagged + 1;
        }
      }
    }
    return setBoard([...board]);
  };

  return (
    <div className="wrapper">
      <style jsx>{`  
        .container {
          grid-template-columns: repeat(${columns}, 25px);
          grid-template-rows: repeat(${rows}, 25px);
        }
      `}</style>
      <div className="container">
        {
          board.map(item => <Tile key={item.location} {...item} handleClick={handleClick} />)
        }
      </div>
    </div>
  );
}