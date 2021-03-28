/** Return a reversed copy of an array. */
export function reversed<T>(list: T[]) {
  const clone = [...list];
  clone.reverse();
  return clone;
}

/**
 * Compute the index of an element in a reversed array.
 *
 * @param index The index of an element in the original array.
 * @return The index of that element in the reversed array.
 */
export function invertIndex(index: number) {
  return this.length - index - 1;
}
