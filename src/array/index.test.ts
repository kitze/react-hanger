import { renderHook, cleanup, act } from 'react-hooks-testing-library';
import { useNumber } from './useNumber';
import { useArray } from './useArray';
import { useBoolean } from './useBoolean';
import { useInput } from './useInput';
import { useBindToInput } from './useBindToInput';
import { useSetState } from './useSetState';
import { useMap } from './useMap';
import { useSet } from './useSet';

afterEach(cleanup);
describe('useNumber array', () => {
  it('should increase value with concrete value', () => {
    // given
    const { result } = renderHook(() => useNumber(5));
    const [, actions] = result.current;
    // when
    act(() => actions.increase(5));
    // then
    expect(result.current[0]).toBe(10);
  });
  it('should increase value by default step', () => {
    // given
    const { result } = renderHook(() => useNumber(5));
    const [, actions] = result.current;
    // when
    act(() => actions.increase());
    // then
    expect(result.current[0]).toBe(6);
  });
  it('should increase value by predefined step', () => {
    // given
    const { result } = renderHook(() => useNumber(5, { step: 3 }));
    const [, actions] = result.current;
    // when
    act(() => actions.increase());
    // then
    expect(result.current[0]).toBe(8);
  });
  it('should decrease value with concrete value', () => {
    // given
    const { result } = renderHook(() => useNumber(5));
    const [, actions] = result.current;
    // when
    act(() => actions.decrease(5));
    // then
    expect(result.current[0]).toBe(0);
  });
  it('should decrease value by default step', () => {
    // given
    const { result } = renderHook(() => useNumber(5));
    const [, actions] = result.current;
    // when
    act(() => actions.decrease());
    // then
    expect(result.current[0]).toBe(4);
  });
  it('should decrease value by predefined step', () => {
    // given
    const { result } = renderHook(() => useNumber(5, { step: 3 }));
    const [, actions] = result.current;
    // when
    act(() => actions.decrease());
    // then
    expect(result.current[0]).toBe(2);
  });
  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useNumber(5));
      const [, originalActionsReference] = result.current;
      expect(result.current[1]).toBe(originalActionsReference);
      // when
      act(() => originalActionsReference.increase(5));
      // then
      expect(originalActionsReference).toBe(result.current[1]);
    });
  });
});

describe('useInput array', () => {
  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useInput(5));
      const [, originalActionsReference] = result.current;
      expect(result.current[1]).toBe(originalActionsReference);
      // when
      act(() => originalActionsReference.setValue('1'));
      // then
      expect(originalActionsReference).toBe(result.current[1]);
    });
  });
});

describe('useBindToInput', () => {
  describe('hooks optimizations', () => {
    it('should keep values array reference equality after rerender with no value change', () => {
      // given
      const { result, rerender } = renderHook(() => useBindToInput(useInput(5)));
      const [originalValueArray] = result.current;
      expect(result.current[0]).toBe(originalValueArray);
      // when
      act(() => rerender());
      // then
      expect(originalValueArray).toEqual(result.current[0]);
      expect(originalValueArray).toBe(result.current[0]);
    });
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useBindToInput(useInput(5)));
      const [, originalActionsReference] = result.current;
      expect(result.current[1]).toBe(originalActionsReference);
      // when
      act(() => originalActionsReference.setValue('1'));
      // then
      expect(originalActionsReference).toBe(result.current[1]);
    });
    it('should not keep bindings reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useBindToInput(useInput(5)));
      const [, actions, originalBindingsReference] = result.current;
      expect(result.current[2]).toBe(originalBindingsReference);
      // when
      act(() => actions.setValue('1'));
      // then
      expect(originalBindingsReference).not.toBe(result.current[2]);
    });
  });
});

describe('useSetState array', () => {
  it('should change and merge state', () => {
    type State = {
      field: number;
      field2: number;
      field3?: number;
    };
    const { result } = renderHook(() => useSetState<State>({ field: 1, field2: 2 }));
    const [, actions] = result.current;

    expect(result.current[0]).toEqual({ field: 1, field2: 2 });

    act(() => actions({ field: 2, field3: 3 }));

    expect(result.current[0]).toEqual({ field: 2, field2: 2, field3: 3 });
  });
  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useSetState({}));
      const [, originalActionsReference] = result.current;
      expect(result.current[1]).toBe(originalActionsReference);
      // when
      act(() => originalActionsReference([1]));
      // then
      expect(originalActionsReference).toBe(result.current[1]);
    });
  });
});

describe('useArray array', () => {
  it('should add item', () => {
    const { result } = renderHook(() => useArray<string>([]));
    const [, actions] = result.current;
    expect(result.current[0].length).toBe(0);

    act(() => actions.add('test'));

    expect(result.current[0].length).toBe(1);
  });

  it('should remove item by index', () => {
    const { result } = renderHook(() => useArray(['test', 'test1', 'test2']));
    const [, actions] = result.current;
    expect(result.current[0].length).toBe(3);

    act(() => actions.removeIndex(1));

    expect(result.current[0].length).toBe(2);
    expect(result.current[0][1]).toBe('test2');
  });

  it('should remove item by id', () => {
    const { result } = renderHook(() => useArray([{ id: 1 }, { id: 2 }]));
    const [, actions] = result.current;
    expect(result.current[0].length).toBe(2);

    act(() => actions.removeById(2));

    expect(result.current[0].length).toBe(1);
  });

  it('should clear the array', () => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]));
    const [, actions] = result.current;

    expect(result.current[0].length).toBe(5);

    act(() => actions.clear());

    expect(result.current[0].length).toBe(0);
  });

  it('should change array', () => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]));
    const [, actions] = result.current;

    expect(result.current[0].length).toBe(5);

    act(() => actions.setValue(it => [...it, 6]));

    expect(result.current[0].length).toBe(6);
    expect(result.current[0][5]).toBe(6);
  });

  it.each`
    from  | to    | expected
    ${3}  | ${0}  | ${[4, 1, 2, 3, 5]}
    ${-1} | ${0}  | ${[5, 1, 2, 3, 4]}
    ${1}  | ${-2} | ${[1, 3, 4, 2, 5]}
    ${-3} | ${-4} | ${[1, 3, 2, 4, 5]}
  `('should move items in the array from: $from to: $to expected: $expected', ({ from, to, expected }) => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]));
    const [, actions] = result.current;

    expect(result.current[0]).toEqual([1, 2, 3, 4, 5]);
    act(() => actions.move(from, to));
    expect(result.current[0]).toEqual(expected);
  });

  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useArray<any>([]));
      const [, originalActionsReference] = result.current;
      expect(result.current[1]).toBe(originalActionsReference);
      // when
      act(() => originalActionsReference.add(1));
      // then
      expect(originalActionsReference).toBe(result.current[1]);
    });
  });
});

describe('useBoolean array', () => {
  it('should set true', () => {
    const { result } = renderHook(() => useBoolean(false));
    const [, actions] = result.current;

    expect(result.current[0]).toBe(false);

    act(() => actions.setTrue());

    expect(result.current[0]).toBe(true);
  });

  it('should set false', () => {
    const { result } = renderHook(() => useBoolean(true));
    const [, actions] = result.current;

    expect(result.current[0]).toBe(true);

    act(() => actions.setFalse());

    expect(result.current[0]).toBe(false);
  });

  it('should toggle', () => {
    const { result } = renderHook(() => useBoolean(true));
    const [, actions] = result.current;
    expect(result.current[0]).toBe(true);

    act(() => actions.toggle());

    expect(result.current[0]).toBe(false);

    act(() => actions.toggle());
    expect(result.current[0]).toBe(true);
  });

  describe('hooks optimizations', () => {
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useBoolean(true));
      const [, originalActionsReference] = result.current;
      expect(result.current[1]).toBe(originalActionsReference);
      // when
      act(() => originalActionsReference.setFalse());
      // then
      expect(originalActionsReference).toBe(result.current[1]);
    });
  });
});

describe('useMap array', () => {
  describe('set', () => {
    it('should update old value', () => {
      // given
      const { result } = renderHook(() => useMap<number, string>([[1, 'default']]));
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBe('default');
      // when
      act(() => actions.set(1, 'changed'));
      // then
      expect(result.current[0].get(1)).toBe('changed');
    });
    it('should add new value', () => {
      // given
      const { result } = renderHook(() => useMap<number, string>());
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBeUndefined();
      // when
      act(() => actions.set(1, 'added'));
      // then
      expect(result.current[0].get(1)).toBe('added');
    });
  });

  describe('remove', () => {
    it('should delete existing value', () => {
      // given
      const { result } = renderHook(() => useMap<number, string>([[1, 'existing']]));
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBe('existing');
      // when
      act(() => actions.remove(1));
      // then
      expect(result.current[0].get(1)).toBeUndefined();
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
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBeUndefined();
      // when
      act(() => actions.initialize(input));
      // then
      expect(result.current[0].get(1)).toBe('initialized');
    });
  });

  describe('clear', () => {
    it('clears the map state and gets values', () => {
      // given
      const { result } = renderHook(() => useMap<number, string>([[1, 'initialized']]));
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBe('initialized');
      // when
      act(() => actions.clear());
      // then
      expect(result.current[0].get(1)).toBeUndefined();
    });
  });

  describe('hooks optimizations', () => {
    it('should change value reference equality after change', () => {
      // given
      const { result } = renderHook(() => useMap<number, number>());
      const [originalValueReference, actions] = result.current;
      expect(result.current[0]).toBe(originalValueReference);
      // when
      act(() => actions.set(1, 1));
      // then
      expect(originalValueReference).not.toBe(result.current[0]);
      expect(originalValueReference.get(1)).toBeUndefined();
      expect(result.current[0].get(1)).toBe(1);
    });
    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useMap<number, number>());
      const [, originalActionsReference] = result.current;
      expect(result.current[1]).toBe(originalActionsReference);
      // when
      act(() => originalActionsReference.set(1, 1));
      // then
      expect(originalActionsReference).toBe(result.current[1]);
    });
  });
});

describe('useSet array', () => {
  const initial = new Set([1, 2, 3]);

  it('should update old value', () => {
    // given
    const { result } = renderHook(() => useSet<number>(initial));
    const [value, { setValue }] = result.current;

    expect(value).toEqual(initial);
    // when
    act(() => setValue(new Set([2])));
    // then
    expect(result.current[0]).toEqual(new Set([2]));
  });

  it('should add new value', () => {
    // given
    const { result } = renderHook(() => useSet<number>(initial));
    const [, { add }] = result.current;
    // when
    act(() => add(4));
    // then
    expect(result.current[0]).toEqual(new Set([1, 2, 3, 4]));
  });

  it('should remove a value', () => {
    // given
    const { result } = renderHook(() => useSet<number>(initial));
    const [, { remove }] = result.current;
    // when
    act(() => remove(2));
    // then
    expect(result.current[0]).toEqual(new Set([1, 3]));
  });

  it('should clear', () => {
    // given
    const { result } = renderHook(() => useSet<number>(initial));
    const [, { clear }] = result.current;
    // when
    act(() => clear());
    // then
    expect(result.current[0]).toEqual(new Set());
  });

  describe('hooks optimizations', () => {
    it('should change value reference equality after change', () => {
      // given
      const { result } = renderHook(() => useSet<number>(initial));
      const [originalValueReference, actions] = result.current;
      expect(result.current[0]).toBe(originalValueReference);
      // when
      act(() => actions.setValue(new Set([1])));
      // then
      expect(originalValueReference).not.toBe(result.current[0]);
    });

    it('should keep actions reference equality after value change', () => {
      // given
      const { result } = renderHook(() => useSet<number>(initial));
      const [, originalActionsReference] = result.current;
      expect(result.current[1]).toBe(originalActionsReference);
      // when
      act(() => originalActionsReference.setValue(new Set([1])));
      // then
      expect(originalActionsReference).toBe(result.current[1]);
    });
  });
});
