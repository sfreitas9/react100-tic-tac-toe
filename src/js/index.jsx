import React from 'react';
import ReactDOM from 'react-dom';

function Square (props) {
  return (
    <button onClick={props.onClick}
      key={props.id} 
      className={"square " + (props.winner ? 'winner' : '')} >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)} 
      key={i}
      id={i}
      winner={this.props.winner.length > 0 && this.props.winner.includes(i)}
      />
    );
  }

  renderRows() {
    let rows = [];

    for (let r=0;r<3;r++) {
      let row = [];
      for (let c=0;c<3;c++) {
        row.push(this.renderSquare(r*3+c));
      }
      rows.push(<div className="board-row" key={r}>{row}</div>);
    }
    return rows;
  }

  render() {
      return (
      <div>
        {this.renderRows()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ 
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      ascSteps: true,
      xIsNext: true
    }
    this.handleAsc = this.handleAsc.bind(this);
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  handleClick(i) {
    const history = this.state.history.length > this.state.stepNumber + 1 ?
      this.state.history.slice(0,this.state.stepNumber+1) : this.state.history;
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).side || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length, 
      xIsNext: !this.state.xIsNext
    });
  }

  handleAsc(event) {
    this.setState({
      ascSteps: event.target.checked,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move} >
          <a href="#" onClick={() => this.jumpTo(move)} 
          className={this.state.stepNumber == move ? 'current' : ''}>{desc}</a>
        </li>
      );
    });
    
    let status;
    if (winner.side) {
      status = 'Winner: ' + winner.side;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

   return (
    <div>
      <h1>Play Tic Tac Toe</h1>
      <div className="game">
        <div className={status.includes("Winner") ? 'winner next' : 'next'}>{status}</div>
        <div className="game-board">
          <Board squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          winner={winner.line}
          />
        </div>
        <div className="game-info">
          <input type="checkbox" checked={this.state.ascSteps} onChange={this.handleAsc}/>Show moves ascending<br/>
          <ol className={this.state.ascSteps ? '' : 'reversed'}>{moves}</ol>
        </div>
      </div>
    </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        side: squares[a],
        line: lines[i]}; 
    }
  }
  return {side: null, line: []};
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
