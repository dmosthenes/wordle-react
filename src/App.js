import logo from './logo.svg';
import './App.css';
import React from 'react';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

const words = ["APPLE", "CHAIR", "HOUSE", "PLANT", "TRAIN", "LEMON", "TIGER", "BEACH", "CLOUD", "EAGLE"]

class Wordle extends React.Component{

  constructor(props){
    super(props);

    // Update words to pick randomly

    this.state = {
      current: 0,
      cells: new Array(25).fill(null),
      word: "PROWL",
      complete: -1

    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress)
  }

  handleKeyPress = (event) => {
    // Check if key was a letter
    //TODO: Fix backspacing
    if (event.key == "Backspace") {
      // Prevent backspace if start of line or end of puzzle
      if (this.state.current % 5 == 0 || this.state.current == 24){
        return
      } 
      // Otherwise, move back one cell
      else {
        this.setState(state => {

          const newCells = [...state.cells]

          newCells[state.current] = null

          return {
            cells: newCells,
            current: state.current - 1
          }
        })
      }
    }
    else if (/[a-zA-Z]/.test(event.key)){

      this.setState(state => {

        const updatedCells = [...state.cells]
        updatedCells[state.current] = event.key.toUpperCase()

        return {
          current: state.current + 1,
          cells: updatedCells
        }

      })


      // console.log("key pressed", event.key)
      // console.log("Current cell:", this.state.current)
    }
    else {
      return
    }

    // Check if end of row
    if ((this.state.current + 1) % 5  === 0){
      this.setState(state => ({
        complete: state.complete + 1
      }))
      console.log("Complete:", this.state.complete)

    }
  }

  updateCellColour = (cell) => {


    // only occurs after row is complete
    // check if cell is in a complete row
    if (cell < (this.state.complete * 5) + 5) {
      // If the cell value is correct, cell is green

      if (this.state.cells[cell] === this.state.word[cell % 5]){
        return (
          "correct"
        )}
      // If cell value is in word but wrong place, cell is yellow
      else if (this.state.word.includes(this.state.cells[cell])) {
        return (
          "place"
        )
      }
      // If not in word, cell is unchanged
      else {
        return "black"
      }
    }
  }

  render() {
    let rows = [];

    for (let row = 0; row < 6; row++){

      let cells = []
      
      for (let col = 0; col < 5; col++){

        let cell = row + col + (row * 4)

        cells.push(

          // Add key to the divs?
        
        <td key={cell}>


          <div
          // Update class if row is complete
          className={row === this.state.complete ? "cell complete_row": "cell"}
          // Update colour if cell is correct letter / in wrong place
          id={this.updateCellColour(cell)}>
            {this.state.cells[cell]}
          </div>
        </td>)

      }

      rows.push(
          <tr key={row}>
        {cells}
          </tr>)
      
    }
  
    return (
      
      <div>
        <table>
          <tbody>

            {rows}

          </tbody>
        </table>
      </div>
    );
  }  
  
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Wordle />
      </header>
    </div>
  );
}

export default App;
