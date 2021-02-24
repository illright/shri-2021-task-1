export function reversed(list: any[]) {
  const clone = [...list];
  clone.reverse();
  return clone;
}

export function invertIndex(index: number) {
  return this.length - index - 1;
}
