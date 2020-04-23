import React from "react";

const Header = ({ name }) => <h2>{name}</h2>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0);

  return (
    <div>
      {parts.map((part) => (
        <Part part={part} key={part.id} />
      ))}
      <p>
        <b>total of {total} exercises</b>
      </p>
    </div>
  );
};

const Course = ({ courses }) => (
  <div>
    {courses.map((course) => (
      <div key={course.id}>
        <Header name={course.name} />
        <Content parts={course.parts} />
      </div>
    ))}
  </div>
);

export default Course;
