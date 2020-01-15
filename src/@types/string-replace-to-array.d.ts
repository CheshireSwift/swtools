declare module 'string-replace-to-array' {
  function replace<T>(
    source: string,
    searchValue: string | RegExp,
    replacer: (substring: string, ...args: any[]) => T
  ): Array<string | T>;

  function replace<T>(
    source: string,
    searchValue: string | RegExp,
    replaceValue: T
  ): Array<string | T>;

  export default replace
}
