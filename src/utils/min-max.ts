/**
 * Compute the minimum and maximum of a numeric array.
 *
 * @param array The array of numbers to find the min and max in.
 * @return An array of two elements: the minimum and the maximum of the array.
 */
export default function minMax(array: number[]): [number, number] {
  let minValue: number | null, maxValue: number | null;
  for (const element of array) {
    if (minValue == null || minValue > element) {
      minValue = element;
    }
    if (maxValue == null || maxValue < element) {
      maxValue = element;
    }
  }
  return [minValue, maxValue];
}
