export function extractAmount(formatted: string) {
  return parseInt(formatted.split(' ')[0]);
}

export function forceSign(n: number) {
  if (n > 0) {
    return `+${n}`;
  }
  return n.toString();
}
