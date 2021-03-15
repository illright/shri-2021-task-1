import type { ActivityData } from '../data';

const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export type Interval = [number, number];

export function zip<T>(...arrays: T[][]): T[] {
  const result: T[] = [];
  const shortestLength = Math.min(...arrays.map(array => array.length));
  for (let idx = 0; idx < shortestLength; ++idx) {
    for (const array of arrays) {
      result.push(array[idx]);
    }
  }
  return result;
}

export function combineAdjacentHours(hours: number[]) {
  const combinedHours: number[] = [];
  for (let i = 0; i < hours.length; i += 2) {
    combinedHours.push(hours[i] + hours?.[i + 1] ?? 0);
  }
  return combinedHours;
}

export function convertToPortraitOrder(mapData: ActivityData['data']) {
  return zip(...(weekdays.map(weekday => mapData[weekday]) as number[][]));
}

export function convertToLandscapeOrder(mapData: ActivityData['data']) {
  return combineAdjacentHours(
    weekdays.flatMap(weekday => mapData[weekday]) as number[]
  );
}

export function computeMinMax(flatData: number[]): [number, number] {
  let minValue: number | null, maxValue: number | null;
  for (const hour of flatData) {
    if (minValue == null || minValue > hour) {
      minValue = hour;
    }
    if (maxValue == null || maxValue < hour) {
      maxValue = hour;
    }
  }
  return [minValue, maxValue];
}

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

export function intervalToText(interval: Interval) {
  if (interval[0] === interval[1] - 1) {
    return interval[0].toString();
  }
  return `${interval[0]} — ${interval[1] - 1}`;
}
