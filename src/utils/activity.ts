import zip from './zip';
import type { ActivityData } from '../data';

const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** A numeric semi-open interval. */
export type Interval = [number, number];

/**
 * Add together adjacent elements of an array.
 * Elements 0 and 1 will be added together, 2 and 3, 4 and 5 and so on.
 * If the array has an odd length, the last element is preserved.
 *
 * @param array The data to combine the adjacent elements in.
 * @return An array half the size of the input array with adjacent elements combined.
 */
export function combineAdjacentElements(array: number[]) {
  const combined: number[] = [];
  for (let i = 0; i < array.length; i += 2) {
    combined.push(array[i] + array?.[i + 1] ?? 0);
  }
  return combined;
}

/**
 * Reorder the hour data from the weekdays to be suitable for sequential rendering
 * in portrait orientation.
 *
 * @param mapData An object of seven keys: one for each weekday, containing hour data
 * @return A 2D grid of values.
 */
export function convertToPortraitOrder(mapData: ActivityData['data']) {
  return zip(...(weekdays.map(weekday => mapData[weekday]) as number[][]));
}

/**
 * Reorder the hour data from the weekdays to be suitable for sequential rendering
 * in landscape orientation.
 *
 * @param mapData An object of seven keys: one for each weekday, containing hour data
 * @return A 2D grid of values.
 */
export function convertToLandscapeOrder(mapData: ActivityData['data']) {
  return combineAdjacentElements(
    weekdays.flatMap(weekday => mapData[weekday]) as number[]
  );
}

/**
 * Build 4 intervals between `min` and `max`.
 * The first interval must be [0; 1). The other 3 intervals are equal in size,
 * with the remainder of integer division added up to the last interval.
 *
 * @param min The minimum element in an array.
 * @param max The maximum element in an array.
 * @return An array of 4 intervals.
 */
export function buildIntervals(min: number, max: number): Interval[] {
  const intervals: Interval[] = [[0, 1]];
  const intervalAmount = 3;
  const intervalLength = Math.floor((max - min) / intervalAmount);
  let lastInterval = intervals[0]
  for (let i = 0; i < intervalAmount; ++i) {
    const newInterval: Interval = [lastInterval[1], lastInterval[1] + intervalLength];
    intervals.push(newInterval);
    lastInterval = newInterval;
  }
  intervals[intervals.length - 1][1] = max + 1;
  return intervals;
}

/**
 * Represent an interval as a string,
 * collapsing both ends if the interval only contains one element.
 */
export function intervalToText(interval: Interval) {
  if (interval[0] === interval[1] - 1) {
    return interval[0].toString();
  }
  return `${interval[0]} — ${interval[1] - 1}`;
}
