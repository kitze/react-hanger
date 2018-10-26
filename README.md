# react-hanger

## Install

```bash
yarn add react-hanger
```

## Usage

```jsx
import React, { Component } from 'react'
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
      <button onClick={todos.clear}> clear todos </button>
      <input type="text" value={newTodo.value} onChange={newTodo.onChangeHangler}/>
    </div>
  )
};
```

### Example
[Open in CodeSandbox](https://codesandbox.io/s/44m70xm70)
