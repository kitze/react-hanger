import { renderHook, cleanup, act } from 'react-hooks-testing-library';
import { useStateful } from './useStateful';
import { useNumber } from './useNumber';
import { useArray } from './useArray';
import { useBoolean } from './useBoolean';
import { useInput } from './useInput';
import { useSetState } from './useSetState';
import { useMap } from './useMap';
import { useSet } from './useSet';

afterEach(cleanup);
describe('useStateful', () => {
  it('should change value', () => {
    const { result } = renderHook(() => useStateful('initial'));
    expect(result.current.value).toBe('initial');

    act(() => result.current.setValue('changed'));

    expect(result.current.value).toBe('changed');
  });
});

describe('useNumber', () => {
  it('should increase value with concrete value', () => {
    // given
    const { result } = renderHook(() => useNumber(5));
    const { increase } = result.current;
    // when
    act(() => increase(5));
    // then
    expect(result.current.value).toBe(10);
  });
  it('should increase value by default step', () => {
    // given
    const { result } = renderHook(() => useNumber(5));
    const { increase } = result.current;
    // when
    act(() => increase());
    // then
    expect(result.current.value).toBe(6);
  });
  it('should increase value by predefined step', () => {
    // given
    const { result } = renderHook(() => useNumber(5, { step: 3 }));
    const { increase } = result.current;
    // when
    act(() => increase());
    // then
    expect(result.current.value).toBe(8);
  });
  it('should decrease value with concrete value', () => {
    // given
    const { result } = renderHook(() => useNumber(5));
    const { decrease } = result.current;
    // when
    act(() => decrease(5));
    // then
    expect(result.current.value).toBe(0);
  });
  it('should decrease value by default step', () => {
    // given
    const { result } = renderHook(() => useNumber(5));
    const { decrease } = result.current;
    // when
    act(() => decrease());
    // then
    expect(result.current.value).toBe(4);
  });
  it('should decrease value by predefined step', () => {
    // given
    const { result } = renderHook(() => useNumber(5, { step: 3 }));
    const { decrease } = result.current;
    // when
    act(() => decrease());
    // then
    expect(result.current.value).toBe(2);
  });
  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useNumber(5));
      const { increase } = result.current;
      expect(result.current.increase).toBe(increase);
      // when
      act(() => increase(5));
      // then
      expect(increase).toBe(result.current.increase);
    });
  });
});

describe('useInput', () => {
  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useInput(5));
      const { setValue } = result.current;
      expect(result.current.setValue).toBe(setValue);
      // when
      act(() => setValue('1'));
      // then
      expect(setValue).toBe(result.current.setValue);
    });
  });
});

describe('useSetState', () => {
  it('should change and merge state', () => {
    type State = {
      field: number;
      field2: number;
      field3?: number;
    };
    const { result } = renderHook(() => useSetState<State>({ field: 1, field2: 2 }));
    const { setState } = result.current;

    expect(result.current.state).toEqual({ field: 1, field2: 2 });

    act(() => setState({ field: 2, field3: 3 }));

    expect(result.current.state).toEqual({ field: 2, field2: 2, field3: 3 });
  });
  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useSetState<{}>({}));
      const { setState } = result.current;
      expect(result.current.setState).toBe(setState);
      // when
      act(() => setState([1]));
      // then
      expect(setState).toBe(result.current.setState);
    });
  });
});

describe('useArray', () => {
  it('should add item', () => {
    const { result } = renderHook(() => useArray<string>([]));
    const { add } = result.current;
    expect(result.current.value.length).toBe(0);

    act(() => add('test'));

    expect(result.current.value.length).toBe(1);
  });

  it('should remove item by index', () => {
    const { result } = renderHook(() => useArray(['test', 'test1', 'test2']));
    const { removeIndex } = result.current;
    expect(result.current.value.length).toBe(3);

    act(() => removeIndex(1));

    expect(result.current.value.length).toBe(2);
    expect(result.current.value[1]).toBe('test2');
  });

  it('should remove item by id', () => {
    const { result } = renderHook(() => useArray([{ id: 1 }, { id: 2 }]));
    const { removeById } = result.current;
    expect(result.current.value.length).toBe(2);

    act(() => removeById(2));

    expect(result.current.value.length).toBe(1);
  });

  it('should clear the array', () => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]));
    const { clear } = result.current;

    expect(result.current.value.length).toBe(5);

    act(() => clear());

    expect(result.current.value.length).toBe(0);
  });

  it('should change array', () => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]));
    const { setValue } = result.current;

    expect(result.current.value.length).toBe(5);

    act(() => setValue(it => [...it, 6]));

    expect(result.current.value.length).toBe(6);
    expect(result.current.value[5]).toBe(6);
  });

  it.each`
    from  | to    | expected
    ${3}  | ${0}  | ${[4, 1, 2, 3, 5]}
    ${-1} | ${0}  | ${[5, 1, 2, 3, 4]}
    ${1}  | ${-2} | ${[1, 3, 4, 2, 5]}
    ${-3} | ${-4} | ${[1, 3, 2, 4, 5]}
  `('should move items in the array from: $from to: $to expected: $expected', ({ from, to, expected }) => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]));
    const { move } = result.current;

    expect(result.current.value).toEqual([1, 2, 3, 4, 5]);
    act(() => move(from, to));
    expect(result.current.value).toEqual(expected);
  });

  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useArray<any>([]));
      const { add } = result.current;
      expect(result.current.add).toBe(add);
      // when
      act(() => add(1));
      // then
      expect(add).toBe(result.current.add);
    });
  });
});

describe('useBoolean', () => {
  it('should set true', () => {
    const { result } = renderHook(() => useBoolean(false));
    const { setTrue } = result.current;

    expect(result.current.value).toBe(false);

    act(() => setTrue());

    expect(result.current.value).toBe(true);
  });

  it('should set false', () => {
    const { result } = renderHook(() => useBoolean(true));
    const { setFalse } = result.current;

    expect(result.current.value).toBe(true);

    act(() => setFalse());

    expect(result.current.value).toBe(false);
  });

  it('should toggle', () => {
    const { result } = renderHook(() => useBoolean(true));
    const { toggle } = result.current;
    expect(result.current.value).toBe(true);

    act(() => toggle());

    expect(result.current.value).toBe(false);

    act(() => toggle());
    expect(result.current.value).toBe(true);
  });

  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useBoolean(true));
      const { setFalse } = result.current;
      expect(result.current.setFalse).toBe(setFalse);
      // when
      act(() => setFalse());
      // then
      expect(setFalse).toBe(result.current.setFalse);
    });
  });
});

describe('useMap', () => {
  describe('set', () => {
    it('should update old value', () => {
      // given
      const { result } = renderHook(() => useMap<number, string>([[1, 'default']]));
      const { set } = result.current;
      expect(result.current.value.get(1)).toBe('default');
      // when
      act(() => set(1, 'changed'));
      // then
      expect(result.current.value.get(1)).toBe('changed');
    });
    it('should add new value', () => {
      // given
      const { result } = renderHook(() => useMap<number, string>());
      const { set } = result.current;
      expect(result.current.value.get(1)).toBeUndefined();
      // when
      act(() => set(1, 'added'));
      // then
      expect(result.current.value.get(1)).toBe('added');
    });
  });

  describe('remove', () => {
    it('should delete existing value', () => {
      // given
      const { result } = renderHook(() => useMap<number, string>([[1, 'existing']]));
      const { remove } = result.current;
      expect(result.current.value.get(1)).toBe('existing');
      // when
      act(() => remove(1));
      // then
      expect(result.current.value.get(1)).toBeUndefined();
    });
  });

  describe('initialize', () => {
    it.each`
      message    | input
      ${'map'}   | ${new Map([[1, 'initialized']])}
      ${'tuple'} | ${[[1, 'initialized']]}
    `('initializes with $message', ({ input }) => {
      // given
      const { result } = renderHook(() => useMap<number, string>());
      const { initialize } = result.current;
      expect(result.current.value.get(1)).toBeUndefined();
      // when
      act(() => initialize(input));
      // then
      expect(result.current.value.get(1)).toBe('initialized');
    });
  });

  describe('clear', () => {
    it('clears the map state and gets values', () => {
      // given
      const { result } = renderHook(() => useMap<number, string>([[1, 'initialized']]));
      const { clear } = result.current;
      expect(result.current.value.get(1)).toBe('initialized');
      // when
      act(() => clear());
      // then
      expect(result.current.value.get(1)).toBeUndefined();
    });
  });

  describe('hooks optimizations', () => {
    it('should change value reference equality after change', () => {
      // given
      const { result } = renderHook(() => useMap<number, number>());
      const { value, set } = result.current;
      expect(result.current.value).toBe(value);
      // when
      act(() => set(1, 1));
      // then
      expect(value).not.toBe(result.current.value);
      expect(value.get(1)).toBeUndefined();
      expect(result.current.value.get(1)).toBe(1);
    });
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useMap<number, number>());
      const { set } = result.current;
      expect(result.current.set).toBe(set);
      // when
      act(() => set(1, 1));
      // then
      expect(set).toBe(result.current.set);
    });
  });
});

describe('useSet', () => {
  const initial = new Set([1, 2, 3]);

  it('should update old value', () => {
    // given
    const { result } = renderHook(() => useSet<number>(initial));
    const { setValue } = result.current;
    expect(new Set(result.current)).toEqual(initial);
    // when
    act(() => setValue(new Set([2])));
    // then
    expect(new Set(result.current)).toEqual(new Set([2]));
  });

  it('should add new value', () => {
    // given
    const { result } = renderHook(() => useSet<number>(initial));
    const { add } = result.current;
    // when
    act(() => add(4));
    // then
    expect(new Set(result.current)).toEqual(new Set([1, 2, 3, 4]));
  });

  it('should remove a value', () => {
    // given
    const { result } = renderHook(() => useSet<number>(initial));
    const { remove } = result.current;
    // when
    act(() => remove(2));
    // then
    expect(new Set(result.current)).toEqual(new Set([1, 3]));
  });

  it('should clear', () => {
    // given
    const { result } = renderHook(() => useSet<number>(initial));
    const { clear } = result.current;
    // when
    act(() => clear());
    // then
    expect(new Set(result.current)).toEqual(new Set());
  });

  it('should check presence', () => {
    // given
    const { result } = renderHook(() => useSet<number>(initial));
    const { has } = result.current;
    // then
    expect(has(0)).toBeFalsy();
    expect(has(2)).toBeTruthy();
  });

  it('should return keys', () => {
    // given
    const initial = new Set([1, 2, 3]);
    const { result } = renderHook(() => useSet<number>(initial));
    const { keys } = result.current;
    // then
    expect(Array.from(keys())).toEqual([1, 2, 3]);
  });

  it('should return values', () => {
    // given
    const initial = new Set([1, 2, 3]);
    const { result } = renderHook(() => useSet<number>(initial));
    const { values } = result.current;
    // then
    expect(Array.from(values())).toEqual([1, 2, 3]);
  });

  it('should return entries', () => {
    // given
    const initial = new Set([1, 2, 3]);
    const { result } = renderHook(() => useSet<number>(initial));
    const { entries } = result.current;
    // then
    expect(Array.from(entries())).toEqual([[1, 1], [2, 2], [3, 3]]);
  });

  it('should be an iterator', () => {
    // given
    const initial = new Set([1, 2, 3]);
    const { result } = renderHook(() => useSet<number>(initial));
    // then
    expect(Array.from(result.current)).toEqual([1, 2, 3]);
  });

  describe('hooks optimizations', () => {
    it('should change value reference equality after change', () => {
      // given
      const { result } = renderHook(() => useSet<number>());
      const value = result.current;
      // when
      act(() => value.setValue(initial));
      // then
      expect(value).not.toBe(result.current);
    });

    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useSet<number>());
      const { setValue } = result.current;
      expect(result.current.setValue).toBe(setValue);
      // when
      act(() => setValue(new Set([1, 1])));
      // then
      expect(setValue).toBe(result.current.setValue);
    });
  });
});
