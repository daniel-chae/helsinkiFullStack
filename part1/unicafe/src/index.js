import React, { useState } from "react";
import ReactDOM from "react-dom";

const SecHeader = ({ title }) => <h2>{title}</h2>;

const Button = ({ clickHandler, text }) => (
  <button onClick={clickHandler}>{text}</button>
);

const Statistic = ({ text, stat }) => (
  <tr>
    <td>{text}</td>
    <td>{stat}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const getAll = () => good + neutral + bad;
  const getAverage = () => (good - bad) / getAll();
  const getPositive = () => `${(good / getAll()) * 100} %`;

  if (getAll() === 0) {
    return <p>No feedback given</p>;
  }
  return (
    <table>
      <tbody>
        <Statistic text={"good"} stat={good} />
        <Statistic text={"neutral"} stat={neutral} />
        <Statistic text={"bad"} stat={bad} />
        <Statistic text={"all"} stat={getAll()} />
        <Statistic text={"average"} stat={getAverage()} />
        <Statistic text={"positive"} stat={getPositive()} />
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <SecHeader title="Give feedback" />
      <Button
        text="good"
        clickHandler={() => {
          setGood(good + 1);
        }}
      />
      <Button
        text="neutral"
        clickHandler={() => {
          setNeutral(neutral + 1);
        }}
      />
      <Button
        text="bad"
        clickHandler={() => {
          setBad(bad + 1);
        }}
      />
      <SecHeader title="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
