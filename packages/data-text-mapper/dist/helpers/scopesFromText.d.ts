declare const scopesRegex: RegExp;
declare const scopesFromText: (text: string) => string[] | null;
declare const removeScopesFromText: (text: string) => string;
export { scopesFromText, removeScopesFromText, scopesRegex };
