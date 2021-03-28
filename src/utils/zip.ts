/**
 * Combine N arrays into one array of N-element tuples.
 * Terminates at the length of the shortest iterable.
 * Analogous to Python's zip() function.
 *
 * @param arrays An arbitrary amount of arrays to zip together.
 * @return An array of tuples.
 */
export default function zip<T>(...arrays: T[][]): T[] {
  const result: T[] = [];
  const shortestLength = Math.min(...arrays.map(array => array.length));
  for (let idx = 0; idx < shortestLength; ++idx) {
    for (const array of arrays) {
      result.push(array[idx]);
    }
  }
  return result;
}
