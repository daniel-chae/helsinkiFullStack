import React from "react";

// From here ----------------------------------------------------------> Person component
const Person = ({ person, onDeletePerson }) => (
  <div>
    {person.name} {person.number}
    <button onClick={() => onDeletePerson(person)}>delete</button>
  </div>
);

export default Person;
