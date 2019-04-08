import { renderHook, cleanup, act } from 'react-hooks-testing-library'
import { useArray, useBoolean, useSetState, useStateful } from './index'

afterEach(cleanup)

describe('useStateful', () => {
  it('should change value', () => {
    const { result } = renderHook(() => useStateful('initial'))
    expect(result.current.value).toBe('initial')

    act(() => result.current.setValue('changed'))

    expect(result.current.value).toBe('changed')
  })
})

describe('useSetState', () => {
  it('should change and merge state', () => {
    type State = {
      field: number
      field2: number
      field3?: number
    }
    const { result } = renderHook(() => useSetState<State>({ field: 1, field2: 2 }))
    expect(result.current.state).toEqual({ field: 1, field2: 2 })

    act(() => result.current.setState({ field: 2, field3: 3 }))

    expect(result.current.state).toEqual({ field: 2, field2: 2, field3: 3 })
  })
})

describe('useArray', () => {
  it('should add item', () => {
    const { result } = renderHook(() => useArray([]))
    expect(result.current.value.length).toBe(0)

    act(() => result.current.add('test'))

    expect(result.current.value.length).toBe(1)
  })

  it('should remove item by index', () => {
    const { result } = renderHook(() => useArray(['test', 'test1', 'test2']))
    expect(result.current.value.length).toBe(3)

    act(() => result.current.removeIndex(1))

    expect(result.current.value.length).toBe(2)
    expect(result.current.value[1]).toBe('test2')
  })

  it('should remove item by id', () => {
    const { result } = renderHook(() => useArray([{ id: 1 }, { id: 2 }]))
    expect(result.current.value.length).toBe(2)

    act(() => result.current.removeById(2))

    expect(result.current.value.length).toBe(1)
  })

  it('should clear the array', () => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]))
    expect(result.current.value.length).toBe(5)

    act(() => result.current.clear())

    expect(result.current.value.length).toBe(0)
  })

  it('should change array', () => {
    const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]))
    expect(result.current.value.length).toBe(5)

    act(() => result.current.setValue(it => [...it, 6]))

    expect(result.current.value.length).toBe(6)
    expect(result.current.value[5]).toBe(6)
  })

  it.each`
    from  | to    | expected
    ${3}  | ${0}  | ${[4, 1, 2, 3, 5]}
    ${-1} | ${0}  | ${[5, 1, 2, 3, 4]}
    ${1}  | ${-2} | ${[1, 3, 4, 2, 5]}
    ${-3} | ${-4} | ${[1, 3, 2, 4, 5]}
  `(
    'should move items in the array from: $from to: $to expected: $expected',
    ({ from, to, expected }) => {
      const { result } = renderHook(() => useArray([1, 2, 3, 4, 5]))
      expect(result.current.value).toEqual([1, 2, 3, 4, 5])
      act(() => result.current.move(from, to))
      expect(result.current.value).toEqual(expected)
    },
  )
})

describe('useBoolean', () => {
  it('should set true', () => {
    const { result } = renderHook(() => useBoolean(false))
    expect(result.current.value).toBe(false)

    act(() => result.current.setTrue())

    expect(result.current.value).toBe(true)
  })
  it('should set false', () => {
    const { result } = renderHook(() => useBoolean(true))
    expect(result.current.value).toBe(true)

    act(() => result.current.setFalse())

    expect(result.current.value).toBe(false)
  })
  it('should toggle', () => {
    const { result } = renderHook(() => useBoolean(true))
    expect(result.current.value).toBe(true)

    act(() => result.current.toggle())
    expect(result.current.value).toBe(false)

    act(() => result.current.toggle())
    expect(result.current.value).toBe(true)
  })
})
