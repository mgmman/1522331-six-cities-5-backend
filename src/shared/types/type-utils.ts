export function isMemberOfUnion<A extends string>(str: string, values: Readonly<Array<A>>): str is A {
  const foundValue = values.find((x) => x === str);
  return !!foundValue;
}
