import { prefixedStringsFromText, removePrefixedStringsFromText, } from "./prefixedStringsFromText";
const scopesRegex = /(@.*?\s)|(@.*?$)/g;
const scopesFromText = (text) => {
    return prefixedStringsFromText(text, "@");
};
const removeScopesFromText = (text) => {
    return removePrefixedStringsFromText(text, "@");
};
export { scopesFromText, removeScopesFromText, scopesRegex };
