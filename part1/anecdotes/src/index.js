import React, { useState } from "react";
import ReactDOM from "react-dom";

// Sub components
const SecHeader = ({ title }) => <h2>{title}</h2>;

const Anecdote = ({ noVote = false, anecdote }) => {
  if (noVote) {
    return <p>No vote yet!!!</p>;
  }
  return <p>{anecdote}</p>;
};

const Button = ({ text, clickHandler }) => (
  <button onClick={clickHandler}>{text}</button>
);

const Count = ({ count }) => <p>has {count} votes</p>;

// App component
const App = (props) => {
  const { anecdotes } = props;
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));

  const selectAnecdote = () => {
    const randomIdx = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIdx);
  };

  const upVote = () => {
    const newPoints = [...points];
    newPoints[selected] += 1;
    setPoints(newPoints);
  };

  const selectMostVoted = () => {
    return points.indexOf(Math.max(...points));
  };

  return (
    <div>
      <SecHeader title="Anecdote of the day" />
      <Anecdote anecdote={anecdotes[selected]} />
      <Count count={points[selected]} />
      <Button text="vote" clickHandler={upVote} />
      <Button text="next anecdote" clickHandler={selectAnecdote} />
      <SecHeader title="Anecdote with most votes" />
      <Anecdote
        noVote={Math.max(...points) === 0}
        anecdote={anecdotes[selectMostVoted()]}
      />
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
