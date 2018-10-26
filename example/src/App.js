import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import { useInput, useBoolean, useNumber, useArray } from "react-hanger";

const App = () => {
  const newTodo = useInput("");
  const showCounter = useBoolean(true);
  const counter = useNumber(0);
  const todos = useArray(["hi there", "sup", "world"]);

  return (
    <div>
      <button onClick={showCounter.toggle}> toggle counter </button>
      <button onClick={counter.increase}> increase </button>
      {showCounter.value && <span> {counter.value} </span>}
      <button onClick={counter.decrease}> decrease </button>
      <br /> <br />
      <button onClick={todos.clear}>clear todos</button>
      <input
        type="text"
        onChange={newTodo.onChangeHandler}
        value={newTodo.value}
        placeholder="new todo"
      />
      <button
        disabled={!newTodo.hasValue}
        onClick={() => {
          todos.add(newTodo.value);
          newTodo.clear();
        }}
      >
        add
      </button>
      <ul>
        {todos.value.map((todo, i) => (
          <li key={i}>
            {todo}
            <button onClick={() => todos.removeIndex(i)}>delete</button>
          </li>
        ))}
      </ul>
      <button onClick={todos.clear}> clear todos </button>
    </div>
  );
};

export default App;
