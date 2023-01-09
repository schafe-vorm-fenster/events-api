declare const prefixedStringsRegex: (prefix: string) => RegExp;
declare const prefixedStringsFromText: (text: string, prefix: string) => string[] | null;
declare const removePrefixedStringsFromText: (text: string, prefix: string) => string;
export { prefixedStringsFromText, removePrefixedStringsFromText, prefixedStringsRegex, };
