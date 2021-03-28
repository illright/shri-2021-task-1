/**
 * Extract the numeric amount from a string with units.
 * For example, '5 commits' -> 5
 */
export function extractAmount(formatted: string) {
  return parseInt(formatted.split(' ')[0]);
}

/** Return a stringified version of a number with an enforced sign. */
export function forceSign(n: number) {
  if (n > 0) {
    return `+${n}`;
  }
  return n.toString();
}
