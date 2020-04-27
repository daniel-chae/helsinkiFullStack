import React, { useState, useEffect } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import phonebookServices from "./services/phonebookServices";

const App = () => {
  // From here ----------------------------------------------------------> Defined for useState hook
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // From here ----------------------------------------------------------> Defined for useEffect hook
  const hook = () => {
    phonebookServices.getPersons().then((persons) => {
      setPersons(persons);
    });
  };

  useEffect(hook, []);

  // From here ----------------------------------------------------------> Defined for Filter component
  const onFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
  };

  // From here ----------------------------------------------------------> Defined for PersonFrom Component
  const onNameChange = (e) => {
    setNewName(e.target.value);
  };

  const onNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const onEntrySubmit = (e) => {
    e.preventDefault();

    const personToUpdate = persons.find(
      (person) =>
        person.name.toLocaleLowerCase() === newName.toLocaleLowerCase()
    );

    if (personToUpdate) {
      const confirm = window.confirm(
        `${personToUpdate.name} is already added to phonebook, replace the old number with a new one?`
      );

      const id = personToUpdate.id;

      if (confirm) {
        const newData = {
          name: newName,
          number: newNumber,
          id,
        };
        phonebookServices
          .updatePerson(id, newData)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== updatedPerson.id ? person : updatedPerson
              )
            );
            setSuccessMessage(`Updated ${updatedPerson.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 2000);
          })
          .catch((err) => {
            setErrorMessage(err.response.data.error);
          });
      }
      setNewName("");
      setNewNumber("");
      return;
    }

    const newEntry = {
      name: newName,
      number: newNumber,
    };

    phonebookServices
      .createPerson(newEntry)
      .then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setSuccessMessage(`Created ${newPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      })
      .catch((err) => {
        setErrorMessage(err.response.data.error);
      });

    setNewName("");
    setNewNumber("");
  };

  // From here ----------------------------------------------------------> Defined for Person component
  const filterPersons = (filterKeyword) => {
    return persons.filter((person) =>
      person.name
        .toLocaleLowerCase()
        .includes(filterKeyword.toLocaleLowerCase())
    );
  };

  const filteredPersons = filter ? filterPersons(filter) : persons;

  const onDeletePerson = (person) => {
    const confirm = window.confirm(`Delete ${person.name} ?`);
    if (confirm) {
      return phonebookServices
        .deletePerson(person.id)
        .then((response) => {
          setPersons(
            persons.filter((deletedPerson) => deletedPerson.id !== person.id)
          );
          setSuccessMessage(
            `Information of ${person.name} is successfully deleted from server`
          );
          setTimeout(() => {
            setSuccessMessage(null);
          }, 2000);
        })
        .catch((error) => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
          setPersons(persons.filter((target) => target.id !== person.id));
        });
    }
    return;
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} messageType="success" />
      <Notification message={errorMessage} messageType="error" />
      <Filter filter={filter} onFilterChange={onFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onEntrySubmit={onEntrySubmit}
        newName={newName}
        newNumber={newNumber}
        onNameChange={onNameChange}
        onNumberChange={onNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        filteredPersons={filteredPersons}
        onDeletePerson={onDeletePerson}
      />
    </div>
  );
};

export default App;
