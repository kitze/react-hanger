// tslint:disable

import * as React from "react";

type BaseType<T = any> = {
  value: T;
  setValue: React.Dispatch<T>;
};
type Callback = (...args: any[]) => void | any;

export function useStateful<T = any>(initial): BaseType<T>;

export function useInput(
  initialState?: string
): BaseType<string> & {
  onChange: (e: React.SyntheticEvent) => void;
  hasValue: boolean;
  clear: () => void;
  bindToInput: {
    onChange: (e: React.SyntheticEvent) => void;
    value: string;
  };
  bind: {
    onChange: React.Dispatch<string>;
    value: string;
  };
};

export function useArray<T = any>(
  initialState: T[]
): BaseType<T[]> & {
  add: (value: T) => void;
  clear: () => void;
  removeById: (
    id: T extends { id: string }
      ? string
      : T extends { id: number } ? number : unknown
  ) => void;
  removeIndex: (index: number) => void;
};

export function useBoolean(
  initialState: boolean
): BaseType<boolean> & {
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};

export function useNumber(
  initialState: number,
  options?: {
    upperLimit?: number;
    lowerLimit?: number;
    loop?: boolean;
    step?: number;
  }
): BaseType<number> & {
  increase: (value?: number) => void;
  decrease: (value?: number) => void;
};

export function useLifecycleHooks({
  onUnmount,
  onMount
}: {
  onUnmount?: Callback;
  onMount?: Callback;
}): void;

export function useOnUnmount(onUnmount: Callback): void;

export function useOnMount(onMount: Callback): void;

export function useLogger(name: string, props: any): void;

export function useSetState<T>(
  initialState: T
): {
  setState: React.Dispatch<Partial<T>>,
  state: T;
};

export function usePrevious<T = any>(value: T): T;
