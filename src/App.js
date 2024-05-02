import logo from './logo.svg';
import './App.css';
import React from 'react';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

// const words = ["APPLE", "CHAIR", "HOUSE", "PLANT", "TRAIN", "LEMON", "TIGER", "BEACH", "CLOUD", "EAGLE"]

let words = []

class Wordle extends React.Component{

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress)

    fetch(process.env.PUBLIC_URL + '/words.txt')
    .then(response => response.text())
    .then(data => {
      words = data.split('\n')
      // console.log(words)
      let randomWord = words[Math.floor(words.length * Math.random())].toUpperCase()
      console.log(randomWord)
      this.setState({
        word: randomWord
      })
    })

  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress)
  }

  constructor(props){
    super(props);

    // Update words to pick randomly

    this.state = {
      current: 0,
      cells: new Array(25).fill(null),
      word: null,
      complete: -1,
      finished: false

    }
  }

  handleKeyPress = (event) => {

    // Disable key handling if word is guessd
    if (this.state.finished){
      return
    }

    // Check if key was a letter
    if (event.key == "Backspace") {
      // Prevent backspace if start of line or end of puzzle
      if (this.state.current % 5 === 0 || this.state.current === 24){
        return
      } 
      // Otherwise, move back one cell
      else {
        this.setState(state => {

          let newCells = [...state.cells]

          newCells[state.current - 1] = null

          return {
            cells: newCells,
            current: state.current - 1
          }
        })
      }
    }
    else if (/[a-zA-Z]/.test(event.key) && event.key.length == 1){

      this.setState(state => {

        const updatedCells = [...state.cells]
        updatedCells[state.current] = event.key.toUpperCase()

        return {
          current: state.current + 1,
          cells: updatedCells
        }

      })

    // Check if end of row
    if ((this.state.current + 1) % 5  === 0){

      this.setState(state => {

        // Construct the word from the previous five cells
        let indices = []
        for (let i = state.current - 5; i < state.current; i++){
          indices.push(i)
        }

        // Get the corresponding cells
        let selectedCells = indices.map(index => state.cells[index])
        let guess = selectedCells.join("")

        // Check that previous five cells match letters of the word
        if (guess === state.word){
          return {
            complete: state.complete + 1,
            finished: true
          }
        }
        else {
          return {
            complete: state.complete + 1
            }
        }
    })

    }

    }
    else {
      return
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

  refresh = () => {
    window.location.reload();
  }

  render() {
    let rows = [];

    for (let row = 0; row < 6; row++){
      let cells = []

      for (let col = 0; col < 5; col++){

        let cell = row + col + (row * 4)

        cells.push(        
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

    let gameOverMessage = this.state.finished ?

      <div onClick={this.refresh}>
        You win. <br/>
        Play again?
      </div>
    : ""

    gameOverMessage = this.state.complete === 5 ?
    
      <div onClick={this.refresh}>
        You lose. The word was {this.state.word}. <br/>
        Play again?
      </div>
      : gameOverMessage
  
    return (
      <div>
        <table id={this.state.finished || this.state.complete === 5 ? "end": ""}>
          <tbody>
            {rows}
          </tbody>
        </table>
        <div 
        id={this.state.finished || this.state.complete === 5 ? "game-end": "game-underway"}>
          {gameOverMessage}
        </div>
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
