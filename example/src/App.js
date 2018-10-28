import React, { useEffect } from "react";

import {
  useInput,
  useBoolean,
  useNumber,
  useArray,
  useSetState
} from "react-hanger";

const Counter = ({ counter }) => {
  return (
    <div>
      <button onClick={counter.increase}> increase</button>
      <div> {counter.value} </div>
      <button onClick={counter.decrease}> decrease </button>
    </div>
  );
};

const App = () => {
  const newTodo = useInput("");
  const showCounter = useBoolean(true);
  const limitedNumber = useNumber(3, { lowerLimit: 0, upperLimit: 5 });
  const rotatingNumber = useNumber(0, {
    lowerLimit: 0,
    upperLimit: 4,
    loop: true
  });
  const counter = useNumber(0);
  const todos = useArray(["hi there", "sup", "world"]);
  const { state, setState } = useSetState({ loading: false, data: true });

  return (
    <div style={{ padding: 20 }}>
      <h3>Counter</h3>
      <button onClick={showCounter.toggle}> toggle counter </button>
      {showCounter.value && <Counter counter={counter} />}
      <h3>Limited number</h3>
      <div>
        This number will stop increasing/decreasing when it reaches the
        "lowerLimit" or the "upperLimit"
      </div>
      <br />
      <button onClick={limitedNumber.increase}> increase </button>
      <div> {limitedNumber.value} </div>
      <button onClick={limitedNumber.decrease}> decrease </button>
      <h3>Rotating number</h3>
      <div>
        This number will loop back to the "lowerLimit" if it reaches the
        "upperLimit" and vice-versa
      </div>
      <br />
      <button onClick={rotatingNumber.increase}> increase </button>
      <div> {rotatingNumber.value} </div>
      <button onClick={rotatingNumber.decrease}> decrease </button>
      <h3>Todos</h3>
      <br /> <br />
      <input type="text" {...newTodo.bindToInput} placeholder="new todo" />
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
