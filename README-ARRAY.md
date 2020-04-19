## API Reference (array destructuring)

### How to import?

```
import { useBoolean } from 'react-hanger/array' // will import all of functions
import useBoolean from 'react-hanger/array/useBoolean' // will import only this function
```

### useBoolean

```jsx
const [showCounter, actions] = useBoolean(true);
```

Actions:

- `toggle`
- `setTrue`
- `setFalse`

### useNumber

```jsx
const [counter] = useNumber(0);
const [limitedNumber] = useNumber(3, { upperLimit: 5, lowerLimit: 3 });
const [rotatingNumber] = useNumber(0, {
  upperLimit: 5,
  lowerLimit: 0,
  loop: true
});
```

Actions:

Both `increase` and `decrease` take an optional `amount` argument which is 1 by default, and will override the `step` property if it's used in the options.

- `increase(amount = 1)`
- `decrease(amount = 1 )`

Options:

- `lowerLimit`
- `upperLimit`
- `loop`
- `step` - sets the increase/decrease amount of the number upfront, but it can still be overriden by `number.increase(3)` or `number.decrease(5)`

### useInput

This one is unique, since it returns tuple as a first element, where first element is `value` and second is `hasValue`
Second element is `actions` as usual

```typescript
type UseInputActions = {
  setValue: React.Dispatch<SetStateAction<string>>;
  onChange: (e: React.SyntheticEvent) => void
  clear: () => void
}
type UseInput = [[string, boolean], UseInputActions]
```

```jsx
const [[newTodo], actions] = useInput("");
```

```jsx
<input value={newTodo} onChange={actions.onChange} />
```
Actions:

- `clear`
- `onChange` - default native event.target.value handler

Properties:

- `hasValue` -

### useBindToInput

Designed to be used in composition with `useInput`.
First and second elements are the same as `useInput.
Third are bindings to spread.

```jsx
const [[newTodo], actions, { nativeBind, valueBind }] = useBindToInput(useInput(""));
```

```jsx
<input value={newTodo} onChange={actions.onChange} />
<input {...nativeBind} />
<Slider {...valueBind} />
```

Actions:

- `nativeBind` - binds the `value` and `onChange` props to an input that has `e.target.value`
- `valueBind` - binds the `value` and `onChange` props to an input that's using only `value` in `onChange` (like most external components)

### useArray

```jsx
const [todos, actions] = useArray([]);
```

Actions:

- `push`
- `unshift`
- `pop`
- `shift`
- `clear`
- `removeIndex`
- `removeById` - if array consists of objects with some specific `id` that you pass
all of them will be removed
- `modifyById` - if array consists of objects with some specific `id` that you pass
these elements will be modified.
- `move` - moves item from position to position shifting other elements. 
```
    So if input is [1, 2, 3, 4, 5]
    
    from  | to    | expected
    3     | 0     | [4, 1, 2, 3, 5]
    -1    | 0     | [5, 1, 2, 3, 4]
    1     | -2    | [1, 3, 4, 2, 5]
    -3    | -4    | [1, 3, 2, 4, 5]
```

### useMap

```jsx
const [someMap, someMapActions] = useMap([["key", "value"]]);
const [anotherMap, anotherMapActions] = useMap(new Map([["key", "value"]]));
```

Actions:

- `set`
- `delete`
- `clear`
- `initialize` - applies tuples or map instances
- `setValue`
 

## useSetState

```jsx
const [state, setState, resetState] = useSetState({ loading: false });
setState({ loading: true, data: [1, 2, 3] });
```

Actions:

- `setState(value)` - will merge the `value` with the current `state` (like this.setState works in React)
- `resetState()` - will reset the current `state` to the `value` which you pass to the `useSetState` hook

Properties:

- `state` - the current state

## usePrevious

Use it to get the previous value of a prop or a state value.  
It's from the official [React Docs](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state).  
It might come out of the box in the future.

```jsx
const Counter = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return (
    <h1>
      Now: {count}, before: {prevCount}
    </h1>
  );
};
```

### Migration from object to array based

All value based hooks like `useBoolean`, `useNumber` etc. Are changed to 
be using arrays, since it's more safe for reference equality, and also 
makes it easier to use many `useSmth` without renaming `value` in destructuring.

So if you had 
```javascript
const { value: showHeader, ...showHeaderActions } = useBoolean(true)
const { value: showFooter, ...setShowFooterActions } = useBoolean(true)
```
It will become
```javascript
const [showHeader, showHeaderActions] = useBoolean(true)
const [showFooter, showFooterActions] = useBoolean(true)
```

Note that despite this code seems to be looking the same, it's not. Cause `showHeaderActions` in v1 will result
in new object reference every rerender (because spreading creates new object, hence new reference). While in v2 actions are memoized 
using `useMemo` and their reference will not change, cause they are not rely on value.
It enables us passing `actions` down the props without useless re-renders and excessive destructuring, it prevents `useEffects` and
other hooks from re-run/new reference creation if autofix of ESLint rule `react-hooks/extraneous-deps` will add them as dependencies automatically.

### useInput migration
Also big change to the `useInput`
If before you was not using `eventBind` and `nativeBind` from them, then using the same approach from above
you will get what you want. 
But if you need bindings you need to compose `useInput` with `useBindToInput` like that:
So if you had
```jsx
const { value, eventBind, valueBind, onChange, hasValue } = useInput("")

<input value={value} onChange={onChange} />
<input {...eventBind} />
{hasValue && <Slider {...valueBind} />}
```
It will become
```jsx
const [[value, hasValue], actions, { eventBind, valueBind }] = useBindToInput(useInput(""))

<input value={value} onChange={actions.onChange} />
<input {...eventBind} />
{hasValue && <Slider {...valueBind} />}
```

Note that first element in destructured array has tuple of `[value, hasValue]` since it's for values
and second argument is for `actions` e.g. only for functions.