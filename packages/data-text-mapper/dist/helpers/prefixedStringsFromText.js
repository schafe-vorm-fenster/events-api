export const prefixedStringsFromText = (text, prefix) => {
    const regex = new RegExp(`${prefix}([\\w-]+)`, "g");
    const matches = text.match(regex);
    if (!matches)
        return null;
    return matches.map((match) => match.slice(prefix.length));
};
export const removePrefixedStringsFromText = (text, prefix) => {
    const regex = new RegExp(`\\s*${prefix}[\\w-]+\\s*`, "g");
    return text.replace(regex, " ").trim().replace(/\s+/g, " ");
};
