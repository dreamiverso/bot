/**
 * ```ts
 * type Foo = { bar: 1, baz: 2 }
 * type ValuesOfFoo = ValuesOf<Foo> // 1 | 2
 * ```
 */
export type ValuesOf<T extends Record<string, unknown>> = T[keyof T]
