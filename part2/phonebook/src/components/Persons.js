import React from "react";
import Person from "./Person";

// From here ----------------------------------------------------------> Persons component
const Persons = ({ filteredPersons, onDeletePerson }) => (
  <div>
    {filteredPersons.map((person) => (
      <Person
        person={person}
        key={person.name}
        onDeletePerson={onDeletePerson}
      />
    ))}
  </div>
);

export default Persons;
