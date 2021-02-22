export default function reversed(list: any[]) {
  const clone = [...list];
  clone.reverse();
  return clone;
}
