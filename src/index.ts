import {
  useCallback,
  useEffect,
  useRef,
  useState,
  SetStateAction,
  useMemo,
  Dispatch,
} from 'react'
import * as React from 'react'

type UseStateful<T = any> = {
  value: T
  setValue: React.Dispatch<SetStateAction<T>>
}
type Callback = (...args: any[]) => void | any

export function useStateful<T = any>(initial: T): UseStateful<T> {
  const [value, setValue] = useState(initial)
  return useMemo(
    () => ({
      value,
      setValue,
    }),
    [value],
  )
}

export type UseNumberActions = {
  setValue: UseStateful<number>['setValue']
  increase: (value?: number) => void
  decrease: (value?: number) => void
}

export type UseNumber = [number, UseNumberActions]

export function useNumber(
  initial: number,
  {
    upperLimit,
    lowerLimit,
    loop,
    step = 1,
  }: {
    upperLimit?: number
    lowerLimit?: number
    loop?: boolean
    step?: number
  } = {},
): UseNumber {
  const [value, setValue] = useState<number>(initial)
  const decrease = useCallback(
    (d?: number) => {
      setValue(aValue => {
        const decreaseBy = d !== undefined ? d : step
        const nextValue = aValue - decreaseBy

        if (lowerLimit !== undefined) {
          if (nextValue + decreaseBy > lowerLimit) {
            return nextValue
          }
          if (loop && upperLimit) {
            return upperLimit
          }
          return aValue
        }
        return nextValue
      })
    },
    [loop, lowerLimit, step, upperLimit],
  )
  const increase = useCallback(
    (i?: number) => {
      setValue(aValue => {
        const increaseBy = i !== undefined ? i : step
        const nextValue = aValue + increaseBy

        if (upperLimit !== undefined) {
          if (nextValue - increaseBy < upperLimit) {
            return nextValue
          }
          if (loop) {
            return initial
          }
          return aValue
        }
        return nextValue
      })
    },
    [initial, loop, step, upperLimit],
  )
  const actions = useMemo(
    () => ({
      setValue,
      increase,
      decrease,
    }),
    [decrease, increase],
  )
  return [value, actions]
}

type UseArrayActions<T> = {
  setValue: UseStateful<T[]>['setValue']
  add: (value: T) => void
  clear: () => void
  move: (from: number, to: number) => void
  removeById: (
    id: T extends { id: string } ? string : T extends { id: number } ? number : unknown,
  ) => void
  removeIndex: (index: number) => void
}

type UseArray<T = any> = [T[], UseArrayActions<T>]

export function useArray<T = any>(initial: T[]): UseArray<T> {
  const [value, setValue] = useState(initial)
  const add = useCallback(a => setValue(v => [...v, a]), [])
  const move = useCallback(
    (from: number, to: number) =>
      setValue(it => {
        const copy = it.slice()
        copy.splice(to < 0 ? copy.length + to : to, 0, copy.splice(from, 1)[0])
        return copy
      }),
    [],
  )
  const clear = useCallback(() => setValue(() => []), [])
  const removeById = useCallback(
    // @ts-ignore not every array that you will pass down will have object with id field.
    id => setValue(arr => arr.filter(v => v && v.id !== id)),
    [],
  )
  const removeIndex = useCallback(
    index =>
      setValue(v => {
        v.splice(index, 1)
        return v
      }),
    [],
  )
  const actions = useMemo(
    () => ({
      setValue,
      add,
      move,
      clear,
      removeById,
      removeIndex,
    }),
    [add, clear, move, removeById, removeIndex],
  )
  return [value, actions]
}

type UseBooleanActions = {
  setValue: React.Dispatch<SetStateAction<boolean>>
  toggle: () => void
  setTrue: () => void
  setFalse: () => void
}

type UseBoolean = [boolean, UseBooleanActions]

export function useBoolean(initial: boolean): UseBoolean {
  const [value, setValue] = useState<boolean>(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  const actions = useMemo(() => ({ setValue, toggle, setTrue, setFalse }), [
    setFalse,
    setTrue,
    toggle,
  ])
  return [value, actions]
}

type UseInputActions = {
  setValue: UseStateful<string>['setValue']
  onChange: (e: React.SyntheticEvent) => void
  clear: () => void
}
type UseInput = [[string, boolean], UseInputActions]

export function useInput(initial: string | number | boolean = ''): UseInput {
  const stringified = initial.toString()
  const [value, setValue] = useState<string>(stringified)
  const onChange = useCallback(e => setValue(e.target.value.toString()), [])

  const clear = useCallback(() => setValue(''), [])
  const hasValue = value !== undefined && value !== null && value.trim() !== ''
  const actions = useMemo(
    () => ({
      setValue,
      clear,
      onChange,
    }),
    [clear, onChange],
  )
  const values = useMemo(() => [value, hasValue], [hasValue, value]) as [string, boolean]
  return [values, actions]
}

type BindToInput = {
  eventBind: {
    onChange: (e: React.SyntheticEvent) => void
    value: string
  }
  valueBind: {
    onChange: React.Dispatch<string>
    value: string
  }
}
type UseBindToInput = [[string, boolean], UseInputActions, BindToInput]

export function useBindToInput(useInputResult: UseInput): UseBindToInput {
  const [values, actions] = useInputResult
  return [
    values,
    actions,
    useMemo(
      () => ({
        eventBind: {
          onChange: actions.onChange,
          value: values[0],
        },
        valueBind: {
          onChange: actions.setValue,
          value: values[0],
        },
      }),
      [actions, values],
    ),
  ]
}

export function useLifecycleHooks({
  onMount,
  onUnmount,
}: {
  onMount?: Callback
  onUnmount?: Callback
}) {
  return useEffect(() => {
    onMount && onMount()
    return () => onUnmount && onUnmount()
  }, [onMount, onUnmount])
}

export function useOnUnmount(onUnmount: Callback) {
  return useEffect(() => {
    return () => onUnmount && onUnmount()
  }, [onUnmount])
}

export function useOnMount(onMount: Callback) {
  return useEffect(() => {
    onMount && onMount()
  }, [onMount])
}

/* eslint-disable no-console */
export function useLogger(name: string, props: any): void {
  useLifecycleHooks({
    onMount: () => console.log(`${name} has mounted`),
    onUnmount: () => console.log(`${name} has unmounted`),
  })
  useEffect(() => {
    console.log('Props updated', props)
  })
}
/* eslint-enable no-console */

type UseSetStateAction<T> = React.Dispatch<SetStateAction<Partial<T>>>
type UseSetState<T> = [T, UseSetStateAction<T>]

export function useSetState<T>(initialValue: T): UseSetState<T> {
  const [value, setValue] = useState<T>(initialValue)
  const setState = useCallback(
    (v: SetStateAction<Partial<T>>) => {
      return setValue(oldValue => ({
        ...oldValue,
        ...(typeof v === 'function' ? v(oldValue) : v),
      }))
    },
    [setValue],
  )
  return [value, setState]
}

export function usePrevious<T = any>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export type MapOrEntries<K, V> = Map<K, V> | [K, V][]

export type UseMapFunctions<K, V> = {
  setValue: Dispatch<SetStateAction<Map<K, V>>>
  delete: (keyToDelete: K) => void
  set: (key: K, value: V) => void
  clear: Map<K, V>['clear']
  initialize: (pairsOrMap: MapOrEntries<K, V>) => void
}

export type UseMap<K, V> = [Map<K, V>, UseMapFunctions<K, V>]

export function useMap<K, V>(initialState: MapOrEntries<K, V> = new Map()): UseMap<K, V> {
  const [map, setMap] = useState(
    Array.isArray(initialState) ? new Map(initialState) : initialState,
  )

  const set = useCallback((key, value) => {
    setMap(aMap => {
      const copy = new Map(aMap)
      return copy.set(key, value)
    })
  }, [])

  const deleteByKey = useCallback(key => {
    setMap(_map => {
      const copy = new Map(_map)
      copy.delete(key)
      return copy
    })
  }, [])

  const clear = useCallback(() => {
    setMap(() => new Map())
  }, [])

  const initialize = useCallback((mapOrTuple: MapOrEntries<K, V> = []) => {
    setMap(() => new Map(mapOrTuple))
  }, [])

  const actions = useMemo(
    () => ({
      setValue: setMap,
      clear,
      set,
      delete: deleteByKey,
      initialize,
    }),
    [clear, deleteByKey, initialize, set],
  )

  return [map, actions]
}
